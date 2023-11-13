
var currentOrigin = "";
var currentTome = "";

var currentForm = "";
var currentFormTraitList = new Array();
var currentCulture = "";
var currentSociety1 = "";
var currentSociety2 = "";
var currentLoadout = "";

var currentAffinityTotal = "";

var extraOrder, extraChaos, extraNature, extraMaterium, extraShadow, extraAstral;

var currentTomeList = new Array();

function ChangeShieldCol() {

    var shieldElement = document.getElementById("shield");
    degrees = Math.random() * 360;
    shieldElement.setAttribute("style", "filter: hue-rotate(" + degrees + "deg)");
}

function ChangeSymbolCol() {

    // var symbolElement = document.getElementById("symbol");
    // degrees = Math.random() * 360;
    // symbolElement.setAttribute("style", "filter: hue-rotate(" + degrees + "deg)")
}

function GetRandomSymbol() {
    // var symbolElement = document.getElementById("symbol");
    // var numb = Math.floor(Math.random() * 138);
    // if (numb < 10 && numb > 0) {

    //     numb = "0" + numb.toString();
    // }
    // if (numb == 0) {
    //     numb += 1;
    //     numb = "0" + numb.toString();
    // }
    // symbolElement.setAttribute("src", "/aow4db/Icons/Symbols/SigilIcons_" + numb + ".gif");

}

function AddExtra(type, add) {
    if (type == "order") {

        extraOrder = addOrSubtract(extraOrder, add);
    }
    if (type == "chaos") {
        extraChaos = addOrSubtract(extraChaos, add);
    }
    if (type == "nature") {
        extraNature = addOrSubtract(extraNature, add);
    }
    if (type == "shadow") {
        extraShadow = addOrSubtract(extraShadow, add);
    }
    if (type == "materium") {
        extraMaterium = addOrSubtract(extraMaterium, add);
    }
    if (type == "astral") {
        extraAstral = addOrSubtract(extraAstral, add);
    }

    RecalculateStats();
}

function addOrSubtract(extraAffinity, add) {
    if (add == "-") {
        if (extraAffinity > 0) {
            extraAffinity--;
        }

    } else {
        extraAffinity++;
    }
    return extraAffinity;
}



function SetRandomStart() {

    GetRandomSymbol();
    ChangeShieldCol();
    ChangeSymbolCol();

    var listofChoice = new Array();
    listofChoice.push("Tome");
    listofChoice.push("Origin");
    listofChoice.push("Form");
    listofChoice.push("FormTrait");
    listofChoice.push("Culture");
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
                currentTomeList = new Array();
                currentTomeList.push(currentTome);

                break;
            case "Origin":
                currentOrigin = randomEntry;
                break;

            case "Form":
                currentForm = randomEntry;
                break;
            case "FormTrait":
                currentFormTraitList = new Array();
                currentFormTraitList.push(randomEntry);


                while (getPoints() < 5) {
                    var randomEntry = GetRandomEntry(listofChoice[j]);
                    if (getPoints() + randomEntry.point_cost < 6 && !isInArray(currentFormTraitList, randomEntry)) {
                        if (randomEntry.group_name == "ADAPTATION") {
                            hasAdaptionGroup = currentFormTraitList.some(item => item.group_name === 'ADAPTATION');
                            if (!hasAdaptionGroup) {
                                currentFormTraitList.push(randomEntry);
                            }
                        } else {
                            currentFormTraitList.push(randomEntry);
                        }




                    }

                }



                break;
            case "Culture":
                currentCulture = randomEntry;
                break;

            case "Society1":
                currentSociety1 = randomEntry;
                break;
            case "Society2":
                while (currentSociety1 == randomEntry) {
                    var randomEntry = GetRandomEntry(listofChoice[j]);
                }
                currentSociety2 = randomEntry;
                break;
            case "Loadout":
                currentLoadout = randomEntry;
                break;
        }



        var originButton = document.getElementById("originButton" + currentChoice);



        if (currentChoice != "FormTrait") {
            originButton.innerHTML = "";
            SetButtonInfo(originButton, randomEntry, currentChoice);
        }


    }

    extraOrder = 0;
    extraChaos = 0;
    extraAstral = 0;
    extraMaterium = 0;
    extraNature = 0;
    extraShadow = 0;
    selectTomePath();
    RecalculateStats();
    updateSelectedOptions();

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

    var originWrapper = document.getElementById("originWrapperOptions");
    originWrapper.innerHTML = "";
    var selectionsText = document.getElementById("selections");
    selectionsText.textContent = "";
}

