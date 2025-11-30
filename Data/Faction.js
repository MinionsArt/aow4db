searchParams = new URLSearchParams(window.location.search);
searchKeyword = searchParams.get("u");
var ListOfSubcultureHolders = ["Architect", "Primal", "Mystic", "Oathsworn", "Feudal", "Dark"];

var ListOfSubsocietyHolders = ["Vision of Promise", "Vision of Ruin", "Vision of Destiny"];

var currentOrigin = "";
var currentTome = "";

var currentForm = "";
var currentFormTraitList = [];
var currentCulture = "";

// society
var currentSociety1 = "";
var currentSociety2 = "";
var currentSubSociety1 = "";
var currentSubSociety2 = "";

var currentSubType = "";
var currentClass = "";
var currentAscension = "";
var currentAmbition = "";

// sub culture
var currentSubCulture = "";

var currentAffinityTotal = "";

var currentHighlights = "";

var extraOrder, extraChaos, extraNature, extraMaterium, extraShadow, extraAstral;

var buildTags = ["Roleplay", "Theme", "PVP", "Casual"];

var listOfPantheonTraits = [
    "talented_collectors",
    "subterranean_society",
    "mana_addicts",
    "bannerlords",
    "chosen_destroyers",
    "cult_of_personality",
    "vigilante_knights",
    "druidic_terraformers",
    "merciless_slavers__evilact__",
    "relentless_crusaders__goodact__",
    "silver_tongued",

    "perfectionist_artisans"
];

var currentTomeList = [];
var currentSignatureSkills = [];

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
        //  selectSkillPath();
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
        listofChoice.push("Class");
        listofChoice.push("SubType");
        listofChoice.push("SubCulture");
        listofChoice.push("SubSociety1");
        listofChoice.push("SubSociety2");

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
                case "SubType":
                    if (origin != "") {
                        currentSubType = randomEntry;
                    }

                    break;
                case "Class":
                    currentClass = randomEntry;

                    break;
                case "Signature":
                    currentSig = randomEntry;
                    currentSignatureSkills = [];
                    currentSignatureSkills.push(currentSig);

                    break;

                case "SubCulture":
                    if (origin != "") {
                        currentSubCulture = randomEntry;
                    }
                    break;
                case "SubSociety1":
                    if (origin != "") {
                        currentSubSociety1 = randomEntry;
                    }
                    break;
                case "SubSociety2":
                    if (origin != "") {
                        currentSubSociety2 = randomEntry;
                    }
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
        //ClearSkillPath("t");
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
            if (origin.name != "Dragon Lord" && origin.name != "Giant King" && origin.name != "Elder Vampire") {
                currentSubType = "";
            } else {
                let newBit;
                // load default class
                for (let index = 0; index < jsonFactionCreation.length; index++) {
                    if (origin.name == "Dragon Lord") {
                        if (jsonFactionCreation[index].id === "astral_dragon") {
                            newBit = jsonFactionCreation[index];
                        }
                    } else if (origin.name == "Giant King") {
                        if (jsonFactionCreation[index].id === "rock_giant_king") {
                            newBit = jsonFactionCreation[index];
                        }
                    } else if (origin.name == "Elder Vampire") {
                        if (jsonFactionCreation[index].id === "elder_vampire_pureblood") {
                            newBit = jsonFactionCreation[index];
                        }
                    }
                }
                //
                //  console.log(newBit.name);
                currentSubType = newBit;
            }
            selectOrigin(currentSubType, "SubType");

            if (origin.name == "Eldritch Sovereign" && currentClass.id != "mage" && currentClass.id != "ritualist") {
                for (let index = 0; index < jsonFactionCreation.length; index++) {
                    if (jsonFactionCreation[index].id === "mage") {
                        newBit = jsonFactionCreation[index];
                    }
                }
                currentClass = newBit;
            }
            // change ranger to warrior for dragon lord
            if (origin.name == "Dragon Lord" && currentClass.id == "ranger") {
                for (let index = 0; index < jsonFactionCreation.length; index++) {
                    if (jsonFactionCreation[index].id === "warrior") {
                        newBit = jsonFactionCreation[index];
                    }
                }
                currentClass = newBit;
            }
            if (origin.name == "Giant King" && currentClass.id == "ranger") {
                for (let index = 0; index < jsonFactionCreation.length; index++) {
                    if (jsonFactionCreation[index].id === "warrior") {
                        newBit = jsonFactionCreation[index];
                    }
                }
                currentClass = newBit;
            }
            selectOrigin(currentClass, "Class");
            // ClearSkillPath("o");
            // if (incompatibleCheck("SubType", currentLoadout)) {
            // add message about it being incompatible

            //  var loadoutButton = document.getElementById("originButtonLoadout");
            //  loadoutButton.innerHTML += '<span style="color:red"> Incompatible </span>';
            // }
            break;

        case "FormTrait":
            currentFormTraitList = origin;
            break;
        case "Culture":
            currentCulture = origin;
            if (!ListOfSubcultureHolders.includes(origin.name)) {
                currentSubCulture = "";
            } else {
                let newBit;
                // load default class
                for (let index = 0; index < jsonFactionCreation.length; index++) {
                    if (
                        jsonFactionCreation[index].type == "SubCulture" &&
                        jsonFactionCreation[index].requirement == origin.name
                    ) {
                        newBit = jsonFactionCreation[index];
                        continue;
                    }
                }

                // console.log(newBit.name);
                currentSubCulture = newBit;
            }
            selectOrigin(currentSubCulture, "SubCulture");
            // subculture
            break;
        case "Form":
            currentForm = origin;
            break;
        case "Society1":
            currentSociety1 = origin;

            if (!ListOfSubsocietyHolders.includes(origin.name)) {
                currentSubSociety1 = "";
            } else {
                let newBit;
                // load default class
                for (let index = 0; index < jsonFactionCreation.length; index++) {
                    if (
                        jsonFactionCreation[index].type == "SubSociety" &&
                        jsonFactionCreation[index].requirement == origin.name
                    ) {
                        newBit = jsonFactionCreation[index];
                        continue;
                    }
                }

                console.log(newBit.name);
                currentSubSociety1 = newBit;
            }
            selectOrigin(currentSubSociety1, "SubSociety1");
            break;
        case "Society2":
            currentSociety2 = origin;
            if (!ListOfSubsocietyHolders.includes(origin.name)) {
                currentSubSociety2 = "";
            } else {
                let newBit;
                // load default class
                for (let index = 0; index < jsonFactionCreation.length; index++) {
                    if (
                        jsonFactionCreation[index].type == "SubSociety" &&
                        jsonFactionCreation[index].requirement == origin.name
                    ) {
                        newBit = jsonFactionCreation[index];
                        continue;
                    }
                }

                console.log(newBit.name);
                currentSubSociety2 = newBit;
            }
            selectOrigin(currentSubSociety2, "SubSociety2");
            break;
        case "SubType":
            currentSubType = origin;
            break;
        case "Ascension":
            currentAscension = origin;
            break;
            case "Ambition":
            currentAmbition = origin;
            break;
        case "Class":
            currentClass = origin;
            // only if its the first

            //  ClearSkillPath();
            // selectSkillPath(origin);
            break;
        case "SubCulture":
            currentSubCulture = origin;
            break;

        case "SubSociety1":
            currentSubSociety1 = origin;
            break;
        case "SubSociety2":
            currentSubSociety2 = origin;
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

function ClearAmbition() {
    var ascensionHolder = document.getElementById("originButtonAmbition");
    ascensionHolder.innerHTML = "+";
    currentAmbition = "";
}

/*
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
}*/

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

