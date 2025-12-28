searchParams = new URLSearchParams(window.location.search);
searchKeyword = searchParams.get("u");

var rulerOrigin = "Champion";
var rulerClass = "Warrior";
var rulerSubType = "OrderDragon";
let currentSelectedSkillsArray = [];
var currentsignatureSelectionsArray = [];
var currentSkillPoints = 24;

const exclusionListElementalistDisplines = [5222680233915, 5222680233899, 5222680233884, 5222680233875];
const exclusionListElementalistFinalSkills = [5222680234221, 5222680234241, 5222680234248, 5222680234256];

var signature1 = "";
var signature2 = "";
var signature3 = "";
var signature4 = "";

var listOfWarriorWeaponTypes = ["Great Weapon", "One Handed Weapon", "Shield", "Fist Weapon", "Polearm Weapon"];
var listOfDefenderWeaponTypes = ["One Handed Weapon", "Shield", "Fist Weapon", "Polearm Weapon"];
var listOfMageWeaponTypes = ["Magic Orb Weapon", "Magic Staff Weapon", "Eldritch Relic Weapon"];
var listOfRitualistWeaponTypes = ["Magic Orb Weapon", "Magic Staff Weapon", "Eldritch Relic Weapon"];
var listOfRangerWeaponTypes = ["Ranged Weapon", "Skirmisher Weapon"];

var astralDragon = 4995046967543;
var chaosDragon = 4995046967544;
var materiumDragon = 4995046967545;
var natureDragon = 4995046967546;
var orderDragon = 4995046967547;
var shadowDragon = 4995046967548;

// Function to convert a number to hexadecimal
function decimalToHex(decimal) {
    return decimal.toString(16);
}

// Function to convert a hexadecimal string to a number
function hexToDecimal(hex) {
    return parseInt(hex, 16);
}

function TestLoad(code) {
    LookupCode(code);
}

function LookUpHeroTableData(lookUpId) {
    for (let index = 0; index < jsonBuilderHeroLookUp.length; index++) {
        if (jsonBuilderHeroLookUp[index].resid == lookUpId) {
            return index;
        }
    }
}

function GetQuickLinkHero() {
    var code = "";
    // 0 origin

    // if no formtraits
    if (rulerOrigin == "Dragon" || rulerOrigin == "Giant") {
        code += rulerOrigin + ":" + rulerSubType + ",";
    } else {
        code += rulerOrigin + ",";
    }

    // 1 class

    code += rulerClass + ",";
    //2 skills
    for (let index = 0; index < currentSelectedSkillsArray.length; index++) {
        var number = decimalToHex(LookUpHeroTableData(currentSelectedSkillsArray[index]));
        //console.log(number);
        if (index == 0) {
            code += number;
        } else {
            code += ":" + number;
        }
    }
    code += ",";

    // 3 signatures
    if (signature1 != "") {
        code += decimalToHex(LookUpHeroTableData(signature1));
    }
    if (signature2 != "") {
        code += ":" + decimalToHex(LookUpHeroTableData(signature2));
    }
    if (signature3 != "") {
        code += ":" + decimalToHex(LookUpHeroTableData(signature3));
    }
    if (signature4 != "") {
        code += ":" + decimalToHex(LookUpHeroTableData(signature4));
    }
    code += ",";
    //4 sigskills
    for (let index = 0; index < currentsignatureSelectionsArray.length; index++) {
        let number = decimalToHex(LookUpHeroTableData(currentsignatureSelectionsArray[index]));
        // console.log(currentsignatureSelectionsArray);
        if (index == 0) {
            code += number;
        } else {
            code += ":" + number;
        }
    }
    code += ",";

    //5 build name
    var Bname = document.getElementById("buildNameInput").value;
    Bname = Bname.replaceAll(" ", "%20");
    code += Bname + ",";

    // console.log("hex code: " + code);

    var linkField = document.getElementById("shareLink");

    var currenturl = window.location.href.split("?")[0];

    // window.history.replaceState({}, 'foo', currenturl + "?u=" + code);
    code = code.replaceAll(" ", "%20");
    linkField.value = currenturl + "?u=" + code;
    // var splitCodes = code.split(":");
    // for (let index = 0; index < splitCodes.length; index++) {
    //     console.log("number code: " + hexToDecimal(splitCodes[index]));
    // }

    LookupCode(code);
}

function ResetAll() {
    ResetSkills();

    ResetSignatures();
    currentSkillPoints = 24;
    UpdatePage();

    SetStartingSkillsSelection();
}

function SetStartingSkillsSelection() {
    // set base skills
    console.log(currentSelectedSkillsArray[0]);
    if (currentSelectedSkillsArray[0] == undefined) {
        return;
    }
    let nodeWithId = document.getElementById(currentSelectedSkillsArray[0]);

    let findSkill = ReturnHeroSkillItself(null, currentSelectedSkillsArray[0]);

    toggleNodeSelection(findSkill, nodeWithId, false);
}

function ResetSkills() {
    currentSkillPoints += currentSelectedSkillsArray.length;

    if (rulerOrigin == "Champion") {
        //command

        currentSelectedSkillsArray = [4273492481388];
        currentSkillPoints--;
    } else if (rulerOrigin == "Wizard") {
        // channeling ritual
        currentSelectedSkillsArray = [5111011084976];
        currentSkillPoints--;
    } else if (rulerOrigin == "Dragon") {
        // lesser dragon breath
        currentSelectedSkillsArray = [4273492487240];
        currentSkillPoints--;
    } else if (rulerOrigin == "Eldritch") {
        // enthralling presence
        currentSelectedSkillsArray = [5046586576674];
        currentSkillPoints--;
    } else if (rulerOrigin == "Giant") {
        if (rulerSubType == "GiantFire") {
            // fire summon
            currentSelectedSkillsArray = [5046586578740];
        }
        if (rulerSubType == "GiantFrost") {
            // fire summon
            currentSelectedSkillsArray = [5046586582508];
        }
        if (rulerSubType == "GiantStorm") {
            // fire summon
            currentSelectedSkillsArray = [5046586578726];
        }
        if (rulerSubType == "GiantRock") {
            // fire summon
            currentSelectedSkillsArray = [5046586578733];
        }
        currentSkillPoints--;
    } else if (rulerOrigin == "Vampire") {
        currentSelectedSkillsArray = [];
        // no preset skills
    }
}

function ResetSignatures() {
    currentSkillPoints += currentsignatureSelectionsArray.length;
    currentsignatureSelectionsArray = [];
    signature1 = "";
    signature2 = "";
    signature3 = "";
    signature4 = "";
}

