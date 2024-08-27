var searchParams = new URLSearchParams(window.location.search);
const searchKeyword = searchParams.get("u");

var currentOrigin = "";
var currentTome = "";

var currentForm = "";
var currentFormTraitList = [];
var currentCulture = "";
var currentSociety1 = "";
var currentSociety2 = "";
var currentLoadout = "";
var currentAscension = "";

var currentAffinityTotal = "";

var currentHighlights = "";

var extraOrder, extraChaos, extraNature, extraMaterium, extraShadow, extraAstral;

var currentTomeList = [];
var currentSignatureSkills = [];

function ChangeShieldCol() {
    var shieldElement = document.getElementById("shield");
    tintImage(shieldElement, getRandomColor(), "myCanvas");
    //degrees = Math.random() * 360;
    //shieldElement.setAttribute("style", "filter: hue-rotate(" + degrees + "deg)");
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to tint a greyscale image with a given color
function tintImage(image, color, canvasID) {
    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Draw the greyscale image on the canvas
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Extract the RGB components of the color
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Loop through each pixel and apply the color tint
    for (let i = 0; i < data.length; i += 4) {
        // The greyscale value is the same for R, G, and B
        const greyscaleValue = data[i];

        // Apply the color tint
        data[i] = r * (greyscaleValue / 255);
        data[i + 1] = g * (greyscaleValue / 255);
        data[i + 2] = b * (greyscaleValue / 255);
    }

    // Put the tinted image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    if (canvasID == "myCanvas") {
        const canvas = document.getElementById("shieldColor");
        canvas.style.backgroundColor = color;
    } else {
        const canvas = document.getElementById("symbolColor");
        canvas.style.backgroundColor = color;
    }
}

function ChangeSymbolCol() {
    var shieldElement = document.getElementById("symbol");
    tintImage(shieldElement, getRandomColor(), "myCanvas2");
}

function GetRandomSymbol() {
    // var symbolElement = document.getElementById("symbol");
    // var numb = Math.floor(Math.random() * 138);
    // if (numb < 10 && numb > 0) {
    //     numb = "0" + numb.toString();
    // }
    // if (numb === 0) {
    //     numb += 1;
    //     numb = "0" + numb.toString();
    // }
    // symbolElement.setAttribute("src", "/aow4db/Icons/Symbols/SigilIcons_" + numb + ".gif");
}

function AddExtra(type, add) {
    if (type === "order") {
        extraOrder = addOrSubtract(extraOrder, add);
    }
    if (type === "chaos") {
        extraChaos = addOrSubtract(extraChaos, add);
    }
    if (type === "nature") {
        extraNature = addOrSubtract(extraNature, add);
    }
    if (type === "shadow") {
        extraShadow = addOrSubtract(extraShadow, add);
    }
    if (type === "materium") {
        extraMaterium = addOrSubtract(extraMaterium, add);
    }
    if (type === "astral") {
        extraAstral = addOrSubtract(extraAstral, add);
    }

    RecalculateStats(false);
}

function addOrSubtract(extraAffinity, add) {
    if (add === "⮟") {
        if (extraAffinity > 0) {
            extraAffinity--;
        }
    } else {
        if (extraAffinity < 9) {
            extraAffinity++;
        }
    }
    return extraAffinity;
}

function SetRandomStart(overwriteParameter) {
    if (searchKeyword != undefined && !overwriteParameter) {
        // console.log("Found" + searchKeyword);
        RebuildFromParam(searchKeyword);
        selectSkillPath();
        RecalculateStats(true);
        selectTomePath(undefined, true);
        // SetHighLightToggle();

        updateSelectedOptions();
    } else {
        document.getElementById("shareLink").value = "";

        var listofChoice = [];
        listofChoice.push("Tome");
        listofChoice.push("Origin");
        listofChoice.push("Form");

        listofChoice.push("Culture");
        listofChoice.push("FormTrait");
        listofChoice.push("Society1");
        listofChoice.push("Society2");
        listofChoice.push("Loadout");

        var j = "";
        for (j = 0; j < listofChoice.length; j++) {
            var randomEntry = GetRandomEntry(listofChoice[j]);

            var currentChoice = listofChoice[j];

            switch (currentChoice) {
                case "Tome":
                    currentTome = randomEntry;
                    currentTomeList = [];
                    currentTomeList.push(currentTome);

                    break;
                case "Origin":
                    currentOrigin = randomEntry;
                    break;

                case "Form":
                    currentForm = randomEntry;
                    break;

                case "Culture":
                    hasAdaptionGroup = currentFormTraitList.some((item) => item.group_name === "ADAPTATION");
                    while (hasAdaptionGroup && randomEntry.name.indexOf("Primal") != -1) {
                        randomEntry = GetRandomEntry(listofChoice[j]);
                    }
                    currentCulture = randomEntry;
                    break;
                case "FormTrait":
                    currentFormTraitList = [];
                    currentFormTraitList.push(randomEntry);

                    while (getPoints() < 5) {
                        randomEntry = GetRandomEntry(listofChoice[j]);
                        if (getPoints() + randomEntry.point_cost < 6 && !isInArray(currentFormTraitList, randomEntry)) {
                            if (checkCompatibilityTraits(randomEntry) == true) {
                                currentFormTraitList.push(randomEntry);
                            }
                        }
                    }

                    break;
                case "Society1":
                    currentSociety1 = randomEntry;
                    break;
                case "Society2":
                    while (currentSociety1 === randomEntry) {
                        randomEntry = GetRandomEntry(listofChoice[j]);
                    }
                    currentSociety2 = randomEntry;
                    break;
                case "Loadout":
                    currentLoadout = randomEntry;
                    break;
                case "Signature":
                    currentSig = randomEntry;
                    currentSignatureSkills = [];
                    currentSignatureSkills.push(currentSig);

                    break;
            }

            var originButton = document.getElementById("originButton" + currentChoice);
            if (currentChoice != "FormTrait" && currentChoice != "Signature") {
                SetButtonInfo(originButton, randomEntry, currentChoice);
            }
        }

        extraOrder = 0;
        extraChaos = 0;
        extraAstral = 0;
        extraMaterium = 0;
        extraNature = 0;
        extraShadow = 0;
        ClearSkillPath("t");
        ClearAscensionSkill();

        // SetHighLightToggle();
        //ResetHighlights();

        selectTomePath(undefined, false);
        // SetHighLightToggle();

        updateSelectedOptions();
        RecalculateStats(false);
    }
    //
}

function ResetHighlights() {
    currentHighlights = "";
    activeIndices.length = 0;
    SetHighlights();
}
var hidden = true;
function ShowHideUnFavs() {
    elements = parentDiv.getElementsByClassName("overview_list_entry");
    // Split highlightList by ":" and convert each element to a number
    // show them
    if (hidden == true) {
        hidden = false;
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i].classList.contains("highlighted")) {
                elements[i].style.display = "none";
            }

            // show
        }
    }
    // hide them
    else if (hidden == false) {
        // hide
        hidden = true;
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i].classList.contains("highlighted")) {
                elements[i].style.display = "flex";
            }

            // show
        }
    }
}

function getPoints() {
    var totalPoints = 0;
    // check if points are used
    for (i = 0; i < currentFormTraitList.length; i++) {
        totalPoints += currentFormTraitList[i].point_cost;
    }
    return totalPoints;
}

// Function to toggle the origin selection buttons
function toggleOriginButtons() {
    var selectionsHolder = document.getElementById("selectionsHolder");
    selectionsHolder.setAttribute("style", "display:none");
    var originWrapper = document.getElementById("originWrapperOptions");
    originWrapper.innerHTML = "";
    // originWrapper.setAttribute("style", "display:none");
    var selectionsText = document.getElementById("selections");
    selectionsText.textContent = "";
}

// Function to handle the selection of an origin
function selectOrigin(origin, type) {
    TurnOffTooltip();
    var originButton = document.getElementById("originButton" + type);
    if (type != "FormTrait") {
        originButton.textContent = "";
    }

    SetButtonInfo(originButton, origin, type);

    // assign current selection
    switch (type) {
        case "Tome":
            currentTome = origin;
            currentTomeList[0] = origin;
            // update tome path
            ClearTomePath();
            selectTomePath(undefined, false);

            break;
        case "Origin":
            currentOrigin = origin;
            ClearSkillPath("o");
            if (incompatibleCheck("Loadout", currentLoadout)) {
                var loadoutButton = document.getElementById("originButtonLoadout");
                loadoutButton.innerHTML += '<span style="color:red"> Incompatible </span>';
            }
            break;

        case "FormTrait":
            currentFormTraitList = origin;
            break;
        case "Culture":
            currentCulture = origin;
            break;
        case "Form":
            currentForm = origin;
            break;
        case "Society1":
            currentSociety1 = origin;
            break;
        case "Society2":
            currentSociety2 = origin;
            break;
        case "Loadout":
            currentLoadout = origin;
            break;
        case "Ascension":
            currentAscension = origin;
            break;
        case "Signature":
            // only if its the first

            ClearSkillPath();
            selectSkillPath(origin);
            break;
    }

    //  SetupButtons(type)
    // set affinity  stats
    RecalculateStats(false);

    //ResetHighlights();

    // swap current known origin

    toggleOriginButtons();
    document.getElementById("shareLink").value = "";
}

// Function to handle the selection of an origin
function SelectSymbol(origin) {
    var symbolElement = document.getElementById("symbol");

    if (origin < 10 && origin > 0) {
        origin = "0" + origin.toString();
    }
    if (origin === 0) {
        origin = 138;
    }

    symbolElement.setAttribute("src", "/aow4db/Icons/Symbols/SigilIcons_" + origin + ".gif");

    tintImage(symbolElement, getRandomColor(), "myCanvas2");

    toggleOriginButtons();
}

function ClearAscensionSkill() {
    var ascensionHolder = document.getElementById("originButtonAscension");
    ascensionHolder.innerHTML = "+";
    currentAscension = "";
}

function SetSkillPathOptions(evt) {
    // if there are 4 already selected, return;

    const rect = evt.target.getBoundingClientRect();
    var selectionsHolder = document.getElementById("selectionsHolder");

    var normalizedPos = getNormalizedPosition(evt);

    const mouseX = evt.clientX;
    const mouseY = evt.clientY;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    if (normalizedPos.x + getNormalizedWidth(selectionsHolder) > 0.95) {
        selectionsHolder.style.left = mouseX - selectionsHolder.getBoundingClientRect().width + scrollLeft + "px";
    } else {
        selectionsHolder.style.left = mouseX + scrollLeft + "px";
    }

    if (normalizedPos.y + getNormalizedHeight(selectionsHolder) > 0.95) {
        selectionsHolder.style.top = mouseY - selectionsHolder.getBoundingClientRect().height + scrollTop + "px";
    } else {
        selectionsHolder.style.top = mouseY + scrollTop + "px";
    }

    //selectionsHolder.setAttribute("style", "display:block; left:" + (mouseX + 10) + "px; top:" + (mouseY + scrollTop + -200) + "px;");

    var originWrapper = document.getElementById("originWrapperOptions");
    originWrapper.setAttribute("style", "grid-template-columns: repeat(7, 2fr);");
    originWrapper.innerHTML = "";
    var list = [];
    if (currentSignatureSkills.length == 4) {
        return;
    }

    // assign current selection

    list = GetAllSignatureSkills();

    // console.log("Clicked");
    // List of origin options

    // Create origin buttons dynamically from the list
    var selectionsText = document.getElementById("selections");
    selectionsText.textContent = "Select Signature Skills";

    for (const origin of list) {
        const originButtonNew = document.createElement("button");
        originButtonNew.className = "list-button";

        originButtonNew.addEventListener("click", () => selectSkillPath(origin));

        originWrapper.appendChild(originButtonNew);

        SetSkillPathInfo(originButtonNew, origin);
    }
}