function SetSkillPathInfoSmall(buttonHolder, origin) {
    const image = document.createElement("img");
    image.setAttribute("width", "60");
    image.setAttribute("height", "60");
    image.style = "position: relative; top: 10px;";

    image.src = "/aow4db/Icons/UnitIcons/" + origin.icon + ".png"; // Set the image source to your image file

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

    addTooltipListeners(image, spa);
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
    let affinityText = document.createElement("div");
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
    if ("DLC" in origin) {
        let DLCTAG = document.createElement("div");
        DLCTAG.style = "    position: absolute;right: 39px;top: 54px;";
        let dlcTag = origin.DLC.replaceAll(" ", "");
        DLCTAG.innerHTML = "<" + dlcTag + "></" + dlcTag + ">";
        newDivButton.appendChild(DLCTAG);
    }

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

function RemoveLastSkill() {
    currentSignatureSkills.pop();

    //currentTomeList.push(currentTome);
    //  selectSkillPath();

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
    if ("DLC" in origin) {
        let DLCTAG = document.createElement("div");
        DLCTAG.style = "    position: absolute;right: 0;top: 4px;";
        let dlcTag = origin.DLC.replaceAll(" ", "");
        DLCTAG.innerHTML = "<" + dlcTag + "></" + dlcTag + ">";
        newDivButton.appendChild(DLCTAG);
    }

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

    image.src = "/aow4db/Icons/UnitIcons/" + origin.icon + ".png"; // Set the image source to your image file

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

    addTooltipListeners(image, spa);
}

function SetupButtons(evt, type) {
    // const rect = evt.target.getBoundingClientRect();
    var selectionsHolder = document.getElementById("selectionsHolder");

    var originWrapper = document.getElementById("originWrapperOptions");
    originWrapper.innerHTML = "";
    originWrapper.setAttribute("style", " grid-template-columns: repeat(2, 2fr);");

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

        case "SubType":
            list = GetAllSubTypes();

            break;
        case "SubCulture":
            list = GetAllSubCultureSetups();

            break;
        case "SubSociety1":
            list = GetAllSubProphecySetups(1);

            break;
        case "SubSociety2":
            list = GetAllSubProphecySetups(2);

            break;
        case "Class":
            list = GetAllClasses();

            break;
        case "Ascension":
            list = GetAllAscensions();

            break;
             case "Ambition":
            list = GetAllAmbitions();

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
        /*  case "Signature":
            list = GetAllSignatureSkills();
            if (currentSignatureSkills.length == 4) {
               
                return;
            }
            break;*/
    }

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

            if (isInArray(currentFormTraitList, origin)) {
                originButtonNew.classList.toggle("selected");
            }

            if (origin.point_cost + getPoints() > 5) {
                originButtonNew.style.color = "grey";
            } else if (checkCompatibilityTraits(origin) == false) {
                originButtonNew.style.color = "red";
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
            // show option but with compatible thingie
            else {
                // dont show everything for loadouts, too many options
                if (type != "Loadout") {
                    // check if its not just already equipped instead

                    originButtonNew.className = "list-button-disabled";

                    // originButtonNew.addEventListener("click", (event) => selectOrigin(origin, type));

                    originWrapper.appendChild(originButtonNew);

                    SetButtonInfo(originButtonNew, origin, type);

                    if (currentSociety1.name === origin.name) {
                        originButtonNew.className = "list-button-currentequipped";
                    } else if (currentSociety2.name === origin.name) {
                        originButtonNew.className = "list-button-currentequipped";
                    } else {
                        //originButtonNew.className = "list-button-incompatible";
                    }
                }
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
    // whatever is getting affinity?
    var listOfAllChoices = [];

    //listOfAllChoices.push(currentOrigin);
    //  listOfAllChoices.push(currentTome);

    //   listOfAllChoices.push(currentForm);
    // listOfAllChoices.push(currentFormTraitList);
    listOfAllChoices.push(currentCulture);
    listOfAllChoices.push(currentSociety1);
    listOfAllChoices.push(currentSociety2);
    // listOfAllChoices.push(currentSubType);
    //listOfAllChoices.push(currentClass);
    return listOfAllChoices;
}

function GetAffinityTotalFromList(list, tomeList, subType, subCulture, subSociety1, subSociety2) {
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

    for (i = 0; i < tomeList.length; i++) {
        if (tomeList[i] != "") {
            if ("affinity" in tomeList[i]) {
                input += tomeList[i].affinity + ",";
            }
            if ("affinities" in tomeList[i]) {
                var bittoadd = duplicateTags(tomeList[i].affinities);
                input += bittoadd + ",";
                input = ClearAffinityExtraTags(input);
            }
        }
    }
    if (subType && subType != "") {
        if ("affinity" in subType) {
            input += subType.affinity + ",";
        }
    }

    if (subCulture && subCulture != "") {
        if ("affinity" in subCulture) {
            input += subCulture.affinity + ",";
        }
    }
    if (subSociety1 && subSociety1 != "") {
        if ("affinity" in subSociety1) {
            input += subSociety1.affinity + ",";
        }
    }
    if (subSociety2 && subSociety2 != "") {
        if ("affinity" in subSociety2) {
            input += subSociety2.affinity + ",";
        }
    }

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

    result = result.replaceAll(",", "");
    return result;
}

function RecalculateStats(fromload) {
    var list = GetCurrentChoiceList();

    var result = GetAffinityTotalFromList(
        list,
        currentTomeList,
        currentSubType,
        currentSubCulture,
        currentSubSociety1,
        currentSubSociety2
    );

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

    const affinitySummary = document.getElementById("currentAffinity");

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

    if (type === "SubType" && !["Dragon Lord", "Giant King", "Elder Vampire"].includes(currentOrigin.name)) return;

    if (type === "SubCulture" && !ListOfSubcultureHolders.includes(currentCulture.name)) return;

    if (type === "SubSociety1" && !ListOfSubsocietyHolders.includes(currentSociety1.name)) return;

    if (type === "SubSociety2" && !ListOfSubsocietyHolders.includes(currentSociety2.name)) return;

    const image = createImage(type, origin);

    const buttonText = createButtonText(origin, type);
    button.append(image, buttonText);

    const tooltip = createTooltip(origin, type);
    addTooltipListeners(image, tooltip);
}

function createImage(type, origin) {
    const image = document.createElement("img");

    const setImage = (src, width = 40, height = 40) => {
        image.setAttribute("src", src);
        image.setAttribute("width", width);
        image.setAttribute("height", height);
    };

    switch (type) {
        case "Tome":
            setImage(`/aow4db/Icons/TomeIcons/${origin.id}.png`);
            break;
        case "Society1":
        case "Society2":
        case "FormTrait":
            setImage("/aow4db/Icons/TraitIcons/" + origin.icon + ".png");
            break;
        case "Culture":
        case "Origin":
        case "Form":
        case "SubCulture":

        case "SubType":
            setImage(getFactionIconPath(origin.id));
            break;
        case "Class":
            setImage(`/aow4db/Icons/Text/${origin.icon}.png`);
            break;
        case "Signature":
        case "Ascension":
            setImage(`/aow4db/Icons/UnitIcons/${origin.icon}.png`);
            break;
             case "Ambition":
            setImage(`/aow4db/Icons/AmbitionIcons/${origin.icon}.png`);
            break;
        case "Symbol":
            let symbolId = parseInt(origin, 10);
            if (symbolId < 10 && symbolId > 0) symbolId = "0" + symbolId;
            if (symbolId === 0) symbolId = 138;
            setImage(`/aow4db/Icons/Symbols/SigilIcons_${symbolId}.gif`);
            break;
    }

    return image;
}

function getFactionIconPath(id) {
    const cleanId = id.startsWith("_") ? id.split("_").slice(1).join("_") : id;
    return `/aow4db/Icons/TraitIcons/${cleanId}.png`;
}

function findOriginLocName(origin, type) {
    let newOrigin = "";
    switch (type) {
        case "Origin":
        case "Culture":
        case "Class":
        case "SubCulture":
        case "SubType":
        case "Form":
            if ("extraLookup" in origin) {
                const valueLookup = findBy(jsonAllFromPOLocalized, "id", origin.extraLookup);
                if ("extraLookup2" in origin) {
                    const valueLookup2 = findBy(jsonAllFromPOLocalized, "id", origin.extraLookup2);

                    newOrigin = valueLookup2.hyperlink || valueLookup2.name || valueLookup2.title;
                } else {
                    newOrigin = valueLookup.hyperlink || valueLookup.name;
                  
                }
            } else {
                
                newOrigin = origin.name;
            }
             newOrigin = newOrigin.split("{")[0];
            break;

        case "Tome":
            const tomeNameLoc = jsonTomesLocalized.find((entry) => entry.resid === origin.resid);
            if (tomeNameLoc == undefined) {
                newOrigin = origin.name;
            } else {
                newOrigin = tomeNameLoc.name;
            }
            //newOrigin = jsonTomes.find((entry) => entry.resid === origin.resid);
            break;

        case "FormTrait":
        case "Society1":
        case "Society2":
            newOrigin = jsonFactionCreation2Localized.find((entry) => entry.icon === origin.icon).name;

            break;

        case "Ascension":
            newOrigin = jsonHeroSkillsLocalized.find((entry) => entry.resid === origin.resid).name;
            break;
             case "Ambition":
            newOrigin = jsonHeroAmbitionsLocalized.find((entry) => entry.icon === origin.icon).name;
            break;
        case "Signature":
        case "Loadout":
            break;
    }
    return newOrigin;
}
function createButtonText(origin, type) {
    const span = document.createElement("span");

    const originLoc = findOriginLocName(origin, type);

    if ("point_cost" in origin && type === "FormTrait") {
        span.innerHTML += `${origin.point_cost}: `;
    }

    if (type == "SubSociety1" || type == "SubSociety2") {
        span.innerHTML += origin.name.split(":")[1];
    } else {
        span.innerHTML += originLoc;
    }

    if ("affinity" in origin) {
        span.innerHTML += ` ${ClearAffinityExtraTags(origin.affinity).replaceAll(",", "")}`;
    }

    if ("affinities" in origin) {
        if (type === "Tome") {
            span.innerHTML += ` ${ClearAffinityExtraTags(duplicateTags(origin.affinities)).replaceAll(",", "")}`;
        } else if (type.includes("Society")) {
            for (const affinity of origin.affinities) {
                if (affinity.name.includes("Affinity")) {
                    span.innerHTML += ` ${clearSocietyAffinities(affinity.name)}`;
                }
            }
        }
    }

    if ("DLC" in origin) {
        const tag = origin.DLC.replaceAll(" ", "");
        span.innerHTML += ` <${tag}></${tag}>`;
    }

    if (listOfPantheonTraits.includes(origin.id)) {
        span.innerHTML += " <pantheon></pantheon>";
    }

    if (type === "Signature" && "hero_property" in origin) {
        const affinityText = document.createElement("div");
        affinityText.style = "position: absolute; left: 0;";
        affinityText.innerHTML = transformString(origin.hero_property).replaceAll(",", "");
        span.appendChild(affinityText);
    }

    return span;
}
function createTooltip(origin, type) {
    const tooltip = document.createElement("span");

    tooltip.style = "margin-left:113px";

    tooltip.innerHTML = `<p style="color: #d7c297;"><span style="font-size:20px;"> ${origin.name.toUpperCase()}</p>`;

    var originLoc = origin; //findOriginLoc(origin, type);
    switch (type) {
        /* case "Society1":
        case "Society2":
            
           origin =  findBy(jsonFactionCreation2Localized, "icon", origin.icon);
            if (origin.effect_descriptions) {
                tooltip.innerHTML += `<br><br><span class="mod_name">EFFECTS: </span><bulletlist>`;
                for (const e of originLoc.effect_descriptions) {
                    tooltip.innerHTML += `<bullet>${e.name}</bullet>`;
                }
                tooltip.innerHTML += "</bulletlist>";
            }

            if (origin.description) tooltip.innerHTML += originLoc.description;

            if (originLoc.starting_bonuses) {
                tooltip.innerHTML += `<br><br><span class="mod_name">STARTING BONUS: </span><bulletlist>`;
                for (const b of originLoc.starting_bonuses) {
                    if (b.structure_upgrade_slug) tooltip.innerHTML += `<bullet>${b.structure_upgrade_slug}</bullet>`;
                    if (b.empire_progression_slug) tooltip.innerHTML += `<bullet>${b.empire_progression_slug}</bullet>`;
                    if (b.description) tooltip.innerHTML += `<bullet>${b.description}</bullet>`;
                }
                tooltip.innerHTML += "</bulletlist>";
            }

           
            break;*/
        case "Society1":
        case "Society2":
        case "Origin":
        case "Culture":
        case "Class":
        case "SubCulture":
        case "SubType":
        case "Form":
        case "FormTrait":
           
            const el = spell_card_template.content.firstElementChild.cloneNode(true);

            tooltip.innerHTML = el.firstElementChild.innerHTML;
            showTrait(origin.id, tooltip);
            if ((origin.incompatible_society_traits || origin.incompatible) && type == "Culture") {
                tooltip.innerHTML += `<br><br><span class="mod_name">INCOMPATIBLE WITH: </span><bulletlist>`;
                const incompatibles = originLoc.incompatible_society_traits || originLoc.incompatible;
                for (const i of incompatibles) {
                    tooltip.innerHTML += `<bullet>${i.name}</bullet>`;
                }
                tooltip.innerHTML += "</bulletlist>";
            }
            break;

        case "Tome":
            
            SetTomePreview(tooltip, originLoc);
            break;

        /* case "FormTrait":
            SetFullPreview(tooltip, originLoc);
            break;*/
                
            
        case "Ambition":
             const el2 = spell_card_template.content.firstElementChild.cloneNode(true);

            tooltip.innerHTML = el2.firstElementChild.innerHTML;
           
             showHeroTrait(origin.id, tooltip);
            break;

        case "Signature":
        case "Ascension":
        
            SetSkillPreview(tooltip, originLoc);
            break;

        case "Loadout":
            SetLoadoutPreview(tooltip, originLoc);
            break;
    }

    return tooltip;
}

function SetSkillPreview(span, origin) {
    span.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";
    if ("description" in origin) {
        span.innerHTML += origin.description;
    }

    if ("abilities" in origin) {
        for (let index = 0; index < origin.abilities.length; index++) {
            for (let i = 0; i < jsonUnitAbilitiesLocalized.length; i++) {
                const test = jsonUnitAbilitiesLocalized[i];
                if (origin.abilities[index].slug == test.slug) {
                    span.innerHTML += "<br>" + GetAbilityInfo(test).innerHTML;
                }
            }
        }

        // span.innerHTML += GetAbilityToolTip()
    }
}

function labelAndTransformString(input) {
    if (input == undefined) {
        return;
    }
    // Split the input string by comma to separate "Origin" and "Culture"
    const parts = input.split(",");

    // Initialize labeled output
    let labeledString = "";

    // Handle the "Origin" part (first part before the comma)
    if (parts[0]) {
        labeledString += "Origin:<br>";
        labeledString += parts[0].split(":").join("<br>") + "<br>";
    }

    // Handle the "Culture" part (second part after the comma)
    if (parts[1]) {
        labeledString += "Culture:<br>";
        labeledString += parts[1].split(":").join("<br>");
    }

    return labeledString;
}

var RangerClassList = [
    "blowgun",
    "bow",
    "crossbow",
    "heavy_magelock_rifle",
    "sword_and_crossbow",
    "pantheon_crowmasters_bow",
    "pantheon_hunters_crossbow",
    "pantheon_umbral_demonslayers_bow",
    "godir_bow"
];
var DefenderClassList = [
    "axe_and_shield",
    "glaive",
    "handaxe_and_shield",
    "mace_and_shield",
    "reaver_halberd",
    "hammer_and_shield",
    "spear",
    "sword_and_shield",
    "materium_dragon",
    "order_dragon",
    "pantheon_lashers_sword_and_shield",
    "pantheon_captains_axe_and_shield",
    "godir_sword_and_shield",
    "pantheon_tyrants_sword_and_shield",
    "pantheon_veterans_pike"
];
var MageClassList = [
    "blight_orb",
    "fire_orb",
    "frost_orb",
    "lightning_orb",
    "spirit_orb",
    "pantheon_orb_of_necromancy",
    "relic_of_mind",
    "relic_of_havoc",
    "relic_of_the_cosmos",
    "astral_dragon"
];
var WarriorClassList = [
    "bladed_mace",
    "cestus",
    "flaming_greatclub",
    "greataxe",
    "greatsword",
    "lance",
    "lance_of_glory",
    "pantheon_martial_cestus",
    "chaos_dragon",
    "shadow_dragon",
    "pantheon_umbral_warriors_greataxe",
    "pantheon_berserkers_axe",
    "pantheon_earthshakers_hammer",
    "pantheon_slayer_sword",
    "godir_greataxe"
];
var RitualistClassList = [
    "blight_staff",
    "fire_staff",
    "lightning_staff",
    "purging_staff",
    "spirit_staff",
    "staff_of_the_primal_spirit",
    "druids_staff",
    "relic_of_flesh",
    "nature_dragon",
    "pantheon_cryomancers_staff",
    "pantheon_umbral_direcasters_staff",
    "pantheon_druids_staff"
];

function GetClassFromWeaponId(id) {
    if (RangerClassList.includes(id)) {
        return "Ranger";
    } else if (DefenderClassList.includes(id)) {
        return "Defender";
    } else if (MageClassList.includes(id)) {
        return "Mage";
    } else if (WarriorClassList.includes(id)) {
        return "Warrior";
    } else if (RitualistClassList.includes(id)) {
        return "Ritualist";
    }
    {
        return "Mage";
    }
}

function SetTomePreview(span, origin) {
    // get loc version?
    let locOrigin = findBy(jsonTomesLocalized, "resid", origin.resid);
    // if not found, use og
    if (locOrigin == undefined) {
        locOrigin = origin;
    }

    span.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + locOrigin.name.toUpperCase() + "</p>";
    span.innerHTML += locOrigin.gameplay_description + "<br>";
    // if ("hero_skills" in origin) {
    //   span.innerHTML += '<p style="color: #97d7a2;>' + '<span style="font-size=20px;">Hero Skills:<br></p>';

    // for (let index = 0; index < origin.hero_skills.length; index++) {
    //   span.innerHTML += "<bullet> " + GetHeroSkillName(origin.hero_skills[index].slug) + "</bullet>";
    //}
    //}
    if ("passives" in locOrigin) {
        span.innerHTML += '<p style="color: #97d7a2;>' + '<span style="font-size=20px;">Passives:<br></p>';
        for (let index = 0; index < locOrigin.passives.length; index++) {
            span.innerHTML += "<bullet>" + locOrigin.passives[index].name + "</bullet>";
        }
    }
    if ("initial_upgrades" in locOrigin) {
        span.innerHTML += '<p  style="color: #97d7a2;>' + '<span style="font-size=20px;">Initial Upgrades:<br></p>';

        for (let index = 0; index < locOrigin.initial_upgrades.length; index++) {
            const struc = GetStructure(locOrigin.initial_upgrades[index].upgrade_slug);
            span.innerHTML +=
                '<bullet> <img width="20px" src="/aow4db/Icons/UpgradeIcons/' +
                struc.icon +
                '.png">' +
                struc.name +
                "</bullet>";
        }
    }
    if ("skills" in locOrigin) {
        span.innerHTML += '<p  style="color: #97d7a2;>' + '<span style="font-size=20px;">Skills:<br></p>';

        for (let index = 0; index < origin.skills.length; index++) {
            // unit unlock
            if (
                origin.skills[index].type == "<hyperlink>Unit</hyperlink>" ||
                origin.skills[index].type == "Unit Unlock"
            ) {
                // can be summon as well
                if ("spell_slug" in origin.skills[index]) {
                    const spell = findBy(jsonSpellsLocalized, "id", locOrigin.skills[index].spell_slug);
                    
                     let iconLink = spell.icon;
                if(spell.icon == undefined){
                    iconLink = spell.id;
                }
                    span.innerHTML +=
                        '<bullet> <img width="20px" src="/aow4db/Icons/SpellIcons/' +
                        iconLink +
                        '.png">' +
                        spell.name +
                        "</bullet>";
                } else {
                    span.innerHTML +=
                        '<bullet> <img width="20px" src="/aow4db/Icons/SpellIcons/' +
                        origin.skills[index].unit_slug +
                        '.png">' +
                        findBy(jsonUnitsLocalized, "id", locOrigin.skills[index].unit_slug).name +
                        "</bullet>";
                }
            }
            // siege
            else if (origin.skills[index].type.indexOf("Siege") != -1) {
                var slug = "";
                if ("siege_project_slug" in origin.skills[index]) {
                    slug = locOrigin.skills[index].siege_project_slug;
                } else {
                    slug = locOrigin.skills[index].name.replaceAll(" ", "_").toLowerCase();
                }
                
                const siege = findBy(jsonSiegeProjectsLocalized, "id", slug);

                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/SiegeProjectIcons/' +
                    siege.icon +
                    '.png">' +
                    siege.name +
                    "</bullet>";
            }
            // city structure
            else if (origin.skills[index].type.indexOf("Structure") != -1) {
                const struc = GetStructure(locOrigin.skills[index].upgrade_slug);
                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/UpgradeIcons/' +
                    struc.icon +
                    '.png">' +
                    struc.name +
                    "</bullet>";
            }
            // province Improvement
            else if (origin.skills[index].type.indexOf("Province") != -1) {
                const struc = GetStructure(locOrigin.skills[index].upgrade_slug);
                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/UpgradeIcons/' +
                    struc.icon +
                    '.png">' +
                    struc.name +
                    "</bullet>";
            }
            // empire upgrades
            else if (origin.skills[index].type.indexOf("Empire") != -1) {
                var imageLinkName = locOrigin.skills[index].name.replaceAll(" ", "_").toLowerCase();
                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/SpellIcons/' +
                    imageLinkName +
                    '.png">' +
                    origin.skills[index].name +
                    "</bullet>";
            }
            // normal spell
            else {
                const spell = findBy(jsonSpellsLocalized, "id", locOrigin.skills[index].spell_slug);
                let iconLink = spell.icon;
                if(spell.icon == undefined){
                    iconLink = spell.id;
                }
                span.innerHTML +=
                    '<bullet> <img width="20px" src="/aow4db/Icons/SpellIcons/' +
                    iconLink +
                    '.png">' +
                    spell.name +
                    "</bullet>";
            }
            //
        }
    }
}

function SetFullPreview(span, origin) {
    span.innerHTML =
        '<p style="color: #d7c297;>' + '<span style="font-size=20px;">' + origin.name.toUpperCase() + "</p>";

    // if("biography_description" in origin){

    //     span.innerHTML += "<br>" + origin.biography_description + "<br>";

    // }
    if ("lore_description" in origin) {
        span.innerHTML += "" + origin.lore_description + "<br>";
    }

    span.innerHTML +=
        '<br><p style="color: #d7c297;>' + '<span style="font-size=20px;">' + "<bulletlist>EFFECTS: " + "</span></p>";
    for (i = 0; i < origin.effect_descriptions.length; i++) {
        span.innerHTML += "<bullet>" + origin.effect_descriptions[i].name + "</bullet>";
    }

    if ("incompatible_society_traits" in origin) {
        span.innerHTML += "<br>Incompatible with:";
        for (i = 0; i < origin.incompatible_society_traits.length; i++) {
            span.innerHTML += "<bullet>" + origin.incompatible_society_traits[i].name + "</bullet>";
        }
    }
    span.innerHTML += "</bulletlist>";
}

function GetAllStartingTomes() {
    var listOfAllTier1Tomes = [];

    for (let i = 0; i < jsonTomes.length; i++) {
        if (jsonTomes[i].tier === 1) {
            listOfAllTier1Tomes.push(jsonTomes[i]);
        }
    }

    // if beta, add new tomes just for now

    // alert(listOfAllTier1Tomes);
    return listOfAllTier1Tomes;
}

function CollectAllPartsForOverview(fromload) {
    document.getElementById("hiddentooltips").innerHTML = "";
    document.getElementById("mainoverview").innerHTML = "";
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
        if (currentSubCulture != "") {
              if (jsonTomes[v].name.indexOf(currentSubCulture.name) != -1) {
                 // if subcutlure
                ExtraTomelist.push(jsonTomes[v]);
            }
        } else {
            if (jsonTomes[v].name.indexOf(currentCulture.name) != -1) {
               

                ExtraTomelist.push(jsonTomes[v]);
            }
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
            // Deduplicate by 'upgrade_slug'
            const uniqueUpgrades = [];

            const seenSlugs = new Set();

            for (let j = 0; j < ExtraTomelist[index].initial_upgrades.length; j++) {
                const upgrade = ExtraTomelist[index].initial_upgrades[j];
                if (!seenSlugs.has(upgrade.upgrade_slug)) {
                    seenSlugs.add(upgrade.upgrade_slug);
                    uniqueUpgrades.push(upgrade);
                }
            }

            // Now push only upgrades not already in the list
            for (let i = 0; i < uniqueUpgrades.length; i++) {
                const upgrade = uniqueUpgrades[i];

                if (!isInArray(listOfAllCurrentSPISlugs, upgrade.upgrade_slug, ExtraTomelist[index])) {
                    listOfAllCurrentSPISlugs.push(upgrade.upgrade_slug, ExtraTomelist[index]);
                }
            }
        }
        /*if ("hero_skills" in ExtraTomelist[index]) {
            for (let l = 0; l < ExtraTomelist[index].hero_skills.length; l++) {
                if (!isInArray(listOfAllCurrentHeroSkillsSlugs, ExtraTomelist[index].hero_skills[l])) {
                    listOfAllCurrentHeroSkillsSlugs.push(ExtraTomelist[index].hero_skills[l], ExtraTomelist[index]);
                }
            }
        }*/
        if ("passives" in ExtraTomelist[index]) {
            for (let q = 0; q < ExtraTomelist[index].passives.length; q++) {
                listOfAllCurrentPassivesSlugs.push(ExtraTomelist[index].passives[q], ExtraTomelist[index]);
            }
        }
    }
    ShowPassivesOverview(listOfAllCurrentPassivesSlugs);
    ShowUnitsOverview(listOfAllCurrentUnitSlugs);
    ShowCombatSpellsOverview(listOfAllCurrentSpellsSlugs);

    ShowUpgradesOverview(listOfAllCurrentUpgradeSlugs);
    ShowSPIOverview(listOfAllCurrentSPISlugs);
    // ShowHeroSkillsOverview(listOfAllCurrentHeroSkillsSlugs);

    ShowSiegeProjectsOverview(listOfAllCurrentSiegeProjectsSlugs);
    var parentDiv = document.getElementById("mainoverview");

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
    const container = document.getElementById("mainoverview");
    //==container.innerHTML = ""; // clear existing content

    const spellGroups = {};

    // Group spells by type
    for (let i = 0; i < list.length; i += 2) {
        const spell = list[i];
        const description = list[i + 1];
        const type = spell.type;

        if (!spellGroups[type]) {
            spellGroups[type] = [];
        }
        spellGroups[type].push([spell, description]);
    }

    // Create sections dynamically
    for (const [type, spells] of Object.entries(spellGroups)) {
        const section = document.createElement("div");
        section.classList.add("column");

        // Create a human-friendly section title
        const heading = document.createElement("div");
        heading.innerHTML = type.replaceAll("<hyperlink>", ""); // helper function
        section.appendChild(heading);

        // Add each spell icon
        spells.forEach(([spell, description]) => {
            section.appendChild(CreateSpellIcon(spell, description));
        });

        container.appendChild(section);
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

    // get spell already

    var spellData = jsonSpells.find((entry) => entry.id == listEntry.spell_slug);
    const listEntryLoc = findBy(jsonSpellsLocalized, "resid", spellData.resid);

    text.innerHTML = " " + listEntryLoc.name;

    var smallIcon = document.createElement("img");
    let iconLink = spellData.icon || spellData.id;
    smallIcon.setAttribute("src", "/aow4db/Icons/SpellIcons/" + iconLink + ".png");
    smallIcon.setAttribute("width", "25px");
    smallIcon.setAttribute("height", "25px");
    spell.appendChild(tier);
    spell.appendChild(smallIcon);
    spell.appendChild(text);

    const fragment = spell_card_template.content.cloneNode(true);
    const iDiv = fragment.firstElementChild;

    document.getElementById("hiddentooltips").appendChild(iDiv);
    var toolTip = showSpell(listEntry.spell_slug, false, iDiv).firstElementChild;

    var newSpan = document.createElement("div");

    newSpan.innerHTML = "<br>From: " + colorEntry.name;
    toolTip.append(newSpan);
    addTooltipListeners(smallIcon, toolTip);
    document.getElementById("hoverDiv").classList.add("wide");

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

    return colors;
}

function CreateUnitIcon(listEntry, colorEntry) {
    const listEntryLoc = findBy(jsonUnitsLocalized, "resid", listEntry.resid);
    var spell = document.createElement("button");
    if (colorEntry != null) {
        var Color = GetColors(colorEntry.affinities);
        applyTextColor(spell, Color);
    }
    spell.className = "overview_list_entry";
    var text = document.createElement("div");
    text.innerHTML =
        romanize(listEntry.tier) + " " + getUnitTypeTag(listEntry.secondary_passives) + " " + listEntryLoc.name;

    // document.getElementById("hiddentooltips").appendChild(iDiv);
    var allAbilities = document.createElement("span");

    var emptyList = [];
    allAbilities.innerHTML +=
        '<span style="font-size: 16px;text-align:center"> ' + listEntryLoc.name.toUpperCase() + " <br></span> ";
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

    var newSpan = document.createElement("div");
    if (colorEntry != null) {
        newSpan.innerHTML = "<br>From: " + colorEntry.name;
        allAbilities.append(newSpan);
    }

    addTooltipListeners(spell, allAbilities);

    spell.appendChild(text);
    return spell;
}

function ShowUnitsOverview(list) {
    var container = document.getElementById("mainoverview");

    const section = document.createElement("div");
    section.classList.add("column");

    // Create a human-friendly section title
    const heading = document.createElement("div");
    heading.innerHTML = "<br>" + "Units:<br>"; // helper function
    section.appendChild(heading);
    for (let i = 0; i < jsonUnits.length; i++) {
        if (currentCulture.name.indexOf(jsonUnits[i].culture_name) != -1 && jsonUnits[i].id != "") {
            if ("sub_culture_name" in jsonUnits[i]) {
                if (currentSubCulture.name.indexOf(jsonUnits[i].sub_culture_name) != -1) {
                    section.append(CreateUnitIcon(jsonUnits[i], null));
                }
            } else {
                section.append(CreateUnitIcon(jsonUnits[i], null));
            }
        }
        //     CreateUnitIcon()
        for (let index = 0; index < list.length; index += 2) {
            if (jsonUnits[i].id == list[index].unit_slug) {
                section.append(CreateUnitIcon(jsonUnits[i], list[index + 1]));
            }
        }
    }

    container.appendChild(section);
    // clear the div
    //  unitsoverviewHolder.innerHTML = "";

    //   unitsoverviewHolder.innerHTML += "Units:<br>";
}

function ShowUpgradesOverview(list) {
    var container = document.getElementById("mainoverview");

    const section = document.createElement("div");
    section.classList.add("column");

    // Create a human-friendly section title
    const heading = document.createElement("div");
    if (list.length > 0) {
        heading.innerHTML = "City Structures:<br>"; // helper function
    }

    section.appendChild(heading);
    for (let index = 0; index < list.length; index += 2) {
        for (let i = 0; i < jsonStructureUpgrades.length; i++) {
            if (jsonStructureUpgrades[i].id == list[index].upgrade_slug) {
                const loc = findBy(jsonStructureUpgradesLocalized, "resid", jsonStructureUpgrades[i].resid);
                var spell = document.createElement("button");
                var Color = GetColors(list[index + 1].affinities);
                applyTextColor(spell, Color);
                spell.className = "overview_list_entry";
                var text = document.createElement("div");
                text.innerHTML = " " + loc.name;
                var smallIcon = document.createElement("img");
                smallIcon.setAttribute("src", "/aow4db/Icons/UpgradeIcons/" + jsonStructureUpgrades[i].id + ".png");
                smallIcon.setAttribute("width", "20px");
                spell.appendChild(smallIcon);
                spell.appendChild(text);
                section.append(spell);
                const iDiv = structure_card_template.content.cloneNode(true);
                const element = iDiv.firstElementChild;

                document.getElementById("hiddentooltips").appendChild(element);

                var tooltip = showStructure(list[index].upgrade_slug, false, element).firstElementChild;
                var newSpan = document.createElement("div");
                if (list[index + 1] != null) {
                    newSpan.innerHTML = "<br>From: " + list[index + 1].name;
                    tooltip.append(newSpan);
                }
                addTooltipListeners(spell, tooltip);
            }
        }
    }

    container.appendChild(section);
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
                smallIcon.setAttribute("src", "/aow4db/Icons/UnitIcons/" + jsonHeroSkills[i].icon + ".png");
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

                    var newSpan = document.createElement("div");
                    if (list[index + 1] != null) {
                        newSpan.innerHTML = "<br>From: " + list[index + 1].name;
                        spa2.append(newSpan);
                    }

                    addTooltipListeners(spell, spa2);
                }
                break;
            }
        }
    }
}

