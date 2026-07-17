let searchParams = new URLSearchParams(window.location.search);
let searchKeyword = searchParams.get("u");


document.addEventListener("DOMContentLoaded", function () {
    // Load header
    fetch("/aow4db/HTML/header.html")
        .then((res) => res.text())
        .then((html) => {
            document.body.insertAdjacentHTML("afterbegin", html);
GetHamburgerMenu();
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
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
});


function GetHamburgerMenu(){
   
    var isMobile = window.matchMedia('(max-width: 800px)');
    var menu = document.getElementById('menu');
    var toggle = document.getElementById('menuToggle');
    var backdrop = document.getElementById('menuBackdrop');
     var topbar = document.querySelector('.topbar');
    var anchor = document.getElementById('topbarAnchor');
    var extras = document.getElementById('menuExtras');

    function openMenu() {
        menu.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; // stop background scroll while menu is open
    }
    function closeMenu() {
        menu.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        // also collapse any open submenus so it resets clean next time
        menu.querySelectorAll('.open').forEach(function (el) {
            if (el !== menu) el.classList.remove('open');
        });
    }

    toggle.addEventListener('click', function () {
        menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    backdrop.addEventListener('click', closeMenu);

    // Nested submenu toggling (mobile only; desktop keeps :hover)
    menu.addEventListener('click', function (e) {
        if (!isMobile.matches) return;

        var link = e.target.closest('#menu > li > a, .has-submenu > a');
        if (!link) return;

        var submenu = link.nextElementSibling;
        if (submenu && submenu.tagName === 'UL') {
            e.preventDefault();
            submenu.classList.toggle('open');
        }
        // else: it's a real link (like Search) — let it navigate normally,
        // closeMenu() isn't strictly needed since the page is about to unload
    });
    
     function placeTopbar(mobile) {
        if (mobile) {
            extras.appendChild(topbar);
        } else {
            anchor.parentNode.insertBefore(topbar, anchor.nextSibling);
        }
    }

    placeTopbar(isMobile.matches); // set correct position on load
    isMobile.addEventListener('change', function (e) {
        placeTopbar(e.matches);
    });
    
     var isTouch = window.matchMedia('(hover: none), (max-width: 800px)');
   

    extras.addEventListener('click', function (e) {
        if (!isTouch.matches) return;

        var title = e.target.closest('.dropdown-title');
        if (!title) return;

        var content = title.nextElementSibling; // the .dropdown-content right after it
        if (content && content.classList.contains('dropdown-content')) {
            content.classList.toggle('open');
        }
    });

}


function requireAjax(file, callback) {
    jQuery.getScript(file, callback);
}