function SetTomePathOptions(evt) {
    const rect = evt.target.getBoundingClientRect();
    var selectionsHolder = document.getElementById("selectionsHolder");

    var normalizedPos = getNormalizedPosition(evt);

    var offset = 0;
    const mouseX = evt.clientX;
    const mouseY = evt.clientY;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    var originWrapper = document.getElementById("originWrapperOptions");
    originWrapper.setAttribute("style", "grid-template-columns: repeat(7, 2fr);");
    originWrapper.innerHTML = "";
    var list = [];

    // assign current selection

    list = GetNextSetOfTomes();

    // console.log("Clicked");
    // List of origin options

    // Create origin buttons dynamically from the list
    var selectionsText = document.getElementById("selections");
    selectionsText.textContent = "Select Tomes";
    for (const origin of list) {
        const originButtonNew = document.createElement("button");
        originButtonNew.className = "list-button";
        originButtonNew.addEventListener("click", () => selectTomePath(origin, false));

        originWrapper.appendChild(originButtonNew);

        SetTomePathInfo(originButtonNew, origin);
    }
    console.log(normalizedPos.x + getNormalizedWidth(selectionsHolder));
    selectionsHolder.style.display = "block";
    // if (normalizedPos.x + getNormalizedWidth(selectionsHolder) > 1.5) {
    //     selectionsHolder.style.left = (mouseX - selectionsHolder.getBoundingClientRect().width - offset + scrollLeft) + 'px';
    // } else {
    selectionsHolder.style.left = "200px";
    // }

    if (normalizedPos.y + getNormalizedHeight(selectionsHolder) > 0.95) {
        selectionsHolder.style.top =
            mouseY - selectionsHolder.getBoundingClientRect().height - offset + scrollTop + "px";
    } else {
        selectionsHolder.style.top = mouseY + offset + scrollTop + "px";
    }
}

// Function to handle the selection of an origin
function selectTomePath(origin, fromLoad) {
    TurnOffTooltip();
    var originButton = document.getElementById("tomePathButton");
    originButton.textContent = "";

    if (origin != undefined) {
        currentTomeList.push(origin);
    }

    for (var i = 0; i < currentTomeList.length; i++) {
        SetTomePathInfoSmall(originButton, currentTomeList[i]);
    }

    RecalculateStats(fromLoad);
    // swap current known origin
    // draw all tomes

    toggleOriginButtons();
}

// Function to handle the selection of an origin
function selectSkillPath(origin) {
    TurnOffTooltip();
    var originButton = document.getElementById("originButtonSignature");

    originButton.textContent = "";
    if (origin != undefined) {
        currentSignatureSkills.push(origin);
    }

    if (currentSignatureSkills.length == 0) {
        originButton.textContent = "+";
    }
    // console.log(currentSignatureSkills + " origin " + origin);

    for (var i = 0; i < currentSignatureSkills.length; i++) {
        SetSkillPathInfoSmall(originButton, currentSignatureSkills[i]);
    }

    RecalculateStats(true);
    // swap current known origin
    // draw all tomes

    toggleOriginButtons();
}

function SetSkillPathInfoSmall(buttonHolder, origin) {
    const image = document.createElement("img");
    image.setAttribute("width", "60");
    image.setAttribute("height", "60");
    image.style = "position: relative; top: 10px;";

    image.src = "/aow4db/Icons/Abilities/" + origin.icon + ".png"; // Set the image source to your image file

    // Create a span element to hold the button text
    const buttonText = document.createElement("span");
    const newDivButton = document.createElement("div");
    buttonText.innerHTML = " " + origin.name;
    buttonText.style = "display: block;font-size: 12px;position: relative;text-align: center;";
    // buttonText.innerHTML += origin.name;
    var affinity = "";
    const affinityText = document.createElement("div");
    affinityText.style = "position: absolute;left: 14px;top: 6px;";

    //console.log(origin);
    if ("hero_property" in origin) {
        affinity = transformString(origin.hero_property);
        affinity = affinity.replaceAll(",", "");
        affinityText.innerHTML += affinity;
    }
    // Append the image and button text to the button element
    newDivButton.appendChild(image);
    newDivButton.appendChild(buttonText);
    newDivButton.appendChild(affinityText);

    buttonHolder.append(newDivButton);

    // create mouseover
    spa = document.createElement("SPAN");
    spa.setAttribute("style", "margin-left:113px");

    spa.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";

    SetSkillPreview(spa, origin);

    newDivButton.className = "skill-button-small";

    newDivButton.addEventListener("click", (event) => SetSkillPathOptions(event));

    // newDivButton.append(spa);

    addTooltipListeners(newDivButton, spa);
}
function SetTomePathInfoSmall(buttonHolder, origin) {
    const image = document.createElement("img");
    image.setAttribute("width", "60");
    image.setAttribute("height", "60");
    image.style = "position: relative; top: 10px;";

    image.src = "/aow4db/Icons/TomeIcons/" + origin.id + ".png"; // Set the image source to your image file

    // Create a span element to hold the button text
    const buttonText = document.createElement("span");
    const newDivButton = document.createElement("div");
    buttonText.innerHTML = romanize(origin.tier);
    buttonText.style = "display: block;font-size: 15px;position: relative;text-align: right; top: -10px;";
    // buttonText.innerHTML += origin.name;
    var affinity = "";
    const affinityText = document.createElement("div");
    affinityText.style = "position: relative;left: -3px;top: -80px;";

    //console.log(origin);
    if ("affinities" in origin) {
        affinity = ClearAffinityExtraTags(duplicateTags(origin.affinities));
        affinity = affinity.replaceAll(",", "");
        affinityText.innerHTML += affinity;
    }
    // Append the image and button text to the button element
    newDivButton.appendChild(image);
    newDivButton.appendChild(buttonText);
    newDivButton.appendChild(affinityText);

    buttonHolder.append(newDivButton);

    // create mouseover
    spa = document.createElement("SPAN");
    spa.setAttribute("style", "margin-left:113px");

    spa.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";

    SetTomePreview(spa, origin);

    newDivButton.className = "tome-button-small";

    newDivButton.addEventListener("click", (event) => SetTomePathOptions(event));

    // newDivButton.append(spa);

    addTooltipListeners(newDivButton, spa);
}

function ClearSkillPath(test) {
    var originButton = document.getElementById("originButtonSignature");
    originButton.textContent = "+";

    if (test != undefined) {
        currentSignatureSkills = [];
    }

    //currentTomeList.push(currentTome);
    // selectSkillPath();

    RecalculateStats(false);
    // swap current known origin
    // draw all tomes

    toggleOriginButtons();
}

function RemoveLastSkill() {
    currentSignatureSkills.pop();

    //currentTomeList.push(currentTome);
    selectSkillPath();

    RecalculateStats(false);
    // swap current known origin
    // draw all tomes

    toggleOriginButtons();
}

function RemoveLastTomePath() {
    if (currentTomeList.length > 1) {
        currentTomeList.pop();
    }

    selectTomePath();

    RecalculateStats(false);
    // swap current known origin
    // draw all tomes

    toggleOriginButtons();
}

function ClearTomePath() {
    var originButton = document.getElementById("tomePathButton");
    originButton.textContent = "";

    currentTomeList = [];
    currentTomeList.push(currentTome);
    selectTomePath();

    RecalculateStats(false);
    // swap current known origin
    // draw all tomes

    toggleOriginButtons();
}

function SetTomePathInfo(button, origin) {
    const image = document.createElement("img");
    image.setAttribute("width", "50");
    image.setAttribute("height", "50");

    image.src = "/aow4db/Icons/TomeIcons/" + origin.id + ".png"; // Set the image source to your image file

    // Create a span element to hold the button text
    const buttonText = document.createElement("span");
    const newDivButton = document.createElement("div");
    buttonText.innerHTML = romanize(origin.tier) + ": ";
    var clearname = origin.name.replace("Tome of the", "");
    buttonText.innerHTML += clearname.replace("Tome of", "");
    buttonText.style = "display: block;font-size: 15px;position: relative;text-align: center; top: -40px;";

    var affinity = "";
    const affinityText = document.createElement("div");
    affinityText.style = "position: relative;left: -20px;top: -50px;";
    if ("affinities" in origin) {
        affinity = ClearAffinityExtraTags(duplicateTags(origin.affinities));
        affinity = affinity.replaceAll(",", "");
        affinityText.innerHTML += " " + affinity;
    }
    // Append the image and button text to the button element
    newDivButton.appendChild(image);
    newDivButton.appendChild(affinityText);
    newDivButton.appendChild(buttonText);

    button.append(newDivButton);

    // create mouseover
    spa = document.createElement("SPAN");

    spa.setAttribute("style", "margin-left:113px");

    spa.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";

    SetTomePreview(spa, origin);

    newDivButton.className = "list-button-long";

    newDivButton.addEventListener("click", (event) => SetTomePathOptions(event));

    //  newDivButton.append(spa);

    addTooltipListeners(newDivButton, spa);
}

function SetSkillPathInfo(button, origin) {
    const image = document.createElement("img");
    image.setAttribute("width", "50");
    image.setAttribute("height", "50");

    image.src = "/aow4db/Icons/Abilities/" + origin.icon + ".png"; // Set the image source to your image file

    // Create a span element to hold the button text
    const buttonText = document.createElement("span");
    const newDivButton = document.createElement("div");
    buttonText.innerHTML = romanize(origin.tier) + ": ";
    var clearname = origin.name.replace("Tome of the", "");
    buttonText.innerHTML += clearname.replace("Tome of", "");
    buttonText.style = "display: block;font-size: 15px;position: relative;text-align: center; top: -40px;";

    var affinity = "";
    const affinityText = document.createElement("div");
    affinityText.style = "position: relative;left: -20px;top: -50px;";

    if ("hero_property" in origin) {
        affinity = transformString(origin.hero_property);
        affinity = affinity.replaceAll(",", "");
        affinityText.innerHTML += affinity;
    }
    // if ('affinities' in origin) {

    //     affinity = ClearAffinityExtraTags(duplicateTags(origin.affinities));
    //     affinity = affinity.replaceAll(",", "");
    //     affinityText.innerHTML += " " + affinity;

    // }
    // Append the image and button text to the button element
    newDivButton.appendChild(image);
    newDivButton.appendChild(affinityText);
    newDivButton.appendChild(buttonText);

    button.append(newDivButton);

    // create mouseover
    spa = document.createElement("SPAN");

    spa.setAttribute("style", "margin-left:113px");

    spa.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";

    SetSkillPreview(spa, origin);

    newDivButton.className = "list-button-long";

    newDivButton.addEventListener("click", () => SetSkillPathOptions(event));

    //  newDivButton.append(spa);

    addTooltipListeners(newDivButton, spa);
}

function SetupButtons(evt, type) {
    // const rect = evt.target.getBoundingClientRect();
    var selectionsHolder = document.getElementById("selectionsHolder");

    var originWrapper = document.getElementById("originWrapperOptions");
    originWrapper.innerHTML = "";
    originWrapper.setAttribute("style", " grid-template-columns: repeat(3, 2fr);");

    // var originButton = document.getElementById("originButton" + type);
    //console.log(type);
    var list = [];

    // assign current selection
    switch (type) {
        case "Tome":
            list = GetAllStartingTomes();

            break;
        case "Origin":
            list = GetAllOrigins();

            break;

        case "FormTrait":
            list = GetAllFormTraitsList();

            break;
        case "Culture":
            list = GetAllCultures();

            break;
        case "Form":
            list = GetAllForms();

            break;
        case "Society1":
            list = GetAllSocietyTraits();

            break;

        case "Loadout":
            list = GetAllLoadouts();

            break;
        case "Ascension":
            list = GetAllAscensions();

            break;
        case "Society2":
            list = GetAllSocietyTraits();

            break;

        case "Symbol":
            list = Array.from(
                {
                    length: 138
                },
                (_, index) => index
            );
            // list = new Array(138);

            break;
        case "TomePath":
            list = GetNextSetOfTomes();
            break;
        case "Signature":
            list = GetAllSignatureSkills();
            if (currentSignatureSkills.length == 4) {
                console.log("more than 4");
                return;
            }
            break;
    }

    // console.log(currentChoice);
    // List of origin options

    // Create origin buttons dynamically from the list
    var selectionsText = document.getElementById("selections");
    selectionsText.textContent = "Select " + type;
    for (const origin of list) {
        var originButtonNew = document.createElement("button");

        if (type === "Symbol") {
            originButtonNew.addEventListener("click", () => SelectSymbol(origin));
            originButtonNew.className = "list-button-small";
            originWrapper.appendChild(originButtonNew);
            SetButtonInfo(originButtonNew, origin, type);
        } else if (type === "FormTrait") {
            // hook into options thingie
            originButtonNew.className = "list-button";

            // console.log(origin.point_cost + " " + getPoints());

            if (isInArray(currentFormTraitList, origin)) {
                originButtonNew.classList.toggle("selected");

                console.log(currentFormTraitList + " " + origin);
            }

            if (origin.point_cost + getPoints() > 5 || checkCompatibilityTraits(origin) == false) {
                originButtonNew.style.color = "grey";
            } else {
                originButtonNew.style.color = "white";
            }

            // new button script

            originButtonNew.addEventListener("click", (event) => toggleSelection(origin, originButtonNew, type, event));

            originWrapper.appendChild(originButtonNew);

            SetButtonInfo(originButtonNew, origin, type);
        } else {
            if (!incompatibleCheck(type, origin)) {
                originButtonNew.className = "list-button";

                originButtonNew.addEventListener("click", (event) => selectOrigin(origin, type));

                originWrapper.appendChild(originButtonNew);

                SetButtonInfo(originButtonNew, origin, type);
                // originButtonNew.innerHTML += "<span style=\"color:red\"> Incompatible </span>";
            }
        }
    }

    if (type == "FormTrait") {
        selectionsHolder.style.display = "block";
        selectionsHolder.style.left = "254px";
        selectionsHolder.style.top = "431px";
    } else {
        var normalizedPos = getNormalizedPosition(evt);

        const mouseX = evt.clientX;
        const mouseY = evt.clientY;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        selectionsHolder.style.display = "block";

        if (normalizedPos.x + getNormalizedWidth(selectionsHolder) > 0.95) {
            selectionsHolder.style.left = mouseX - selectionsHolder.getBoundingClientRect().width + scrollLeft + "px";
        } else {
            selectionsHolder.style.left = mouseX + scrollLeft + "px";
        }

        if (normalizedPos.y + getNormalizedHeight(selectionsHolder) > 0.95) {
            selectionsHolder.style.top = mouseY - selectionsHolder.getBoundingClientRect().height + scrollTop + "px";
        } else {
            selectionsHolder.style.top = mouseY + scrollTop + "px";
        }
    }
}