function LookupCode(code) {
    currentSkillPoints = 24;
    code = code.replaceAll("%20", " ");
    var splitcode = code.split(",");
    // console.log("Splitcode" + splitcode);

    // 0 = currentOrigin
    var origin = splitcode[0];
    console.log(origin);
    // check for dragon type
    var originSplitForDragon = origin.split(":");
    if (originSplitForDragon[0] != undefined) {
        // we have a dragon
        rulerOrigin = originSplitForDragon[0];

        if (originSplitForDragon[1] != undefined) {
            // a saved splitorigin
            rulerSubType = originSplitForDragon[1];
            if (rulerOrigin == "Dragon") {
                document.getElementById("actionDropdownOriginDragonHolder").style.display = "block";
                document.getElementById("actionDropdownOriginDragon").value = rulerSubType;
            } else if (rulerOrigin == "Giant") {
                document.getElementById("actionDropdownOriginGiantHolder").style.display = "block";
                document.getElementById("actionDropdownOriginGiant").value = rulerSubType;
            }
        } else {
            if (rulerOrigin == "Dragon") {
                rulerSubType = "OrderDragon";
                document.getElementById("actionDropdownOriginDragonHolder").style.display = "block";
                document.getElementById("actionDropdownOriginDragon").value = rulerSubType;
            } else if (rulerOrigin == "Giant") {
                rulerSubType = "GiantFire";
                document.getElementById("actionDropdownOriginGiantHolder").style.display = "block";
                document.getElementById("actionDropdownOriginGiant").value = rulerSubType;
            }
        }
    } else {
        rulerOrigin = origin;
    }

    var dropdownOrigin = (document.getElementById("actionDropdownOrigin").value = rulerOrigin);

    // 1 = currentClass
    var rclass = splitcode[1];

    rulerClass = rclass;
    var dropdownClass = (document.getElementById("actionDropdownClass").value = rulerClass);

    UpdatePage();

    // 2 = currentskills
    var skills = splitcode[2];

    var skilllist = skills.split(":");

    var newArray = [];

    if (skilllist[0] != "") {
        for (let index = 0; index < skilllist.length; index++) {
            let number = skilllist[index];

            var numbernew = jsonBuilderHeroLookUp[hexToDecimal(number)].resid;
            // console.log(numbernew);
            newArray.push(numbernew);
        }
    }

    // 3 = signatures
    var sigs = splitcode[3];
    // 4 sigs or less
    var signatures = sigs.split(":");
    //  console.log(signatures);

    if (signatures[0] != "") {
        for (let index = 0; index < signatures.length; index++) {
            let number = signatures[index];
            let numbernew = jsonBuilderHeroLookUp[hexToDecimal(number)].resid;

            if (index == 0) {
                signature1 = ReturnHeroSkillItself(null, numbernew).resid;
            } else if (index == 1) {
                signature2 = ReturnHeroSkillItself(null, numbernew).resid;
            } else if (index == 2) {
                signature3 = ReturnHeroSkillItself(null, numbernew).resid;
            } else if (index == 3) {
                signature4 = ReturnHeroSkillItself(null, numbernew).resid;
            }
        }
    }

    // 4 = signatureChoices
    var sigchoises = splitcode[4];
    var skilllistSig = sigchoises.split(":");
    var siggyarray = [];
    //  console.log(skilllistSig);
    if (skilllistSig[0] != "") {
        for (let index = 0; index < skilllistSig.length; index++) {
            let number = skilllistSig[index];
            let numbernew = jsonBuilderHeroLookUp[hexToDecimal(number)].resid;
            siggyarray.push(numbernew);
        }
    }

    //5 = buildname
    var buildName = splitcode[5];

    document.getElementById("buildNameInput").value = buildName;

    UpdatePage();

    for (let i = 0; i < siggyarray.length; i++) {
        let nodeWithId = document.getElementById(siggyarray[i]);

        toggleNodeSelection(ReturnHeroSkillItself(null, siggyarray[i]), nodeWithId, true);
    }

    currentsignatureSelectionsArray = siggyarray;

    for (let i = 0; i < newArray.length; i++) {
        let nodeWithId = document.getElementById(newArray[i]);

        let findSkill = ReturnHeroSkillItself(null, newArray[i]);

        toggleNodeSelection(findSkill, nodeWithId, false);
        // console.log(newArray[0]);
    }

    currentSelectedSkillsArray = newArray;
}

function UpdatePage() {
    var holder = document.getElementById("treeHolder");
    var holder2 = document.getElementById("treeHolderClass");
    var treespace = document.getElementById("treeLineHolder");
    var treespace2 = document.getElementById("treeLineHolderClass");

    holder.innerHTML = "";
    treespace.innerHTML = "";
    holder2.innerHTML = "";
    treespace2.innerHTML = "";
    SetUpTreeNodes(rulerOrigin, rulerSubType, 0, "white", holder, treespace);
    SetUpTreeNodes(rulerClass, null, 0, "white", holder2, treespace2);
    SetUpSignatures(0);
    UpdateSkillPoints();
    // console.log(currentSelectedSkillsArray);

    resizeParentToFitChildren(holder);
    resizeParentToFitChildren(holder2);
    // add a summary
    // CreateSummary();
}

function CreateSummary() {
    var summaryHolder = document.getElementById("summaryHolder");
    summaryHolder.innerHTML = "";

    var activeAbilitiesList = [];
    var passiveAbilitiesList = [];
    var baseStatsList = [];
    // selected skills
    for (let i = 0; i < currentSelectedSkillsArray.length; i++) {
        let listEntry = document.createElement("DIV");
        let thisSkill = ReturnHeroSkillItself(null, currentSelectedSkillsArray[i]);

        if ("abilities" in thisSkill) {
            let ability = ReturnSkillItself(thisSkill.abilities[0].slug);

            if ("range" in ability) {
                // active ability
                // img.setAttribute("height", "65px");
                activeAbilitiesList.push(thisSkill);
            } else {
                // passive
                passiveAbilitiesList.push(thisSkill);
                // img.setAttribute("height", "50px");
            }
        } else {
            baseStatsList.push(thisSkill);
        }
        listEntry.innerHTML = thisSkill.name + "\n" + thisSkill.description;

        // find passives

        //Holder.appendChild(listEntry);
    }

    // signatures
    for (let i = 0; i < currentsignatureSelectionsArray.length; i++) {
        let listEntry = document.createElement("DIV");
        listEntry.innerHTML = ReturnHeroSkillItself(null, currentsignatureSelectionsArray[i]).name;
        //summaryHolder.appendChild(listEntry);
    }
    //  summaryHolder.innerHTML += "Actives: \n";
    SetSummaryAbilities(activeAbilitiesList, summaryHolder);
    //summaryHolder.innerHTML += "Passives: \n";
    SetSummaryAbilities(passiveAbilitiesList, summaryHolder);
    // summaryHolder.innerHTML += "Base Stats: \n";
    SetSummaryBaseStats(baseStatsList, summaryHolder);
    // console.log(activeAbilitiesList);
}

function SetSummaryAbilities(list, holder) {
    for (let i = 0; i < list.length; i++) {
        // let span = document.createElement("div");

        addAbilityslot(list[i].abilities[0].slug, holder, []);
        // console.log(GetSkillData(list[i]));
        //span.innerHTML += GetSkillData(list[i]).innerHTML;
        //holder.appendChild(span);
    }
}

function SetSummaryBaseStats(list, holder) {
    var baseStats = document.createElement("DIV");
    for (let i = 0; i < list.length; i++) {
        baseStats.innerHTML += list[i].description + "<br>";
    }
    // console.log(baseStats.innerHTML);
    baseStats.innerHTML = cleanUpMergeStatsText(baseStats.innerHTML);
    holder.appendChild(baseStats);
}

