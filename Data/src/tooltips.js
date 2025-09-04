

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
                updateHoverDivPosition(event, secondary);
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
                updateHoverDivPosition(event, secondary);
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
    hoverDiv2 = document.getElementById("hoverDiv2");
    hoverDiv = document.getElementById("hoverDiv");
    // console.log("dialog 2 is open? " + hoverDiv2.open);
    if (secondary != undefined) {
        if (checkboxTooltip.checked) {
            if (origin == hoverDiv2) {
                hoverDiv2.close();
            }
        } else {
            hoverDiv2.close();
        }

        // console.log("closed dialog 2");
    } else {
        if (hoverDiv2.open) {
            //   console.log("dialog is open ");
        } else {
            hoverDiv.close();
            //  console.log("closed dialog 1");
        }
    }
}

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

    let offset = 2;
    let hoverDiv = null;
    if (secondary != undefined) {
        hoverDiv = document.getElementById("hoverDiv2");
        offset = -5;
    } else {
        hoverDiv = document.getElementById("hoverDiv");
    }
    if (settings.tooltipselectable) {
        hoverDiv.setAttribute("Style", "pointer-events: all;");
    } else {
        hoverDiv.setAttribute("Style", "pointer-events: none;");
        offset = 10;
    }

    let normalizedPos = getNormalizedPosition(event);
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    if (normalizedPos.x + getNormalizedWidth(hoverDiv) > 1) {
        hoverDiv.style.left = mouseX - hoverDiv.getBoundingClientRect().width - offset + scrollLeft + "px";
    } else {
        hoverDiv.style.left = mouseX + offset + scrollLeft + "px";
    }

    if (normalizedPos.y + getNormalizedHeight(hoverDiv) > 1) {
        hoverDiv.style.top = mouseY - hoverDiv.getBoundingClientRect().height - offset + scrollTop + "px";
    } else {
        hoverDiv.style.top = mouseY + offset + scrollTop + "px";
    }
}

function getNormalizedHeight(element) {
    const elementWidth = element.getBoundingClientRect().height;
    const viewportWidth = window.innerHeight;
    return elementWidth / viewportWidth;
}

function getNormalizedWidth(element) {
    const elementWidth = element.getBoundingClientRect().width;
    const viewportWidth = window.innerWidth;
    return elementWidth / viewportWidth;
}