function ShowPassivesOverview(list) {
    var container = document.getElementById("mainoverview");

    const section = document.createElement("div");
    section.classList.add("column");

    // Create a human-friendly section title
    const heading = document.createElement("div");
    if (list.length > 0) {
        heading.innerHTML = "Passives:<br>";
    }

    section.appendChild(heading);
    for (let index = 0; index < list.length; index += 2) {
        var spell = document.createElement("button");
        var Color = GetColors(list[index + 1].affinities);
        applyTextColor(spell, Color);
        spell.className = "overview_list_entry";
        var text = document.createElement("div");
        text.innerHTML = list[index].name;
        // var smallIcon = document.createElement("img");
        // smallIcon.setAttribute("src", "/aow4db/Icons/UnitIcons/" + jsonHeroSkills[index].icon + ".png");
        // smallIcon.setAttribute("width", "20px");
        //    spell.appendChild(smallIcon);
        spell.appendChild(text);
        section.append(spell);
        var spa = document.createElement("SPAN");
        spa.innerHTML = list[index].type + "<br>";
        spa.innerHTML += list[index].description;

        var newSpan = document.createElement("div");
        if (list[index + 1] != null) {
            newSpan.innerHTML = "<br>From: " + list[index + 1].name;
            spa.append(newSpan);
        }
        addTooltipListeners(spell, spa);
    }

    container.appendChild(section);
}