function cleanUpMergeStatsText(text) {
    // A function to extract the numeric value and base text (removing unnecessary tags)
    function extractNumberAndText(line) {
        // Match the number and the rest of the text, ignoring tags
        const regex = /([+-]?\d+(?:\.\d+)?)(.*?)(<\/.*?>|\n|$)/;
        const match = line.trim().match(regex);

        if (match) {
            // Extract number and remove any unnecessary inner HTML tags for comparison
            const cleanText = match[2].replace(/<\/?[^>]+(>|$)/g, "").trim();
            return { number: parseFloat(match[1]), text: cleanText, originalLine: line };
        }
        return { number: 0, text: line.trim(), originalLine: line };
    }

    // Process the lines
    let lines = text.split("<br>");
    const statsMap = new Map();

    for (let line of lines) {
        const { number, text, originalLine } = extractNumberAndText(line);

        if (statsMap.has(text)) {
            // If the text exists, add the numbers
            statsMap.set(text, { number: statsMap.get(text).number + number, originalLine });
        } else {
            // Otherwise, store the line
            statsMap.set(text, { number, originalLine });
        }
    }

    // Now rebuild the text with summed numbers and preserved structure
    let mergedText = "";
    statsMap.forEach(({ number, originalLine }, key) => {
        if (number !== 0) {
            // Replace the original number in the text with the summed number
            const updatedLine = originalLine.replace(/([+-]?\d+(?:\.\d+)?)/, number);
            mergedText += updatedLine + "<br>";
        } else {
            mergedText += originalLine + "<br>";
        }
    });
    return mergedText;
}
function SetUpSignatures(row) {
    // clear existing

    SetBaseSignatureChoices(200, 100, row, signature1, 1);
    SetBaseSignatureChoices(200, 300, row, signature2, 2);
    SetBaseSignatureChoices(200, 500, row, signature3, 3);
    SetBaseSignatureChoices(200, 700, row, signature4, 4);
}

function resizeParentToFitChildren(parent) {
    const children = Array.from(parent.children); // Get all child elements
    let maxWidth = 0;
    let maxHeight = 0;

    children.forEach((child) => {
        const childRect = child.getBoundingClientRect(); // Get the child's position and size relative to the viewport
        const parentRect = parent.getBoundingClientRect(); // Get the parent's position and size

        // Calculate the child's position relative to the parent
        const childRight = childRect.right - parentRect.left;
        const childBottom = childRect.bottom - parentRect.top;

        maxWidth = Math.max(maxWidth, childRight);
        maxHeight = Math.max(maxHeight, childBottom);
    });

    // Apply the calculated dimensions to the parent
    parent.style.width = maxWidth + "px";
    parent.style.height = maxHeight + "px";
}

function SetBaseSignatureChoices(leftPos, topPost, row, sig, slot) {
    let holder = document.getElementById("treeHolderSignature" + slot);
    let treespace = document.getElementById("treeLineHolderSignature" + slot);
    holder.innerHTML = "";
    treespace.innerHTML = "";

    let skill = ReturnHeroSkillItself(null, sig);
    // console.log("skill " + skill);
    let newNode = document.createElement("DIV");

    // Convert the x and y coordinates to pixel positions
    const leftPosition = leftPos + 5; // x-coordinate scaled to grid size
    const topPosition = topPost; // y-coordinate scaled to grid size

    // Set the style to position the node based on x and y coordinates
    newNode.setAttribute("style", `position: absolute; left: ${leftPosition}px; top: ${topPosition}px;`);

    // Apply the appropriate shape class
    newNode.className = `unittype_ic shape-signature`;

    newNode.setAttribute("id", "Test");

    newNode.addEventListener("click", (event) => ChooseSignatures(slot, newNode, event));
    // add function to choose signature
    //newNode.addEventListener("click", function () {
    //  ChooseSignatures(slot, newNode);
    //});
    // first slot doesnt get a line

    // Set the button functionality
    holder.appendChild(newNode);

    if (slot != 1) {
        BuildLine([leftPos, topPost - 250], newNode, treespace, -15, 0);
    }
    setSignatureSelection(skill, newNode, slot, holder, treespace);
}

function SetSkillData(nodeElement, skill, rulerSubType, choice) {
    nodeElement.innerHTML = "";
    var img = document.createElement("IMG");
    img.className = "empireNodeIcon";
    nodeElement.append(img);

    if (skill == undefined) {
        img.setAttribute("src", "/aow4db/Icons/Interface/skill_unassigned.png");
        img.setAttribute("height", "80px");
        return;
    } else {
        img.setAttribute("src", "/aow4db/Icons/UnitIcons/" + skill.icon + ".png");
    }
    // lookup localized
    var skillLoc = jsonHeroSkillsLocalized.find((entry) => entry.resid === skill.resid);

    if (skill.type == "signature") {
        if (choice != undefined) {
            var name = document.createElement("Div");
            name.innerHTML = skill.name;
            name.className = "list-name";
            nodeElement.append(name);
            nodeElement.className = "list-button";
            img.setAttribute("height", "50px");
        } else {
            img.setAttribute("height", "100px");
        }
    } else if ("abilities" in skill) {
        var skill3 = ReturnSkillItself(skillLoc.abilities[0].slug, rulerSubType);

        if ("range" in skill3) {
            img.setAttribute("height", "65px");
        } else {
            img.setAttribute("height", "50px");
        }
    } else {
        img.setAttribute("height", "50px");
    }

    // add number for order
    var numberHolder = document.createElement("DIV");
    numberHolder.className = "numberOrder";
    nodeElement.appendChild(numberHolder);

    // create description span
    var spa = document.createElement("SPAN");

    spa.innerHTML = '<span style="display:block;color:  #d7c297;">' + skillLoc.name.toUpperCase() + "</span>" + "<br>";

    if ("group_name" in skill) {
        spa.innerHTML += '<span style=" display:block;color:  aliceblue;">' + skillLoc.group_name + "</span>" + "<br>";
    }

    if (skillLoc.description == undefined) {
        spa.innerHTML += GetSkillData(skillLoc, rulerSubType);
    } else {
        var description = skillLoc.description;
        description = description.replaceAll("<bulletlist></bullet>", "<bulletlist>");
        description = description.replaceAll("</bullet></bulletlist>", "</bullet></bullet></bulletlist>");
        description = description.replaceAll("<br></br>", "<br>");
        description = AddTagIconsForStatusEffects(description);
        spa.innerHTML += description + "<br>";
    }

    // newNode.appendChild(spa);
    addTooltipListeners(img, spa);
}

function ChooseSignatures(slot, nodeElement, evt) {
    var listOfSkills = GetAllAvailableSignatureSkills(slot);
    //console.log("skills " + listOfSkills);
    BuildChoicesPanel(listOfSkills, nodeElement, slot, evt);
}