function GetCurrentChoiceList() {
    var listOfAllChoices = [];

    //listOfAllChoices.push(currentOrigin);
    //  listOfAllChoices.push(currentTome);

    //   listOfAllChoices.push(currentForm);
    // listOfAllChoices.push(currentFormTraitList);
    listOfAllChoices.push(currentCulture);
    listOfAllChoices.push(currentSociety1);
    listOfAllChoices.push(currentSociety2);
    listOfAllChoices.push(currentLoadout);
    return listOfAllChoices;
}

function RecalculateStats(fromload) {
    var list = GetCurrentChoiceList();

    var input = "";

    for (i = 0; i < list.length; i++) {
        if (list[i] != "") {
            if ("affinity" in list[i]) {
                input += list[i].affinity + ",";
            }
            if ("affinities" in list[i]) {
                if (list[i].affinities.length > 0) {
                    for (let index = 0; index < list[i].affinities.length; index++) {
                        if (list[i].affinities[index].name.indexOf("Affinity") != -1) {
                            var bittoadd = clearSocietyAffinities(list[i].affinities[index].name);
                            //  console.log(list[i].affinities[0].name);
                            input += bittoadd + ",";

                            input = ClearAffinityExtraTags(input);
                        }
                    }
                } else {
                    var bittoadd = duplicateTags(list[i].affinities);
                    input += bittoadd + ",";

                    input = ClearAffinityExtraTags(input);
                }
            }
        }
    }

    for (i = 0; i < currentTomeList.length; i++) {
        if (list[i] != "") {
            if ("affinity" in currentTomeList[i]) {
                input += currentTomeList[i].affinity + ",";
            }
            if ("affinities" in currentTomeList[i]) {
                var bittoadd = duplicateTags(currentTomeList[i].affinities);
                input += bittoadd + ",";
                input = ClearAffinityExtraTags(input);
            }
        }
    }

    for (i = 0; i < currentSignatureSkills.length; i++) {
        if (list[i] != "") {
            if ("hero_property" in currentSignatureSkills[i]) {
                var bittoadd = transformString(currentSignatureSkills[i].hero_property);
                input += bittoadd + ",";
                input = ClearAffinityExtraTags(input);
            }
        }
    }

    // add all extra input tags
    document.getElementById("extraOrder").innerHTML = "<empireorderBig></empireorderBig>" + extraOrder;
    document.getElementById("extraOrder").style = "text-align:center";
    document.getElementById("extraChaos").innerHTML = "<empirechaosBig></empirechaosBig>" + extraChaos;
    document.getElementById("extraChaos").style = "text-align:center";
    document.getElementById("extraNature").innerHTML = "<empirenatureBig></empirenatureBig>" + extraNature;
    document.getElementById("extraNature").style = "text-align:center";
    document.getElementById("extraMaterium").innerHTML = "<empirematterBig></empirematterBig>" + extraMaterium;
    document.getElementById("extraMaterium").style = "text-align:center";
    document.getElementById("extraShadow").innerHTML = "<empireshadowBig></empireshadowBig>" + extraShadow;
    document.getElementById("extraShadow").style = "text-align:center";
    document.getElementById("extraAstral").innerHTML = "<empirearcanaBig></empirearcanaBig>" + extraAstral;
    document.getElementById("extraAstral").style = "text-align:center";
    for (let i = 0; i < extraOrder; i++) {
        input += "<empireorder></empireorder>,";
    }
    for (let i = 0; i < extraChaos; i++) {
        input += "<empirechaos></empirechaos>,";
    }
    for (let i = 0; i < extraNature; i++) {
        input += "<empirenature></empirenature>,";
    }
    for (let i = 0; i < extraMaterium; i++) {
        input += "<empirematter></empirematter>,";
    }

    for (let i = 0; i < extraShadow; i++) {
        input += "<empireshadow></empireshadow>,";
    }

    for (let i = 0; i < extraAstral; i++) {
        input += "<empirearcana></empirearcana>,";
    }

    input = input.slice(0, -1);

    // console.log(input);

    // Split the input string into an array of words
    const words = input.split(",").map((word) => word.trim());

    // Create an object to store word counts
    const wordCounts = {};

    // Count the occurrences of each word
    words.forEach((word) => {
        if (wordCounts[word]) {
            wordCounts[word]++;
        } else {
            wordCounts[word] = 1;
        }
    });

    // Sort the words by count in descending order
    const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);

    // Format the result
    var result = sortedWords
        .map((word) => {
            const count = wordCounts[word];

            return ` ${word} ${count}`;
        })
        .join(", ");

    const affinitySummary = document.getElementById("currentAffinity");

    result = result.replaceAll(",", "");

    currentAffinityTotal = result;

    result = result.replace("<empireshadow></empireshadow> ", "<empireshadowBig></empireshadowBig>");
    result = result.replace("<empirechaos></empirechaos> ", "<empirechaosBig></empirechaosBig>");
    result = result.replace("<empirenature></empirenature> ", "<empirenatureBig></empirenatureBig>");
    result = result.replace("<empirearcana></empirearcana> ", "<empirearcanaBig></empirearcanaBig>");
    result = result.replace("<empirematter></empirematter> ", "<empirematterBig></empirematterBig>");
    result = result.replace("<empireorder></empireorder> ", "<empireorderBig></empireorderBig>");
    affinitySummary.innerHTML = result;

    CollectAllPartsForOverview(fromload);
}

function clearSocietyAffinities(input) {
    if (input.indexOf("shadow") != -1) {
        input = "<empireshadow></empireshadow>";
    }
    if (input.indexOf("chaos") != -1) {
        input = "<empirechaos></empirechaos>";
    }
    if (input.indexOf("matter") != -1) {
        input = "<empirematter></empirematter>";
    }
    if (input.indexOf("order") != -1) {
        input = "<empireorder></empireorder>";
    }
    if (input.indexOf("nature") != -1) {
        input = "<empirenature></empirenature>";
    }
    if (input.indexOf("arcana") != -1) {
        input = "<empirearcana></empirearcana>";
    }
    return input;
}

function ClearAffinityExtraTags(input) {
    input = input.replace(" Empire Astral Affinity", "");
    input = input.replace(" Empire Nature Affinity", "");
    input = input.replace(" Empire Order Affinity", "");
    input = input.replace(" Empire Materium Affinity", "");
    input = input.replace(" Empire Chaos Affinity", "");
    input = input.replace(" Empire Shadow Affinity", "");

    input = input.replace(" Astral Affinity", "");
    input = input.replace(" Nature Affinity", "");
    input = input.replace(" Order Affinity", "");
    input = input.replace(" Materium Affinity", "");
    input = input.replace(" Chaos Affinity", "");
    input = input.replace(" Shadow Affinity", "");
    return input;
}

function duplicateTags(inputString) {
    const tagPattern = /(\d+)\s+<([^>]+)>/g;

    //console.log(inputString);

    let result = "";
    let match;

    while ((match = tagPattern.exec(inputString)) !== null) {
        const count = parseInt(match[1]);
        const tagName = match[2];

        // Create a repeated tag string
        const repeatedTags = Array(count).fill(`<${tagName}></${tagName}>`).join(", ");

        // Append the repeated tags to the result
        if (result !== "") {
            result += ", ";
        }
        result += repeatedTags;
    }

    return result;
}

function SetButtonInfo(button, origin, type, color) {
    button.innerHTML = "";
    const image = document.createElement("img");
    image.setAttribute("width", "40");
    image.setAttribute("height", "40");

    if (type === "Tome") {
        image.src = "/aow4db/Icons/TomeIcons/" + origin.id + ".png"; // Set the image source to your image file
    } else if (type === "FormTrait") {
        image.setAttribute("width", "22");
        image.setAttribute("height", "22");
        if (origin.id.startsWith("_")) {
            var iconLink = origin.id;

            iconLink = iconLink.split("_").slice(1).join("_");
            image.src = "/aow4db/Icons/FactionCreation/" + iconLink + ".png";
        } else {
            image.src = "/aow4db/Icons/FactionCreation/" + origin.id + ".png"; // Set the image source to your image file
        }
    } else if (
        type === "Culture" ||
        type === "Origin" ||
        type === "Society1" ||
        type === "Society2" ||
        type === "Form"
    ) {
        if (origin.id.startsWith("_")) {
            var iconLink = origin.id;
            iconLink = iconLink.split("_").slice(1).join("_");
            image.src = "/aow4db/Icons/FactionCreation/" + iconLink + ".png";
        } else {
            image.src = "/aow4db/Icons/FactionCreation/" + origin.id + ".png"; // Set the image source to your image file
        }
    } else if (type === "Loadout") {
        image.src = "/aow4db/Icons/Abilities/" + origin.id + ".png"; // Set the image source to your image file
    } else if (type === "Signature" || type == "Ascension") {
        image.src = "/aow4db/Icons/Abilities/" + origin.icon + ".png";
    } else if (type === "Symbol") {
        if (origin < 10 && origin > 0) {
            origin = "0" + origin.toString();
        }
        if (origin === 0) {
            origin += 138;
        }
        image.src = "/aow4db/Icons/Symbols/SigilIcons_" + origin + ".gif"; // Set the image source to your image file
    }
    if (type != "Symbol") {
        // Create a span element to hold the button text
        const buttonText = document.createElement("span");

        if ("point_cost" in origin && type === "FormTrait") {
            buttonText.innerHTML += origin.point_cost + ": ";
        }

        buttonText.innerHTML += " " + origin.name;
        var affinity = "";
        if ("affinity" in origin) {
            affinity = ClearAffinityExtraTags(origin.affinity);
            affinity = affinity.replaceAll(",", "");
            buttonText.innerHTML += " " + affinity;
        }

        if ("affinities" in origin) {
            if (type == "Tome") {
                affinity = ClearAffinityExtraTags(duplicateTags(origin.affinities));
                affinity = affinity.replaceAll(",", "");
                buttonText.innerHTML += " " + affinity;
            }
            if (type.indexOf("Society") != -1) {
                for (let index = 0; index < origin.affinities.length; index++) {
                    if (origin.affinities[index].name.indexOf("Affinity") != -1) {
                        var newaffinity = origin.affinities[index].name;

                        newaffinity = clearSocietyAffinities(newaffinity);

                        //  affinity = newaffinity.replaceAll(",", "");
                        buttonText.innerHTML += " " + newaffinity;
                    }
                }
            }
        }

        if (type == "Signature") {
            if ("hero_property" in origin) {
                const affinityText = document.createElement("div");
                affinityText.style = " position: absolute;left: 0;";

                affinity = transformString(origin.hero_property);
                affinity = affinity.replaceAll(",", "");
                affinityText.innerHTML += affinity;
                button.append(affinityText);
            }
        }

        // Append the image and button text to the button element
        button.appendChild(image);
        button.appendChild(buttonText);
    } else {
        button.appendChild(image);
        return;
    }

    // create mouseover
    spa = document.createElement("SPAN");
    spa.setAttribute("style", "margin-left:113px");

    spa.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;"> ' + origin.name.toUpperCase() + "</p>";
    if (type === "Origin" || type === "Culture" || type === "Form" || type === "Society1" || type === "Society2") {
        //spa.innerHTML += origin.description;

        if ("effect_descriptions" in origin) {
            spa.innerHTML += '<br><br><span class="mod_name">EFFECTS: </span><bulletlist>';
            var k = "";
            for (k in origin.effect_descriptions) {
                spa.innerHTML += "<bullet>" + origin.effect_descriptions[k].name + "</bullet>";
            }
            spa.innerHTML += "</bulletlist>";
        }

        if ("description" in origin) {
            spa.innerHTML += origin.description;
        }

        if ("starting_bonuses" in origin) {
            spa.innerHTML += '<br><br><span class="mod_name">STARTING BONUS: </span><bulletlist>';
            var k = "";
            for (k in origin.starting_bonuses) {
                if ("structure_upgrade_slug" in origin.starting_bonuses[k]) {
                    spa.innerHTML += "<bullet>" + origin.starting_bonuses[k].structure_upgrade_slug + "</bullet>";
                }
                if ("empire_progression_slug" in origin.starting_bonuses[k]) {
                    spa.innerHTML += "<bullet>" + origin.starting_bonuses[k].empire_progression_slug + "</bullet>";
                }
                if ("description" in origin.starting_bonuses[k]) {
                    spa.innerHTML += "<bullet>" + origin.starting_bonuses[k].description + "</bullet>";
                }
            }
            spa.innerHTML += "</bulletlist>";
        }

        if ("incompatible_society_traits" in origin) {
            spa.innerHTML += '<br><br><span class="mod_name">INCOMPATIBLE WITH: </span><bulletlist>';
            var k = "";
            for (k in origin.incompatible_society_traits) {
                spa.innerHTML += "<bullet>" + origin.incompatible_society_traits[k].name + "</bullet>";
            }
            spa.innerHTML += "</bulletlist>";
        }
    } else if (type === "Tome") {
        SetTomePreview(spa, origin);
    } else if (type === "FormTrait") {
        SetFullPreview(spa, origin);
    } else if (type === "Signature" || type == "Ascension") {
        SetSkillPreview(spa, origin);
    } else if ((type = "Loadout")) {
        SetLoadoutPreview(spa, origin);
    }
    addTooltipListeners(button, spa);

    // button.append(spa);
}
function SetSkillPreview(span, origin) {
    span.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";
    if ("description" in origin) {
        span.innerHTML += origin.description;
    }

    if ("abilities" in origin) {
        for (let index = 0; index < origin.abilities.length; index++) {
            for (let i = 0; i < jsonUnitAbilities.length; i++) {
                const test = jsonUnitAbilities[i];
                if (origin.abilities[index].slug == test.slug) {
                    span.innerHTML += "<br>" + GetAbilityInfo(test).innerHTML;
                }
            }
        }

        // span.innerHTML += GetAbilityToolTip()
    }
}