function ShowSPIOverview(list) {
    var container = document.getElementById("mainoverview");

    const section = document.createElement("div");
    section.classList.add("column");

    const heading = document.createElement("div");
    if (list.length > 0) {
        heading.innerHTML = "Special Province Impr.:<br>";
    }

    section.appendChild(heading);

    const seenStructureIds = new Set();

    for (let index = 0; index < list.length; index += 2) {
        const structureId = list[index];

        // Skip if already added
        if (seenStructureIds.has(structureId)) {
            continue;
        }

        seenStructureIds.add(structureId);

        for (let i = 0; i < jsonStructureUpgrades.length; i++) {
            if (jsonStructureUpgrades[i].id == structureId) {
                // get loc name
                const loc = findBy(jsonStructureUpgradesLocalized, "resid", jsonStructureUpgrades[i].resid);

                const spell = document.createElement("button");

                const Color = GetColors(list[index + 1].affinities);
                applyTextColor(spell, Color);
                spell.className = "overview_list_entry";

                const text = document.createElement("div");
                text.innerHTML = loc.name;

                const smallIcon = document.createElement("img");
                smallIcon.setAttribute("src", "/aow4db/Icons/UpgradeIcons/" + jsonStructureUpgrades[i].icon + ".png");
                smallIcon.setAttribute("width", "20px");

                spell.appendChild(smallIcon);
                spell.appendChild(text);
                section.append(spell);

                const name = loc.name;
                const spa = document.createElement("SPAN");

                spa.innerHTML =
                    '<span style="color: #deb887 ;text-transform: uppercase">' +
                    name +
                    "</span>" +
                    GetStructure(loc.id).description;

                const newSpan = document.createElement("div");
                if (list[index + 1] != null) {
                    newSpan.innerHTML = "<br>From: " + list[index + 1].name;
                    spa.append(newSpan);
                }

                addTooltipListeners(spell, spa);
                break; // Done with this structureId
            }
        }
    }

    container.appendChild(section);
}