function GetAllAvailableSignatureSkills(slot) {
    const listOfFirstChoice = ["Mindbreaker", "Fleshweaver", "Madcaster"];
    const listOfSecondChoiceMindbreaker = ["Enthraller", "Mind Devourer"];
    const listOfSecondChoiceFleshweaver = ["Puppeteer", "Fleshsculptor"];
    const listOfSecondChoiceMadcaster = ["Cosmic Caster", "Havoc Caster"];
    const dragonBreathIDList = [
        "4273492487959",
        "4273492488409",
        "4273492488425",
        "4273492488436",
        "4273492488449",
        "4273492488460"
    ];
    const GiantFirstRuneList = [
        "Reflecting Rune",
        "Critical Rune",
        "Damage Rune",
        "Vitality Rune",
        "Guard Rune",
        "Dispelling Rune"
    ];

    const GiantSecondRuneList = [
        "Cascading Rune",
        "Fury Rune",
        "Brawn Rune",
        "Life Rune",
        "Safeguard Rune",
        "Disruption Rune"
    ];

    const listOfFirstChoiceVampire = ["Hemomancer", "Nightsworn", "Dreadful", "Desecrator"];

    const listOfSecondChoiceVampire = [
        "Nightlord",
        "Reaper",
        "Vampiric Rage",
        "Profane Body Mastery",
        "Marrow Drinker",
        "Defiler"
    ];
    const listOfThirdChoiceVampire = [
        "Blood Communion",
        "Exsanguinate",
        "Bloodblight",
        "Tormenting Mist",
        "Festering Spine",
        "Gravemarch"
    ];
    const listOfFourthChoiceVampire = ["Supernatural Speed", "Rosebound Noble", "Curse to Undeath"];

    var listOfSkills = [];
    for (var s = 0; s < jsonHeroSkills.length; s++) {
        if (jsonHeroSkills[s].type == "signature") {
            if ((rulerOrigin == "Champion" || rulerOrigin == "Wizard") && jsonHeroSkills[s].DLC == undefined) {
                if (slot === 1 && jsonHeroSkills[s].name.indexOf("Initiate") != -1) {
                    listOfSkills.push(jsonHeroSkills[s]);
                }

                if (
                    slot === 2 &&
                    (jsonHeroSkills[s].name.indexOf("Initiate") != -1 || jsonHeroSkills[s].name.indexOf("Adept") != -1)
                ) {
                    if (jsonHeroSkills[s].resid != signature1) {
                        listOfSkills.push(jsonHeroSkills[s]);
                    }
                }
                if (
                    slot === 3 &&
                    (jsonHeroSkills[s].name.indexOf("Initiate") != -1 ||
                        jsonHeroSkills[s].name.indexOf("Adept") != -1 ||
                        jsonHeroSkills[s].name.indexOf("Master") != -1)
                ) {
                    if (jsonHeroSkills[s].resid != signature1 && jsonHeroSkills[s].resid != signature2) {
                        listOfSkills.push(jsonHeroSkills[s]);
                    }
                }
                if (
                    slot === 4 &&
                    (jsonHeroSkills[s].name.indexOf("Initiate") != -1 ||
                        jsonHeroSkills[s].name.indexOf("Adept") != -1 ||
                        jsonHeroSkills[s].name.indexOf("Master") != -1 ||
                        jsonHeroSkills[s].name.indexOf("Paragon") != -1)
                ) {
                    if (
                        jsonHeroSkills[s].resid != signature1 &&
                        jsonHeroSkills[s].resid != signature2 &&
                        jsonHeroSkills[s].resid != signature3
                    ) {
                        listOfSkills.push(jsonHeroSkills[s]);
                    }
                }
            } else if (rulerOrigin == "Dragon") {
                if (jsonHeroSkills[s].DLC == "DRAGONLORDS ") {
                    // first slot : aspect
                    if (slot === 1 && jsonHeroSkills[s].name.indexOf("Aspect") != -1) {
                        // check required

                        listOfSkills.push(jsonHeroSkills[s]);
                    }
                    // second slot : transfomration
                    if (
                        slot === 2 &&
                        (jsonHeroSkills[s].name.indexOf("Transformation") != -1 ||
                            jsonHeroSkills[s].name.indexOf("Primal") != -1)
                    ) {
                        if (jsonHeroSkills[s].name.indexOf("Primal") != -1) {
                            if (jsonHeroSkills[s].required_skills[0].resid === lookupDragonAffinity(rulerSubType)) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        } else {
                            listOfSkills.push(jsonHeroSkills[s]);
                        }
                    }
                    // third slot : breath
                    if (slot === 3 && jsonHeroSkills[s].name.indexOf("breath") != -1) {
                        if (jsonHeroSkills[s].required_skills[0].resid === lookupDragonAffinity(rulerSubType)) {
                            listOfSkills.push(jsonHeroSkills[s]);
                        }
                    }
                    // fourth slot: elder
                    if (slot === 4 && jsonHeroSkills[s].name.indexOf("Elder") != -1) {
                        listOfSkills.push(jsonHeroSkills[s]);
                    }
                }
            } else if (rulerOrigin == "Eldritch") {
                if ("DLC" in jsonHeroSkills[s]) {
                    if (jsonHeroSkills[s].DLC.indexOf("ELDRITCHREALMS") != -1) {
                        if (slot == 1) {
                            if (listOfFirstChoice.includes(jsonHeroSkills[s].name)) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        } else if (slot == 2) {
                            if (jsonHeroSkills[s].name.indexOf("Forgotten Tome") != -1) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        } else if (slot == 3) {
                            // fleshweaver
                            if (signature1 == "5046586575299") {
                                if (listOfSecondChoiceFleshweaver.includes(jsonHeroSkills[s].name)) {
                                    listOfSkills.push(jsonHeroSkills[s]);
                                }
                            }
                            // madcaster
                            if (signature1 == "5046586575303") {
                                if (listOfSecondChoiceMadcaster.includes(jsonHeroSkills[s].name)) {
                                    listOfSkills.push(jsonHeroSkills[s]);
                                }
                            }
                            // mindbreaker
                            if (signature1 == "5046586575294") {
                                if (listOfSecondChoiceMindbreaker.includes(jsonHeroSkills[s].name)) {
                                    listOfSkills.push(jsonHeroSkills[s]);
                                }
                            }
                        } else if (slot == 4) {
                            if (jsonHeroSkills[s].name.indexOf("Forgotten Tome") != -1) {
                                if (signature2 != jsonHeroSkills[s].resid) {
                                    listOfSkills.push(jsonHeroSkills[s]);
                                }
                            }
                        }

                        // forgotten tome
                    }
                }
            } else if (rulerOrigin.indexOf("Giant") != -1) {
                // one of the giants
                if ("DLC" in jsonHeroSkills[s]) {
                    if (jsonHeroSkills[s].DLC.indexOf("GIANTKINGS") != -1) {
                        if (slot == 1) {
                            if (
                                GiantFirstRuneList.includes(jsonHeroSkills[s].name) &&
                                jsonHeroSkills[s].id.indexOf("1") != -1
                            ) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        }
                        if (slot == 2) {
                            if (
                                GiantSecondRuneList.includes(jsonHeroSkills[s].name) &&
                                jsonHeroSkills[s].id.indexOf("2") != -1
                            ) {
                                // check type
                                if (jsonHeroSkills[s].name == "Cascading Rune") {
                                    let listTocheck = ["fire", "frost", "storm", "rock"];
                                    for (let k = 0; k < listTocheck.length; k++) {
                                        if (
                                            rulerSubType.toLowerCase().indexOf(listTocheck[k]) != -1 &&
                                            jsonHeroSkills[s].id.indexOf(listTocheck[k]) != -1
                                        ) {
                                            listOfSkills.push(jsonHeroSkills[s]);
                                        }
                                    }
                                } else {
                                    listOfSkills.push(jsonHeroSkills[s]);
                                }
                            }
                        }
                        if (slot == 3) {
                            if (
                                GiantFirstRuneList.includes(jsonHeroSkills[s].name) &&
                                jsonHeroSkills[s].id.indexOf("3") != -1
                            ) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        }
                        if (slot == 4) {
                            if (jsonHeroSkills[s].name.indexOf("Grand ") != -1) {
                                if (jsonHeroSkills[s].name == "Grand Cascading Rune") {
                                    let listTocheck = ["fire", "frost", "storm", "rock"];
                                    for (let k = 0; k < listTocheck.length; k++) {
                                        if (
                                            rulerSubType.toLowerCase().indexOf(listTocheck[k]) != -1 &&
                                            jsonHeroSkills[s].id.indexOf(listTocheck[k]) != -1
                                        ) {
                                            listOfSkills.push(jsonHeroSkills[s]);
                                        }
                                    }
                                } else {
                                    listOfSkills.push(jsonHeroSkills[s]);
                                }
                            }
                        }

                        // forgotten tome
                    }
                }
            } else if (rulerOrigin == "Vampire") {
                if ("DLC" in jsonHeroSkills[s]) {
                    if (jsonHeroSkills[s].DLC.indexOf("THRONESOFBLOOD") != -1) {
                        if (slot == 1) {
                            if (listOfFirstChoiceVampire.includes(jsonHeroSkills[s].name)) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        } else if (slot == 2) {
                            if (listOfSecondChoiceVampire.includes(jsonHeroSkills[s].name)) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        } else if (slot == 3) {
                            // fleshweaver
                            if (listOfThirdChoiceVampire.includes(jsonHeroSkills[s].name)) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        } else if (slot == 4) {
                            if ("required_skills" in jsonHeroSkills[s]) {
                                for (let j = 0; j < jsonHeroSkills[s].required_skills.length; j++) {
                                    //     console.log(type);
                                    if (
                                        jsonHeroSkills[s].required_skills[j].resid == signature3 &&
                                        jsonHeroSkills[s].type == "signature"
                                    ) {
                                        listOfSkills.push(jsonHeroSkills[s]);
                                    }
                                }
                            }

                            // generic skills
                            if (listOfFourthChoiceVampire.includes(jsonHeroSkills[s].name)) {
                                listOfSkills.push(jsonHeroSkills[s]);
                            }
                        }

                        // forgotten tome
                    }
                }
            }
        }
    }

    return listOfSkills;
}
function lookupDragonAffinity(type) {
    if (type == "AstralDragon") {
        return astralDragon;
    } else if (type == "OrderDragon") {
        return orderDragon;
    } else if (type == "ChaosDragon") {
        return chaosDragon;
    } else if (type == "NatureDragon") {
        return natureDragon;
    } else if (type == "MateriumDragon") {
        return materiumDragon;
    } else if (type == "ShadowDragon") {
        return shadowDragon;
    }
}

