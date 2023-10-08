 function showDiv(name) {
     x = document.getElementsByClassName("typeHolder");
     for (i = 0; i < x.length; i++) {
         x[i].style.display = "none";
     }
     if (name === "faction") {
         var visible = document.getElementById("factioncreator");
         visible.style.display = "block";
         // show faction
     } else if (name === "tome") {
         var visible = document.getElementById("tomepath");
         visible.style.display = "block";
         // show tome path
     }
 }
 var currentOrigin = "";
 var currentTome = "";

 var currentForm = "";
 var currentBody = "";
 var currentMind = "";
 var currentCulture = "";
 var currentSociety1 = "";
 var currentSociety2 = "";
 var currentLoadout = "";

 var currentAffinityTotal = "";

 var currentTomeList = new Array();

 function ChangeShieldCol() {

     var shieldElement = document.getElementById("shield");
     degrees = Math.random() * 360;
     shieldElement.setAttribute("style", "filter: hue-rotate(" + degrees + "deg)");
 }

 function ChangeSymbolCol() {

     var symbolElement = document.getElementById("symbol");
     degrees = Math.random() * 360;
     symbolElement.setAttribute("style", "filter: hue-rotate(" + degrees + "deg)")
 }

 function GetRandomSymbol() {
     var symbolElement = document.getElementById("symbol");
     var numb = Math.floor(Math.random() * 138);
     if (numb < 10 && numb > 0) {

         numb = "0" + numb.toString();
     }
     if (numb == 0) {
         numb += 1;
         numb = "0" + numb.toString();
     }
     symbolElement.setAttribute("src", "/aow4db/Icons/Symbols/SigilIcons_" + numb + ".gif");

 }



 function SetRandomStart() {

     GetRandomSymbol();
     ChangeShieldCol();
     ChangeSymbolCol();

     var listofChoice = new Array();
     listofChoice.push("Tome");
     listofChoice.push("Origin");

     listofChoice.push("Form");
     listofChoice.push("Body");
     listofChoice.push("Mind");
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
             case "Body":
                 currentBody = randomEntry;
                 break;
             case "Mind":
                 currentMind = randomEntry;
                 break;
             case "Culture":
                 currentCulture = randomEntry;
                 break;
                 f
             case "Society1":
                 currentSociety1 = randomEntry;
                 break;
             case "Society2":
                 currentSociety2 = randomEntry;
                 break;
             case "Loadout":
                 currentLoadout = randomEntry;
                 break;
         }



         var originButton2 = document.getElementById("originButton" + currentChoice);
         originButton2.innerHTML = "";

         SetButtonInfo(originButton2, randomEntry, currentChoice);

     }
     RecalculateStats();

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
     originButton.textContent = "";

     SetButtonInfo(originButton, origin, type);


     // assign current selection
     switch (type) {
         case "Tome":

             currentTome = origin;
             break;
         case "Origin":

             currentOrigin = origin;
             if (incompatibleCheck("Loadout", currentLoadout)) {
                 var loadoutButton = document.getElementById("originButtonLoadout");
                 loadoutButton.innerHTML += "<span style=\"color:red\"> Incompatible </span>";
             }
             break;

         case "Body":

             currentBody = origin;
             break;
         case "Culture":

             currentCulture = origin;
             break;
         case "Form":

             currentForm = origin;
             break;
         case "Mind":
             currentMind = origin;
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

     console.log("Clicked");
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
     //originButton.textContent = "";

     SetTomePathInfo(originButton, origin);


     currentTomeList.push(origin);
     RecalculateStats();
     // swap current known origin

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



     newDivButton.append(spa);
 }


 function SetupButtons(type) {

     var originWrapper = document.getElementById("originWrapperOptions");
     originWrapper.innerHTML = "";
     var originButton = document.getElementById("originButton" + type);
     console.log(type);
     var list = new Array();

     // assign current selection
     switch (type) {
         case "Tome":

             list = GetAllStartingTomes();

             break;
         case "Origin":
             list = GetAllOrigins();

             break;

         case "Body":
             list = GetAllBodyTraits();

             break;
         case "Culture":
             list = GetAllCultures();

             break;
         case "Form":
             list = GetAllForms();

             break;
         case "Mind":
             list = GetAllMindTraits();

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
         if (type == "Symbol") {
             const originButtonNew = document.createElement("button");
             originButtonNew.addEventListener("click", () => SelectSymbol(origin));
             originButtonNew.className = "list-button-small";
             originWrapper.appendChild(originButtonNew);
             SetButtonInfo(originButtonNew, origin, type);

         } else {
             if (!incompatibleCheck(type, origin)) {
                 const originButtonNew = document.createElement("button");
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

     listOfAllChoices.push(currentOrigin);
     //  listOfAllChoices.push(currentTome);

     listOfAllChoices.push(currentForm);
     listOfAllChoices.push(currentBody);
     listOfAllChoices.push(currentMind);
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
                 var bittoadd = duplicateTags(list[i].affinities);
                 input += bittoadd + ",";
                 input = ClearAffinityExtraTags(input);

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
     input = input.slice(0, -1);


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
     const affinitySummary2 = document.getElementById("currentAffinity2");

     result = result.replaceAll(",", "");
     currentAffinityTotal = result;

     affinitySummary.innerHTML = result;
     affinitySummary2.innerHTML = result;

 }

 function ClearAffinityExtraTags(input) {
     input = input.replace(" Empire Astral Affinity", "");
     input = input.replace(" Empire Nature Affinity", "");
     input = input.replace(" Empire Order Affinity", "");
     input = input.replace(" Empire Materium Affinity", "");
     input = input.replace(" Empire Chaos Affinity", "");
     input = input.replace(" Empire Shadow Affinity", "");
     return input;
 }



 function duplicateTags(inputString) {
     const tagPattern = /(\d+)\s+<([^>]+)>/g;

     // Find all matches of the pattern
     const matches = inputString.matchAll(tagPattern);

     let result = '';

     for (const match of matches) {
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

     if (type == "Tome") {
         image.src = "/aow4db/Icons/TomeIcons/" + origin.id + ".png"; // Set the image source to your image file
     } else if (type == "Culture" || type == "Origin" || type == "Body" || type == "Mind" || type == "Society1" || type == "Society2" || type == "Form") {
         image.src = "/aow4db/Icons/FactionCreation/" + origin.id + ".png"; // Set the image source to your image file
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

         buttonText.innerHTML = origin.name;
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
     if (type == "Origin" || type == "Culture" || type == "Form" || type == "Society1" || type == "Society2" || type == "Mind" || type == "Body") {
         spa.innerHTML += origin.description;
     } else if (type == "Tome") {
         SetTomePreview(spa, origin);

     }

     button.append(spa);
 }

 function SetTomePreview(span, origin) {
     span.innerHTML = "<p style=\"color: #d7c297;>" + "<span style=\"font-size=20px;\">" + origin.name.toUpperCase() + "</p>";
     span.innerHTML += origin.gameplay_description;



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
     if (currentTomeList.length > 3) {
         // allow tier 3 tomes
         for (i = 0; i < jsonTomes.tomes.length; i++) {
             if (jsonTomes.tomes[i].tier == 3) {
                 // 3 affinity
                 if (GetAffinityMatches(currentAffinityTotal, jsonTomes.tomes[i].affinities, 3)) {
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
                 if (GetAffinityMatches(currentAffinityTotal, jsonTomes.tomes[i].affinities, 6)) {
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
                 if (GetAffinityMatches(currentAffinityTotal, jsonTomes.tomes[i].affinities, 8)) {
                     if (!isInArray(currentTomeList, jsonTomes.tomes[i])) {
                         listOfNextTomes.push(jsonTomes.tomes[i]);
                     }
                 }
             }
         }
     }


     console.log(listOfNextTomes);
     return listOfNextTomes;
 }


 function GetAffinityMatches(inputString, substringToCount, number) {
     // if not mixed affinity
     var moreThanNumber = false;
     if (substringToCount.indexOf("2") != -1) {
         var empireType = substringToCount.split(" ")[1];

         inputString = inputString.replaceAll("  ", " ");
         console.log(empireType + " input :" + inputString);

         // Use a regular expression to find the tag and extract the number
         const match = inputString.match(new RegExp(`${empireType}\\s*(\\d+)`));

         // Extract the number from the match result
         const numberMatch = match ? parseInt(match[1]) : null;
         // Use a regular expression to find all occurrences of the substring


         // Check if the number of occurrences is greater than 4
         moreThanNumber = numberMatch > number;
     } else {
         moreThanNumber = true;
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

     return listOfAllOrigins;
 }

 function GetAllCultures() {
     var listOfAllOrigins = new Array();

     for (i = 0; i < jsonFactionCreation.traits.length; i++) {
         if (jsonFactionCreation.traits[i].type == "Culture") {
             listOfAllOrigins.push(jsonFactionCreation.traits[i]);
         }
     }

     return listOfAllOrigins;
 }

 function GetAllForms() {
     var listOfAllOrigins = new Array();

     for (i = 0; i < jsonFactionCreation.traits.length; i++) {
         if (jsonFactionCreation.traits[i].type == "Form") {
             listOfAllOrigins.push(jsonFactionCreation.traits[i]);
         }
     }

     return listOfAllOrigins;
 }

 function GetAllMindTraits() {
     var listOfAllOrigins = new Array();

     for (i = 0; i < jsonFactionCreation.traits.length; i++) {
         if (jsonFactionCreation.traits[i].type == "Mind Trait") {
             listOfAllOrigins.push(jsonFactionCreation.traits[i]);
         }
     }

     return listOfAllOrigins;
 }

 function GetAllSocietyTraits() {
     var listOfAllOrigins = new Array();

     for (i = 0; i < jsonFactionCreation.traits.length; i++) {
         if (jsonFactionCreation.traits[i].type == "Society Trait") {
             listOfAllOrigins.push(jsonFactionCreation.traits[i]);
         }
     }

     return listOfAllOrigins;
 }

 function GetAllBodyTraits() {
     var listOfAllOrigins = new Array();

     for (i = 0; i < jsonFactionCreation.traits.length; i++) {
         if (jsonFactionCreation.traits[i].type == "Body Trait") {
             listOfAllOrigins.push(jsonFactionCreation.traits[i]);
         }
     }

     return listOfAllOrigins;
 }

 function GetAllLoadouts() {
     var listOfAllOrigins = new Array();

     for (i = 0; i < jsonFactionCreation.traits.length; i++) {
         if (jsonFactionCreation.traits[i].type == "Loadout") {
             listOfAllOrigins.push(jsonFactionCreation.traits[i]);
         }
     }

     return listOfAllOrigins;
 }

 function GetRandomEntry(type) {
     const originButton = document.getElementById("originButton" + type);
     const originWrapper = document.getElementById("originWrapper" + type);

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
         case "Body":
             var list = GetAllBodyTraits();
             randomOrigin = list[Math.floor(Math.random() * list.length)];
             break;
         case "Mind":
             var list = GetAllMindTraits();
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
         if (type == "Society1") {

             var i = "";
             for (i in origin.incompatible) {
                 if (currentSociety2 != "") {
                     if (currentSociety2.name.indexOf(origin.incompatible[i].name) != -1) {
                         incompatibleWithSetup = true;
                     }
                 }
                 if (currentCulture != "") {
                     if (currentCulture.name.indexOf(origin.incompatible[i].name) != -1) {
                         incompatibleWithSetup = true;
                     }
                 }

             }
             if (currentSociety2.name == origin.name) {

                 incompatibleWithSetup = true;

             }

         }
         if (type == "Society2") {
             var i = "";
             for (i in origin.incompatible) {
                 if (currentSociety1 != "") {
                     if (currentSociety1.name.indexOf(origin.incompatible[i].name) != -1) {
                         incompatibleWithSetup = true;
                     }
                 }
                 if (currentCulture != "") {
                     if (currentCulture.name.indexOf(origin.incompatible[i].name) != -1) {
                         incompatibleWithSetup = true;
                     }
                 }



             }
             if (currentSociety1.name == origin.name) {

                 incompatibleWithSetup = true;

             }

         }
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
