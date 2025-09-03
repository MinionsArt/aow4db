document.addEventListener("DOMContentLoaded", function () {
    // Load header
    fetch("/aow4db/HTML/header.html")
        .then((res) => res.text())
        .then((html) => {
            document.body.insertAdjacentHTML("afterbegin", html);

            requireAjax("/aow4db/Data/src/settings.js", function () {
                requireAjax("/aow4db/Data/src/dataloader.js", function () {
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
                    }); });
                });
            });
        });
});

function requireAjax(file, callback) {
    jQuery.getScript(file, callback);
}