function BuildChoicesPanel(choiceslist, originButton, slot, evt) {
    const selectionsHolder = document.getElementById("selectionsHolder");
    selectionsHolder.style.display = "block";

    const panel = document.getElementById("choicesPanel");
    panel.innerHTML = "";

    choiceslist.forEach((choice) => {
        const choiceNode = document.createElement("BUTTON");
        const thisSkill = ReturnHeroSkillItself(null, choice.resid);

        choiceNode.innerHTML = thisSkill.name;
        SetSkillData(choiceNode, thisSkill, undefined, choice);

        choiceNode.addEventListener("click", () => {
            ClearAndSetSignature(thisSkill, originButton, slot);
        });

        panel.appendChild(choiceNode);
    });

    // Defer positioning until after the layout is calculated
    requestAnimationFrame(() => {
        const normalizedPos = getNormalizedPosition(evt);

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
    });
}

function ClearAndSetSignature(chosenSkill, origin, slot) {
    if (slot == 1) {
        signature1 = chosenSkill.resid;

        SetBaseSignatureChoices(200, 100, 0, signature1, 1);
    } else if (slot == 2) {
        signature2 = chosenSkill.resid;

        SetBaseSignatureChoices(200, 300, 0, signature2, 2);
    } else if (slot == 3) {
        signature3 = chosenSkill.resid;

        SetBaseSignatureChoices(200, 500, 0, signature3, 3);
    } else if (slot == 4) {
        signature4 = chosenSkill.resid;
        SetBaseSignatureChoices(200, 700, 0, signature4, 4);
        //  console.log("signature4 " + signature4 + " " + chosenSkill.resid + " " + slot);
    }
}

function closePanel() {
    var selectionsHolder = document.getElementById("selectionsHolder");
    selectionsHolder.setAttribute("style", "display:none");
    //  var originWrapper = document.getElementById("originWrapperOptions");
    //originWrapper.innerHTML = "";
    // originWrapper.setAttribute("style", "display:none");
    var selectionsText = document.getElementById("selections");
    selectionsText.textContent = "";
}

function setSignatureSelection(chosenSkill, origin, slot, holder, treespace) {
    closePanel();
    var listOfFirstChoice = ["Mindbreaker", "Fleshweaver", "Madcaster"];

    SetSkillData(origin, chosenSkill);

    if (chosenSkill == undefined) {
        return;
    }
    if (slot == 1) {
        signature1 = chosenSkill.resid;
    } else if (slot == 2) {
        signature2 = chosenSkill.resid;
    } else if (slot == 3) {
        signature3 = chosenSkill.resid;
    } else if (slot == 4) {
        signature4 = chosenSkill.resid;
        //  console.log("signature4 " + signature4 + " " + chosenSkill.resid + " " + slot);
    }
    // rebuild the 2 choices in there
    var skills = GetSignatureSkillUnlocks(chosenSkill);

    let skill1 = skills[0];
    let skill2 = skills[1];
    var row = 0;

    var extraOffset = [100, -150];
    extraOffset[1] = extraOffset[1] + slot * 200;
    var extraOffset2 = [100, -60];
    extraOffset2[1] = extraOffset2[1] + slot * 200;

    if (skills[0] != undefined) {
        BuildLine(extraOffset, origin, treespace, 0, -12);
        BuildSkillTreeEntry(skill1, row, holder, treespace, extraOffset);
    }
    if (skills[1] != undefined) {
        BuildLine(extraOffset2, origin, treespace, 0, -10);

        BuildSkillTreeEntry(skill2, row, holder, treespace, extraOffset2);
    }
}

function GetSignatureSkillUnlocks(currentSig) {
    var unlockedSigs = [];
    for (let i = 0; i < jsonHeroSkills.length; i++) {
        // hardcode some of these because theyre not hooked up properly
        // mind devourer - ancient one not exported
        // ev ancient one not exported
        // mind devourer || roseblood noble || bloodsomething
        if (
            currentSig.resid == 5046586575333 ||
            currentSig.resid == 5046586586510 ||
            currentSig.resid == 5046586586483
        ) {
            // ancient one : +30% damage +20 hp, same as ancient of earth but different name

            if (jsonHeroSkills[i].resid == 4514010632504) {
                // modify ancient of earth
                let skill = jsonHeroSkills[i];
                console.log(skill);
                 const dropdownOrigin = document.getElementById("actionDropdownOrigin");
                // change name to Ancient One
                if (dropdownOrigin.value == "Eldritch" || dropdownOrigin.value == "Vampire") {
                    // console.log("here");
                    skill.name = "Ancient One";
                }

                unlockedSigs.push(skill);
            }
        }
        // grand brawn rune - ancient of earth
        if (currentSig.resid == 5046586579058) {
            if (jsonHeroSkills[i].resid == 4514010632504) {
                unlockedSigs.push(jsonHeroSkills[i]);
            }
        }
        if ("required_skills" in jsonHeroSkills[i]) {
            for (let j = 0; j < jsonHeroSkills[i].required_skills.length; j++) {
                if (
                    jsonHeroSkills[i].required_skills[j].resid == currentSig.resid &&
                    jsonHeroSkills[i].type != "signature"
                ) {
                    unlockedSigs.push(jsonHeroSkills[i]);
                }
            }
        }
    }
    return unlockedSigs;
}