function SetLoadoutPreview(span, origin) {
    span.className = "abilityHighLighter";
    span.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>  <br>";
    if ("description" in origin) {
        span.innerHTML +=
            '<p <p class ="abilityHighLighter" style="color: #d797b2;>' +
            '<span style="font-size=20px;">' +
            origin.name.toUpperCase() +
            "</p>" +
            "<br>";
        span.innerHTML += origin.description;
    }
    if ("items" in origin) {
        for (let index = 0; index < origin.items.length; index++) {
            for (let i = 0; i < jsonHeroItems.length; i++) {
                const test = jsonHeroItems[i];
                if (origin.items[index].slug == test.id) {
                    span.innerHTML +=
                        '<p class ="abilityHighLighter" style="color: #97d7a2;>' +
                        '<span style="font-size=20px;"> ITEM: <img style="margin-top:-10px" src="/aow4db/Icons/Abilities/' +
                        test.icon +
                        ".png\" height='30px'>" +
                        test.name.toUpperCase() +
                        "</p>" +
                        "<br>";
                    break;
                }
            }
            if (origin.items[index].slug == "hero_mount") {
                span.innerHTML +=
                    '<p class ="abilityHighLighter" style="color: #97d7a2;>' +
                    '<span style="font-size=20px;"> ITEM: <img style="margin-top:-10px" src="/aow4db/Icons/Abilities/white_horse.png" height=\'30px\'>HERO MOUNT</p>' +
                    "<br>";
            }
        }

        // span.innerHTML += GetAbilityToolTip()
    }

    if ("spells" in origin) {
        for (let index = 0; index < origin.spells.length; index++) {
            for (let i = 0; i < jsonSpells.length; i++) {
                const test = jsonSpells[i];
                if (origin.spells[index].slug == test.id) {
                    span.innerHTML +=
                        '<p class ="abilityHighLighter" style="color: #82a3eb;>' +
                        '<span style="font-size=20px;"> SPELL: <img style="margin-top:-10px" src="/aow4db/Icons/SpellIcons/' +
                        test.id +
                        ".png\" height='30px'>" +
                        test.name.toUpperCase() +
                        "</p>" +
                        "<br>";
                    span.innerHTML += test.description + "<br><br><br>";
                    break;
                }
            }
        }

        // span.innerHTML += GetAbilityToolTip()
    }

    if ("abilities" in origin) {
        for (let index = 0; index < origin.abilities.length; index++) {
            for (let i = 0; i < jsonUnitAbilities.length; i++) {
                const test = jsonUnitAbilities[i];

                if (origin.abilities[index].slug == test.slug) {
                    span.innerHTML += "<br>" + GetAbilityInfo(test).innerHTML + "<br>";
                }
            }
            for (let j = 0; j < jsonHeroSkills.length; j++) {
                const test = jsonHeroSkills[j];
                if (origin.abilities[index].slug == test.id) {
                    if ("description" in test) {
                        span.innerHTML +=
                            ' <p class ="abilityHighLighter" style="color: #d797b2;>' +
                            '<span style="font-size=20px;">' +
                            test.name.toUpperCase() +
                            "</p>" +
                            "<br><br>";

                        span.innerHTML += test.description;
                    }
                }
            }
        }

        // span.innerHTML += GetAbilityToolTip()
    }
}

function SetTomePreview(span, origin) {
    span.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";
    span.innerHTML += origin.gameplay_description + "<br>";
    if ("hero_skills" in origin) {
        span.innerHTML += '<p style="color: #97d7a2;>' + '<span style="font-size=20px;">Hero Skills:<br></p>';

        for (let index = 0; index < origin.hero_skills.length; index++) {
            span.innerHTML += "<bullet> " + GetHeroSkillName(origin.hero_skills[index].slug) + "</bullet>";
        }
    }
    if ("passives" in origin) {
        span.innerHTML += '<p style="color: #97d7a2;>' + '<span style="font-size=20px;">Passives:<br></p>';
        for (let index = 0; index < origin.passives.length; index++) {
            span.innerHTML += "<bullet>" + origin.passives[index].name + "</bullet>";
        }
    }
    if ("initial_upgrades" in origin) {
        span.innerHTML += '<p  style="color: #97d7a2;>' + '<span style="font-size=20px;">Initial Upgrades:<br></p>';

        for (let index = 0; index < origin.initial_upgrades.length; index++) {
            span.innerHTML +=
                '<bullet> <img width="20px" src="/aow4db/Icons/UpgradeIcons/' +
                origin.initial_upgrades[index].upgrade_slug +
                '.png">' +
                GetStructureName(origin.initial_upgrades[index].upgrade_slug) +
                "</bullet>";
        }
    }
    if ("skills" in origin) {
        span.innerHTML += '<p  style="color: #97d7a2;>' + '<span style="font-size=20px;">Skills:<br></p>';

        for (let index = 0; index < origin.skills.length; index++) {
            // unit unlock
            if (
                origin.skills[index].type == "<hyperlink>Unit</hyperlink>" ||
                origin.skills[index].type == "Unit Unlock"
            ) {
                // can be summon as well
                if ("spell_slug" in origin.skills[index]) {
                    span.innerHTML +=
                        '<bullet> <img width="20px" src="/aow4db/Icons/SpellIcons/' +
                        origin.skills[index].spell_slug +
                        '.png">' +
                        GetSpellTierAndName(origin.skills[index].spell_slug) +
                        "</bullet>";
                } else {
                    span.innerHTML +=
                        '<bullet> <img width="20px" src="/aow4db/Icons/SpellIcons/' +
                        origin.skills[index].unit_slug +
                        '.png">' +
                        GetUnitNamePlain(origin.skills[index].unit_slug) +
                        "</bullet>";
                }
            }
            // siege
            else if (origin.skills[index].type.indexOf("Siege") != -1) {
                var slug = "";
                if ("siege_project_slug" in origin.skills[index]) {
                    slug = origin.skills[index].siege_project_slug;
                } else {
                    slug = origin.skills[index].name.replaceAll(" ", "_").toLowerCase();
                }
                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/SiegeIcons/' +
                    slug +
                    '.png">' +
                    GetSiegeProjectName(slug) +
                    "</bullet>";
            }
            // city structure
            else if (origin.skills[index].type.indexOf("Structure") != -1) {
                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/UpgradeIcons/' +
                    origin.skills[index].upgrade_slug +
                    '.png">' +
                    GetStructureName(origin.skills[index].upgrade_slug) +
                    "</bullet>";
            }
            // empire upgrades
            else if (origin.skills[index].type.indexOf("Empire") != -1) {
                var imageLinkName = origin.skills[index].name.replaceAll(" ", "_").toLowerCase();
                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/SpellIcons/' +
                    imageLinkName +
                    '.png">' +
                    origin.skills[index].name +
                    "</bullet>";
            }
            // normal spell
            else {
                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/SpellIcons/' +
                    origin.skills[index].spell_slug +
                    '.png">' +
                    GetSpellTierAndName(origin.skills[index].spell_slug) +
                    "</bullet>";
            }
            //
        }
    }
}

function SetFullPreview(span, origin) {
    span.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";

    span.innerHTML += "<bulletlist>";
    for (i = 0; i < origin.effect_descriptions.length; i++) {
        span.innerHTML += "<bullet>" + origin.effect_descriptions[i].name + "</bullet>";
    }
    span.innerHTML += "</bulletlist>";
}

function GetAllStartingTomes() {
    var listOfAllTier1Tomes = [];

    for (i = 0; i < jsonTomes.length; i++) {
        if (jsonTomes[i].tier === 1) {
            listOfAllTier1Tomes.push(jsonTomes[i]);
        }
    }
    // alert(listOfAllTier1Tomes);
    return listOfAllTier1Tomes;
}

function CollectAllPartsForOverview(fromload) {
    document.getElementById("hiddentooltips").innerHTML = "";
    // get all spells

    var listOfAllCurrentSpellsSlugs = [];
    var listOfAllCurrentUnitSlugs = [];
    var listOfAllCurrentUpgradeSlugs = [];
    var listOfAllCurrentSPISlugs = [];
    var listOfAllCurrentHeroSkillsSlugs = [];
    var listOfAllCurrentPassivesSlugs = [];

    var listOfAllCurrentSiegeProjectsSlugs = [];

    var ExtraTomelist = [];
    ExtraTomelist.push(...currentTomeList);

    for (let v = 0; v < jsonTomes.length; v++) {
        if (currentCulture.name.indexOf(jsonTomes[v].name) != -1) {
            // if subcutlure

            ExtraTomelist.push(jsonTomes[v]);
        }
    }

    ExtraTomelist.sort((a, b) => a.tier - b.tier);
    // from all tomes
    for (let index = 0; index < ExtraTomelist.length; index++) {
        if ("skills" in ExtraTomelist[index]) {
            for (let i = 0; i < ExtraTomelist[index].skills.length; i++) {
                // found a spell
                if ("spell_slug" in ExtraTomelist[index].skills[i]) {
                    listOfAllCurrentSpellsSlugs.push(ExtraTomelist[index].skills[i], ExtraTomelist[index]);
                }
                if ("unit_slug" in ExtraTomelist[index].skills[i]) {
                    listOfAllCurrentUnitSlugs.push(ExtraTomelist[index].skills[i], ExtraTomelist[index]);
                }
                if ("upgrade_slug" in ExtraTomelist[index].skills[i]) {
                    listOfAllCurrentUpgradeSlugs.push(ExtraTomelist[index].skills[i], ExtraTomelist[index]);
                }
                if (ExtraTomelist[index].skills[i].type.indexOf("Siege") != -1) {
                    listOfAllCurrentSiegeProjectsSlugs.push(ExtraTomelist[index].skills[i], ExtraTomelist[index]);
                }

                if (ExtraTomelist[index].skills[i].type == "<hyperlink>Empire Bonus</hyperlink>") {
                    listOfAllCurrentPassivesSlugs.push(ExtraTomelist[index].skills[i], ExtraTomelist[index]);
                }
            }
        }
        if ("initial_upgrades" in ExtraTomelist[index]) {
            for (let j = 0; j < ExtraTomelist[index].initial_upgrades.length; j++) {
                listOfAllCurrentSPISlugs.push(
                    ExtraTomelist[index].initial_upgrades[j].upgrade_slug,
                    ExtraTomelist[index]
                );
            }
        }
        if ("hero_skills" in ExtraTomelist[index]) {
            for (let l = 0; l < ExtraTomelist[index].hero_skills.length; l++) {
                if (!isInArray(listOfAllCurrentHeroSkillsSlugs, ExtraTomelist[index].hero_skills[l])) {
                    listOfAllCurrentHeroSkillsSlugs.push(ExtraTomelist[index].hero_skills[l], ExtraTomelist[index]);
                }
            }
        }
        if ("passives" in ExtraTomelist[index]) {
            for (let q = 0; q < ExtraTomelist[index].passives.length; q++) {
                listOfAllCurrentPassivesSlugs.push(ExtraTomelist[index].passives[q], ExtraTomelist[index]);
            }
        }
    }

    ShowCombatSpellsOverview(listOfAllCurrentSpellsSlugs);

    ShowUnitsOverview(listOfAllCurrentUnitSlugs);

    ShowUpgradesOverview(listOfAllCurrentUpgradeSlugs);
    ShowSPIOverview(listOfAllCurrentSPISlugs);
    ShowHeroSkillsOverview(listOfAllCurrentHeroSkillsSlugs);
    ShowPassivesOverview(listOfAllCurrentPassivesSlugs);
    ShowSiegeProjectsOverview(listOfAllCurrentSiegeProjectsSlugs);
    var parentDiv = document.getElementById("mainoverview");

    // console.log("here");
    // reset highlights
    if (fromload == false) {
        ResetHighlights();
    }

    SetHighlights();
    SetHighLightToggle();
}

