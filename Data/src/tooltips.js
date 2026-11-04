
const TooltipConfig = {
    maxWindows: 4, // when the chain gets longer the oldest window is dropped
    fadeStep: 0.2, // opacity lost per level below the newest window
    minOpacity: 0.35,
    closeDelay: 150, // ms the pointer may take to get from a trigger into its window (selectable mode only)
    fadeOutMs: 140,
    gap: 6, // px between a window and the window it was opened from
    debug: false // true = log every window that opens
};

const tooltipStack = []; // oldest ... newest; always one chain
const tooltipHandlers = new WeakMap(); // trigger -> { enter, leave }
let tooltipSweepTimer = null;
let lastPointer = { clientX: 0, clientY: 0, target: null };

const isTouchLayout = () => window.matchMedia("(max-width: 800px), (hover: none)").matches;

document.addEventListener(
    "mousemove",
    (e) => {
        lastPointer = { clientX: e.clientX, clientY: e.clientY, target: e.target };
    },
    { passive: true }
);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllTooltips(true);
});
window.addEventListener("blur", () => closeAllTooltips(true));

function tooltipContentHtml(source) {
    if (source == null) return null;
    if (typeof source === "string") return source;
    return typeof source.innerHTML === "string" ? source.innerHTML : null;
}

function createTooltipWindow(level, selectable) {
    const template = (level > 0 ? document.getElementById("hoverDiv2") : null) ?? document.getElementById("hoverDiv");
    let el;
    if (template) {
        el = template.cloneNode(false);
        el.removeAttribute("open");
        el.removeAttribute("style");
        template.parentNode.appendChild(el);
    } else {
        console.warn("tooltips: no #hoverDiv found in the page, using an unstyled dialog");
        el = document.createElement("dialog");
        document.body.appendChild(el);
    }
    el.classList.add("hoverWindow");
    el.style.pointerEvents = selectable ? "all" : "none";
    el.style.transition = `opacity ${TooltipConfig.fadeOutMs}ms ease`;
    return el;
}

// show it without being seen: measured and moved first, revealed afterwards
function showTooltipWindowHidden(el) {
    el.style.visibility = "hidden";
    el.inert = true; // so show() cannot steal the focus (same trick the old code used)
    el.show();
    el.inert = false;
}

function placeTouchSheet(el) {
    const vv = window.visualViewport;
    if (!vv) return;
    el.style.width = `${vv.width}px`;
    el.style.left = `${vv.offsetLeft}px`;
    el.style.top = `${vv.offsetTop + vv.height - el.offsetHeight}px`;
    el.style.transform = `scale(${1 / vv.scale})`;
    el.style.transformOrigin = "bottom left";
    el.style.width = `${vv.width * vv.scale}px`;
}

function placeRootTooltip(w, event) {
    if (isTouchLayout()) return placeTouchSheet(w.el);

    const selectionsHolder = document.getElementById("selectionsHolder");
    if (selectionsHolder && event.target?.closest?.("#selectionsHolder")) {
        const holderRect = selectionsHolder.getBoundingClientRect();
        const dialogRect = w.el.getBoundingClientRect();
        const left =
            holderRect.right + 20 + dialogRect.width < window.innerWidth
                ? holderRect.right + 20
                : holderRect.left - dialogRect.width - 20;
        return clampToViewport(w.el, left, event.clientY - 50);
    }

    const offset = getUserSettings().tooltipselectable ? 6 : 10;
    clampToViewport(w.el, event.clientX + offset, event.clientY + offset);
}

// beside the window it was opened from, level with the link that opened it
function placeChildTooltip(w, parent, trigger) {
    const p = parent.el.getBoundingClientRect();
    const t = trigger.getBoundingClientRect();
    const c = w.el.getBoundingClientRect();
    const gap = TooltipConfig.gap;
    const margin = 8;

    let left = p.right + gap;
    if (left + c.width + margin > window.innerWidth) left = p.left - c.width - gap;
    if (left < margin) {
        // no room on either side: sit just below the link, overlapping
        return clampToViewport(w.el, t.left + 16, t.bottom + gap);
    }
    clampToViewport(w.el, left, t.top - 12);
}

// Put el at viewportLeft/viewportTop (kept inside the screen). Same name and arguments as before.
// It measures where the box really ended up and corrects the difference, so margins, auto
// centering or position:fixed in the stylesheet cannot push the tooltip away from the cursor.
function clampToViewport(el, viewportLeft, viewportTop, margin = 8) {
    el.style.right = "auto"; // a dialog with left AND right set is centered between them
    el.style.bottom = "auto";

    const rect = el.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width - margin;
    const maxTop = window.innerHeight - rect.height - margin;
    const x = Math.min(Math.max(viewportLeft, margin), Math.max(maxLeft, margin));
    const y = Math.min(Math.max(viewportTop, margin), Math.max(maxTop, margin));

    el.style.left = x + window.pageXOffset + "px";
    el.style.top = y + window.pageYOffset + "px";

    const after = el.getBoundingClientRect();
    const dx = after.left - x;
    const dy = after.top - y;
    if (Math.abs(dx) > 1) el.style.left = parseFloat(el.style.left) - dx + "px";
    if (Math.abs(dy) > 1) el.style.top = parseFloat(el.style.top) - dy + "px";
}