function BuildLine(offset, targetnode, treespace, extraOffsetLeft, extraOffsetTop) {
    // signature skil lines
    let connectionLine = document.createElement("DIV");

    var leftPosition = targetnode.offsetLeft + extraOffsetLeft; // Element's left position relative to the nearest positioned ancestor
    var topPosition = targetnode.offsetTop + extraOffsetTop;
    // Calculate the difference in x and y positions between the target and current node
    var dx = offset[0] - leftPosition; // Switched to work backwards
    var dy = offset[1] - topPosition;

    // Calculate the angle between the current node and the target node
    var angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Calculate the position of the line
    var leftpos = 50 + leftPosition; // Position starts from the prerequisite node
    var toppos = 50 + topPosition;
    color = "white";

    // Calculate the length of the line
    var lineLength = Math.sqrt(dx * dx + dy * dy); // Dynamic length based on distance

    connectionLine.setAttribute(
        "style",
        `position: absolute; top: ${toppos}px; left: ${leftpos}px; width: ${lineLength}px; transform: rotate(${angle}deg); background-color: ${color};`
    );

    // Set class and data attributes for the line
    connectionLine.className = "branch-line";
    //  connectionLine.dataset.source = targetNode.resid.toString(); // Source is the prerequisite
    // connectionLine.dataset.target = targetnode.resid.toString(); // Target is the current skill

    // Append the connection line to the tree space
    treespace.appendChild(connectionLine);
}

function SetUpTreeNodes(keyword, subtype, row, color, holder, treespace) {
    let overrideKeyword = keyword;
    for (var s = 0; s < jsonHeroSkills.length; s++) {
        let currentSkill = jsonHeroSkills[s];
        // Check if the current skill is of the right class
        if ("tree_name" in currentSkill) {
            // check type

            // manually add in the 2 mission giant kings parts
            if (keyword == "Giant") {
                if (currentSkill.resid == 5046586578724 || currentSkill.resid == 5046586579832) {
                    BuildSkillTreeEntry(currentSkill, row, holder, treespace);
                }
            }

            if (subtype == "GiantFrost") {
                overrideKeyword = "Kings - Frost";
            }
            if (subtype == "GiantStorm") {
                overrideKeyword = "Kings - Storm";
            }
            if (subtype == "GiantFire") {
                overrideKeyword = "Kings - Fire";
            }
            if (subtype == "GiantRock") {
                overrideKeyword = "Kings - Rock";
            }

            if (currentSkill.tree_name.indexOf(overrideKeyword) != -1) {
                if (currentSkill.id.indexOf("unlinked") == -1) {
                    BuildSkillTreeEntry(currentSkill, row, holder, treespace, undefined, subtype);
                }
            } else {
                if ("group_name" in currentSkill) {
                    if (currentSkill.group_name.indexOf(overrideKeyword) != -1) {
                        if (currentSkill.id.indexOf("unlinked") == -1) {
                            BuildSkillTreeEntry(currentSkill, row, holder, treespace, undefined, subtype);
                        }
                    }
                }
            }
        }
    }
}

function BuildSkillTreeEntry(currentSkill, row, holder, treespace, extraOffset, rulerSubType) {
    // var currentSkillLoc = json;
    var nodeHeight = 50;

    var left = 1;
    var top = 1;

    let name = currentSkill.id;
    let form = currentSkill.form || "circle"; // Default to shield if no form is specified

    // Adjust the form based on the description

    // get skill data, if its got a range its an active ability and needs diamond
    let overwriteIcon = "";
    let abilityIconType = "";

    let leftPosition = currentSkill.tree_pos_x + row * 200; // x-coordinate scaled to grid size
    let topPosition = currentSkill.tree_pos_y; // y-coordinate scaled to grid size
    // add custom offset for signatures
    if (extraOffset != undefined) {
        leftPosition = extraOffset[0] + row * 200; // x-coordinate scaled to grid size
        topPosition = extraOffset[1]; // y-coordinate scaled to grid size
    }

    if ("abilities" in currentSkill) {
        let skill = ReturnSkillItself(currentSkill.abilities[0].slug, rulerSubType);
        // console.log(skill.damage);

        if ("range" in skill) {
            form = "diamond";

            overwriteIcon = skill.icon;
            abilityIconType = "";
            topPosition -= 10;
            leftPosition -= 5;
            //  abilityIconType = GetAbilityBackground(skill.damage);
        } else {
            form = "square";
            topPosition += 5;
            leftPosition += 10;
        }
    }

    if (
        currentSkill.name.indexOf("Defense") != -1 ||
        currentSkill.name.indexOf("Vigor") != -1 ||
        currentSkill.name.indexOf("Resistance") != -1
    ) {
        form = "shield";
    }

    let newNode = document.createElement("DIV");

    // Convert the x and y coordinates to pixel positions

    // Set the style to position the node based on x and y coordinates
    newNode.setAttribute("style", `position: absolute; left: ${leftPosition}px; top: ${topPosition}px;`);

    // Apply the appropriate shape class
    newNode.className = `unittype_ic shape-${form}`;

    if (abilityIconType != "") {
        newNode.style.backgroundImage = "url('/aow4db/Icons/Interface/" + abilityIconType + ".png";
    }

    SetSkillData(newNode, currentSkill, rulerSubType);

    newNode.setAttribute("id", currentSkill.resid);

    holder.appendChild(newNode);

    let isSig = false;

    if (currentSkill.group_name == "Affinity Hero Skill Group") {
        isSig = true;
    }

    // Add event listener for node selection
    newNode.addEventListener("click", function () {
        toggleNodeSelection(currentSkill, newNode, isSig);
    });

    if (!("required_skills" in currentSkill)) {
        newNode.classList.add("selectable");
    }

    // Create connection lines for each linkto
    if ("required_skills" in currentSkill) {
        currentSkill.required_skills.forEach((link) => {
            // Find the prerequisite node based on the name
            let targetNode = jsonHeroSkills.find((node) => node.resid === link.resid);
            // elementalist skills withering blizzard and the other elemental end points, incorrect lines
            // discipline lines to exclude array

            if (targetNode) {
                if (
                    exclusionListElementalistDisplines.includes(targetNode.resid) &&
                    exclusionListElementalistFinalSkills.includes(currentSkill.resid)
                ) {
                    targetNode = null;
                    console.log("here");
                    return;
                }
                let connectionLine = document.createElement("DIV");
                var extra = row * 200;
                // Calculate the difference in x and y positions between the target and current node
                var dx = currentSkill.tree_pos_x + extra - (targetNode.tree_pos_x + extra); // Switched to work backwards
                var dy = currentSkill.tree_pos_y - targetNode.tree_pos_y;

                // Calculate the angle between the current node and the target node
                var angle = Math.atan2(dy, dx) * (180 / Math.PI);

                // Calculate the position of the line
                var leftpos = 50 + (targetNode.tree_pos_x + extra); // Position starts from the prerequisite node
                var toppos = 50 + targetNode.tree_pos_y;
                color = "black";

                // Calculate the length of the line
                var lineLength = Math.sqrt(dx * dx + dy * dy); // Dynamic length based on distance

                if (targetNode.tree_pos_y != undefined) {
                    connectionLine.setAttribute(
                        "style",
                        `position: absolute; top: ${toppos}px; left: ${leftpos}px; width: ${lineLength}px; transform: rotate(${angle}deg); background-color: ${color};`
                    );

                    // Set class and data attributes for the line
                    connectionLine.className = "branch-line";
                    connectionLine.dataset.source = targetNode.resid.toString(); // Source is the prerequisite
                    connectionLine.dataset.target = currentSkill.resid.toString(); // Target is the current skill

                    // Append the connection line to the tree space
                    treespace.appendChild(connectionLine);
                }
                return;
            } else {
                console.log("missing Node here for: " + currentSkill.name + " node missing for : " + link.name);
            }
        });
    }

    if ("excluded_skills" in currentSkill) {
        currentSkill.excluded_skills.forEach((link) => {
            // Find the prerequisite node based on the name
            var targetNode = jsonHeroSkills.find((node) => node.resid === link.resid);

            if (targetNode) {
                var connectionLine = document.createElement("DIV");
                var extra = row * 200;
                // Calculate the difference in x and y positions between the target and current node
                var dx = currentSkill.tree_pos_x + extra - (targetNode.tree_pos_x + extra); // Switched to work backwards
                var dy = currentSkill.tree_pos_y - targetNode.tree_pos_y;

                // Calculate the angle between the current node and the target node
                var angle = Math.atan2(dy, dx) * (180 / Math.PI);

                // Calculate the position of the line
                var leftpos = 50 + (targetNode.tree_pos_x + extra); // Position starts from the prerequisite node
                var toppos = 50 + targetNode.tree_pos_y;

                color = "blue";

                // Calculate the length of the line
                var lineLength = Math.sqrt(dx * dx + dy * dy); // Dynamic length based on distance

                connectionLine.setAttribute(
                    "style",
                    `position: absolute; top: ${toppos}px; left: ${leftpos}px; width: ${lineLength}px; transform: rotate(${angle}deg);`
                );

                // Set class and data attributes for the line
                connectionLine.className = "dotted-line";
                connectionLine.dataset.source = targetNode.resid.toString(); // Source is the prerequisite
                connectionLine.dataset.target = currentSkill.resid.toString(); // Target is the current skill

                // Append the connection line to the tree space
                treespace.appendChild(connectionLine);
                return;
            }
        });
    }
}