// Function to handle the selection of an origin
function selectOrigin(origin, type) {

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
            selectTomePath();
            break;
        case "Origin":

            currentOrigin = origin;
            if (incompatibleCheck("Loadout", currentLoadout)) {
                var loadoutButton = document.getElementById("originButtonLoadout");
                loadoutButton.innerHTML += "<span style=\"color:red\"> Incompatible </span>";
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
    }



    //  SetupButtons(type)
    // set affinity  stats
    RecalculateStats();
    // swap current known origin

    toggleOriginButtons();
}


// Function to handle the selection of an origin
function SelectSymbol(origin) {



    var symbolElement = document.getElementById("symbol");

    if (origin < 10 && origin > 0) {

        origin = "0" + origin.toString();
    }
    if (origin == 0) {
        origin = 138;

    }
    symbolElement.setAttribute("src", "/aow4db/Icons/Symbols/SigilIcons_" + origin + ".gif");



    toggleOriginButtons();
}

function SetTomePathOptions() {

    var originWrapper = document.getElementById("originWrapperOptions");
    originWrapper.innerHTML = "";
    var list = new Array();

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
        originButtonNew.addEventListener("click", () => selectTomePath(origin));

        originWrapper.appendChild(originButtonNew);

        SetTomePathInfo(originButtonNew, origin);
    }


}

// Function to handle the selection of an origin
function selectTomePath(origin) {

    var originButton = document.getElementById("tomePathButton");
    originButton.textContent = "";

    if (origin != undefined) {
        currentTomeList.push(origin);
    }

    for (var i = 0; i < currentTomeList.length; i++) {
        SetTomePathInfoSmall(originButton, currentTomeList[i]);
    }




    RecalculateStats();
    // swap current known origin
    // draw all tomes

    toggleOriginButtons();
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
    if ('affinities' in origin) {

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
    spa.className = "tooltiptext";
    spa.setAttribute("style", "margin-left:113px");

    spa.innerHTML = "<p style=\"color: #d7c297;>" + "<span style=\"font-size=20px;\">" + origin.name.toUpperCase() + "</p>";

    SetTomePreview(spa, origin);

    newDivButton.className = "tome-button-small";

    newDivButton.addEventListener("click", () => SetTomePathOptions());

    newDivButton.append(spa);
}

function ClearTomePath() {
    var originButton = document.getElementById("tomePathButton");
    originButton.textContent = "";

    currentTomeList = new Array();
    currentTomeList.push(currentTome);
    selectTomePath();



    RecalculateStats();
    // swap current known origin
    // draw all tomes

    toggleOriginButtons();
}

function SetTomePathInfo(button, origin) {


    const image = document.createElement("img");
    image.setAttribute("width", "40");
    image.setAttribute("height", "40");


    image.src = "/aow4db/Icons/TomeIcons/" + origin.id + ".png"; // Set the image source to your image file




    // Create a span element to hold the button text
    const buttonText = document.createElement("span");
    const newDivButton = document.createElement("div");
    buttonText.innerHTML = "Tier " + origin.tier;
    buttonText.innerHTML += origin.name;
    var affinity = "";

    if ('affinities' in origin) {

        affinity = ClearAffinityExtraTags(duplicateTags(origin.affinities));
        affinity = affinity.replaceAll(",", "");
        buttonText.innerHTML += " " + affinity;

    }
    // Append the image and button text to the button element
    newDivButton.appendChild(image);
    newDivButton.appendChild(buttonText);

    button.append(newDivButton);





    // create mouseover
    spa = document.createElement("SPAN");
    spa.className = "tooltiptext";
    spa.setAttribute("style", "margin-left:113px");

    spa.innerHTML = "<p style=\"color: #d7c297;>" + "<span style=\"font-size=20px;\">" + origin.name.toUpperCase() + "</p>";

    SetTomePreview(spa, origin);

    newDivButton.className = "list-button-small";

    newDivButton.addEventListener("click", () => SetTomePathOptions());

    newDivButton.append(spa);
}


function SetupButtons(type) {

    var originWrapper = document.getElementById("originWrapperOptions");
    originWrapper.innerHTML = "";
    var originButton = document.getElementById("originButton" + type);
    // console.log(type);
    var list = new Array();

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
        case "Society2":
            list = GetAllSocietyTraits();

            break;

        case "Symbol":
            list = Array.from({
                length: 138
            }, (_, index) => index);
            // list = new Array(138);

            break;
        case "TomePath":
            list = GetNextSetOfTomes();
            break;

    }

    // console.log(currentChoice);
    // List of origin options

    // Create origin buttons dynamically from the list
    var selectionsText = document.getElementById("selections");
    selectionsText.textContent = "Select " + type;
    for (const origin of list) {
        const originButtonNew = document.createElement("button");
        if (type == "Symbol") {

            originButtonNew.addEventListener("click", () => SelectSymbol(origin));
            originButtonNew.className = "list-button-small";
            originWrapper.appendChild(originButtonNew);
            SetButtonInfo(originButtonNew, origin, type);

        } else if (type == "FormTrait") {

            // hook into options thingie
            originButtonNew.className = "list-button";

            if (isInArray(currentFormTraitList, origin)) {
                originButtonNew.classList.toggle('selected');
                //console.log(currentFormTraitList + " " + origin);

            }

            // new button script
            originButtonNew.addEventListener("click", () => toggleSelection(origin, originButtonNew));

            originWrapper.appendChild(originButtonNew);

            SetButtonInfo(originButtonNew, origin, type);

        }
        else {

            if (!incompatibleCheck(type, origin)) {
                originButtonNew.className = "list-button";

                originButtonNew.addEventListener("click", () => selectOrigin(origin, type));

                originWrapper.appendChild(originButtonNew);

                SetButtonInfo(originButtonNew, origin, type);
                // originButtonNew.innerHTML += "<span style=\"color:red\"> Incompatible </span>";
            }

        }


    }

}

