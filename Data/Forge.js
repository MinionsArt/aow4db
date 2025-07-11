var CurrentType = "";
var currentDam = "";
var currentAb = "";
var currentPassives = [];
var currentPointsAmount = 0;
var maxPointsAmount = 5;

var currentInfusionType = "";

var itemTypes = [
    "One-handed weapon",
    "Double-handed weapon",
    "Polearm",
    "Light ranged",
    "Heavy ranged",
    "Magical Orb",
    "Staff",
    "Dual weapon",
    "Dragon Claw",
    "Dragon Claw: Warclaw",
    "Dragon Claw: Armored claw",
    "Giant Axe",
    "Warhammer",
    "Obelisk",
    "Eldritch relic",
    "Head",
    "Torso",
    "Leg",
    "Shield",
    "Ring",
    "Wand (misc.)",
    "Trinket (misc.)"
];

function HandlePage() {
    GenerateAllIconTypes();
}

function showItemType(type) {
    ResetAll();
    CurrentType = type;
    SetIcons(type);
}

function swapPointMax(sheet) {
    if ($(sheet).prop("checked") == true) {
        maxPointsAmount = 6;
    } else {
        maxPointsAmount = 5;
    }
}

function GenerateAllIconTypes() {
    var holder = document.getElementById("itemTypeHolder");

    for (let i = 0; i < itemTypes.length; i++) {
       

        holder.appendChild(AddNewItemIconType(itemTypes[i]));
    }
}

function AddNewItemIconType(entry){
     // generate buttons
        const newButton = document.createElement("button");
        newButton.className = "itemSelectionButton";
        const newImage = document.createElement("img");
        newImage.setAttribute("src", "/aow4db/Icons/Interface/skill_unassigned.png");
        newImage.style.width = "40px";
        newButton.append(newImage);
        const newSpan = document.createElement("Span");

        newSpan.innerHTML = entry;
        newSpan.setAttribute("id", "subCultureName" + entry);
        newSpan.className = "subCultureName";
        newButton.appendChild(newSpan);

        newButton.addEventListener("click", () => showItemType(entry));
    return newButton;
}

function showInfusionType(infusionType) {
    currentInfusionType = infusionType;
    UpdateList();
}
function UpdateList() {
    var list = [];
    for (let i = 0; i < jsonItemForge.length; i++) {
        let key = CurrentType; // your dynamic variable
        let value = jsonItemForge[i][key];

        if (value != "") {
            console.log("value : " + value + " infusiontype");
            // check type
            if (currentInfusionType == "damage" && jsonItemForge[i].Type == "D") {
                list.push(jsonItemForge[i]);
            }
            if (currentInfusionType == "ability" && jsonItemForge[i].Type == "A") {
                list.push(jsonItemForge[i]);
            }
            if (
                currentInfusionType == "passive" &&
                jsonItemForge[i].Type == "P" &&
                !isInArray(currentPassives, jsonItemForge[i])
            ) {
                list.push(jsonItemForge[i]);
            }
        }
    }

    ShowItemForgeResults(list);
}

function ShowItemForgeResults(list) {
    // get the selectionsholder
    var selectionsHolder = document.getElementById("SelectionsHolder");
    ClearSelections();
    for (let i = 0; i < list.length; i++) {
        selectionsHolder.append(AddNewSelectionEntry(list[i]));
    }
}

function AddNewSelectionEntry(entry) {
    const newEntry = document.createElement("BUTTON");
    newEntry.className = "list-button";
    // checkPoints, if not enough, make it greyed out.
    if (currentPointsAmount + parseInt(entry.PTS) > maxPointsAmount) {
        // we dont have enough points
        newEntry.disabled = true;
    }

    const Icon = document.createElement("IMG");
    Icon.setAttribute("src", entry["Icon link"]);
    Icon.setAttribute("style", "width: 40px; height:40px");
    const NameEntry = document.createElement("div");
    NameEntry.innerHTML = entry["Infusion name"] + " " + entry.PTS;

    const descrEntry = document.createElement("div");
    descrEntry.innerHTML = AddTagIconsForStatusEffects(entry.Description);
    newEntry.appendChild(Icon);
    newEntry.append(NameEntry);
    NameEntry.setAttribute("style", "  width: 300px;  display: flex; flex-direction: column; align-items: flex-start;");
    NameEntry.appendChild(descrEntry);

    newEntry.addEventListener("click", () => TryToAddToItem(entry));
    return newEntry;
}

function TryToRemoveEntry(entry) {
    if (entry.Type == "D") {
        currentDam = "";
    }
    if (entry.Type == "A") {
        currentAb = "";
    }
    if (entry.Type == "P") {
        const index = currentPassives.indexOf(entry);

        const x = currentPassives.splice(index, 1);
    }
    GetNewPointstotal();

    // update points display
    UpdatePointsDisplay();
    ShowResults();
    UpdateList();
}
function TryToAddToItem(entry) {
    if (entry.Type == "D") {
        currentDam = entry;
    }
    if (entry.Type == "A") {
        currentAb = entry;
    }
    if (entry.Type == "P") {
        currentPassives.push(entry);
    }

    GetNewPointstotal();

    // update points display
    UpdatePointsDisplay();
    ShowResults();
    UpdateList();
}

function GetNewPointstotal() {
    var number = 0;
    if (currentDam != "") {
        number += parseInt(currentDam.PTS);
    }
    if (currentAb != "") {
        number += parseInt(currentAb.PTS);
    }

    for (let i = 0; i < currentPassives.length; i++) {
        number += parseInt(currentPassives[i].PTS);
    }

    currentPointsAmount = number;
}

function UpdatePointsDisplay() {
    var pointsDisplay = document.getElementById("points");
    pointsDisplay.innerHTML = "Points: " + currentPointsAmount + "/" + maxPointsAmount;
}

function ShowResults() {
    // check if points works
    ClearResults();

    var resultsHolder = document.getElementById("ResultsHolder");
    if (currentDam != "") {
        resultsHolder.append(NewResultsListEntry(currentDam));
    }
    if (currentAb != "") {
        resultsHolder.append(NewResultsListEntry(currentAb));
    }

    for (let i = 0; i < currentPassives.length; i++) {
        resultsHolder.append(NewResultsListEntry(currentPassives[i]));
    }
}

function NewResultsListEntry(entry) {
    const newEntry = document.createElement("BUTTON");
    const img = document.createElement("Img");
    img.setAttribute("src", entry["Icon link"]);
    newEntry.className = "list-button";
    newEntry.innerHTML = entry["Infusion name"] + " " + entry.PTS;
    newEntry.appendChild(img);
    newEntry.addEventListener("click", () => TryToRemoveEntry(entry));
    return newEntry;
}

function ResetAll() {
    ResetCurrent();
    ClearResults();
    ClearSelections();
    ResetPoints();
    UpdatePointsDisplay();
}

function ResetCurrent() {
    currentAb = "";
    currentDam = "";
    currentPassives = [];
}

function ResetPoints() {
    currentPointsAmount = 0;
}

function ClearResults() {
    var resultsHolder = document.getElementById("ResultsHolder");
    resultsHolder.innerHTML = "";
}

function ClearSelections() {
    var selectionsHolder = document.getElementById("SelectionsHolder");
    selectionsHolder.innerHTML = "";
}

function SetIcons(id) {
    var thisNameAll = document.querySelectorAll(".subCultureName");

    for (let index = 0; index < thisNameAll.length; index++) {
        thisNameAll[index].style.color = "grey";
    }
    var thisName = document.getElementById("subCultureName" + id);
    if (thisName == null) {
        return;
    }
    thisName.style.color = "white";
}