function toggleNodeSelection(nodeData, nodeElement, isSig) {
    // `nodeData` is the data object for the skill
    // `nodeElement` is the HTML element representing the skill
    //
    //
    //
    //

    //console.log("toggling" + nodeData.id);

    // Check if the node is already active
    const isActive = nodeElement.classList.contains("activated");
    // console.log(nodeData);
    // If the node is not active, activate it
    if (!isActive) {
        // Check if its blue or if its got no skills required and theres enough points left
        if (
            currentSkillPoints > 0 &&
            (!("required_skills" in nodeData) ||
                nodeElement.classList.contains("selectable") ||
                nodeData.group_name == "Affinity Hero Skill Group")
        ) {
            // also check if excluded_skills isnt in there
            if ("excluded_skills" in nodeData) {
                for (let i = 0; i < nodeData.excluded_skills.length; i++) {
                    const requiredNodeElement = document.getElementById(nodeData.excluded_skills[i].resid);
                    if (requiredNodeElement.classList.contains("activated")) {
                        // console.log("excluded");
                        return;
                    }
                }
            }

            activateNode(nodeElement, nodeData, isSig);

            // Check other nodes to see if they require this skill
            jsonHeroSkills.forEach((otherNode) => {
                // Skip the current node itself
                if (otherNode.resid !== nodeData.resid) {
                    if (
                        otherNode.required_skills &&
                        otherNode.required_skills.some((req) => String(req.resid) === String(nodeData.resid))
                    ) {
                        // Get the corresponding DOM element for this other node
                        const relatedNode = document.getElementById(otherNode.resid);
                        if (relatedNode) {
                            // check if its not the special elementalist nodes
                            //
                            if (
                                exclusionListElementalistDisplines.includes(nodeData.resid) &&
                                exclusionListElementalistFinalSkills.includes(otherNode.resid)
                            ) {
                                console.log("found special");
                                return;
                            }
                            // check if final skills have the right node 5222680234186 = elemental mastery
                            const elemental_Mastery = 5222680234186;
                            if (
                                nodeData.resid == elemental_Mastery &&
                                exclusionListElementalistFinalSkills.includes(otherNode.resid)
                            ) {
                                console.log("found special");
                                // get the required node data

                                const secondRelatedNode = document.getElementById(otherNode.required_skills[1].resid);
                                if (!secondRelatedNode.classList.contains("activated")) {
                                    return;
                                }
                            }
                            //
                            // chec kif its not already activated
                            if (!relatedNode.classList.contains("activated")) {
                                // Change the color of the related node to blue
                                relatedNode.classList.remove("activated");
                                relatedNode.classList.add("selectable");
                            }
                        }
                    }
                }
            });
        }
    } else {
        let allowedToDisable = true;
        // check if any below the node have been activated
        jsonHeroSkills.forEach((otherNode) => {
            // Skip the current node itself
            if (otherNode.resid !== nodeData.resid) {
                if (
                    otherNode.required_skills &&
                    otherNode.required_skills.some((req) => String(req.resid) === String(nodeData.resid))
                ) {
                    // Get the corresponding DOM element for this other node
                    const relatedNode = document.getElementById(otherNode.resid);

                    if (relatedNode) {
                        if (relatedNode.classList.contains("activated")) {
                            // console.log("found existing activated node " + otherNode.id);
                            allowedToDisable = false;
                            return;
                        }
                    }
                }
            }
        });
        if (allowedToDisable) {
            // dont turn off skill if its the starting ones
            if (
                nodeData.resid == 4273492481388 ||
                nodeData.resid == 5111011084976 ||
                nodeData.resid == 4273492487240 ||
                nodeData.resid == 5046586576674 ||
                // giant skills
                nodeData.resid == 5046586578740 ||
                nodeData.resid == 5046586582508 ||
                nodeData.resid == 5046586578726 ||
                nodeData.resid == 5046586578733
            ) {
                return;
            }
            deactivateNode(nodeElement, nodeData, isSig);
        }
    }
    // CreateSummary();
}

function UpdateSkillPoints() {
    var skillPointDiv = document.getElementById("currentSkillPoints");
    skillPointDiv.innerHTML = currentSkillPoints.toString();

    // var selectedSkillsDiv = document.getElementById("selectedSkills");
    //selectedSkillsDiv.innerHTML = currentSelectedSkillsArray.toString();
}

function activateNode(newNode3, nodeData, isSig) {
    // Activate the node
    newNode3.classList.remove("selectable");
    newNode3.classList.add("activated");

    //  newNode3.style.backgroundColor = "green"; // Active color

    // Revert the connection lines color
    document.querySelectorAll(`.branch-line`).forEach((line) => {
        if (line.dataset.source === nodeData.resid.toString()) {
            line.style.backgroundColor = "white"; // Revert line color
        } else if (line.dataset.target === nodeData.resid.toString()) {
            let targetS = document.getElementById(line.dataset.source);
            //console.log(line.dataset.target);
            if (targetS != undefined) {
                if (targetS.classList.contains("activated")) {
                    line.style.backgroundColor = "green"; // Revert line color
                }
            }
        }
    });
    let idNumber = nodeData.resid;
    currentSkillPoints--;
    if (isSig == true) {
        // console.log("here sig");
        currentsignatureSelectionsArray.push(idNumber);
    } else {
        currentSelectedSkillsArray.push(idNumber);
    }

    UpdateSkillPoints();
    //  console.log("Activated this: " + newNode3.id);

    // block the excluded skill visually
    if ("excluded_skills" in nodeData) {
        nodeData.excluded_skills.forEach((skill) => {
            const requiredNodeElement = document.getElementById(skill.resid);
            requiredNodeElement.classList.add("blocked");

            document.querySelectorAll(".dotted-line").forEach((line) => {
                if (
                    line.dataset.source === nodeData.resid.toString() ||
                    line.dataset.target === nodeData.resid.toString()
                ) {
                    line.style.backgroundColor = "red";
                }
            });
        });
    }
}

