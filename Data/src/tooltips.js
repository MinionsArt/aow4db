

function addTooltipListeners(tooltip, span, secondary) {
    let hoverDiv2 = document.getElementById("hoverDiv2");
    let hoverDiv = document.getElementById("hoverDiv");

    if (secondary != undefined) {
        tooltip.addEventListener("mouseenter", function (event) {
            TurnOnTooltip(span, secondary);
            //  FillToolTip(span, secondary);

            hoverDiv2.style.visibility = "hidden"; // make it invisible
            hoverDiv2.inert = true;
            hoverDiv2.show();
            hoverDiv2.inert = false;
            if (tooltip != hoverDiv2) {
                 try { updateHoverDivPosition(event, secondary); } catch(e) {}
                //updateHoverDivPosition(event, secondary);
            }
            hoverDiv2.close(); // close and reset visiblity
            hoverDiv2.style.visibility = "";
            hoverDiv2.inert = true;
            hoverDiv2.show();
            hoverDiv2.inert = false;
        });

        tooltip.addEventListener("mouseleave", function () {
            // if (altHeld == false) {
            // Only hide if ALT is NOT active
            TurnOffTooltip(secondary, tooltip);
            //}
        });
    } else {
        tooltip.addEventListener("mouseenter", function (event) {
            TurnOnTooltip(span, secondary);
            // hoverDiv.show();
            hoverDiv.style.visibility = "hidden";
            hoverDiv.inert = true;
            hoverDiv.show();
            hoverDiv.inert = false;
            if (tooltip != hoverDiv) {
                    try { updateHoverDivPosition(event, secondary); } catch(e) {}
              //  updateHoverDivPosition(event, secondary);
            }
            hoverDiv.close();
            hoverDiv.style.visibility = "";
            hoverDiv.inert = true;
            hoverDiv.show();
            hoverDiv.inert = false;
        });

        tooltip.addEventListener("mouseleave", function () {
            //  if (altHeld == false) {
            TurnOffTooltip(secondary);
            //  }
        });
    }
}

function removeToolTipListeners(tooltip) {
    tooltip.removeEventListener("mouseenter", tooltip);

    tooltip.removeEventListener("mouseleave", tooltip);
}

function TurnOnTooltip(spa, secondary) {
    // Configuration of the observer: observe changes to child nodes
    let hoverDiv2 = document.getElementById("hoverDiv2");
    let hoverDiv = document.getElementById("hoverDiv");
    if (secondary != undefined) {
        if (spa != null) {
            hoverDiv2.innerHTML = spa.innerHTML;
        }
    } else {
        if (spa != null) {
            hoverDiv.innerHTML = spa.innerHTML;
            HandleExtraTooltips(hoverDiv);
        }
    }
}


function TurnOffTooltip(secondary, origin) {
    let hoverDiv2 = document.getElementById("hoverDiv2");
    let hoverDiv = document.getElementById("hoverDiv");

    if (secondary != undefined) {
        if (checkboxTooltip.checked) {
            if (origin == hoverDiv2 && hoverDiv2.open) hoverDiv2.close();
        } else {
            if (hoverDiv2.open) hoverDiv2.close();
        }
    } else {
        // Close hoverDiv on its own terms — don't let hoverDiv2's state block this indefinitely.
        if (hoverDiv.open) hoverDiv.close();
    }
}
/*function TurnOffTooltip(secondary, origin) {
    hoverDiv2 = document.getElementById("hoverDiv2");
    hoverDiv = document.getElementById("hoverDiv");
    
    // console.log("dialog 2 is open? " + hoverDiv2.open);
    if (secondary != undefined) {
        if (checkboxTooltip.checked) {
            if (origin == hoverDiv2) {
                 hoverDiv2.innerHTML = "";
                hoverDiv2.close();
            }
        } else {
              hoverDiv2.innerHTML = "";
            hoverDiv2.close();
        }

        // console.log("closed dialog 2");
    } else {
        if (hoverDiv2.open) {
            //   console.log("dialog is open ");
        } else {
              hoverDiv.innerHTML = "";
          
            hoverDiv.close();
            
            //  console.log("closed dialog 1");
        }
    }
}*/

function getNormalizedPosition(event) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // event.clientX and event.clientY give the position of the mouse
    const xPosition = event.clientX;
    const yPosition = event.clientY;

    // Normalize to a range of 0 to 1
    const normalizedX = xPosition / screenWidth;
    const normalizedY = yPosition / screenHeight;

    return {
        x: normalizedX,
        y: normalizedY
    };
}
function updateHoverDivPosition(event, secondary) {
    const settings = getUserSettings();
    const isTouch = window.matchMedia('(max-width: 800px), (hover: none)').matches;

    let hoverDiv = secondary != undefined
        ? document.getElementById("hoverDiv2")
        : document.getElementById("hoverDiv");

    if (settings.tooltipselectable) {
        hoverDiv.setAttribute("Style", "pointer-events: all;");
    } else {
        hoverDiv.setAttribute("Style", "pointer-events: none;");
    }

    // Mobile: CSS pins this as a fixed bottom sheet (see below) — no JS positioning needed.
    if (isTouch) {
         const vv = window.visualViewport;

        // Calculate current viewport dimensions considering zoom scale
        const currentWidth = vv.width;
        const currentHeight = vv.height;

        // Force layout size and position relative to current visual viewport offset
        hoverDiv.style.width = `${currentWidth}px`;
        hoverDiv.style.left = `${vv.offsetLeft}px`;
        hoverDiv.style.top = `${vv.offsetTop + currentHeight - hoverDiv.offsetHeight}px`;

        // Scale the inner content so text remains readable when zoomed out
        hoverDiv.style.transform = `scale(${1 / vv.scale})`;
        hoverDiv.style.transformOrigin = 'bottom left';
        hoverDiv.style.width = `${currentWidth * vv.scale}px`;
        
        return;
    }
       

    var selectionsHolder = document.getElementById("selectionsHolder");
    if (selectionsHolder && event.target.closest && event.target.closest("#selectionsHolder")) {
        var holderRect = selectionsHolder.getBoundingClientRect();
        var dialogRect = hoverDiv.getBoundingClientRect();

        var desiredLeft = (holderRect.right + 20 + dialogRect.width < window.innerWidth)
            ? holderRect.right + 20
            : holderRect.left - dialogRect.width - 20;

        clampToViewport(hoverDiv, desiredLeft, event.clientY - 50 );
        return;
    }

    var offset = secondary != undefined ? -5 : (settings.tooltipselectable ? 2 : 10);
    clampToViewport(hoverDiv, event.clientX + offset, event.clientY + offset);
}
/*
function getNormalizedHeight(element) {
    const elementWidth = element.getBoundingClientRect().height;
    const viewportWidth = window.innerHeight;
    return elementWidth / viewportWidth;
}

function getNormalizedWidth(element) {
    const elementWidth = element.getBoundingClientRect().width;
    const viewportWidth = window.innerWidth;
    return elementWidth / viewportWidth;
}*/

function clampToViewport(el, viewportLeft, viewportTop, margin = 8) {
    const rect = el.getBoundingClientRect(); // just need width/height
    const maxLeft = window.innerWidth - rect.width - margin;
    const maxTop = window.innerHeight - rect.height - margin;

    const clampedLeft = Math.min(Math.max(viewportLeft, margin), Math.max(maxLeft, margin));
    const clampedTop = Math.min(Math.max(viewportTop, margin), Math.max(maxTop, margin));

    el.style.left = (clampedLeft + window.pageXOffset) + "px";
    el.style.top = (clampedTop + window.pageYOffset) + "px";
}