function GetCurrentChoiceList() {
    var listOfAllChoices = new Array();

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

function RecalculateStats() {

    var list = GetCurrentChoiceList();

    var input = "";



    for (i = 0; i < list.length; i++) {
        if (list[i] != "") {

            if ('affinity' in list[i]) {

                input += list[i].affinity + ",";

            }
            if ('affinities' in list[i]) {
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

            if ('affinity' in currentTomeList[i]) {

                input += currentTomeList[i].affinity + ",";
            }
            if ('affinities' in currentTomeList[i]) {
                var bittoadd = duplicateTags(currentTomeList[i].affinities);
                input += bittoadd + ",";
                input = ClearAffinityExtraTags(input);

            }
        }

    }



    // add all extra input tags
    document.getElementById("extraOrder").innerHTML = "<empireorder></empireorder>" + extraOrder;
    document.getElementById("extraChaos").innerHTML = "<empirechaos></empirechaos>" + extraChaos;
    document.getElementById("extraNature").innerHTML = "<empirenature></empirenature>" + extraNature;
    document.getElementById("extraMaterium").innerHTML = "<empirematter></empirematter>" + extraMaterium;
    document.getElementById("extraShadow").innerHTML = "<empireshadow></empireshadow>" + extraShadow;
    document.getElementById("extraAstral").innerHTML = "<empirearcana></empirearcana>" + extraAstral;
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
    const words = input.split(',').map(word => word.trim());

    // Create an object to store word counts
    const wordCounts = {};

    // Count the occurrences of each word
    words.forEach(word => {
        if (wordCounts[word]) {
            wordCounts[word]++;
        } else {
            wordCounts[word] = 1;
        }
    });

    // Sort the words by count in descending order
    const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);

    // Format the result
    var result = sortedWords.map(word => {
        const count = wordCounts[word];

        return ` ${word} ${count}`;
    }).join(', ');

    const affinitySummary = document.getElementById("currentAffinity");

    result = result.replaceAll(",", "");
    currentAffinityTotal = result;

    affinitySummary.innerHTML = result;


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

    // console.log(inputString);

    let result = '';
    let match;

    while ((match = tagPattern.exec(inputString)) !== null) {
        const count = parseInt(match[1]);
        const tagName = match[2];

        // Create a repeated tag string
        const repeatedTags = Array(count).fill(`<${tagName}></${tagName}>`).join(', ');

        // Append the repeated tags to the result
        if (result !== '') {
            result += ', ';
        }
        result += repeatedTags;
    }

    return result;
}



function SetButtonInfo(button, origin, type) {
    const image = document.createElement("img");
    image.setAttribute("width", "40");
    image.setAttribute("height", "40");
    // console.log(origin);

    if (type == "Tome") {
        image.src = "/aow4db/Icons/TomeIcons/" + origin.id + ".png"; // Set the image source to your image file
    }
    else if (type === "FormTrait") {
        image.setAttribute("width", "20");
        image.setAttribute("height", "20");
        if (origin.id.startsWith("_")) {
            var iconLink = origin.id;

            iconLink = iconLink.split('_').slice(1).join('_');
            image.src = "/aow4db/Icons/FactionCreation/" + iconLink + ".png";
        } else {
            image.src = "/aow4db/Icons/FactionCreation/" + origin.id + ".png"; // Set the image source to your image file
        }
    }
    else if (type == "Culture" || type == "Origin" || type == "Society1" || type == "Society2" || type == "Form") {
        if (origin.id.startsWith("_")) {
            var iconLink = origin.id;
            iconLink = iconLink.split('_').slice(1).join('_');
            image.src = "/aow4db/Icons/FactionCreation/" + iconLink + ".png";
        } else {
            image.src = "/aow4db/Icons/FactionCreation/" + origin.id + ".png"; // Set the image source to your image file
        }

    } else if (type == "Loadout") {
        image.src = "/aow4db/Icons/Abilities/" + origin.id + ".png"; // Set the image source to your image file
    } else if (type == "Symbol") {
        if (origin < 10 && origin > 0) {

            origin = "0" + origin.toString();
        }
        if (origin == 0) {
            origin += 138;

        }
        image.src = "/aow4db/Icons/Symbols/SigilIcons_" + origin + ".gif"; // Set the image source to your image file
    }
    if (type != "Symbol") {



        // Create a span element to hold the button text
        const buttonText = document.createElement("span");

        if ('point_cost' in origin && type == "FormTrait") {
            buttonText.innerHTML += origin.point_cost + ": ";
        }

        buttonText.innerHTML += origin.name;
        var affinity = "";
        if ('affinity' in origin) {
            affinity = ClearAffinityExtraTags(origin.affinity);
            affinity = affinity.replaceAll(",", "");
            buttonText.innerHTML += " " + affinity;
        }

        if ('affinities' in origin) {

            affinity = ClearAffinityExtraTags(duplicateTags(origin.affinities));
            affinity = affinity.replaceAll(",", "");
            buttonText.innerHTML += " " + affinity;

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
    spa.className = "tooltiptext";
    spa.setAttribute("style", "margin-left:113px");

    spa.innerHTML = "<p style=\"color: #d7c297;>" + "<span style=\"font-size=20px;\">" + origin.name.toUpperCase() + "</p>";
    if (type == "Origin" || type == "Culture" || type == "Form" || type == "Society1" || type == "Society2") {
        //spa.innerHTML += origin.description;



        if ('effect_descriptions' in origin) {
            spa.innerHTML += "<br><br><span class=\"mod_name\">EFFECTS: </span><bulletlist>";
            var k = "";
            for (k in origin.effect_descriptions) {

                spa.innerHTML += "<bullet>" + origin.effect_descriptions[k].name + "</bullet>";
            }
            spa.innerHTML += "</bulletlist>";
        }

        if ('description' in origin) {

            spa.innerHTML += origin.description;
        }

        if ('starting_bonuses' in origin) {
            spa.innerHTML += "<br><br><span class=\"mod_name\">STARTING BONUS: </span><bulletlist>";
            var k = "";
            for (k in origin.starting_bonuses) {

                if ('structure_upgrade_slug' in origin.starting_bonuses[k]) {
                    spa.innerHTML += "<bullet>" + origin.starting_bonuses[k].structure_upgrade_slug + "</bullet>";
                }
                if ('empire_progression_slug' in origin.starting_bonuses[k]) {
                    spa.innerHTML += "<bullet>" + origin.starting_bonuses[k].empire_progression_slug + "</bullet>";
                }
                if ('description' in origin.starting_bonuses[k]) {
                    spa.innerHTML += "<bullet>" + origin.starting_bonuses[k].description + "</bullet>";
                }

            }
            spa.innerHTML += "</bulletlist>";
        }

        if ('incompatible_society_traits' in origin) {
            spa.innerHTML += "<br><br><span class=\"mod_name\">INCOMPATIBLE WITH: </span><bulletlist>";
            var k = "";
            for (k in origin.incompatible_society_traits) {

                spa.innerHTML += "<bullet>" + origin.incompatible_society_traits[k].name + "</bullet>";
            }
            spa.innerHTML += "</bulletlist>";
        }


    } else if (type == "Tome") {
        SetTomePreview(spa, origin);

    } else if (type == "FormTrait") {
        SetFullPreview(spa, origin);

    }

    button.append(spa);
}

function SetTomePreview(span, origin) {
    span.innerHTML = "<p style=\"color: #d7c297;>" + "<span style=\"font-size=20px;\">" + origin.name.toUpperCase() + "</p>";
    span.innerHTML += origin.gameplay_description;



}



function SetFullPreview(span, origin) {
    span.innerHTML = "<p style=\"color: #d7c297;>" + "<span style=\"font-size=20px;\">" + origin.name.toUpperCase() + "</p>";


    for (i = 0; i < origin.effect_descriptions.length; i++) {
        span.innerHTML += origin.effect_descriptions[i].name;
    }




}

function GetAllStartingTomes() {
    var listOfAllTier1Tomes = new Array();

    for (i = 0; i < jsonTomes.tomes.length; i++) {
        if (jsonTomes.tomes[i].tier == 1) {
            listOfAllTier1Tomes.push(jsonTomes.tomes[i]);
        }
    }
    // alert(listOfAllTier1Tomes);
    return listOfAllTier1Tomes;
}

function GetNextSetOfTomes() {

    var listOfNextTomes = new Array();

    for (i = 0; i < jsonTomes.tomes.length; i++) {
        // all tier 1
        if (jsonTomes.tomes[i].tier == 1) {
            if (!isInArray(currentTomeList, jsonTomes.tomes[i])) {
                listOfNextTomes.push(jsonTomes.tomes[i]);
            }
        }
    }

    if (currentTomeList.length > 1) {
        // allow tier 2 tomes
        for (i = 0; i < jsonTomes.tomes.length; i++) {

            if (jsonTomes.tomes[i].tier == 2) {
                if (!isInArray(currentTomeList, jsonTomes.tomes[i])) {
                    listOfNextTomes.push(jsonTomes.tomes[i]);
                }
            }
        }
    }
    if (currentTomeList.length >= 3) {
        // allow tier 3 tomes
        for (i = 0; i < jsonTomes.tomes.length; i++) {
            if (jsonTomes.tomes[i].tier == 3) {
                // 3 affinity
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes.tomes[i].affinities, 2)) {
                    if (!isInArray(currentTomeList, jsonTomes.tomes[i])) {
                        listOfNextTomes.push(jsonTomes.tomes[i]);
                    }
                }

            }
        }

    }
    if (currentTomeList.length > 5) {
        // allow tier 4 tomes
        for (i = 0; i < jsonTomes.tomes.length; i++) {
            if (jsonTomes.tomes[i].tier == 4) {
                // 6 affinity
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes.tomes[i].affinities, 5)) {
                    if (!isInArray(currentTomeList, jsonTomes.tomes[i])) {
                        listOfNextTomes.push(jsonTomes.tomes[i]);
                    }
                }
            }
        }
    }
    if (currentTomeList.length > 7) {
        // allow tier 5 tomes
        for (i = 0; i < jsonTomes.tomes.length; i++) {
            if (jsonTomes.tomes[i].tier == 5) {
                // 8 affinity
                if (GetAffinityMatches(currentAffinityTotal, jsonTomes.tomes[i].affinities, 7)) {
                    if (!isInArray(currentTomeList, jsonTomes.tomes[i])) {
                        listOfNextTomes.push(jsonTomes.tomes[i]);
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

        numberMatches = new Array();

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
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Ruler Origin") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}

function GetAllCultures() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Culture") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}

function GetAllForms() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Skin") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}

function GetAllFormTraitsList() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation2.traits.length; i++) {
        if (jsonFactionCreation2.traits[i].type == "form") {
            listOfAllOrigins.push(jsonFactionCreation2.traits[i]);
        }
    }
    //console.log(listOfAllOrigins);
    listOfAllOrigins.sort((a, b) => a.point_cost - b.point_cost);

    return listOfAllOrigins;
}

function GetAllSocietyTraits() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation2.traits.length; i++) {
        if (jsonFactionCreation2.traits[i].type == "society") {
            if (jsonFactionCreation2.traits[i].enabled == true) {
                if (jsonFactionCreation2.traits[i].id != "guardians_of_nature__goodact__") {
                    listOfAllOrigins.push(jsonFactionCreation2.traits[i]);
                }

            }
        }
    }
    listOfAllOrigins.sort((a, b) => a.id - b.id);
    return listOfAllOrigins;
}



function GetAllLoadouts() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Loadout") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
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

    }
    // console.log(randomOrigin);
    return randomOrigin;


}