function deactivateNode(newNode, nodeData, isSig) {
    // Deactivate the node
    currentSkillPoints++;
    if (isSig == true) {
        currentsignatureSelectionsArray = currentsignatureSelectionsArray.filter((item) => item !== nodeData.resid);
    } else {
        currentSelectedSkillsArray = currentSelectedSkillsArray.filter((item) => item !== nodeData.resid);
    }

    UpdateSkillPoints();
    newNode.classList.remove("activated");
    newNode.classList.remove("selectable");

    // if the required skills are still there, turn it blue again
    if ("required_skills" in nodeData) {
        for (let i = 0; i < nodeData.required_skills.length; i++) {
            const requiredNodeElement = document.getElementById(nodeData.required_skills[i].resid);
            if (requiredNodeElement != undefined) {
                newNode.classList.remove("activated");
                newNode.classList.remove("blocked");
                newNode.classList.add("selectable"); // still blue
            }
        }
    } else {
        newNode.classList.add("selectable"); // still blue
    }

    // Find all nodes that list this node in their required_skills
    jsonHeroSkills.forEach((otherNode) => {
        if (otherNode.required_skills && otherNode.required_skills.some((req) => req.resid === nodeData.resid)) {
            // Check if any of the required skills for this node are still active
            const anyRequiredActive = otherNode.required_skills.some((req) => {
                let requiredNodeElement = document.getElementById(req.resid);
                return requiredNodeElement && requiredNodeElement.classList.contains("activated");
            });

            // If none of the required skills are active, reset the color
            if (!anyRequiredActive) {
                const relatedNode = document.getElementById(otherNode.resid);
                if (relatedNode) {
                    relatedNode.classList.remove("selectable");
                    relatedNode.classList.remove("activated");
                    relatedNode.classList.remove("blocked");
                    // relatedNode.style.backgroundColor = ""; // Reset to default color
                }
            }
        }

        if ("excluded_skills" in otherNode) {
            if (otherNode.excluded_skills && otherNode.excluded_skills.some((req) => req.resid === nodeData.resid)) {
                const anyRequiredActive = otherNode.excluded_skills.some((req) => {
                    let requiredNodeElement = document.getElementById(otherNode.resid);
                    requiredNodeElement.classList.remove("blocked");

                    // Revert the connection lines color
                    document.querySelectorAll(`.dotted-line`).forEach((line) => {
                        if (line.dataset.source === otherNode.resid.toString()) {
                            line.style.removeProperty("background-color"); // Revert line color
                        }
                        if (line.dataset.source === nodeData.resid.toString()) {
                            line.style.removeProperty("background-color"); // Revert line color
                        }
                    });
                });
            }
        }

        // Revert the connection lines color
        document.querySelectorAll(`.branch-line`).forEach((line) => {
            if (line.dataset.source === nodeData.resid.toString()) {
                line.style.backgroundColor = "black"; // Revert line color
            }
        });
    });
}

function ReturnSkillItself(lookup, subTypeOverride) {
    for (let j in jsonUnitAbilitiesLocalized) {
        if (jsonUnitAbilitiesLocalized[j].slug === lookup) {
            let originalSkill = jsonUnitAbilitiesLocalized[j];
            let skill = {
                ...originalSkill,
                modifiers: originalSkill.modifiers ? originalSkill.modifiers.map((mod) => ({ ...mod })) : undefined
            };
            const eldritchAncientOne = ["0000041b0000113a"];
            const dropdownOrigin = document.getElementById("actionDropdownOrigin");
            //console.log(dropdownOrigin.value);
            if (
                eldritchAncientOne.includes(skill.slug) &&
                (dropdownOrigin.value == "Eldritch" || dropdownOrigin.value == "Vampire")
            ) {
                // console.log("here");
                skill.name = "Ancient One";
                skill.description =
                    skill.description.split("</bullet>")[1] + "</bullet>" + skill.description.split("</bullet>")[2];
                skill.description = skill.description.replace("+30", "+20");
            }
            if (
                eldritchAncientOne.includes(skill.slug) &&
                (dropdownOrigin.value == "Dragon" || dropdownOrigin.value == "Giant")
            ) {
                skill.description = skill.description.replace("+30", "+20");
            }

            if (subTypeOverride !== undefined) {
                // Shallow clone of skill — safe for top-level edits
                //let skill = { ...originalSkill };

                const dragonBreath = [
                    "limited_breath_ability_000003BD00002895",
                    "cone_breath_ability_000003BD00002895",
                    "line_breath_ability_000003BD00002895",
                    "comet_breath_ability_000003BD00002895"
                ];

                //   console.log(skill.name);

                if (dragonBreath.includes(skill.slug)) {
                    switch (subTypeOverride) {
                        case "AstralDragon":
                            skill.damage = skill.damage.replaceAll("physical", "lightning");
                            skill.modifiers[0].name = skill.modifiers[0].name.replaceAll("Bleeding", "Electrified");
                            skill.modifiers[0].description = skill.modifiers[0].description.replaceAll(
                                "Bleeding",
                                "Electrified"
                            );
                            break;
                        case "OrderDragon":
                            skill.damage = skill.damage.replaceAll("physical", "spirit");
                            skill.modifiers[0].name = skill.modifiers[0].name.replaceAll("Bleeding", "Distracted");
                            skill.modifiers[0].description = skill.modifiers[0].description.replaceAll(
                                "Bleeding",
                                "Distracted"
                            );
                            break;
                        case "ChaosDragon":
                            skill.damage = skill.damage.replaceAll("physical", "fire");
                            skill.modifiers[0].name = skill.modifiers[0].name.replaceAll("Bleeding", "Burning");
                            skill.modifiers[0].description = skill.modifiers[0].description.replaceAll(
                                "Bleeding",
                                "Burning"
                            );
                            break;
                        case "ShadowDragon":
                            skill.damage = skill.damage.replaceAll("physical", "frost");
                            skill.modifiers[0].name = skill.modifiers[0].name.replaceAll("Bleeding", "Slowed");
                            skill.modifiers[0].description = skill.modifiers[0].description.replaceAll(
                                "Bleeding",
                                "Slowed"
                            );
                            break;
                        case "NatureDragon":
                            skill.damage = skill.damage.replaceAll("physical", "blight");
                            skill.modifiers[0].name = skill.modifiers[0].name.replaceAll("Bleeding", "Poisoned");
                            skill.modifiers[0].description = skill.modifiers[0].description.replaceAll(
                                "Bleeding",
                                "Poisoned"
                            );
                            break;
                    }
                }

                return skill; // ✅ Return modified copy
            }

            return skill; // No subtype override, return original
        }
    }
}

function TestSignatureUnlocksRandom(id) {
    var list = [];
    for (let j = 0; j < jsonHeroSkills.length; j++) {
        if (jsonHeroSkills[j].group_name == "Affinity Hero Skill Group") {
            list.push(jsonHeroSkills[j]);
        }
    }
    return list[id];
}

function ReturnHeroSkillItself(lookup, resid) {
    for (let j = 0; j < jsonHeroSkills.length; j++) {
        if (lookup != null) {
            if (jsonHeroSkills[j].id == lookup) {
                return jsonHeroSkills[j];
            }
        }

        if (resid != undefined) {
            if (jsonHeroSkills[j].resid === resid) {
                return jsonHeroSkills[j];
            }
        }
    }
}

function GetSkillData(a, subtype) {
    var spa = "";
    if ("abilities" in a) {
        var l = 0;

        for (l in a.abilities) {
            let lookup = a.abilities[l].slug;
            let thisSkill = ReturnSkillItself(lookup, subtype);
            let abilityName = thisSkill.name;

            //   description = jsonUnit[j].description;
            spa += GetAbilityInfo(thisSkill).innerHTML + "<br>";
        }
    }
    return spa;
}