function SetHighLightToggle() {
    RemoveHighLightToggle();
    parentDiv.addEventListener("click", handleClick);
}

// Function to remove the event listener
function RemoveHighLightToggle() {
    parentDiv.removeEventListener("click", handleClick);
}

function handleClick(e) {
    let target = e.target;
    while (target !== parentDiv && !target.classList.contains("overview_list_entry")) {
        target = target.parentNode;
    }
    if (target !== parentDiv && target.classList.contains("overview_list_entry")) {
        target.classList.toggle("highlighted");
        updateActiveIndices();
    }
}

var parentDiv = document.getElementById("mainoverview");
if (parentDiv != undefined) {
    var elements = parentDiv.getElementsByClassName("overview_list_entry");
}
const activeIndices = [];
const activeIndicesDisplay = document.getElementById("highlighted-indices");

function updateActiveIndices() {
    activeIndices.length = 0; // Clear the array
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains("highlighted")) {
            activeIndices.push(i);
        }
    }
    currentHighlights = activeIndices.join(", ");
    currentHighlights = currentHighlights.replaceAll(", ", ":");
    //activeIndicesDisplay.textContent = activeIndices.join(', ');
}

function SetHighlights() {
    elements = parentDiv.getElementsByClassName("overview_list_entry");
    // Split highlightList by ":" and convert each element to a number
    var newHighlights = currentHighlights.split(":").map(Number);
    if (currentHighlights == "") {
        newHighlights = "";
    }

    for (let i = 0; i < elements.length; i++) {
        if (newHighlights.includes(i)) {
            elements[i].classList.add("highlighted"); // Use 'add' instead of 'toggle' to ensure it gets highlighted
        } else {
            elements[i].classList.remove("highlighted"); // Remove the 'active' class if not in newHighlights
        }
    }
}

function CreateHolders(string) {
    var subtHolder = document.createElement("div");
    subtHolder.className = "column";
    subtHolder.innerHTML = string;
    return subtHolder;
}
function ShowCombatSpellsOverview(list) {
    var combatSpellHolder = document.getElementById("overviewCombatSpellsHolder");
    var transformHolder = document.getElementById("overviewTransformationsHolder");

    var enchantHolder = document.getElementById("overviewEnchantmentsHolder");
    var summonHolder = document.getElementById("overviewSummonHolder");
    var otherHolder = document.getElementById("overviewOtherSpellHolder");
    summonHolder.innerHTML = "Summons:<br>";
    enchantHolder.innerHTML = "Enchantments:<br>";
    combatSpellHolder.innerHTML = "Combat Spells:<br>";
    transformHolder.innerHTML = "Transformations:<br>";
    otherHolder.innerHTML = "Misc Spells:<br>";

    for (let index = 0; index < list.length; index += 2) {
        // combat spells:
        if (list[index].type.indexOf("casttactical") != -1) {
            combatSpellHolder.append(CreateSpellIcon(list[index], list[index + 1]));
        } else if (list[index].type.indexOf("Enchantment") != -1) {
            enchantHolder.append(CreateSpellIcon(list[index], list[index + 1]));
        } else if (list[index].type.indexOf("Transformation") != -1) {
            transformHolder.append(CreateSpellIcon(list[index], list[index + 1]));
        } else if (list[index].type.indexOf("Summon Spell") != -1) {
            summonHolder.append(CreateSpellIcon(list[index], list[index + 1]));
        } else {
            otherHolder.append(CreateSpellIcon(list[index], list[index + 1]));
        }

        // strategic spells:
    }
}

function applyTextColor(element, colors) {
    // Create a color box element
    var colorBox = document.createElement("span");
    colorBox.classList.add("color-box");
    colorBox.setAttribute("style", "min-height: 24px;min-width: 7px;position: relative;left: -7px;");

    if (colors.length === 1) {
        // Single color
        colorBox.style.background = colors[0];
    } else if (colors.length === 2) {
        // Gradient color
        colorBox.style.background = `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`;
    }

    // Insert the color box at the beginning of the element
    element.insertBefore(colorBox, element.firstChild);
}

function CreateSpellIcon(listEntry, colorEntry) {
    // var Color = ["green", "blue"];
    var spell = document.createElement("button");
    if ("affinities" in colorEntry) {
        var Color = GetColors(colorEntry.affinities);
        applyTextColor(spell, Color);
    }

    spell.className = "overview_list_entry";
    var text = document.createElement("div");
    var tier = document.createElement("div");
    text.innerHTML = " " + listEntry.name;
    tier.innerHTML = romanize(listEntry.tier) + " ";
    //tier.setAttribute("style", " top: 50%;left: 50%;");

    var smallIcon = document.createElement("img");
    smallIcon.setAttribute("src", "/aow4db/Icons/SpellIcons/" + listEntry.spell_slug + ".png");
    smallIcon.setAttribute("width", "20px");
    spell.appendChild(tier);
    spell.appendChild(smallIcon);
    spell.appendChild(text);
    var iDiv = spell_card_template.content.cloneNode(true);

    document.getElementById("hiddentooltips").appendChild(iDiv);
    var span = showSpell(listEntry.spell_slug, false);

    var newSpan = document.createElement("span");

    newSpan.innerHTML = "<p>From: " + colorEntry.name + "<br></p>";
    span.prepend(newSpan);
    addTooltipListeners(spell, span);
    return spell;
}

function GetColors(affinity) {
    var colors = [];
    if (affinity != undefined) {
        if (affinity.toLowerCase().indexOf("order") != -1) {
            colors.push("#f8f64f");
        }
        if (affinity.toLowerCase().indexOf("shadow") != -1) {
            colors.push("#665cc1");
        }
        if (affinity.toLowerCase().indexOf("nature") != -1) {
            colors.push("#04ae83");
        }
        if (affinity.toLowerCase().indexOf("arcana") != -1) {
            colors.push("#63e3f2");
        }
        if (affinity.toLowerCase().indexOf("chaos") != -1) {
            colors.push("#f0403f");
        }
        if (affinity.toLowerCase().indexOf("matter") != -1) {
            colors.push("#e39954");
        }
    }
    // console.log(colors);
    return colors;
}

function CreateUnitIcon(listEntry, colorEntry) {
    var spell = document.createElement("button");
    if (colorEntry != null) {
        var Color = GetColors(colorEntry.affinities);
        applyTextColor(spell, Color);
    }
    spell.className = "overview_list_entry";
    var text = document.createElement("div");
    text.innerHTML =
        romanize(listEntry.tier) + " " + getUnitTypeTag(listEntry.secondary_passives) + " " + listEntry.name;
    //var smallIcon = document.createElement("img");
    // smallIcon.setAttribute("src", "/aow4db/Icons/SpellIcons/" + listEntry.id + ".png");
    // smallIcon.setAttribute("width", "20px");
    // spell.appendChild(smallIcon);
    // var iDiv = spell_card_template.content.cloneNode(true);

    // document.getElementById("hiddentooltips").appendChild(iDiv);
    var allAbilities = document.createElement("span");

    var emptyList = [];
    allAbilities.innerHTML +=
        '<span style="font-size: 16px;text-align:center"> ' + listEntry.name.toUpperCase() + " <br></span> ";
    allAbilities.innerHTML +=
        '<span style="font-size: 20px ;display:flex" ><img  src="/aow4db/Icons/Text/health.png" width="25 " height="25 ">' +
        listEntry.hp +
        '<img src="/aow4db/Icons/Text/mp.png" width="25 " height="25 ">' +
        listEntry.mp +
        '<img src="/aow4db/Icons/Text/resistance.png" width="25 " height="25 ">' +
        listEntry.resistance +
        '<img  src="/aow4db/Icons/Text/armor.png" width="25 " height="25 ">' +
        listEntry.armor +
        "</span><hr>";
    if ("secondary_passives" in listEntry) {
        for (let index = 0; index < listEntry.secondary_passives.length; index++) {
            addUnitTypeIcon(listEntry.secondary_passives[index].slug, allAbilities, "");
        }
    }
    for (let index = 0; index < listEntry.abilities.length; index++) {
        addAbilityslot(listEntry.abilities[index].slug, allAbilities, emptyList);
    }
    if ("primary_passives" in listEntry) {
        for (let index = 0; index < listEntry.primary_passives.length; index++) {
            addPassiveslot(listEntry.primary_passives[index].slug, allAbilities, emptyList);
        }
    }

    var newSpan = document.createElement("span");
    if (colorEntry != null) {
        newSpan.innerHTML = "<p>From: " + colorEntry.name + "<br></p>";
        allAbilities.prepend(newSpan);
    }

    addTooltipListeners(spell, allAbilities);

    spell.appendChild(text);
    return spell;
}

function ShowUnitsOverview(list) {
    var unitsoverviewHolder = document.getElementById("overviewUnitsHolder");
    // clear the div
    unitsoverviewHolder.innerHTML = "";

    unitsoverviewHolder.innerHTML = "Units:<br>";

    for (let i = 0; i < jsonUnits.length; i++) {
        if (currentCulture.name.indexOf(jsonUnits[i].culture_name) != -1 && jsonUnits[i].id != "") {
            if ("sub_culture_name" in jsonUnits[i]) {
                if (currentCulture.name.indexOf(jsonUnits[i].sub_culture_name) != -1) {
                    unitsoverviewHolder.append(CreateUnitIcon(jsonUnits[i], null));
                }
            } else {
                unitsoverviewHolder.append(CreateUnitIcon(jsonUnits[i], null));
            }
        }
        //     CreateUnitIcon()
        for (let index = 0; index < list.length; index += 2) {
            if (jsonUnits[i].id == list[index].unit_slug) {
                unitsoverviewHolder.append(CreateUnitIcon(jsonUnits[i], list[index + 1]));
            }
        }
    }
}

function ShowUpgradesOverview(list) {
    var upradesoverviewHolder = document.getElementById("overviewUpgradesHolder");
    // clear the div

    upradesoverviewHolder.innerHTML = "";
    if (list.length > 0) {
        upradesoverviewHolder.innerHTML = "City Structures:<br>";
    }
    for (let index = 0; index < list.length; index += 2) {
        for (let i = 0; i < jsonStructureUpgrades.length; i++) {
            if (jsonStructureUpgrades[i].id == list[index].upgrade_slug) {
                var spell = document.createElement("button");
                var Color = GetColors(list[index + 1].affinities);
                applyTextColor(spell, Color);
                spell.className = "overview_list_entry";
                var text = document.createElement("div");
                text.innerHTML = " " + list[index].name;
                var smallIcon = document.createElement("img");
                smallIcon.setAttribute("src", "/aow4db/Icons/UpgradeIcons/" + jsonStructureUpgrades[i].id + ".png");
                smallIcon.setAttribute("width", "20px");
                spell.appendChild(smallIcon);
                spell.appendChild(text);
                upradesoverviewHolder.append(spell);
                var iDiv = structure_card_template.content.cloneNode(true);

                document.getElementById("hiddentooltips").appendChild(iDiv);

                var span = showStructure(list[index].upgrade_slug, false);
                var newSpan = document.createElement("span");
                if (list[index + 1] != null) {
                    newSpan.innerHTML = "<p>From: " + list[index + 1].name + "<br></p>";
                    span.prepend(newSpan);
                }
                addTooltipListeners(spell, span);
            }
        }
    }
}