function incompatibleCheck(type, origin) {
    var incompatibleWithSetup = false;
    if ('incompatible' in origin) {

        if (type == "Culture") {

            var i = "";
            for (i in origin.incompatible) {

                if (origin.incompatible[i].name == currentSociety1.name || origin.incompatible[i].name == currentSociety2.name) {
                    incompatibleWithSetup = true;
                }
            }

        }
    }
    if ('incompatible_society_traits' in origin) {
        if (type == "Society1") {

            var i = "";
            for (i in origin.incompatible_society_traits) {
                if (currentSociety2 != "") {
                    if ((origin.incompatible_society_traits[i].name.toLowerCase()).indexOf(currentSociety2.name.toLowerCase()) != -1) {
                        incompatibleWithSetup = true;
                    }
                }


            }


        }
        if (type == "Society2") {
            var i = "";
            for (i in origin.incompatible) {
                if (currentSociety1 != "") {
                    if (origin.incompatible_society_traits[i].name.toLowerCase().indexOf(currentSociety1.name.toLowerCase()) != -1) {
                        incompatibleWithSetup = true;
                    }
                }




            }


        }
    }
    if (currentSociety1.name == origin.name) {

        incompatibleWithSetup = true;

    }
    if (currentSociety2.name == origin.name) {

        incompatibleWithSetup = true;

    }


    if (type == "Loadout") {

        var splitOrigins = origin.requirement.split(",");

        if (splitOrigins.length > 1) {

            var multiSetup = splitOrigins[1].split(":");
            if (!multiSetup.includes(currentCulture.name)) {
                incompatibleWithSetup = true;
            }

            if (splitOrigins[0].indexOf(currentOrigin.name) == -1) {
                // console.log(splitOrigins);
                // console.log(currentCulture.name + " " + splitOrigins[1]);
                incompatibleWithSetup = true;
            }
        } else {
            // console.log(currentOrigin.name + " " + splitOrigins[0]);

            if (splitOrigins[0].indexOf(currentOrigin.name) == -1) {

                incompatibleWithSetup = true;
            }
        }
    }

    return incompatibleWithSetup;
}