// ---------------------------------------------------------------------------
// the chain
// ---------------------------------------------------------------------------
function updateTooltipFades() {
    const last = tooltipStack.length - 1;
    tooltipStack.forEach((w, i) => {
        const fromTop = last - i;
        const opacity = Math.max(TooltipConfig.minOpacity, 1 - TooltipConfig.fadeStep * fromTop);
        w.el.style.opacity = fromTop === 0 ? "" : String(Math.round(opacity * 100) / 100);
    });
}

function removeTooltipWindow(w, instant) {
    const i = tooltipStack.indexOf(w);
    if (i !== -1) tooltipStack.splice(i, 1);
    w.hover = false;
    w.triggerHover = false;

    const finish = () => {
        try {
            w.el.close();
        } catch (e) {}
        w.el.remove();
    };
    if (instant || TooltipConfig.fadeOutMs <= 0) return finish();

    w.el.style.pointerEvents = "none";
    w.el.style.opacity = "0";
    setTimeout(finish, TooltipConfig.fadeOutMs);
}

function closeAllTooltips(instant) {
    clearTimeout(tooltipSweepTimer);
    tooltipSweepTimer = null;
    for (const w of [...tooltipStack].reverse()) removeTooltipWindow(w, instant);
}

// Close every window that is newer than the newest one the pointer is on
// (on the window itself, or on the link it was opened from).
function sweepTooltips() {
    tooltipSweepTimer = null;
    let alive = -1;
    for (let i = tooltipStack.length - 1; i >= 0; i--) {
        const w = tooltipStack[i];
        if (w.hover || (w.triggerHover && w.trigger.isConnected)) {
            alive = i;
            break;
        }
    }
    for (let i = tooltipStack.length - 1; i > alive; i--) removeTooltipWindow(tooltipStack[i], false);
    updateTooltipFades();
}

function scheduleTooltipSweep() {
    clearTimeout(tooltipSweepTimer);
    const delay = getUserSettings().tooltipselectable ? TooltipConfig.closeDelay : 0;
    if (delay <= 0) sweepTooltips();
    else tooltipSweepTimer = setTimeout(sweepTooltips, delay);
}

function openTooltip(trigger, source, event) {
    // already open for this trigger (pointer left and came back before the window closed)
    const existing = tooltipStack.find((w) => w.trigger === trigger);
    if (existing) {
        existing.triggerHover = true;
        return scheduleTooltipSweep();
    }

    const html = tooltipContentHtml(source);
    if (html == null || html === "") return;

    const selectable = !!getUserSettings().tooltipselectable;
    const canNest = selectable && !isTouchLayout();

    // where does the new window go in the chain? Right after the window the trigger sits in.
    // A trigger on the page itself (or no nesting) starts a new chain.
    const parentIndex = canNest ? tooltipStack.findIndex((w) => w.el.contains(trigger)) : -1;
    while (tooltipStack.length > parentIndex + 1) removeTooltipWindow(tooltipStack[tooltipStack.length - 1], true);
    const parent = parentIndex >= 0 ? tooltipStack[parentIndex] : null;

    const el = createTooltipWindow(parentIndex + 1, selectable);
    el.innerHTML = html;
    const w = { el, trigger, hover: false, triggerHover: true };
    el.addEventListener("mouseenter", () => {
        w.hover = true;
        scheduleTooltipSweep();
    });
    el.addEventListener("mouseleave", () => {
        w.hover = false;
        scheduleTooltipSweep();
    });

    // Make the links inside this window hoverable. This has to happen while the dialog is still
    // closed: HandleExtraTooltips reads el.innerText, which is empty for hidden elements.
    if (canNest) HandleExtraTooltips(el);

    showTooltipWindowHidden(el);
    if (parent) placeChildTooltip(w, parent, trigger);
    else placeRootTooltip(w, event);
    el.style.visibility = "";
    if (TooltipConfig.debug) console.info("tooltip opened", { level: parentIndex + 1, selectable, canNest });

    tooltipStack.push(w);
    while (tooltipStack.length > TooltipConfig.maxWindows) removeTooltipWindow(tooltipStack[0], true);
    updateTooltipFades();
    scheduleTooltipSweep();
}

function addTooltipListeners(tooltip, span, secondary) {
    removeToolTipListeners(tooltip); // calling it twice on one element replaces, never doubles

    const enter = (event) => openTooltip(tooltip, span, event);
    const leave = () => {
        for (const w of tooltipStack) if (w.trigger === tooltip) w.triggerHover = false;
        scheduleTooltipSweep();
    };
    tooltip.addEventListener("mouseenter", enter);
    tooltip.addEventListener("mouseleave", leave);
    tooltipHandlers.set(tooltip, { enter, leave });
}

function removeToolTipListeners(tooltip) {
    const h = tooltipHandlers.get(tooltip);
    if (!h) return;
    tooltip.removeEventListener("mouseenter", h.enter);
    tooltip.removeEventListener("mouseleave", h.leave);
    tooltipHandlers.delete(tooltip);
}

// --- kept so older calls elsewhere do not break -----------------------------
function TurnOnTooltip(spa, secondary) {
    openTooltip(lastPointer.target ?? document.body, spa, lastPointer);
}

function TurnOffTooltip(secondary, origin) {
    closeAllTooltips(false);
}

function getNormalizedPosition(event) {
    return { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight };
}

// Old "follow the cursor" callers: only moves a lone, non-selectable tooltip.
function updateHoverDivPosition(event, secondary) {
    if (tooltipStack.length === 1 && !getUserSettings().tooltipselectable) {
        placeRootTooltip(tooltipStack[0], event);
    }
}