function ShowSiegeProjectsOverview(list) {
    var container = document.getElementById("mainoverview");

    const section = document.createElement("div");
    section.classList.add("column");

    // Create a human-friendly section title
    const heading = document.createElement("div");
    if (list.length > 0) {
        heading.innerHTML = "Siege Projects:<br>";
    }

    section.appendChild(heading);
    for (let index = 0; index < list.length; index += 2) {
        var slug = "";
        for (let i = 0; i < jsonSiegeProjects.length; i++) {
            if ("siege_project_slug" in list[index]) {
                slug = list[index].siege_project_slug;
            } else {
                slug = list[index].name.replaceAll(" ", "_").toLowerCase();
            }

            if (jsonSiegeProjects[i].id == slug) {
                const loc = findBy(jsonSiegeProjectsLocalized, "resid", jsonSiegeProjects[i].resid);
                var spell = document.createElement("button");

                var Color = GetColors(list[index + 1].affinities);
                applyTextColor(spell, Color);
                spell.className = "overview_list_entry";
                var text = document.createElement("div");
                text.innerHTML = loc.name;
                var smallIcon = document.createElement("img");
                smallIcon.setAttribute("src", "/aow4db/Icons/SiegeProjectIcons/" + jsonSiegeProjects[i].icon + ".png");
                smallIcon.setAttribute("width", "20px");
                spell.appendChild(smallIcon);
                spell.appendChild(text);
                section.append(spell);

                var name = loc.name;

                var spa = document.createElement("SPAN");
                spa.innerHTML =
                    '<span style="color: #deb887 ;text-transform: uppercase">' +
                    name +
                    "<br>" +
                    "</span>" +
                    loc.description;

                //  div.appendChild(spa);

                var newSpan = document.createElement("div");
                if (list[index + 1] != null) {
                    newSpan.innerHTML = "<br>From: " + list[index + 1].name;
                    spa.append(newSpan);
                }

                addTooltipListeners(spell, spa);
            }
        }
    }

    container.appendChild(section);
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
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes[i].affinities, 2) || checkEmpireOfCosmos(1)) {
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
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes[i].affinities, 5) || checkEmpireOfCosmos(2)) {
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
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes[i].affinities, 7) || checkEmpireOfCosmos(3)) {
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

function checkEmpireOfCosmos(tierCheck) {
    // no empire of cosmos here
    if (currentSociety1.id != "empire_of_the_cosmos" && currentSociety2.id != "empire_of_the_cosmos") {
        return false;
    }

    if (hasAllAffinitiesForEmpireOfCosmos(tierCheck)) {
        return true;
    } else {
        return false;
    }
}

function hasAllAffinitiesForEmpireOfCosmos(number) {
    const html = document.getElementById("currentAffinity").innerHTML;

    // List of affinity tags
    const affinities = ["empirematter", "empirearcana", "empirechaos", "empirenature", "empireorder", "empireshadow"];

    // Check if each affinity has a number >= 1 after it
    return affinities.every((affinity) => {
        const regex = new RegExp(`<${affinity}big></${affinity}big>\\s*(\\d+)`);
        const match = html.match(regex);
        return match && parseInt(match[1], 10) >= number;
    });
}

function GetAffinityMatches(affinityTotal, substringToCount, number) {
    // if not mixed affinity
    var moreThanNumber = false;
    if (substringToCount.indexOf("2") != -1) {
        var empireType = substringToCount.split(" ")[1];

        affinityTotal = affinityTotal.replaceAll("  ", " ");

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

function GetAllAmbitions() {
    var listOfAllOrigins = [];

    for (i = 0; i < jsonHeroAmbitions.length; i++) {
        if (jsonHeroAmbitions[i].available_to_rulers == true) {
            listOfAllOrigins.push(jsonHeroAmbitions[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.name - b.name);
    return listOfAllOrigins;
}

function GetAllSubTypes() {
    var listOfAllSubTypes = [];

    for (i = 0; i < jsonFactionCreation.length; i++) {
        if (jsonFactionCreation[i].type === "SubType") {
            if (jsonFactionCreation[i].requirement == currentOrigin.name) {
                listOfAllSubTypes.push(jsonFactionCreation[i]);
            }
        }
    }
    listOfAllSubTypes.sort((a, b) => a.id - b.id);
    return listOfAllSubTypes;
}

function GetAllSubCultureSetups() {
    var listOfAllSubCultTypes = [];

    // list of subcultures for architect

    for (i = 0; i < jsonFactionCreation.length; i++) {
        if (jsonFactionCreation[i].type === "SubCulture") {
            if (jsonFactionCreation[i].requirement == currentCulture.name) {
                listOfAllSubCultTypes.push(jsonFactionCreation[i]);
            }
        }
    }

    listOfAllSubCultTypes.sort((a, b) => a.id - b.id);
    console.log(listOfAllSubCultTypes);
    return listOfAllSubCultTypes;
}

function GetAllSubProphecySetups(entry) {
    var listOfAllSubTypes = [];

    // list of subcultures for architect

    for (i = 0; i < jsonFactionCreation.length; i++) {
        if (jsonFactionCreation[i].type === "SubSociety") {
            if (entry == 1) {
                if (jsonFactionCreation[i].requirement == currentSociety1.name) {
                    listOfAllSubTypes.push(jsonFactionCreation[i]);
                }
            }
            if (entry == 2) {
                if (jsonFactionCreation[i].requirement == currentSociety2.name) {
                    listOfAllSubTypes.push(jsonFactionCreation[i]);
                }
            }
        }
    }
    listOfAllSubTypes.sort((a, b) => a.id - b.id);
    return listOfAllSubTypes;
}
function GetAllClasses() {
    var listofallClasses = [];

    for (i = 0; i < jsonFactionCreation.length; i++) {
        if (jsonFactionCreation[i].type === "Class") {
            listofallClasses.push(jsonFactionCreation[i]);
        }
    }
    listofallClasses.sort((a, b) => a.id - b.id);
    return listofallClasses;
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
        case "SubType":
            var list = GetAllSubTypes(currentOrigin);

            randomOrigin = list[Math.floor(Math.random() * list.length)];
            if (
                currentOrigin.name != "Dragon Lord" &&
                currentOrigin.name != "Giant King" &&
                currentOrigin.name != "Elder Vampire"
            ) {
                randomOrigin = "";
            }
            break;
        case "SubCulture":
            var list = GetAllSubCultureSetups(currentOrigin);

            randomOrigin = list[Math.floor(Math.random() * list.length)];
            if (!ListOfSubcultureHolders.includes(currentCulture.name)) {
                randomOrigin = "";
            }
            // while (incompatibleCheck("Loadout", randomOrigin) === true) {
            //   randomOrigin = list[Math.floor(Math.random() * list.length)];
            //}
            break;

        case "SubSociety1":
            var list = GetAllSubProphecySetups(1);

            randomOrigin = list[Math.floor(Math.random() * list.length)];
            if (!ListOfSubsocietyHolders.includes(currentSociety1.name)) {
                randomOrigin = "";
            }
            // while (incompatibleCheck("Loadout", randomOrigin) === true) {
            //   randomOrigin = list[Math.floor(Math.random() * list.length)];
            //}
            break;
        case "SubSociety2":
            var list = GetAllSubProphecySetups(2);

            randomOrigin = list[Math.floor(Math.random() * list.length)];
            if (!ListOfSubsocietyHolders.includes(currentSociety2.name)) {
                randomOrigin = "";
            }
            // while (incompatibleCheck("Loadout", randomOrigin) === true) {
            //   randomOrigin = list[Math.floor(Math.random() * list.length)];
            //}
            break;
        case "Class":
            var list = GetAllClasses();

            randomOrigin = list[Math.floor(Math.random() * list.length)];
            while (incompatibleCheck("Class", randomOrigin) === true) {
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

function GetCultureFromID(id) {
    for (let index = 0; index < jsonFactionCreation.length; index++) {
        if (jsonFactionCreation[index].id == id) {
            return jsonFactionCreation[index];
        }
    }
}

function incompatibleCheck(type, origin) {
    var incompatibleWithSetup = false;

    // check from culture too

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

    if (currentCulture != "") {
        if ("incompatible" in currentCulture) {
            for (let index = 0; index < currentCulture.incompatible.length; index++) {
                //  console.log(currentCulture.incompatible[index].name + " " + origin.name );
                if (origin.name == currentCulture.incompatible[index].name) {
                    {
                        incompatibleWithSetup = true;
                    }
                }
            }
        }
    }

    if ("incompatible_society_traits" in origin) {
        if (type === "Society1") {
            let i = "";
            // also check from culture here
            //  currentCul = GetCultureFromID(currentCulture);

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

    if (currentSociety1 != "") {
        // only one vision
        if (currentSociety1.name.indexOf("Vision of") != -1 && origin.name.indexOf("Vision of") != -1) {
            incompatibleWithSetup = true;
        }
    }

    if (currentSociety2 != "") {
        // only one vision
        if (currentSociety2.name.indexOf("Vision of") != -1 && origin.name.indexOf("Vision of") != -1) {
            incompatibleWithSetup = true;
        }
    }

    if (currentSociety1.name === origin.name) {
        incompatibleWithSetup = true;
    } else if (currentSociety2.name === origin.name) {
        incompatibleWithSetup = true;
    }

    // add class incompatiblity?
    if (type === "Class") {
        if (origin.name == "Ranger") {
            if (
                currentOrigin.name == "Dragon Lord" ||
                currentOrigin.name == "Eldritch Sovereign" ||
                currentOrigin.name == "Giant King"
            ) {
                incompatibleWithSetup = true;
            }
        }
        if (
            origin.name == "Defender" ||
            origin.name == "Warrior" ||
            origin.name == "Spellblade" ||
            origin.name == "Death Knight"
        ) {
            if (currentOrigin.name == "Eldritch Sovereign") {
                incompatibleWithSetup = true;
            }
        }
    }

    return incompatibleWithSetup;
}

function toggleSelection(origin, button, type, event) {
    // console.log("test" + origin);

    // dont let turn off the starting skills

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
    const exclusiveGroups = ["Adaptations", "Mounts", "DAMAGE_RETALIATION", "TACTICS", "Flaws"];

    // Check if only one of each exclusive group can exist
    if (exclusiveGroups.includes(entry.group_name)) {
        const hasSameGroup = currentFormTraitList.some((item) => item.group_name === entry.group_name);

        const isBlockedByPrimal = entry.group_name === "Adaptations" && currentCulture.name.includes("Primal");

        if (hasSameGroup || isBlockedByPrimal) {
            return false;
        }
    }

    // Normalize to array of names
    const currentTraitNames = currentFormTraitList.map((item) => item.name);

    // --- Forward check: entry conflicts with something already selected
    if (Array.isArray(entry.incompatible_society_traits)) {
        const incompatibleNames = entry.incompatible_society_traits.map((i) => (typeof i === "string" ? i : i.name));

        const hasIncompatible = incompatibleNames.some((name) => currentTraitNames.includes(name));
        if (hasIncompatible) {
            return false;
        }
    }

    // --- Reverse check: something already selected conflicts with entry
    for (const trait of currentFormTraitList) {
        if (Array.isArray(trait.incompatible_society_traits)) {
            const incompatibleNames = trait.incompatible_society_traits.map((i) =>
                typeof i === "string" ? i : i.name
            );

            if (incompatibleNames.includes(entry.name)) {
                return false;
            }
        }
    }

    return true;
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

function GenerateQuickLink() {
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

    // attach subsociety1 to it
    if (currentSubSociety1 != "") {
        var extraNummer = decimalToHex(LookUpTableData(currentSubSociety1.id));
        code += ":" + extraNummer;
    }

    //2
    var number = decimalToHex(LookUpTableData(currentSociety2.id));
    code += "," + number;

    // attach subsociety2 to it
    if (currentSubSociety2 != "") {
        var extraNummer = decimalToHex(LookUpTableData(currentSubSociety2.id));
        code += ":" + extraNummer;
    }
    //3
    var number = decimalToHex(LookUpTableData(currentForm.id));
    code += "," + number;
    //4
    var number = decimalToHex(LookUpTableData(currentCulture.id));
    code += "," + number;
    // attach subculture to it
    if (currentSubCulture != "") {
        var extraNummer = decimalToHex(LookUpTableData(currentSubCulture.id));
        code += ":" + extraNummer;
    }
    //5
    var number = decimalToHex(LookUpTableData(currentOrigin.id));
    code += "," + number;
    //6
    // if no subtype, add blank
    if (currentSubType == "") {
        code += "," + "s";
    } else {
        var number = decimalToHex(LookUpTableData(currentSubType.id));
        code += "," + number;
    }

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

    // 9 class
    var number = decimalToHex(LookUpTableData(currentClass.id));
    code += "," + number;

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
        var modName = name.replaceAll(" ", "%20");
        code += "," + modName;
    }
    if (raceName == "Race Name") {
        code += ":" + "r";
    } else {
        var modRaceName = raceName.replaceAll(" ", "%20");
        code += ":" + modRaceName;
    }
    // 12 add ambition
    // 13 ascension
    if (currentAmbition == "") {
        code += "," + "am";
    } else {
        var number = decimalToHex(LookUpTableData(currentAmbition.id));
        code += "," + number;
    }

    // console.log("hex code: " + code);

    return code;
}

function GetQuickLink() {
    var code = GenerateQuickLink();

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
    // load classes
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
    var currentSocietySplit = lookUp.split(":");
    var numbernew = jsonBuilderLookUp[hexToDecimal(currentSocietySplit[0])].id;

    for (let index = 0; index < jsonFactionCreation2.length; index++) {
        if (jsonFactionCreation2[index].id === numbernew) {
            var newBit = jsonFactionCreation2[index];
        }
    }
    currentSociety1 = newBit;
    var originButton = document.getElementById("originButtonSociety1");
    SetButtonInfo(originButton, currentSociety1, "Society1");

    // sub society1
    if (currentSocietySplit[1] != undefined) {
        // sub society here

        var subsoc1 = jsonBuilderLookUp[hexToDecimal(currentSocietySplit[1])].id;

        for (let index = 0; index < jsonFactionCreation.length; index++) {
            if (jsonFactionCreation[index].id === subsoc1) {
                var newBit = jsonFactionCreation[index];
            }
            currentSubSociety1 = newBit;
            var originButton = document.getElementById("originButtonSubSociety1");
            SetButtonInfo(originButton, currentSubSociety1, "SubSociety1");
        }
    }

    // 2 = currentsociety2
    var lookUp2 = splitcode[2];
    var currentSocietySplit2 = lookUp2.split(":");
    var numbernew = jsonBuilderLookUp[hexToDecimal(currentSocietySplit2[0])].id;

    for (let index = 0; index < jsonFactionCreation2.length; index++) {
        if (jsonFactionCreation2[index].id === numbernew) {
            var newBit = jsonFactionCreation2[index];
        }
    }
    currentSociety2 = newBit;
    var originButton = document.getElementById("originButtonSociety2");
    SetButtonInfo(originButton, currentSociety2, "Society2");

    // sub society
    if (currentSocietySplit[1] != undefined) {
        // sub society here

        var subsoc1 = jsonBuilderLookUp[hexToDecimal(currentSocietySplit[1])].id;

        for (let index = 0; index < jsonFactionCreation.length; index++) {
            if (jsonFactionCreation[index].id === subsoc1) {
                var newBit = jsonFactionCreation[index];
            }
            currentSubSociety2 = newBit;
            var originButton = document.getElementById("originButtonSubSociety2");
            SetButtonInfo(originButton, currentSubSociety2, "SubSociety2");
        }
    }

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
    // check for subculture
    var currentCultureSplit = lookUp.split(":");
    var numbernew = jsonBuilderLookUp[hexToDecimal(currentCultureSplit[0])].id;

    for (let index = 0; index < jsonFactionCreation.length; index++) {
        if (jsonFactionCreation[index].id === numbernew) {
            var newBit = jsonFactionCreation[index];
        }
    }

    currentCulture = newBit;

    // backwards compatible
    if (newBit.type == "SubCulture") {
        currentSubCulture = newBit;

        for (let index = 0; index < jsonFactionCreation.length; index++) {
            if (jsonFactionCreation[index].name === currentSubCulture.requirement) {
                var newBit = jsonFactionCreation[index];
            }
        }
        currentCulture = newBit;

        var originButton = document.getElementById("originButtonSubCulture");
        SetButtonInfo(originButton, currentSubCulture, "SubCulture");
    }

    var originButton = document.getElementById("originButtonCulture");
    SetButtonInfo(originButton, currentCulture, "Culture");

    // subculture
    if (currentCultureSplit[1] != undefined) {
        // subculture here
        //  console.log("here");
        var subcultureNo = jsonBuilderLookUp[hexToDecimal(currentCultureSplit[1])].id;

        for (let index = 0; index < jsonFactionCreation.length; index++) {
            if (jsonFactionCreation[index].id === subcultureNo) {
                var newBit = jsonFactionCreation[index];
            }
            currentSubCulture = newBit;
            var originButton = document.getElementById("originButtonSubCulture");
            SetButtonInfo(originButton, currentSubCulture, "SubCulture");
        }
    }

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
    // old loadout, new subtype
    var lookUp = splitcode[6];
    var TempReplacementForClass = "";
    if (lookUp != "s") {
        var numbernew = jsonBuilderLookUp[hexToDecimal(lookUp)].id;

        for (let index = 0; index < jsonFactionCreation.length; index++) {
            if (jsonFactionCreation[index].id === numbernew) {
                var newBit = jsonFactionCreation[index];
            }
        }
        if (newBit.name.indexOf("Dragon") != -1 || newBit.name.indexOf("Giant") != -1) {
            currentSubType = newBit;
            var originButton = document.getElementById("originButtonSubType");
            SetButtonInfo(originButton, currentSubType, "SubType");
        }
        // ctry to find equivalent for class later one
        // console.log("found an old loadout : " + GetClassFromWeaponId(newBit.id));
        TempReplacementForClass = GetClassFromWeaponId(newBit.id);
    }
    // 7 = tomes
    var newList = [];
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
    if (currentExtraAffinityLoad[0] != undefined) {
        extraAstral = currentExtraAffinityLoad[0];
        extraChaos = currentExtraAffinityLoad[1];
        extraMaterium = currentExtraAffinityLoad[2];
        extraNature = currentExtraAffinityLoad[3];
        extraOrder = currentExtraAffinityLoad[4];
        extraShadow = currentExtraAffinityLoad[5];
    } else {
        extraAstral = 0;
        extraChaos = 0;
        extraMaterium = 0;
        extraNature = 0;
        extraOrder = 0;
        extraShadow = 0;
    }

    // 9 = signatures if available, else placeholder "s" is added
    // overwrite with class, signatures have been gone for a while
    var classType = splitcode[9];

    if (classType != "s") {
        var numbernew = jsonBuilderLookUp[hexToDecimal(classType)].id;

        for (let index = 0; index < jsonFactionCreation.length; index++) {
            if (jsonFactionCreation[index].id === numbernew) {
                var newBit = jsonFactionCreation[index];
            }
        }
        currentClass = newBit;
        var originButton = document.getElementById("originButtonClass");
        SetButtonInfo(originButton, currentClass, "Class");
    } else if (TempReplacementForClass != "") {
        for (let index = 0; index < jsonFactionCreation.length; index++) {
            if (jsonFactionCreation[index].name === TempReplacementForClass) {
                var newBit = jsonFactionCreation[index];
            }
        }
        currentClass = newBit;
        var originButton = document.getElementById("originButtonClass");
        SetButtonInfo(originButton, currentClass, "Class");
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
    
     // 13 = ambition if available, else placeholder "am" is added
    var amb = splitcode[13];
    if (amb != "am" && amb != undefined) {
        var numbernew = jsonBuilderLookUp[hexToDecimal(amb)].id;

        for (let index = 0; index < jsonHeroAmbitions.length; index++) {
            if (jsonHeroAmbitions[index].id === numbernew) {
                var newas = jsonHeroAmbitions[index];
            }
        }
        currentAmbition = newas;
        var originButton = document.getElementById("originButtonAmbition");
        SetButtonInfo(originButton, currentAmbition, "Ambition");
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
    console.log(code);
    reversLookUp(code);
    spinner.style.display = "block"; // Show the spinner
    fetch(
        "https://script.google.com/macros/s/AKfycbz5r36EOFcrtfu2Y3CN8DdgDkJDiq6NHf7Y6JEv1IkngOG4we3F5uFU6o5aYFSnm5M4/exec",
        {
            method: "POST",
            body: new URLSearchParams({
                action: "incrementView",
                buildId: window.location.href.split("?")[0] + "?u=" + code.replaceAll(" ", "%20")
            })
        }
    )
        .then((res) => res.json()) // Parse the JSON from response
        .then((builds) => {
            if (builds[0] != undefined) {
                FillInBuildDetails(builds[0]);
            }
        })
        .finally(() => {
            spinner.style.display = "none"; // Hide spinner after fetch is done
        });

    if (window.location.href.indexOf("&edit")) {
        // save current url for overwriting
        document.getElementById("oldURL").innerHTML = window.location.href.split("?")[0] + "?u=" + code;
        // show edit button
        var editButton = document.getElementById("overwriteButton");
        editButton.style.display = "block";
        //   alert("Editing");
    }

    // check if build code is here

    // if (build.editKey === getOrCreateUserEditKey()) {
}

function FillInBuildDetails(build) {
    console.log(build);
    var nameBuild = document.getElementById("buildName");
    nameBuild.value = build.BuildName;
    var notesBlock = document.getElementById("notesDisplay");
    console.log(build.Notes);
    var convertedNotes = convertBracketsToHTML(build.Notes);
    console.log(convertedNotes);
    convertedNotes = convertNamesToHTML(convertedNotes);
    console.log(convertedNotes);
    notesBlock.innerHTML = convertedNotes;
    if (build.Tags != "") {
        const tagArray = new Set(build.Tags.split(",").map((tag) => tag.trim()));
        updateTagList(tagArray);
    }

    rawNotes = build.Notes;

    // const tagArray = Array.from(selectedTags);
}