function toggleSelection(origin, button) {
    const selectedButtons = document.querySelectorAll('#options-container list-button.selected');
    for (let index = 0; index < selectedButtons.length; index++) {
        selectedButtons[index].classList.remove('selected');

    }






    // Uncomment the line below if you want to limit the selection to a specific number (e.g., 2)
    // updateSelectionLimit(origin);

    updateSelectedOptions(origin);

    if (isInArray(currentFormTraitList, origin)) {
        button.classList.remove('selected');
        button.classList.toggle('selected');
    } else {
        button.classList.remove('selected');
    }

}

function updateSelectedOptions(origin) {
    const selectedOptionsContainer = document.getElementById('selected-options-container');
    const selectedButtons = document.querySelectorAll('#options-container button');



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
    selectedOptionsContainer.innerHTML = '';

    for (let index = 0; index < currentFormTraitList.length; index++) {
        const selectedOption = document.createElement('button');
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


function toggleArrayEntry(array, entry) {
    const index = array.indexOf(entry);

    if (index !== -1) {
        // Entry exists, remove it
        array.splice(index, 1);
    } else {
        // Entry doesn't exist, add it

          if (entry.group_name == "ADAPTATION") {
           var hasAdaptionGroup = currentFormTraitList.some(item => item.group_name === 'ADAPTATION');
           console.log(hasAdaptionGroup);
            if (hasAdaptionGroup) {
                
              
            } else{
                array.push(entry);
            }
            }
            else{
                array.push(entry);
            }
        }
       
}