function ShowHeroSkillsOverview(list) {
    var upradesoverviewHolder = document.getElementById("overviewHeroSkillsHolder");
    // clear the div

    upradesoverviewHolder.innerHTML = "";
    if (list.length > 0) {
        upradesoverviewHolder.innerHTML = "Hero Skills:<br>";
    }

    for (let index = 0; index < list.length; index += 2) {
        for (let i = 0; i < jsonHeroSkills.length; i++) {
            if (jsonHeroSkills[i].id === list[index].slug) {
                var spell = document.createElement("button");
                var Color = GetColors(list[index + 1].affinities);
                applyTextColor(spell, Color);
                spell.className = "overview_list_entry";
                var text = document.createElement("div");
                text.innerHTML = jsonHeroSkills[i].name;
                var smallIcon = document.createElement("img");
                smallIcon.setAttribute("src", "/aow4db/Icons/Abilities/" + jsonHeroSkills[i].icon + ".png");
                smallIcon.setAttribute("width", "20px");
                spell.appendChild(smallIcon);
                spell.appendChild(text);
                upradesoverviewHolder.append(spell);

                var heroSkillIconAndDesc = GetHeroSkillDescription(list[index].slug);

                if (heroSkillIconAndDesc != undefined) {
                    var spa2;
                    // its a ability
                    if (heroSkillIconAndDesc[0] != "") {
                        spa2 = GetAbilityInfo(heroSkillIconAndDesc[0]);
                    } else {
                        // its a passive
                        spa2 = CreatePassiveSlotToolTip(
                            heroSkillIconAndDesc[1].icon,
                            heroSkillIconAndDesc[1].name,
                            heroSkillIconAndDesc[1].description
                        );
                    }
                    var title = document.createElement("SPAN");
                    title.innerHTML = heroSkillIconAndDesc[1].name.toUpperCase();
                    title.setAttribute("style", "color:#deb887 ");

                    title.innerHTML +=
                        "<br>" +
                        heroSkillIconAndDesc[1].category_name +
                        " - " +
                        heroSkillIconAndDesc[1].level_name +
                        "<br><br>";

                    spa2.prepend(title);
                    //div.appendChild(spa2);

                    var newSpan = document.createElement("span");
                    if (list[index + 1] != null) {
                        newSpan.innerHTML = "<p>From: " + list[index + 1].name + "<br></p>";
                        spa2.prepend(newSpan);
                    }

                    addTooltipListeners(spell, spa2);
                }
                break;
            }
        }
    }
}

function ShowPassivesOverview(list) {
    var upradesoverviewHolder = document.getElementById("overviewPassivesHolder");
    // clear the div

    upradesoverviewHolder.innerHTML = "";
    if (list.length > 0) {
        upradesoverviewHolder.innerHTML = "Passives:<br>";
    }

    for (let index = 0; index < list.length; index += 2) {
        var spell = document.createElement("button");
        var Color = GetColors(list[index + 1].affinities);
        applyTextColor(spell, Color);
        spell.className = "overview_list_entry";
        var text = document.createElement("div");
        text.innerHTML = list[index].name;
        // var smallIcon = document.createElement("img");
        // smallIcon.setAttribute("src", "/aow4db/Icons/Abilities/" + jsonHeroSkills[index].icon + ".png");
        // smallIcon.setAttribute("width", "20px");
        //    spell.appendChild(smallIcon);
        spell.appendChild(text);
        upradesoverviewHolder.append(spell);
        var spa = document.createElement("SPAN");
        spa.innerHTML = list[index].type + "<br>";
        spa.innerHTML += list[index].description;

        var newSpan = document.createElement("span");
        if (list[index + 1] != null) {
            newSpan.innerHTML = "<p>From: " + list[index + 1].name + "<br></p>";
            spa.prepend(newSpan);
        }
        addTooltipListeners(spell, spa);
    }
}

function ShowSPIOverview(list) {
    var upradesoverviewHolder = document.getElementById("overviewSPIHolder");
    // clear the div
    upradesoverviewHolder.innerHTML = "";
    if (list.length > 0) {
        upradesoverviewHolder.innerHTML = "Special Province Impr.:<br>";
    }

    for (let index = 0; index < list.length; index += 2) {
        for (let i = 0; i < jsonStructureUpgrades.length; i++) {
            if (jsonStructureUpgrades[i].id == list[index]) {
                var spell = document.createElement("button");

                var Color = GetColors(list[index + 1].affinities);
                applyTextColor(spell, Color);
                spell.className = "overview_list_entry";
                var text = document.createElement("div");
                text.innerHTML = jsonStructureUpgrades[i].name;
                var smallIcon = document.createElement("img");
                smallIcon.setAttribute("src", "/aow4db/Icons/UpgradeIcons/" + jsonStructureUpgrades[i].id + ".png");
                smallIcon.setAttribute("width", "20px");
                spell.appendChild(smallIcon);
                spell.appendChild(text);
                upradesoverviewHolder.append(spell);

                var name = GetStructureName(list[index]);

                var spa = document.createElement("SPAN");
                spa.innerHTML =
                    '<span style="color: #deb887 ;text-transform: uppercase">' +
                    name +
                    "</span>" +
                    GetStructureDescription(list[index]);

                //  div.appendChild(spa);

                var newSpan = document.createElement("span");
                if (list[index + 1] != null) {
                    newSpan.innerHTML = "<p>From: " + list[index + 1].name + "<br></p>";
                    spa.prepend(newSpan);
                }
                addTooltipListeners(spell, spa);
            }
        }
    }
}

function ShowSiegeProjectsOverview(list) {
    var upradesoverviewHolder = document.getElementById("overviewSiegeHolder");
    // clear the div
    upradesoverviewHolder.innerHTML = "";
    if (list.length > 0) {
        upradesoverviewHolder.innerHTML = "Siege Projects:<br>";
    }

    for (let index = 0; index < list.length; index += 2) {
        var slug = "";
        for (let i = 0; i < jsonSiegeProjects.length; i++) {
            if ("siege_project_slug" in list[index]) {
                slug = list[index].siege_project_slug;
            } else {
                slug = list[index].name.replaceAll(" ", "_").toLowerCase();
            }

            if (jsonSiegeProjects[i].id == slug) {
                var spell = document.createElement("button");

                var Color = GetColors(list[index + 1].affinities);
                applyTextColor(spell, Color);
                spell.className = "overview_list_entry";
                var text = document.createElement("div");
                text.innerHTML = jsonSiegeProjects[i].name;
                var smallIcon = document.createElement("img");
                smallIcon.setAttribute("src", "/aow4db/Icons/SiegeIcons/" + jsonSiegeProjects[i].id + ".png");
                smallIcon.setAttribute("width", "20px");
                spell.appendChild(smallIcon);
                spell.appendChild(text);
                upradesoverviewHolder.append(spell);

                var name = GetSiegeProjectName(slug);

                var spa = document.createElement("SPAN");
                spa.innerHTML =
                    '<span style="color: #deb887 ;text-transform: uppercase">' +
                    name +
                    "<br>" +
                    "</span>" +
                    jsonSiegeProjects[i].description;

                //  div.appendChild(spa);

                var newSpan = document.createElement("span");
                if (list[index + 1] != null) {
                    newSpan.innerHTML = "<p>From: " + list[index + 1].name + "<br></p>";
                    spa.prepend(newSpan);
                }

                addTooltipListeners(spell, spa);
            }
        }
    }
}

function GetAllSignatureSkills() {
    var listOfNextSignatures = [];

    var listOfFirstChoice = ["mindbreaker", "fleshweaver", "madcaster"];
    var listOfSecondChoiceMindbreaker = ["enthraller", "mind_devourer"];
    var listOfSecondChoiceFleshweaver = ["puppeteer", "fleshsculptor"];

    var listOfSecondChoiceMadcaster = ["cosmic_caster", "havoc_caster"];

    for (i = 0; i < jsonHeroSkills.length; i++) {
        // all signature skills
        if (jsonHeroSkills[i].type === "signature") {
            switch (currentOrigin.id) {
                case "eldritch_sovereign":
                    // starting type
                    if (currentSignatureSkills.length == 0) {
                        if ("DLC" in jsonHeroSkills[i]) {
                            if (
                                jsonHeroSkills[i].DLC.indexOf("ELDRITCHREALMS") != -1 &&
                                listOfFirstChoice.includes(jsonHeroSkills[i].id)
                            ) {
                                if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                    listOfNextSignatures.push(jsonHeroSkills[i]);
                                }
                            }
                        }
                    }
                    // forgotten tome
                    if (currentSignatureSkills.length == 1) {
                        if ("DLC" in jsonHeroSkills[i]) {
                            if (
                                jsonHeroSkills[i].DLC.indexOf("ELDRITCHREALMS") != -1 &&
                                jsonHeroSkills[i].name.indexOf("Forgotten Tome") != -1
                            ) {
                                if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                    listOfNextSignatures.push(jsonHeroSkills[i]);
                                }
                            }
                        }
                    }
                    // major type
                    if (currentSignatureSkills.length == 2) {
                        if ("DLC" in jsonHeroSkills[i]) {
                            if (jsonHeroSkills[i].DLC.indexOf("ELDRITCHREALMS") != -1) {
                                if (currentSignatureSkills[0].id == "fleshweaver") {
                                    if (listOfSecondChoiceFleshweaver.includes(jsonHeroSkills[i].id)) {
                                        if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                            listOfNextSignatures.push(jsonHeroSkills[i]);
                                        }
                                    }
                                }
                                if (currentSignatureSkills[0].id == "madcaster") {
                                    if (listOfSecondChoiceMadcaster.includes(jsonHeroSkills[i].id)) {
                                        if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                            listOfNextSignatures.push(jsonHeroSkills[i]);
                                        }
                                    }
                                }
                                if (currentSignatureSkills[0].id == "mindbreaker") {
                                    if (listOfSecondChoiceMindbreaker.includes(jsonHeroSkills[i].id)) {
                                        if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                            listOfNextSignatures.push(jsonHeroSkills[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // forgotten tome
                    if (currentSignatureSkills.length == 3) {
                        if ("DLC" in jsonHeroSkills[i]) {
                            if (
                                jsonHeroSkills[i].DLC.indexOf("ELDRITCHREALMS") != -1 &&
                                jsonHeroSkills[i].name.indexOf("Forgotten Tome") != -1
                            ) {
                                if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                    listOfNextSignatures.push(jsonHeroSkills[i]);
                                }
                            }
                        }
                    }
                    break;
                case "dragon_lord":
                    // choose normal skill first
                    if (currentSignatureSkills.length == 1) {
                        if (!("DLC" in jsonHeroSkills[i])) {
                            if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                listOfNextSignatures.push(jsonHeroSkills[i]);
                            }
                        }
                    }
                    // choose aspect next
                    if (currentSignatureSkills.length == 0) {
                        if ("DLC" in jsonHeroSkills[i]) {
                            if (
                                jsonHeroSkills[i].DLC.indexOf("DRAGONLORDS") != -1 &&
                                jsonHeroSkills[i].name.indexOf("Aspect") != -1
                            ) {
                                if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                    addUniqueEntry(currentSignatureSkills, listOfNextSignatures, jsonHeroSkills[i]);
                                    //listOfNextSignatures.push(jsonHeroSkills[i]);
                                }
                            }
                        }
                    }
                    // choose normal skill
                    if (currentSignatureSkills.length == 3) {
                        if (!("DLC" in jsonHeroSkills[i])) {
                            if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                listOfNextSignatures.push(jsonHeroSkills[i]);
                            }
                        }
                    }
                    // choose transformation
                    if (currentSignatureSkills.length == 2) {
                        if ("DLC" in jsonHeroSkills[i]) {
                            if (
                                jsonHeroSkills[i].DLC.indexOf("DRAGONLORDS") != -1 &&
                                jsonHeroSkills[i].name.indexOf("Transformation") != -1
                            ) {
                                if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                                    addUniqueEntry(currentSignatureSkills, listOfNextSignatures, jsonHeroSkills[i]);
                                    //listOfNextSignatures.push(jsonHeroSkills[i]);
                                }
                            }
                        }
                    }
                    break;
                case "wizard_king":
                    if (!("DLC" in jsonHeroSkills[i])) {
                        if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                            listOfNextSignatures.push(jsonHeroSkills[i]);
                        }
                    }
                    break;
                case "champion":
                    if (!("DLC" in jsonHeroSkills[i])) {
                        if (!isInArray(currentSignatureSkills, jsonHeroSkills[i])) {
                            listOfNextSignatures.push(jsonHeroSkills[i]);
                        }
                    }

                    break;
            }
        }
    }
    return listOfNextSignatures;
}

