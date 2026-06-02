let searchParams = new URLSearchParams(window.location.search);
let searchKeyword = searchParams.get("u");

// Inject viewport meta tag for mobile responsiveness (all pages)
(function(){var m=document.createElement('meta');m.name='viewport';m.content='width=device-width,initial-scale=1.0';document.head.appendChild(m);})();

document.addEventListener("DOMContentLoaded", function () {
    // Load header
    fetch("/aow4db/HTML/header.html")
        .then((res) => res.text())
        .then((html) => {
            document.body.insertAdjacentHTML("afterbegin", html);

            // Mobile hamburger menu + submenu click toggle
            (function(){
                var menu = document.getElementById("menu");
                var topbar = document.querySelector(".topbar");
                if (!menu || !topbar) return;
                var btn = document.createElement("button");
                btn.id = "hamburgerBtn";
                btn.textContent = "☰";
                btn.setAttribute("aria-label","Menu");
                topbar.appendChild(btn);
                btn.addEventListener("click", function(e){
                    e.stopPropagation();
                    var isOpen = menu.classList.toggle("open");
                    menu.style.right = isOpen ? "0" : "-280px";
                });
                // Close on outside click
                document.addEventListener("click", function(e){
                    if (!menu.contains(e.target) && e.target !== btn) {
                        menu.classList.remove("open");
                        menu.style.right = "-280px";
                    }
                });
                // Mobile submenu toggle: touchstart prevents ghost click
                menu.addEventListener("touchstart", function(e){
                    if (window.innerWidth > 768) return;
                    var toggleA = e.target.closest('.has-submenu > a');
                    if (!toggleA) {
                        var parentLi = e.target.closest('li');
                        if (parentLi && parentLi.querySelector(':scope > ul') && e.target.closest('li > a')) {
                            toggleA = e.target.closest('li > a');
                        }
                    }
                    if (!toggleA) return;
                    var li = toggleA.parentElement;
                    var sub = li.querySelector(':scope > ul');
                    if (!sub) return;
                    e.preventDefault(); // block ghost click on item below
                    sub.classList.toggle('sub-open');
                });
                // Close menu when a navigation link is clicked
                menu.addEventListener("click", function(e){
                    if (window.innerWidth > 768) return;
                    if (e.target.tagName === 'A' && e.target.href && !e.target.closest('.has-submenu > a')) {
                        menu.classList.remove('open');
                        menu.style.right = "-280px";
                    }
                });
            })();

            // Mobile: tooltip via touch, stays open with modal, closes when modal closes
            var _lastTapped = null;
            var _blockNextClick = false;
            document.addEventListener("touchstart", function(e){
                if (window.innerWidth > 768) return;
                if (e.target.closest('#menu')) return; // skip menu drawer
                var hd = document.getElementById("hoverDiv");
                var hdVis = hd && hd.getBoundingClientRect().width > 0;
                var sel = document.getElementById("selectionsHolder");
                var modalOpen = sel && getComputedStyle(sel).display !== "none";
                var isListBtn = e.target.closest && e.target.closest('.list-button');

                // Close tooltip if tapping outside AND modal closed
                if (hdVis && !hd.contains(e.target) && !modalOpen) { hd.close(); _lastTapped = null; }

                // Inside modal: 1st tap = tooltip, 2nd tap = select
                if (isListBtn && modalOpen) {
                    if (_lastTapped === isListBtn) {
                        _lastTapped = null; _blockNextClick = false;
                        return;
                    }
                    _lastTapped = isListBtn;
                    _blockNextClick = true;
                    // Dispatch mouseenter on the list-button itself (not its child)
                    isListBtn.dispatchEvent(new MouseEvent('mouseenter', {bubbles: false}));
                    return;
                }
                _lastTapped = null; _blockNextClick = false;

                // Show tooltip: dispatch on target + walk up to find listener
                if (!hdVis && !isListBtn) {
                    var el = e.target;
                    while (el) {
                        el.dispatchEvent(new MouseEvent('mouseenter', {bubbles: false}));
                        el = el.parentElement;
                    }
                }
                // Re-show tooltip after modal opens
                if (modalOpen && !hdVis) {
                    setTimeout(function(){
                        var el = document.elementFromPoint(
                            e.touches ? e.touches[0].clientX : e.clientX || 100,
                            e.touches ? e.touches[0].clientY : e.clientY || 200
                        );
                        while (el) {
                            el.dispatchEvent(new MouseEvent('mouseenter', {bubbles: false}));
                            el = el.parentElement;
                        }
                    }, 350);
                }
            }, {passive: true});

            // Block click after 1st tap inside modal
            document.addEventListener("click", function(e){
                if (!_blockNextClick) return;
                if (e.target.closest && e.target.closest('.list-button')) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    _blockNextClick = false;
                }
            }, true); // capture phase
            // Close tooltip when modal closes
            var _selObserver = new MutationObserver(function(){
                if (window.innerWidth > 768) return;
                var sel = document.getElementById("selectionsHolder");
                if (sel && getComputedStyle(sel).display === "none") {
                    var hd = document.getElementById("hoverDiv");
                    if (hd && hd.getBoundingClientRect().width > 0) hd.close();
                }
            });
            var _selEl = document.getElementById("selectionsHolder");
            if (_selEl) _selObserver.observe(_selEl, {attributes: true, attributeFilter: ["style"]});

            requireAjax("/aow4db/Data/src/settings.js", function () {
                requireAjax("/aow4db/Data/src/dataloader.js", function () {
                    requireAjax("/aow4db/Data/src/tooltips.js", function () {
                        requireAjax("/aow4db/Data/src/lookuputils.js", function () {
                            requireAjax("/aow4db/Data/Search.js", function () {
                                requireAjax("/aow4db/Data/Faction.js", function () {
                                    requireAjax("/aow4db/Data/Builder.js", function () {
                                        CheckData();
                                        // wait for a while and then  HandleExtraTooltips();
                                        setTimeout(function () {
                                            HandleExtraTooltips();
                                        }, 2000);
                                        // Mobile: affinity column fix
                                        var _affFix = setInterval(function(){
                                            if (window.innerWidth > 768) { clearInterval(_affFix); return; }
                                            var aff = document.getElementById('currentAffinity');
                                            if (!aff || !aff.parentElement) return;
                                            var p = aff.parentElement;
                                            if (p.style.flexDirection !== 'column') {
                                                p.style.flexDirection = 'column';
                                                p.style.justifyContent = 'flex-start';
                                                p.style.alignItems = 'center';
                                            }
                                        }, 800);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
});



function requireAjax(file, callback) {
    jQuery.getScript(file, callback);
}