function checkIfT5(jsonEntries) {
    // Check if an entry with t5 already exists
    const entryExists = jsonEntries.some((entry) => entry.tier === 5);

    // If not, add the new entry
    return entryExists;
}

function addUniqueEntry(jsonEntries, jsonEntriesToAdd, newEntry) {
    // Check if an entry with the same id already exists
    const entryExists = jsonEntries.some((entry) => entry.id === newEntry.id);
    const entryExists2 = jsonEntriesToAdd.some((entry) => entry.id === newEntry.id);

    // If not, add the new entry
    if (!entryExists && !entryExists2) {
        jsonEntriesToAdd.push(newEntry);
    }
}
function GetNextSetOfTomes() {
    var listOfNextTomes = [];

    for (i = 0; i < jsonTomes.length; i++) {
        // all tier 1
        if (jsonTomes[i].tier === 1) {
            if (!isInArray(currentTomeList, jsonTomes[i])) {
                listOfNextTomes.push(jsonTomes[i]);
            }
        }
    }

    if (currentTomeList.length > 1) {
        // allow tier 2 tomes
        for (i = 0; i < jsonTomes.length; i++) {
            if (jsonTomes[i].tier === 2) {
                if (!isInArray(currentTomeList, jsonTomes[i])) {
                    listOfNextTomes.push(jsonTomes[i]);
                }
            }
        }
    }
    if (currentTomeList.length > 3) {
        // allow tier 3 tomes
        for (i = 0; i < jsonTomes.length; i++) {
            if (jsonTomes[i].tier === 3) {
                // 3 affinity
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes[i].affinities, 2)) {
                    if (!isInArray(currentTomeList, jsonTomes[i])) {
                        listOfNextTomes.push(jsonTomes[i]);
                    }
                }
            }
        }
    }
    if (currentTomeList.length > 5) {
        // allow tier 4 tomes
        for (i = 0; i < jsonTomes.length; i++) {
            if (jsonTomes[i].tier === 4) {
                // 6 affinity
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes[i].affinities, 5)) {
                    if (!isInArray(currentTomeList, jsonTomes[i])) {
                        listOfNextTomes.push(jsonTomes[i]);
                    }
                }
            }
        }
    }
    if (currentTomeList.length > 7) {
        // allow tier 5 tomes
        for (i = 0; i < jsonTomes.length; i++) {
            if (jsonTomes[i].tier === 5) {
                // 8 affinity
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes[i].affinities, 7)) {
                    // check if we dont already have a t5, we can only have 1
                    if (!checkIfT5(currentTomeList)) {
                        if (!isInArray(currentTomeList, jsonTomes[i])) {
                            listOfNextTomes.push(jsonTomes[i]);
                        }
                    }
                }
            }
        }
    }

    return listOfNextTomes;
}

function GetAffinityMatches(affinityTotal, substringToCount, number) {
    // if not mixed affinity
    var moreThanNumber = false;
    if (substringToCount.indexOf("2") != -1) {
        var empireType = substringToCount.split(" ")[1];

        affinityTotal = affinityTotal.replaceAll("  ", " ");
        //   console.log(empireType + " input :" + inputString);

        // Use a regular expression to find the tag and extract the number
        const match = affinityTotal.match(new RegExp(`${empireType}\\s*(\\d+)`));

        // Extract the number from the match result
        const numberMatch = match ? parseInt(match[1]) : null;
        // Use a regular expression to find all occurrences of the substring

        // Check if the number of occurrences is greater than 4
        moreThanNumber = numberMatch > number;
    } else {
        // mixed affinity
        // split to both type
        subSubtStringToCount = substringToCount.split(", ");

        numberMatches = [];

        for (let index = 0; index < subSubtStringToCount.length; index++) {
            var empireType = subSubtStringToCount[index].split(" ")[1];

            affinityTotal = affinityTotal.replaceAll("  ", " ");

            // Use a regular expression to find the tag and extract the number
            const match = affinityTotal.match(new RegExp(`${empireType}\\s*(\\d+)`));
            numberMatches.push(match ? parseInt(match[1]) : 0);
            // console.log(match);
        }

        var finalNumber = 0;
        for (let index = 0; index < numberMatches.length; index++) {
            finalNumber += numberMatches[index];
        }

        moreThanNumber = finalNumber > number;
    }

    return moreThanNumber;
}

function GetAllOrigins() {
    var listOfAllOrigins = [];

    for (i = 0; i < jsonFactionCreation.length; i++) {
        if (jsonFactionCreation[i].type === "Ruler Origin") {
            listOfAllOrigins.push(jsonFactionCreation[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}

function GetAllCultures() {
    var listOfAllOrigins = [];

    for (i = 0; i < jsonFactionCreation.length; i++) {
        if (jsonFactionCreation[i].type === "Culture") {
            listOfAllOrigins.push(jsonFactionCreation[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}

function GetAllForms() {
    var listOfAllOrigins = [];

    for (i = 0; i < jsonFactionCreation.length; i++) {
        if (jsonFactionCreation[i].type === "Skin") {
            listOfAllOrigins.push(jsonFactionCreation[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}

function GetAllFormTraitsList() {
    var listOfAllOrigins = [];

    for (i = 0; i < jsonFactionCreation2.length; i++) {
        if (jsonFactionCreation2[i].type === "form") {
            listOfAllOrigins.push(jsonFactionCreation2[i]);
        }
    }
    //console.log(listOfAllOrigins);
    listOfAllOrigins.sort((a, b) => a.point_cost - b.point_cost);

    return listOfAllOrigins;
}

function GetAllSocietyTraits() {
    var listOfAllOrigins = [];

    for (i = 0; i < jsonFactionCreation2.length; i++) {
        if (jsonFactionCreation2[i].type === "society") {
            if (jsonFactionCreation2[i].enabled === true) {
                if (jsonFactionCreation2[i].id != "guardians_of_nature__goodact__") {
                    listOfAllOrigins.push(jsonFactionCreation2[i]);
                }
            }
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}

function GetAllAscensions() {
    var listOfAllOrigins = [];

    for (i = 0; i < jsonHeroSkills.length; i++) {
        if (jsonHeroSkills[i].name.indexOf("Ascension") != -1) {
            listOfAllOrigins.push(jsonHeroSkills[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.name - b.name);
    return listOfAllOrigins;
}

function GetAllLoadouts() {
    var listOfAllOrigins = [];

    for (i = 0; i < jsonFactionCreation.length; i++) {
        if (jsonFactionCreation[i].type === "Loadout") {
            listOfAllOrigins.push(jsonFactionCreation[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}

function GetRandomEntry(type) {
    var randomOrigin;
    switch (type) {
        case "Tome":
            var list = GetAllStartingTomes();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;

        case "Origin":
            var list = GetAllOrigins();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;

        case "Form":
            var list = GetAllForms();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;
        case "FormTrait":
            var list = GetAllFormTraitsList();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;

        case "Culture":
            var list = GetAllCultures();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            while (incompatibleCheck("Culture", randomOrigin)) {
                randomOrigin = list[Math.floor(Math.random() * list.length)];
            }
            break;
        case "Society1":
            var list = GetAllSocietyTraits();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            while (incompatibleCheck("Society1", randomOrigin)) {
                randomOrigin = list[Math.floor(Math.random() * list.length)];
            }
            break;
        case "Society2":
            var list = GetAllSocietyTraits();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            while (incompatibleCheck("Society2", randomOrigin)) {
                randomOrigin = list[Math.floor(Math.random() * list.length)];
            }
            break;
        case "Loadout":
            var list = GetAllLoadouts();

            randomOrigin = list[Math.floor(Math.random() * list.length)];
            while (incompatibleCheck("Loadout", randomOrigin) === true) {
                randomOrigin = list[Math.floor(Math.random() * list.length)];
            }
            break;
        // case "Signature":
        //     currentSignatureSkills = [];
        //     var list = GetAllSignatureSkills();
        //     randomOrigin = list[Math.floor(Math.random() * list.length)];
        //     currentSignatureSkills[0] = randomOrigin;
        //     break;
    }
    // console.log(randomOrigin);
    return randomOrigin;
}

function incompatibleCheck(type, origin) {
    var incompatibleWithSetup = false;
    if ("incompatible" in origin) {
        if (type === "Culture") {
            var i = "";
            var j = "";
            for (i in origin.incompatible) {
                if (
                    origin.incompatible[i].name === currentSociety1.name ||
                    origin.incompatible[i].name === currentSociety2.name
                ) {
                    incompatibleWithSetup = true;
                }
                for (j in currentFormTraitList) {
                    if (currentFormTraitList[j].name.indexOf(origin.incompatible[i].name) != -1)
                        incompatibleWithSetup = true;
                }
            }
        }
    }
    if ("incompatible_society_traits" in origin) {
        if (type === "Society1") {
            var i = "";
            for (i in origin.incompatible_society_traits) {
                if (currentSociety2 != "") {
                    if (
                        origin.incompatible_society_traits[i].name
                            .toLowerCase()
                            .indexOf(currentSociety2.name.toLowerCase()) != -1
                    ) {
                        incompatibleWithSetup = true;
                    }
                }
            }
        }
        if (type === "Society2") {
            var i = "";
            for (i in origin.incompatible) {
                if (currentSociety1 != "") {
                    if (
                        origin.incompatible_society_traits[i].name
                            .toLowerCase()
                            .indexOf(currentSociety1.name.toLowerCase()) != -1
                    ) {
                        incompatibleWithSetup = true;
                    }
                }
            }
        }
    }
    if (currentSociety1.name === origin.name) {
        incompatibleWithSetup = true;
    }
    if (currentSociety2.name === origin.name) {
        incompatibleWithSetup = true;
    }

    if (type === "Loadout") {
        var splitOrigins = origin.requirement.split(",");

        if (splitOrigins.length > 1) {
            var multiSetup = splitOrigins[1].split(":");
            if (!multiSetup.includes(currentCulture.name)) {
                incompatibleWithSetup = true;
            }

            // check if its primal culture
            if (currentCulture.name.indexOf("Primal") != -1) {
                if (multiSetup.includes("Primal")) {
                    incompatibleWithSetup = false;
                }
            }

            if (splitOrigins[0].indexOf(currentOrigin.name) === -1) {
                // console.log(splitOrigins);
                // console.log(currentCulture.name + " " + splitOrigins[1]);
                incompatibleWithSetup = true;
            }
        } else {
            // console.log(currentOrigin.name + " " + splitOrigins[0]);

            if (splitOrigins[0].indexOf(currentOrigin.name) === -1) {
                incompatibleWithSetup = true;
            }

            if (currentCulture.name.indexOf("Primal") != -1) {
                if (splitOrigins[0].includes("Primal")) {
                    incompatibleWithSetup = false;
                }
            }
        }
    }

    return incompatibleWithSetup;
}

function toggleSelection(origin, button, type, event) {
    //   console.log("test"+ origin);

    const selectedButtons = document.querySelectorAll("#options-container list-button");
    for (let index = 0; index < selectedButtons.length; index++) {
        selectedButtons[index].classList.remove("selected");
    }

    // Uncomment the line below if you want to limit the selection to a specific number (e.g., 2)
    // updateSelectionLimit(origin);
    var exclusionList = [];
    exclusionList = updateSelectedOptions(origin);

    if (isInArray(currentFormTraitList, origin)) {
        button.classList.remove("selected");
        button.classList.toggle("selected");
    } else {
        button.classList.remove("selected");
    }

    SetupButtons(event, type, exclusionList);
}

function updateSelectedOptions(origin) {
    const selectedOptionsContainer = document.getElementById("selected-options-container");
    const selectedButtons = document.querySelectorAll("#options-container button");

    // if already in list, remove it

    if (origin != undefined) {
        toggleArrayEntry(currentFormTraitList, origin);

        //     if (getPoints() > 5) {
        //         currentFormTraitList.pop();
        //     }
        // } else {
        if (getPoints() > 5) {
            currentFormTraitList.pop();
        }
        // }
    }

    // Clear the selected options container
    selectedOptionsContainer.innerHTML = "";

    for (let index = 0; index < currentFormTraitList.length; index++) {
        const selectedOption = document.createElement("button");
        selectedOption.className = "button-inset";
        SetButtonInfo(selectedOption, currentFormTraitList[index], "FormTrait");
        //selectedOption.textContent = currentFormTraitList[index].name;
        selectedOptionsContainer.appendChild(selectedOption);
    }
}

// // Uncomment the function below if you want to limit the selection to a specific number (e.g., 2)
// function updateSelectionLimit(origin) {

//     const maxPoints = 5;
//     if (getPoints() > maxPoints) {

//         currentFormTraitList.pop();
//     }

// }

function checkCompatibilityTraits(entry) {
    var canBeAdded = true;
    if (entry.group_name === "ADAPTATION") {
        var hasAdaptionGroup = currentFormTraitList.some((item) => item.group_name === "ADAPTATION");
        //console.log(hasAdaptionGroup);
        // already has adaption or already has primal culture
        if (hasAdaptionGroup || currentCulture.name.indexOf("Primal") != -1) {
            canBeAdded = false;
        }
    } else if (entry.group_name === "MOUNT") {
        var hasAdaptionGroup = currentFormTraitList.some((item) => item.group_name === "MOUNT");
        //console.log(hasAdaptionGroup);
        // already has adaption or already has primal culture
        if (hasAdaptionGroup) {
            canBeAdded = false;
        }
    } else if (entry.group_name === "TACTICS") {
        var hasAdaptionGroup = currentFormTraitList.some((item) => item.group_name === "TACTICS");
        //console.log(hasAdaptionGroup);
        // already has adaption or already has primal culture
        if (hasAdaptionGroup) {
            canBeAdded = false;
        }
    }
    return canBeAdded;
}

function toggleArrayEntry(array, entry) {
    const index = array.indexOf(entry);

    if (index !== -1) {
        // Entry exists, remove it
        array.splice(index, 1);
    } else {
        // Entry doesn't exist, add it
        if (checkCompatibilityTraits(entry) == true) {
            array.push(entry);
        }
    }
}

function LookUpTableData(lookUpId) {
    for (let index = 0; index < jsonBuilderLookUp.length; index++) {
        if (jsonBuilderLookUp[index].id == lookUpId) {
            return index;
        }
    }
}

function GetQuickLink() {
    var code = "";
    // 0

    // if no formtraits

    if (currentFormTraitList.length == 0) {
        code += "F";
    }
    for (let index = 0; index < currentFormTraitList.length; index++) {
        var number = decimalToHex(LookUpTableData(currentFormTraitList[index].id));
        if (index == 0) {
            code += number;
        } else {
            code += ":" + number;
        }
    }
    // 1
    var number = decimalToHex(LookUpTableData(currentSociety1.id));
    code += "," + number;
    //2
    var number = decimalToHex(LookUpTableData(currentSociety2.id));
    code += "," + number;
    //3
    var number = decimalToHex(LookUpTableData(currentForm.id));
    code += "," + number;
    //4
    var number = decimalToHex(LookUpTableData(currentCulture.id));
    code += "," + number;
    //5
    var number = decimalToHex(LookUpTableData(currentOrigin.id));
    code += "," + number;
    //6
    var number = decimalToHex(LookUpTableData(currentLoadout.id));
    code += "," + number;
    //7
    for (let index = 0; index < currentTomeList.length; index++) {
        var number = decimalToHex(LookUpTableData(currentTomeList[index].id));
        //console.log(number);
        if (index == 0) {
            code += "," + number;
        } else {
            code += ":" + number;
        }
    }
    // 8
    var extraAffinityCode =
        extraAstral.toString() +
        extraChaos.toString() +
        extraMaterium.toString() +
        extraNature.toString() +
        extraOrder.toString() +
        extraShadow.toString();

    code += "," + extraAffinityCode;

    // 9 hero skills
    if (currentSignatureSkills.length == 0) {
        code += "," + "s";
    }
    for (let index2 = 0; index2 < currentSignatureSkills.length; index2++) {
        var number2 = decimalToHex(LookUpTableData(currentSignatureSkills[index2].id));
        //console.log(number);
        if (index2 == 0) {
            code += "," + number2;
        } else {
            code += ":" + number2;
        }
    }
    // 10 ascension
    if (currentAscension == "") {
        code += "," + "a";
    } else {
        var number = decimalToHex(LookUpTableData(currentAscension.id));
        code += "," + number;
    }
    // 11 highlights

    if (currentHighlights == "") {
        code += "," + "h";
    } else {
        code += "," + currentHighlights;
    }

    // add name and race name?
    var name = document.getElementById("fname1").value;
    var raceName = document.getElementById("fname").value;
    if (name == "Ruler Name") {
        code += "," + "n";
    } else {
        var modName = name.replace(" ", "%20");
        code += "," + modName;
    }
    if (raceName == "Race Name") {
        code += ":" + "r";
    } else {
        var modRaceName = raceName.replace(" ", "%20");
        code += ":" + modRaceName;
    }

    // console.log("hex code: " + code);

    var linkField = document.getElementById("shareLink");

    var currenturl = window.location.href.split("?")[0];

    // window.history.replaceState({}, 'foo', currenturl + "?u=" + code);
    linkField.value = currenturl + "?u=" + code;
    // var splitCodes = code.split(":");
    // for (let index = 0; index < splitCodes.length; index++) {
    //     console.log("number code: " + hexToDecimal(splitCodes[index]));
    // }

    reversLookUp(code);
}

function reversLookUp(code) {
    var splitcode = code.split(",");
    // console.log("Splitcode" + splitcode);
    var newList = [];

    // 0 = currentformtraits
    var list = splitcode[0];

    // no formtraits selected
    if (list == "F") {
        currentFormTraitList = [];
    } else {
        var currentFormTraitsLoad = list.split(":");
        for (let i = 0; i < currentFormTraitsLoad.length; i++) {
            var numbernew = jsonBuilderLookUp[hexToDecimal(currentFormTraitsLoad[i])].id;

            for (let index = 0; index < jsonFactionCreation2.length; index++) {
                if (jsonFactionCreation2[index].id === numbernew) {
                    newList.push(jsonFactionCreation2[index]);
                }
            }
        }
        currentFormTraitList = newList;
    }

    // 1 = currentsociety1
    var lookUp = splitcode[1];
    var numbernew = jsonBuilderLookUp[hexToDecimal(lookUp)].id;

    for (let index = 0; index < jsonFactionCreation2.length; index++) {
        if (jsonFactionCreation2[index].id === numbernew) {
            var newBit = jsonFactionCreation2[index];
        }
    }
    currentSociety1 = newBit;
    var originButton = document.getElementById("originButtonSociety1");
    SetButtonInfo(originButton, currentSociety1, "Society1");

    // 2 = currentsociety2
    var lookUp2 = splitcode[2];

    var numbernew = jsonBuilderLookUp[hexToDecimal(lookUp2)].id;

    for (let index = 0; index < jsonFactionCreation2.length; index++) {
        if (jsonFactionCreation2[index].id === numbernew) {
            var newBit = jsonFactionCreation2[index];
        }
    }
    currentSociety2 = newBit;
    var originButton = document.getElementById("originButtonSociety2");
    SetButtonInfo(originButton, currentSociety2, "Society2");

    // 3 = form
    var lookUp = splitcode[3];

    var numbernew = jsonBuilderLookUp[hexToDecimal(lookUp)].id;

    for (let index = 0; index < jsonFactionCreation.length; index++) {
        if (jsonFactionCreation[index].id === numbernew) {
            var newBit = jsonFactionCreation[index];
        }
    }
    currentForm = newBit;
    var originButton = document.getElementById("originButtonForm");
    SetButtonInfo(originButton, currentForm, "Form");

    // 4 = culture
    var lookUp = splitcode[4];

    var numbernew = jsonBuilderLookUp[hexToDecimal(lookUp)].id;

    for (let index = 0; index < jsonFactionCreation.length; index++) {
        if (jsonFactionCreation[index].id === numbernew) {
            var newBit = jsonFactionCreation[index];
        }
    }
    currentCulture = newBit;
    var originButton = document.getElementById("originButtonCulture");
    SetButtonInfo(originButton, currentCulture, "Culture");

    // 5 = origin
    var lookUp = splitcode[5];

    var numbernew = jsonBuilderLookUp[hexToDecimal(lookUp)].id;

    for (let index = 0; index < jsonFactionCreation.length; index++) {
        if (jsonFactionCreation[index].id === numbernew) {
            var newBit = jsonFactionCreation[index];
        }
    }
    currentOrigin = newBit;
    var originButton = document.getElementById("originButtonOrigin");
    SetButtonInfo(originButton, currentOrigin, "Origin");

    // 6 = loadout
    var lookUp = splitcode[6];

    var numbernew = jsonBuilderLookUp[hexToDecimal(lookUp)].id;

    for (let index = 0; index < jsonFactionCreation.length; index++) {
        if (jsonFactionCreation[index].id === numbernew) {
            var newBit = jsonFactionCreation[index];
        }
    }
    currentLoadout = newBit;
    var originButton = document.getElementById("originButtonLoadout");
    SetButtonInfo(originButton, currentLoadout, "Loadout");

    var newList = [];
    // 7 = tomes
    var list = splitcode[7];
    var currentTomeListLoad = list.split(":");
    for (let i = 0; i < currentTomeListLoad.length; i++) {
        var numbernew = jsonBuilderLookUp[hexToDecimal(currentTomeListLoad[i])].id;

        for (let index = 0; index < jsonTomes.length; index++) {
            if (jsonTomes[index].id === numbernew) {
                newList.push(jsonTomes[index]);
            }
        }
    }
    currentTome = newList[0];

    var originButton = document.getElementById("originButtonTome");
    SetButtonInfo(originButton, currentTome, "Tome");
    currentTomeList = newList;

    // 8 = extraaffinity
    var list = splitcode[8];

    var currentExtraAffinityLoad = list;

    extraAstral = currentExtraAffinityLoad[0];
    extraChaos = currentExtraAffinityLoad[1];
    extraMaterium = currentExtraAffinityLoad[2];
    extraNature = currentExtraAffinityLoad[3];
    extraOrder = currentExtraAffinityLoad[4];
    extraShadow = currentExtraAffinityLoad[5];

    // 9 = signatures if available, else placeholder "s" is added
    var list = splitcode[9];
    if (list != "s" && list != undefined) {
        var currentSignatureLoad = list.split(":");
        var newList2 = [];
        for (let i = 0; i < currentSignatureLoad.length; i++) {
            var numbernew = jsonBuilderLookUp[hexToDecimal(currentSignatureLoad[i])].id;

            for (let index = 0; index < jsonHeroSkills.length; index++) {
                if (jsonHeroSkills[index].id === numbernew) {
                    newList2.push(jsonHeroSkills[index]);
                    break;
                }
            }
        }
        // currentTome = newList[0];
        var originButton = document.getElementById("originButtonSignature");
        currentSignatureSkills = newList2;
    }

    // 10 = assension if available, else placeholder "a" is added
    var ascen = splitcode[10];
    if (ascen != "a" && ascen != undefined) {
        var numbernew = jsonBuilderLookUp[hexToDecimal(ascen)].id;

        for (let index = 0; index < jsonHeroSkills.length; index++) {
            if (jsonHeroSkills[index].id === numbernew) {
                var newas = jsonHeroSkills[index];
            }
        }
        currentAscension = newas;
        var originButton = document.getElementById("originButtonAscension");
        SetButtonInfo(originButton, currentAscension, "Ascension");
    }

    // 11 highlight if available, placeholder is "h"
    var highlights = splitcode[11];

    if (highlights != "h" && highlights != undefined) {
        currentHighlights = highlights;
    }
    //
    var names = splitcode[12];
    if (names != undefined) {
        var splitNames = names.split(":");
        if (splitNames[0] != "n") {
            document.getElementById("fname1").value = splitNames[0];
        }
        if (splitNames[1] != "r") {
            document.getElementById("fname").value = splitNames[1];
        }
    }
}

// Function to convert a number to hexadecimal
function decimalToHex(decimal) {
    return decimal.toString(16);
}

// Function to convert a hexadecimal string to a number
function hexToDecimal(hex) {
    return parseInt(hex, 16);
}

function RebuildFromParam(code) {
    reversLookUp(code);
}
