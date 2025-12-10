searchParams = new URLSearchParams(window.location.search);
let sorting = searchParams.get("sort");
let currentView = "";

const checkboxTooltip = document.getElementById("tooltipCheckbox");
const checkboxNumbers = document.getElementById("numbersCheckbox");
const showBetaTooltip = document.getElementById("showBetaCheckbox");
const languageSelect = document.getElementById("languageSelect");

function highlightNumbersInDiv(text) {
    if (!text) return;

    text = text.replace(
        /(?<!\d)([+-]?\d+(?:\.\d+)?%?|%\d+(?:\.\d+)?)(?!-)/g,
        '<span class="number-highlight">[$1]</span>'
    );
    return text;
}

// cache maps so we don't rebuild every time
let abilityTagCache = null;

function buildAbilityTagCache() {
    abilityTagCache = new Map();

    const underline = '<span style="color:white; text-decoration:underline">';
    const endtag = "</span>";

    for (const ability of jsonUnitAbilitiesLocalized) {
        if (ability.slug === "0000041b000013b4") continue; // skip that one

        const abilityName = ability.name.split("^")[0];
        if (!abilityName || abilityName.includes("%") || abilityName.includes("+")) continue;

        // build the replacement string once
        const tag = abilityName.replaceAll(" ", "_").toLowerCase();
        const tooltipspan = `<span class="statusEffectHandler">${abilityName}</span>`;
        const replacement = `${underline}<${tag}></${tag}>${tooltipspan}${endtag}`;

        abilityTagCache.set(abilityName, replacement);
    }
}

// main function
function AddTagIconsForStatusEffects(text) {
    if (!text) return text;
    text = cleanTranslation(text);
    if (!abilityTagCache) buildAbilityTagCache();

    // simple replace loop — only checks keys that actually exist
    for (const [abilityName, replacement] of abilityTagCache.entries()) {
        if (text.includes(abilityName)) {
            let pattern = new RegExp(`\\b${abilityName}\\b`);
            text = text.replace(pattern, replacement);
        }
    }

    if (getUserSettings().isolateNumber) {
        text = highlightNumbersInDiv(text);
    }
    
      text = text.replaceAll("<bulletlist></bullet>", "<bulletlist>");
      
        text = text.replaceAll("</bullet></bulletlist>", "</bullet></bullet></bulletlist>");
        text = text.replaceAll("<br></br>", "<br>");

    return text;
}

/*function AddTagIconsForStatusEffects(name) {
    // if(name == "")
    let underline = '<span style="color:white; text-decoration:underline">';
    let endtag = "</span>";
    
   
    
    
    for (let i = 0; i < jsonUnitAbilitiesLocalized.length; i++) {
        const abilityName = jsonUnitAbilitiesLocalized[i].name.split("^")[0];

        if (
            name.includes(abilityName) &&
            jsonUnitAbilitiesLocalized[i].slug !== "0000041b000013b4" // skip that specific one
        ) {
            let tooltipspan = document.createElement("span");
            tooltipspan.className = "statusEffectHandler";
            let tag = jsonUnitAbilities[i].name.replaceAll(" ", "_").toLowerCase();
            tooltipspan.innerHTML = abilityName;

            // Use a regex with word boundaries to avoid partial matches (optional)
            if (abilityName.indexOf("%") == -1 && abilityName.indexOf("+") == -1) {
                let pattern = new RegExp(`\\b${abilityName}\\b`);
                name = name.replace(pattern, `${underline}<${tag}></${tag}>${tooltipspan.outerHTML}${endtag}`);
            }
        }
    }

    // also check for numbers isolate settings

    if (getUserSettings().isolateNumber) {
        name = highlightNumbersInDiv(name);
    }

    return name;
}*/

function lookupStatusEffect(name) {
    const effect = findBy(jsonUnitAbilitiesLocalized, "name", name);
    if (!effect) return name;
    return createStatusEffectTooltip(effect, "status");
}

function createStatusEffectTooltip(effectData, handlerType = "status") {
    const span = document.createElement("span");
    span.className = "statusEffectHandler";
    // span.innerHTML = maybeHighlight(effectData.description);

    let effect = effectData.name;

    // let tag = jsonUnitAbilitiesLocalized[i].description;
    let tag = maybeHighlight(effectData.description);

    let image = document.createElement("IMG");
    image.setAttribute("src", "/aow4db/Icons/UnitIcons/" + effectData.icon + ".png");
    image.setAttribute("width", "30");
    image.setAttribute("height", "30");

    tag.replaceAll("<br><br>", "<br>");

    let effectplusColor = '<span style="color:white; text-decoration:underline">' + effect + "</span>";

    span.innerHTML = effect.replace(effect, image.outerHTML + effectplusColor + "<br>" + tag);
    // addTooltipListeners(span, name.description, handlerType);
    return span.outerHTML;
}

function HandleExtraTooltips(specificDiv) {
    // Add event listeners after elements exist in the DOM
    if (specificDiv != undefined) {
        specificDiv.querySelectorAll(".statusEffectHandler").forEach((el) => {
            let spantest = document.createElement("span");
            spantest.innerHTML = lookupStatusEffect(el.innerText);
            addTooltipListeners(el, spantest, "something");
        });
    } else {
        document.querySelectorAll(".statusEffectHandler").forEach((el) => {
            let spantest = document.createElement("span");
            spantest.innerHTML = lookupStatusEffect(el.innerText);
            addTooltipListeners(el, spantest, "something");
        });
    }
}

function GetUnitTierAndName(id, subcultureCheck) {
    for (let i = 0; i < jsonUnits.length; i++) {
        let unit = jsonUnits[i];

        // Check if the ID matches
        if (id !== unit.id) {
            continue;
        }
        // Skip deprecated units
        if (depCheckResID(unit.resid) == true) {
            continue;
        }

        // Check if subculture matches if provided,
        if (subcultureCheck !== undefined && "sub_culture_name" in unit && unit.sub_culture_name !== subcultureCheck) {
            continue;
        }
        let unitLoc = jsonUnitsLocalized.find((entry) => entry.resid === unit.resid);
        // Prepare the unit's name
        let name = unitLoc.name;

        // Add mount special tags if applicable
        if (MountedSpecialList.includes(id) || CheckIfOptionalCavalry(id)) {
            name += " <mountSpecial></mountSpecial>";
        }

        // Add subculture tags if available
        if ("sub_culture_name" in unit) {
            let subculture = unit.sub_culture_name.toLowerCase().replaceAll(" ", "_");
            name += `<${subculture}></${subculture}>`;
        }

        // Return the formatted name and tier
        return `
            <p style="width: 160px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-transform: none;">
                ${getUnitTypeTag(unit.secondary_passives)} ${name}
            </p>
            <p style="text-align: right; color: white; top: -16px; position: relative;">
                ${romanize(unit.tier)}
            </p>`;
    }
}

function CheckIfFormUnit(unit) {
    if (MountedSpecialList.includes(unit.id) || extraFormUnitsList.includes(unit.id) || "culture_name" in unit) {
        if (unit.id !== "observer" && unit.id != "magelock_cannon") {
            return true;
        }
    } else {
        return false;
    }
}

function GetTomeTierAndNameTome(id) {
    let tome = findBy(jsonTomes, "id", id);
    let tomeLoc = findBy(jsonTomesLocalized, "resid", tome.resid);
    if (tome != undefined) {
        return romanize(tome.tier) + " - " + tomeLoc.name;
    } else {
        console.log("couldn't find tome " + id);
        return null;
    }
}

function ShowUnitFromLink() {
    let unitID = searchParams.get("unit");
    document.title = "Age of Wonders 4 Database - " + GetUnitTierAndName(unitID).split(">")[2];
    showUnitFromString(unitID, "dataHolder");
}

function ShowSpellFromLink() {
    const paramMap = [
        {
            key: "skill",
            title: "Hero Skill",
            action: showHeroSkillFromString
        },
        {
            key: "spell",
            title: (id) => findBy(jsonSpells, "id", id)?.name ?? "Spell",
            action: showSpellFromString
        },
        {
            key: "siege",
            title: "Siege Project",
            action: showSiegeProjectFromString
        },
        {
            key: "governance",
            title: "Governance",
            action: showHeroGovernanceFromString
        },
        {
            key: "wonder",
            title: "Wonder",
            action: showWorldStructureFromString
        },
        {
            key: "tome",
            title: "Tome",
            action: showTomeFromString
        },
        {
            key: "structure",
            title: "Structure",
            action: showStructureFromString
        }
    ];

    for (const { key, title, action } of paramMap) {
        const id = searchParams.get(key);
        if (id) {
            const titleText = typeof title === "function" ? title(id) : title;
            document.title = `Age of Wonders 4 Database - ${titleText}`;
            action(id, "dataHolder");
            return;
        }
    }
}

function getUnitTypeTag(passivesList) {
    // Mapping slugs to their corresponding HTML tags
    const slugToTag = {
        "000003e300004ea6": "<unitFighter></unitFighter>",
        "000003bd000028b7": "<unitShock></unitShock>",
        "000003e600000492": "<unitSkirmisher></unitSkirmisher>",
        "000003bd000020c0": "<unitSupport></unitSupport>",
        "000003fe00000060": "<unitScout></unitScout>",
        "0000039f000016f1": "<unitRanged></unitRanged>",
        "000003e300004c86": "<unitBattlemage></unitBattlemage>",
        "0000039f000016f2": "<unitPolearm></unitPolearm>",
        "0000039f000016f0": "<unitShield></unitShield>",
        "0000041b00001910": "<unitTower></unitTower>",
        "000003fe00000020": "<unitSiegecraft></unitSiegecraft>",
        "000003e300004e9f": "<unitMythic></unitMythic>",
        "000003ec000021b1": "<unitCivilian></unitCivilian>"
    };

    // Loop through the passives list and return the appropriate tag
    for (let i = 0; i < passivesList.length; i++) {
        const tag = slugToTag[passivesList[i].slug];
        if (tag) {
            return tag; // Return the tag if found
        }
    }

    // Return an empty string if no matching tag is found
    return "";
}

function AddListView(list, parent) {
    // add list view first
    if (parent != undefined) {
        // but only if its a non-tiered one, if tiered only do the first one
        if (parent.indexOf("Tier") != -1) {
            // tiered
            if (parent.indexOf("Tier I ") != -1) {
                // do nothing;
                console.log("parent has tier1");
            } else {
                console.log("parent has no tier1");
                return;
            }
        }
    }
    let buttonHolder;
    if (parent === undefined) {
        buttonHolder = document.getElementById("buttonHolder");
    } else {
        buttonHolder = document.getElementById(parent);
    }
    let btn = document.createElement("BUTTON");

    btn.className = "w3-bar-item w3-button tablink";
    btn.type = "button";
    btn.innerHTML = "&#9776";
    btn.setAttribute("onclick", 'openDiv(event, "' + list + '")');

    let firstChild = buttonHolder.firstChild;
    buttonHolder.insertBefore(btn, firstChild);
}

function SetButtonsAndDivs(list, parent, cardType, otherParent, subcultureCheck) {
    AddListView(list, parent);
    //console.log(list);
    let buttonHolder;
    let subcultureCheck2;

    for (let i = 0; i < list.length; i++) {
        subcultureCheck2 = subcultureCheck;
        if (list[i].includes(",")) {
            let test = list[i].split(",");

            subcultureCheck2 = test[1];
            list[i] = test[0];
        }
        if (parent === undefined) {
            buttonHolder = document.getElementById("buttonHolder");
        } else {
            buttonHolder = document.getElementById(parent);
        }
        let dataHolder;
        if (otherParent === undefined) {
            dataHolder = document.getElementById("dataHolder");
        } else {
            dataHolder = document.getElementById(otherParent);
        }
        let div = document.createElement("DIV");
        div.className = "w3-container w3-border city";
        if (subcultureCheck2 == undefined) {
            div.setAttribute("id", list[i]);
        } else {
            div.setAttribute("id", list[i] + subcultureCheck2);
        }
        dataHolder.appendChild(div);

        let btn = document.createElement("BUTTON");
        btn.className = "w3-bar-item w3-button tablink";
        btn.type = "button";
        if (subcultureCheck2 == undefined) {
            btn.setAttribute("id", list[i] + "-button");
        } else {
            btn.setAttribute("id", list[i] + subcultureCheck2 + "-button");
        }

        switch (cardType) {
            case "unitTomeIcon":
                let splitIcon = list[i].split(":");
                div.setAttribute("id", splitIcon[0]);
                btn.setAttribute("id", splitIcon[0] + "-button");
                btn.innerHTML =
                    '<img style="float:left;" src="/aow4db/Icons/TomeIcons/' +
                    splitIcon[1] +
                    ".png\" width='25px'\">" +
                    GetUnitTierAndName(splitIcon[0]);
                AddTriangleForDLCUnits("Unit", splitIcon[0], btn);
                showUnitFromString(splitIcon[0], splitIcon[0]);
                btn.setAttribute("onclick", "openDiv(event,'" + splitIcon[0] + "')");
                break;
            case "unit":
                if (subcultureCheck2 == undefined) {
                    showUnitFromString(list[i], list[i]);
                    btn.innerHTML = GetUnitTierAndName(list[i]);
                    btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "',)");
                } else {
                    showUnitFromString(list[i], list[i] + subcultureCheck2, subcultureCheck2);
                    btn.innerHTML = GetUnitTierAndName(list[i], subcultureCheck2);
                    btn.setAttribute("onclick", "openDiv(event,'" + list[i] + subcultureCheck2 + "',)");
                }

                break;
            case "subcultureUnit":
                showUnitFromString(list[i], list[i]);
                btn.innerHTML = GetUnitTierAndName(list[i]);
                btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "',)");
                break;
            case "tome":
                showTomeFromList2(list[i], list[i]);
                btn.innerHTML = GetTomeTierAndNameTome(list[i]);
                btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "',)");
                break;
            case "searchUnit":
                if (subcultureCheck2 != undefined) {
                    // div.setAttribute("id", list[i] + subcultureCheck);
                    //ignore if architect cause its not true subcultures

                    showUnitFromString(list[i], list[i] + subcultureCheck2, subcultureCheck2);
                    btn.innerHTML = GetUnitTierAndName(list[i], subcultureCheck2);
                    btn.setAttribute("onclick", "openDiv(event,'" + list[i] + subcultureCheck2 + "',true)");
                } else {
                    //  div.setAttribute("id", list[i]);
                    showUnitFromString(list[i], list[i]);
                    btn.innerHTML = GetUnitTierAndName(list[i]);
                    btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "',true)");
                }

                div.setAttribute("style", "margin-left:200px");

                break;
            case "searchSpell":
                showSpellFromString(list[i], list[i]);
                btn.innerHTML = findBy(jsonSpells, "id", list[i]).name;
                btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "')");

                break;
        }

        buttonHolder.appendChild(btn);

        AddTriangleForDLCUnits(cardType, list[i], btn);
        let holderHeight = buttonHolder.offsetHeight;
        dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px; margin-left:200px");
    }
}

function AddTriangleForDLCUnits(type, string, div) {
    let DLCCheck = CheckForDLCContent(type, string);
    //console.log(DLCCheck);
    if (DLCCheck != null) {
        let triangle = document.createElement("DIV");
        triangle.className = DLCCheck.replace(" ", "") + "triangle";
        div.appendChild(triangle);
    }
}

function CheckForDLCContent(type, string) {
    let unit;
    if (type.toLowerCase().indexOf("unit") != -1) {
        unit = findBy(jsonUnits, "id", string);
    }
    if (type.toLowerCase() == "tome") {
        unit = findBy(jsonTomes, "id", string);
    }

    if (unit != undefined && "DLC" in unit) {
        return unit.DLC;
    }
    return null;
}

function SetCollapsibleButtonsAndDivs(overwrite, list, cardType) {
    let modName,
        description,
        cost,
        type,
        tier,
        i,
        nameString = "";
    let buttonHolder = document.getElementById("buttonHolder");
    let btn = document.createElement("BUTTON");
    btn.type = "button";

    btn.innerHTML = overwrite + " (" + list.length + ")";
    if (cardType != "unit" && cardType.indexOf("search") === -1) {
        btn.setAttribute("onclick", "openDiv(event,'" + overwrite + "')");
        btn.setAttribute("id", overwrite + "-button");
    } else if (cardType.indexOf("search") != -1) {
        btn.setAttribute("onclick", "openDiv(event,'" + overwrite + "',true)");
        btn.setAttribute("id", overwrite + "-button");
    }

    buttonHolder.appendChild(btn);
    let dataHolder;
    let holderHeight = buttonHolder.offsetHeight;
    if (cardType != "unit" && cardType != "searchUnit") {
        btn.className = "w3-bar-item w3-button tablink";
        dataHolder = document.getElementById("dataHolder");
        holderHeight = buttonHolder.offsetHeight;

        dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");

        let div = document.createElement("DIV");

        div.className = "w3-container w3-border city";
        div.setAttribute("id", overwrite);
        if (overwrite == "Spells" || overwrite == "Siege Projects") {
            div.setAttribute("style", "margin-left: 250px;");
        }

        dataHolder.appendChild(div);
    }

    switch (cardType) {
        case "spell":
            showSpellFromList(list, overwrite);
            break;
        case "heroTrait":
            showHeroTraitFromList(list, overwrite);
            break;
        case "heroGov":
            showHeroGovFromList(list, overwrite);
            break;
        case "skill":
            showSkillFromList(list, overwrite);
            break;
        case "item":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showItemFromList(list, overwrite);
            break;
        case "trait":
            showTraitFromList(list, overwrite);
            break;
        case "searchSkill":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showSkillFromList(list, overwrite);
            break;
        case "searchItem":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showItemFromList(list, overwrite);
            break;
        case "searchSiege":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showSiegeProjects(list, overwrite);
            break;
        case "searchEmpire":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showEmpireTrees(list, overwrite);
            break;
        case "searchTraits":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showTraitFromList(list, overwrite);
            break;
        case "searchAmbition":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");

            showHeroTraitFromList(list, overwrite);
            break;
        case "searchDestiny":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showDestinyTraitsFromList(list, overwrite);
            break;
        case "searchStruct":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showStructures(list, overwrite);
            break;
        case "searchWorldStruct":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showWorldStructures(list, overwrite);
            break;
        case "searchSpell":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");

            showSpellFromList(list, overwrite);
            break;
        case "tome":
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showTomeFromList2(list, overwrite);
            break;

        case "unit":
            btn.className = "collapsibleUnits";
            let content = document.createElement("DIV");
            content.setAttribute("id", overwrite + "-button");
            content.className = "contentUnits";
            buttonHolder.append(content);
            break;
    }
}

async function openDiv(evt, cityName, search) {
    if (cityName != undefined) {
        currentView = cityName;
    }

    let i, x, tablinks;
    x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    closeTabLinks(cityName);

    if (evt != null) {
        evt.currentTarget.className += " w3-red";
    }
    if (cityName.indexOf(",") != -1) {
        console.log("is array");
        let parentDiv = document.getElementById("dataHolder");
        if (parentDiv == undefined) {
            parentDiv = document.getElementById("dataHolder1");
        }
        if (parentDiv == undefined) {
            parentDiv = document.getElementById("dataHolder2");
        }

        // Get all direct children of the parent div
        let children = parentDiv.children;

        // Loop through each child and set its display to "block"
        for (let j = 0; j < children.length; j++) {
            children[j].style.display = "block";
        }
    } else {
        let currentEl = document.getElementById(cityName);
        if (currentEl != null) {
            currentEl.style.display = "block";
        }

        let currenturl = window.location.href.split("?")[0];
        let currentadditive = currenturl.split("&")[1];
        if (currentadditive === undefined) {
            currentadditive = "";
        }
        if (search === undefined) {
            window.history.replaceState({}, "foo", currenturl + "?type=" + cityName + "&" + currentadditive);
        }

        if (sorting != undefined) {
            let splits = sorting.split(":");
            setTimeout(function () {
                sortDivs(splits[0], splits[1]);
            }, 50);
            // console.log(cityName);
        }
    }
}

function closeTabLinks(cityName) {
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        if (tablinks[i].id != cityName + "-button") {
            tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
        }
    }
}

function CheckIfOptionalCavalry(name) {
    let optional = false;
    const unit = findBy(jsonUnits, "id", name);

    if (unit != undefined) {
        // optional cavalry slug = 000003eb0000073f
        const part = findBy(unit.secondary_passives, "slug", "000003eb0000073f");
        if (part != undefined) {
            optional = true;
        }
    }
    return optional;
}

function addUnitTypeIcon(a, holder, origin) {
    let icontext,
        iconsrc,
        iconName,
        j,
        btn,
        imag,
        spa = "";

    let unitAbilityLoc = jsonUnitAbilitiesLocalized.find((entry) => entry.slug === a);
    let unitAbilityEN = jsonUnitAbilities.find((entry) => entry.slug === a);
    icontext = AddTagIconsForStatusEffects(unitAbilityLoc.description);
    icontext = icontext.replaceAll("<bulletlist></bullet>", "<bulletlist>");
    icontext = icontext.replaceAll("</bullet></bulletlist>", "</bullet></bullet></bulletlist>");
    icontext = icontext.replaceAll("<br></br>", "<br>");

    let unitType = "";
    iconsrc = unitAbilityLoc.icon;
    iconName = unitAbilityLoc.name;

    iconName = iconName.toUpperCase();
    btn = document.createElement("DIV");
    btn.className = "unittype_icon";
    imag = document.createElement("IMG");
    spa = document.createElement("SPAN");
    imag.setAttribute("src", "/aow4db/Icons/UnitIcons/" + iconsrc + ".png");
    imag.setAttribute("onerror", "this.setAttribute('src','/aow4db/Icons/Text/mp.png')");
    imag.setAttribute("width", "40");
    imag.setAttribute("height", "40");

    spa.innerHTML =
        '<img style="float:left; height:30px; width:30px" src="/aow4db/Icons/UnitIcons/' +
        iconsrc +
        '.png"><p class="abilityHighLighter" style="color: #d7c297;>' +
        '<span  style="font-size=20px;">' +
        iconName +
        "</span></p>" +
        "</br>" +
        icontext;
    iconName = unitAbilityEN.name;

    if (origin !== "") {
        const roleNames = [
            "Shock Unit",
            "Shield Unit",
            "Fighter Unit",
            "Support Unit",
            "Battle Mage Unit",
            "Skirmisher Unit",
            "Scout Unit",
            "Polearm Unit",
            "Ranged Unit",
            "Mythic Unit",
            "Tower",
            "Siegecraft",
            "Civilian"
        ];

        if (roleNames.includes(iconName)) {
            const unitRole = origin.querySelector("img#unit_role"); // no need for [0]
            const unitType = iconsrc;

            const clearname = unitAbilityEN.name.replaceAll(" ", "_").toLowerCase();
            unitRole.setAttribute("src", `/aow4db/Icons/Text/${clearname}.png`);
        }
    }
    addTooltipListeners(btn, spa);
    btn.appendChild(imag);
    holder.appendChild(btn);

    return unitType;
}

function addAbilityslot(a, holder, list, enchant, uniqueMedal) {
    let abilityName,
        abilityIcon,
        abilityDam,
        abilityEncht,
        abilityAcc,
        abilityRange,
        abilityType,
        abilityNote,
        j,
        abilityReq,
        abilityMod = "";

    const abilityLoc = jsonUnitAbilitiesLocalized.find((entry) => entry.slug === a);

    const abilityEn = jsonUnitAbilities.find((entry) => entry.slug === a);
    // console.log(abilityEn);
    abilityDam = "";
    if ("damage" in abilityLoc) {
        abilityDam = abilityLoc.damage;
    }

    abilityType = abilityLoc.actionPoints;

    abilityRange = abilityLoc.range;

    abilityName = abilityLoc.name;

    let abilityHasMedal = false;
    if (uniqueMedal != null) {
        if (uniqueMedal.name.split("Champion ")[1] == abilityEn.name) {
            abilityName += " <champion></champion>";
            // add note about the levelup change
            abilityHasMedal = true;
        }
    }

    abilityIcon = abilityLoc.icon;
    if (abilityIcon == undefined) {
        console.log("missing icon link for : " + abilityEn.name);
        abilityIcon = "";
    }

    abilityReq = "";
    if ("requisites" in abilityLoc) {
        abilityReq = abilityLoc.requisites;
    }

    if ("modifiers" in abilityLoc) {
        for (let l = 0; l < abilityLoc.modifiers.length; l++) {
            abilityName += '<span style="color:#addd9e;font-size: 20px">&#11049</span>';
            /* let modName = abilityLoc.modifiers[l].name.split("^")[0];

            let modDesc = abilityLoc.modifiers[l].description;
            abilityMod += "<bullet>" + AddTagIconsForStatusEffects(modName) + "<br>";
            abilityMod += AddTagIconsForStatusEffects(modDesc) + "</bullet><br>";*/
        }
    }

    let combinedReq = "";
    let m = "";
    for (m in abilityReq) {
        combinedReq += abilityReq[m].requisite + ",";
    }
    abilityEncht = "";
    // enchantment handling disabled for now
    /*for (let p = 0; p < list.length; p++) {
        let foundEnchantment = false;

        for (let k = 0; k < jsonEnchantments.length; k++) {
            if (jsonEnchantments[k].id === list[p].id) {
                foundEnchantment = true;
                if ("damage" in jsonEnchantments[k]) {
                    console.log("damage increase");
                    abilityDam = IncreaseDamageValue(abilityDam, 1.2);
                }
                if ("attack" in jsonEnchantments[k]) {
                    for (t = 0; t < jsonEnchantments[k].attack.length; t++) {
                        if ("type2" in jsonEnchantments[k].attack[t]) {
                            if (jsonEnchantments[k].attack[t].type2.indexOf("*") != -1) {
                                if (
                                    combinedReq.indexOf(jsonEnchantments[k].attack[t].type) != -1 ||
                                    combinedReq.indexOf(jsonEnchantments[k].attack[t].type2.split("*")[1]) != -1
                                ) {
                                    abilityName += '<span style="color:#aa84f6;font-size: 20px">*</span>';
                                    abilityEncht +=
                                        '<bullet><img src="/aow4db/Icons/SpellIcons/' +
                                        jsonEnchantments[k].id +
                                        ".png\" height='20px'>" +
                                        jsonEnchantments[k].attack[t].description +
                                        "<br>";
                                    abilityEncht += "</bullet><br>";

                                    if ("range" in jsonEnchantments[k].attack[t]) {
                                        abilityRange += jsonEnchantments[k].attack[t].range + "*";
                                    }
                                }
                            }
                            // or check, not and
                            else {
                                if (
                                    combinedReq.indexOf(jsonEnchantments[k].attack[t].type) != -1 &&
                                    combinedReq.indexOf(jsonEnchantments[k].attack[t].type2) != -1
                                ) {
                                    abilityName += '<span style="color:#aa84f6;font-size: 20px">*</span>';
                                    abilityEncht +=
                                        '<bullet><img src="/aow4db/Icons/SpellIcons/' +
                                        jsonEnchantments[k].id +
                                        ".png\" height='20px'>" +
                                        jsonEnchantments[k].attack[t].description +
                                        "<br>";
                                    abilityEncht += "</bullet><br>";

                                    if ("range" in jsonEnchantments[k].attack[t]) {
                                        abilityRange += jsonEnchantments[k].attack[t].range + "*";
                                    }
                                }
                            }
                        } else {
                            if (combinedReq.indexOf(jsonEnchantments[k].attack[t].type) != -1) {
                                abilityName += '<span style="color:#aa84f6;font-size: 20px">*</span>';
                                abilityEncht +=
                                    '<bullet><img src="/aow4db/Icons/SpellIcons/' +
                                    jsonEnchantments[k].id +
                                    ".png\" height='20px'>" +
                                    jsonEnchantments[k].attack[t].description +
                                    "<br>";
                                abilityEncht += "</bullet><br>";

                                if ("range" in jsonEnchantments[k].attack[t]) {
                                    abilityRange =
                                        parseInt(
                                            parseInt(jsonEnchantments[k].attack[t].range) + parseInt(abilityRange)
                                        ) + "*";
                                }
                            }
                        }
                    }
                }
                let doubled;
                if ("damage_change" in jsonEnchantments[k]) {
                    if (jsonEnchantments[k].requisites.length > 1) {
                        if (jsonEnchantments[k].requisites[1].type.indexOf("*") != -1) {
                            if (
                                combinedReq.indexOf(jsonEnchantments[k].requisites[0].type) != -1 ||
                                combinedReq.indexOf(jsonEnchantments[k].requisites[1].type.split("*")[1]) != -1
                            ) {
                                if (abilityDam != "") {
                                    if (abilityType != "<repeatingaction></repeatingaction>") {
                                        // double damage
                                        doubled = doubleNumbers(jsonEnchantments[k].damage_change);
                                        abilityDam = combineDamageStrings(abilityDam, doubled);
                                    } else {
                                        abilityDam = combineDamageStrings(
                                            abilityDam,
                                            jsonEnchantments[k].damage_change
                                        );
                                    }
                                }
                            }
                            // or check, not and
                        } else {
                            if (
                                combinedReq.indexOf(jsonEnchantments[k].requisites[0].type) != -1 &&
                                combinedReq.indexOf(jsonEnchantments[k].requisites[1].type) != -1
                            ) {
                                if (abilityDam != "") {
                                    if (abilityType != "<repeatingaction></repeatingaction>") {
                                        // double damage
                                        doubled = doubleNumbers(jsonEnchantments[k].damage_change);
                                        abilityDam = combineDamageStrings(abilityDam, doubled);
                                    } else {
                                        abilityDam = combineDamageStrings(
                                            abilityDam,
                                            jsonEnchantments[k].damage_change
                                        );
                                    }
                                }
                            }
                        }
                    } else {
                        if (combinedReq.indexOf(jsonEnchantments[k].requisites[0].type) != -1) {
                            if (abilityDam != "") {
                                if (abilityType != "<repeatingaction></repeatingaction>") {
                                    // double damage
                                    doubled = doubleNumbers(jsonEnchantments[k].damage_change);
                                    abilityDam = combineDamageStrings(abilityDam, doubled);
                                } else {
                                    abilityDam = combineDamageStrings(abilityDam, jsonEnchantments[k].damage_change);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (foundEnchantment == false) {
            console.log("missing enchantment info for : " + list[p].name);
        }
    }*/

    // add notes

    abilityNote = "";
    let Cooldown = "";
    let Once = "";
    // jsonUnitAbilities english;

    if ("notes" in abilityLoc) {
        for (let l = 0; l < abilityLoc.notes.length; l++) {
            if (abilityLoc.notes[l] === undefined) {
            } else {
                if (abilityEn.notes[l].note.indexOf("Cooldown") != -1) {
                    Cooldown = abilityLoc.notes[l].note;
                } else if (abilityEn.notes[l].note.indexOf("once per") != -1) {
                    Once = abilityLoc.notes[l].note;
                } else {
                    abilityNote += "<br>" + abilityLoc.notes[l].note;
                }
            }
        }
    }

    //  abilityDam = jsonUnitAbilities[j].damage;
    abilityRange = abilityRange + "<range></range>";
    abilityAcc = abilityLoc.accuracy + "<accuracy></accuracy>";

    let tooltipName = document.createElement("SPAN");
    let btn = document.createElement("DIV");
    /// tooltipName.style.fontSize = "20px";
    tooltipName.innerHTML = "test";
    btn.className = "unit_abilityslot";
    // if (n === true) {
    //   btn.style.backgroundColor = "rgb(73, 0, 80)";
    //}
    let imag = document.createElement("IMG");
    imag.className = "unit_ability_icon";
    //  let spa = document.createElement("SPAN");
    let tex = document.createElement("DIV");
    tex.className = "tooltip";
    tex.innerHTML = abilityName;
    tex.setAttribute("style", "color:white");
    // tex.setAttribute('onclick', '');
    let dam = document.createElement("DIV");
    dam.className = "ability_damage";
    dam.innerHTML = abilityDam;

    let abilityIconType = "";
    imag.setAttribute("src", "/aow4db/Icons/UnitIcons/" + abilityIcon + ".png");

    abilityIconType = GetAbilityBackground(abilityDam);

    imag.setAttribute(
        "style",
        'background-image: url("/aow4db/Icons/Interface/' +
            abilityIconType +
            '.png");background-repeat: no-repeat;background-size: 40px 40px'
    );

    imag.setAttribute("onerror", "this.setAttribute('src','/aow4db/Icons/Text/mp.png')");
    imag.setAttribute("width", "40");
    imag.setAttribute("height", "40");
    let imageExtra;
    if (Cooldown != "") {
        imageExtra = document.createElement("IMG");
        imageExtra.setAttribute("src", "/aow4db/Icons/Text/turn.png");
        imageExtra.setAttribute("style", " position: absolute; height: 18px; left: 0px;bottom: 4px;");
        btn.append(imageExtra);
    }

    if (Once != "") {
        imageExtra = document.createElement("IMG");
        imageExtra.setAttribute("src", "/aow4db/Icons/Text/once.png");
        imageExtra.setAttribute("style", " position: absolute; height: 18px; left: 0px;bottom: 4px;");
        btn.append(imageExtra);
    }

    let spa = GetAbilityToolTip(abilityLoc, uniqueMedal);

    if (abilityEn.name.indexOf("Defense Mode") > -1) {
        spa.innerHTML =
            '<div class="leftAbility" style="color:#d7c297;"> <p class="abilityHighLighter">' +
            abilityName.toUpperCase() +
            "</p>";
        spa.innerHTML += '<div style="clear:both"> </div>' + "<br>";
        spa.innerHTML += AddTagIconsForStatusEffects(abilityLoc.description);
        dam.innerHTML = "";
    }

    if (enchant) {
        btn.setAttribute(
            "style",
            "background-image: linear-gradient(to right, rgb(95 47 162 / 0%), rgb(146 47 162 / 25%), rgb(222 88 228 / 50%), rgb(138 47 162 / 26%), rgb(151 47 162 / 0%));"
        );
    }

    holder.append(btn);
    btn.ability = jsonUnitAbilities[j];
    btn.appendChild(imag);
    let divider = document.createElement("div");
    divider.setAttribute("style", "display: flex;justify-content: space-between;width: 100%;");
    divider.append(tex);
    divider.append(dam);
    btn.append(divider);

    addTooltipListeners(tex, spa);
}

function GetAbilityBackground(abilityDam) {
    if (!abilityDam) return "ability_icon";

    const splitDamageString = abilityDam.split(">");
    const damageType = splitDamageString[0].toLowerCase();

    const map = {
        phys: "ability_icon_phys",
        frost: "ability_icon_frost",
        blight: "ability_icon_blight",
        spirit: "ability_icon_spirit",
        fire: "ability_icon_fire",
        lightning: "ability_icon_light"
    };

    // find the first key that matches
    for (const key in map) {
        if (damageType.includes(key)) {
            return map[key];
        }
    }

    return "ability_icon"; // fallback
}

function IncreaseDamageValue(input, percentage) {
    // Extract the number value and tag
    // Split the input string into individual entries
    const entries = input.split(/\s+/);

    // Initialize an array to store the updated entries
    const updatedEntries = [];

    // Process each entry
    entries.forEach((entry) => {
        // Extract the number value and tag
        const match = entry.match(/(\d+)<(\w+)><\/\2>/);
        if (match && match.length === 3) {
            const originalValue = parseInt(match[1], 10);
            const tag = match[2];

            // Increase the value by 20%
            const increasedValue = originalValue * percentage;

            // Construct the updated entry
            const updatedEntry = `${increasedValue.toFixed(0)}<${tag}></${tag}>`;

            updatedEntries.push(updatedEntry);
        } else {
            // If the entry doesn't match the expected format, add it as is
            updatedEntries.push(entry);
        }
    });

    // Join the updated entries back together
    const newString = updatedEntries.join(" ");
    return newString;
}

/*function GetAbilityToolTip(ability) {
    // block one, header
    // image
    let spa = document.createElement("SPAN");

    let abilityIcon = ability.icon;
    if (abilityIcon == "undefined") {
        console.log("Missing icon in tooltip for : " + ability.name);
        abilityIcon = "";
    }
    let abilityHighlighter = document.createElement("DIV");
    abilityHighlighter.className = "abilityHighLighter";
      let abilityIconType = GetAbilityBackground(ability.damage);
    abilityHighlighter.innerHTML =
        "<img style=\"float:left; height:50px; width:50px; background-image:url('/aow4db/Icons/Interface/" +
        abilityIconType +
        '.png\');background-repeat: no-repeat;background-size: 50px" src="/aow4db/Icons/UnitIcons/' +
        abilityIcon +
        '.png">';

    // name and damage

    let line1 = document.createElement("DIV");
    line1.setAttribute("style", "display: flex;justify-content: space-between;");
    let nameHolder = document.createElement("DIV");
    nameHolder.className = "abilityLineSlot";
    nameHolder.setAttribute("style", "color:#d7c297;");
    nameHolder.innerHTML = ability.name.toUpperCase();

    let damageHolder = document.createElement("DIV");
    damageHolder.className = "abilityLineSlot";
    damageHolder.innerHTML = ability.damage;

    line1.appendChild(nameHolder);
    line1.appendChild(damageHolder);
    abilityHighlighter.append(line1);

    // block accuracy range abilitytype
    let line2 = document.createElement("DIV");
    line2.setAttribute("style", "display: flex;justify-content: space-between;");
    let accrangeHolder = document.createElement("DIV");

    let accuracy = document.createElement("DIV");
    accuracy.innerHTML = ability.accuracy;
    accuracy.className = "abilityLineSlot";

    let range = document.createElement("DIV");
    range.innerHTML = ability.range;
    range.className = "abilityLineSlot";

    // action point type
    let actionPoint = document.createElement("DIV");
    actionPoint.innerHTML = ability.actionPoints;
    actionPoint.className = "abilityLineSlot";

    // action point name

    let actionPointName = LookUpActionPointsName(ability.actionPoints);
    if (actionPointName != undefined) {
        actionPoint.innerHTML +=
            "<br>" + '<span style="color: lightskyblue; font-size:14px">' + actionPointName + "</span>";
    }

    accrangeHolder.appendChild(accuracy);
    accrangeHolder.appendChild(range);
    ////spa.append(accrangeHolder);

    let typeHolder = document.createElement("DIV");
    typeHolder.appendChild(actionPoint);

    line2.appendChild(accrangeHolder);
    line2.appendChild(typeHolder);
    abilityHighlighter.append(line2);

    spa.append(abilityHighlighter);

    // block 2, descrp
    let abilityDescr = ability.description;

    abilityDescr = abilityDescr.replaceAll("</br>", "");
    abilityDescr = AddTagIconsForStatusEffects(abilityDescr);
    spa.innerHTML += "<hr> " + abilityDescr; // + "<br>";

    // modifiers
    if (abilityMod != "") {
        spa.innerHTML += '<span style="color:#addd9e;font-size: 14px">' + abilityMod + "</span>";
    }
    if (abilityEncht != "") {
        spa.innerHTML += '<span style="color:#aa84f6;font-size: 14px">' + abilityEncht + "</span>";
    }

    // block 3, req
    //notes

    //spa.innerHTML += '<span style="color:#a4a4a6; font-size: 13px">' + abilityNote + "</span>";

    let bottomLine = document.createElement("DIV");
    bottomLine.setAttribute("style", "display: flex;justify-content: space-between;");
    let reqs = document.createElement("DIV");
    if (abilityReq != "") {
        let i = "";
        for (i in abilityReq) {
            let newReq = document.createElement("DIV");
            newReq.innerHTML = abilityReq[i].requisite;
            newReq.setAttribute("style", "background-color:#2e2e28");
            if (abilityReq[i].requisite == "Support") {
                newReq.setAttribute("style", "background-color:#263b38");
            }
            if (abilityReq[i].requisite == "Melee") {
                newReq.setAttribute("style", "background-color:#3b2826");
            }
            if (abilityReq[i].requisite == "Physical Ranged") {
                newReq.setAttribute("style", "background-color:#383125");
            }
            if (abilityReq[i].requisite == "Magic") {
                newReq.setAttribute("style", "background-color:#262f42");
            }
            if (abilityReq[i].requisite == "Debuff") {
                newReq.setAttribute("style", "background-color:#3c2642");
            }
            if (abilityReq[i].requisite == "Summoning") {
                newReq.setAttribute("style", "background-color:#422631");
            }
            if (abilityReq[i].requisite == "Base") {
                newReq.setAttribute("style", "background-color:#5d5d5c");
            }
            newReq.className = "requisiteSlot";
            reqs.appendChild(newReq);
        }
    }
    bottomLine.appendChild(reqs);

    if (cooldown != "") {
        let cooldownDiv = document.createElement("DIV");
        cooldownDiv.innerHTML = cooldown;
        cooldownDiv.setAttribute("style", "margin:5px");
        //  cooldownDiv.setattri() = "requisiteSlot";
        bottomLine.appendChild(cooldownDiv);
    }
    if (once != "") {
        let onceDiv = document.createElement("DIV");
        onceDiv.innerHTML = "<once></once> Once per battle";
        onceDiv.setAttribute("style", "margin:5px");
        //  cooldownDiv.setattri() = "requisiteSlot";
        bottomLine.appendChild(onceDiv);
    }

    spa.append(bottomLine);

    return spa;
}*/

function GetAbilityToolTip(ability, uniqueMedal) {
    // get template
    const abiltyTemplate = ability_slot_template.content.cloneNode(true);
    const element = abiltyTemplate.firstElementChild;

    // name and damage
    let abilityName = element.querySelector("#abilityName");
    abilityName.innerHTML = ability.name.toUpperCase();

    let abilityDam = element.querySelector("#abilityDamage");
    abilityDam.innerHTML = ability.damage;

    // ability icon
    let abilityIcon = element.querySelector("#abilityIcon");
    let abilityBackground = GetAbilityBackground(ability.damage);
    abilityIcon.setAttribute("src", "/aow4db/Icons/UnitIcons/" + ability.icon + ".png");
    abilityIcon.style.backgroundImage = "url(/aow4db/Icons/Interface/" + abilityBackground + ".png";

    // accuracy range and actions
    let accuracy = element.querySelector("#abilityAcc");
    accuracy.innerHTML = ability.accuracy + "<accuracy></accuracy>";

    let range = element.querySelector("#abilityRange");
    range.innerHTML = ability.range + "<range></range>";

    let actions = element.querySelector("#abilityAction");
    actions.innerHTML = ability.actionPoints;
    let actionPointName = LookUpActionPointsName(ability.actionPoints);
    actions.innerHTML += actionPointName
        ? "<br>" + '<span style="color: lightskyblue; font-size:14px">' + actionPointName + "</span>"
        : "";

    // description

    let descript = element.querySelector("#abilityDescription");
    descript.innerHTML = AddTagIconsForStatusEffects(ability.description);

    let modifierSpan = element.querySelector("#abilityMods");

    // cleanup later
    let abilityMod = "";

    if (Array.isArray(ability.modifiers)) {
        for (const modifier of ability.modifiers) {
            abilityName += "&#11049";
            abilityMod += "<bullet>" + AddTagIconsForStatusEffects(modifier.name) + "<br>"; // AddTagIconsForStatusEffects(ability.modifiers[l].name) + "<br>";
            abilityMod += AddTagIconsForStatusEffects(modifier.description) + "</bullet><br>";
        }
    }

    if (uniqueMedal != undefined) {
        if (uniqueMedal.name.split("Champion ")[1] == ability.name) {
            let championMedal = uniqueMedal.description;

            abilityMod +=
                '<br><span style="color:yellow"><medal_champion></medal_champion> Champion Medal ' +
                championMedal +
                "</span><br>";
        }
    }
    // modifiers
    if (abilityMod != "") {
        modifierSpan.innerHTML += '<span style="color:#addd9e;font-size: 14px">' + abilityMod + "</span>";
    }

    let abilityEncht = "";
    if (abilityEncht != "") {
        modifierSpan.innerHTML += '<span style="color:#aa84f6;font-size: 14px">' + abilityEncht + "</span>";
    }

    // notes

    // cleanup later
    let abilityNote = "";
    let Cooldown = "";
    let Once = "";

    if ("notes" in ability) {
        for (let l = 0; l < ability.notes.length; l++) {
            if (ability.notes[l] === undefined) {
            } else {
                if (ability.notes[l].note.indexOf("Cooldown") != -1) {
                    Cooldown = ability.notes[l].note;
                } else if (ability.notes[l].note.indexOf("once per") != -1) {
                    Once = ability.notes[l].note;
                } else {
                    abilityNote += "<br>" + ability.notes[l].note;
                }
            }
        }
    }

    modifierSpan.innerHTML += '<span style="color:#a4a4a6; font-size: 13px">' + abilityNote + "</span>";

    let reqs = element.querySelector("#abilityTags");
    reqs.innerHTML = "";
    if (Array.isArray(ability.requisites)) {
        for (const requisite of ability.requisites) {
            let newReq = document.createElement("DIV");
            newReq.innerHTML = requisite.requisite;
            newReq.setAttribute("style", "background-color:#2e2e28");
            if (requisite.requisite == "Support") {
                newReq.setAttribute("style", "background-color:#263b38");
            }
            if (requisite.requisite == "Melee") {
                newReq.setAttribute("style", "background-color:#3b2826");
            }
            if (requisite.requisite == "Physical Ranged") {
                newReq.setAttribute("style", "background-color:#383125");
            }
            if (requisite.requisite == "Magic") {
                newReq.setAttribute("style", "background-color:#262f42");
            }
            if (requisite.requisite == "Debuff") {
                newReq.setAttribute("style", "background-color:#3c2642");
            }
            if (requisite.requisite == "Summoning") {
                newReq.setAttribute("style", "background-color:#422631");
            }
            if (requisite.requisite == "Base") {
                newReq.setAttribute("style", "background-color:#5d5d5c");
            }
            newReq.className = "requisiteSlot";
            reqs.appendChild(newReq);
        }
    }

    // cooldowns and once per battle

    let cooldownDiv = element.querySelector("#abilityCooldowns");
    if (Cooldown != "") {
        cooldownDiv.innerHTML = Cooldown;
    }
    if (Once != "") {
        cooldownDiv.innerHTML = "<once></once> Once per battle";
    }
    return element;
}

function LookUpActionPointsName(string) {
    if (string != undefined) {
        if (string.indexOf("<repeatingaction>") != -1) {
            return "Repeating";
        }
        if (string.indexOf("<fullaction>") != -1) {
            return "Full Action";
        }
        if (string.indexOf("<fullactioncontinue>") != -1) {
            return "Full Action Continue";
        }
        if (string.indexOf("<freeaction>") != -1) {
            return "Free Action";
        }
        if (string.indexOf("<leaveoneaction>") != -1) {
            return "Leave One";
        }
        if (string.indexOf("<singleuseaction>") != -1) {
            return "Single Action";
        }
    }
}

function addPassiveslot(a, div, enchant) {
    let abilityName,
        abilityIcon,
        abilityDescr,
        j = "";
    for (j in jsonUnitAbilitiesLocalized) {
        if (a === jsonUnitAbilitiesLocalized[j].slug) {
            abilityName = jsonUnitAbilitiesLocalized[j].name;
            abilityIcon = jsonUnitAbilitiesLocalized[j].icon;
            abilityDescr = jsonUnitAbilitiesLocalized[j].description;

            let btn = document.createElement("DIV");
            btn.className = "unit_passiveslot";
            let imag = document.createElement("IMG");
            imag.className = "unit_ability_icon";

            let tex = document.createElement("DIV");
            tex.className = "tooltip";
            tex.setAttribute("onclick", "");
            tex.innerHTML = abilityName;

            imag.setAttribute("src", "/aow4db/Icons/UnitIcons/" + abilityIcon + ".png");
            imag.setAttribute("onerror", "this.setAttribute('src','/aow4db/Icons/Text/mp.png')");
            imag.setAttribute("width", "40");
            imag.setAttribute("height", "40");

            if (enchant) {
                btn.setAttribute(
                    "style",
                    "background-image: linear-gradient(to right, rgb(95 47 162 / 0%), rgb(146 47 162 / 25%), rgb(222 88 228 / 50%), rgb(138 47 162 / 26%), rgb(151 47 162 / 0%));"
                );
            }

            let spa = CreatePassiveSlotToolTip(abilityIcon, abilityName, abilityDescr);
            div.appendChild(btn);

            btn.appendChild(imag);

            //tex.appendChild(spa);

            btn.append(tex);
            addTooltipListeners(tex, spa);
        }
    }
}

function addUniquePassiveSlot(enchantment, descr, div, overwrite) {
    let abilityName,
        abilityIcon,
        abilityDescr,
        j = "";

    if (overwrite != "") {
        abilityName = overwrite;
    } else {
        abilityName = enchantment.name;
    }

    abilityIcon = enchantment.id;
    abilityDescr = descr;

    let btn = document.createElement("DIV");
    btn.className = "unit_passiveslot";
    let imag = document.createElement("IMG");
    imag.className = "unit_ability_icon";

    let tex = document.createElement("DIV");
    tex.className = "tooltip";
    tex.setAttribute("onclick", "");
    tex.innerHTML = abilityName;

    imag.setAttribute("src", "/aow4db/Icons/SpellIcons/" + abilityIcon + ".png");
    imag.setAttribute("onerror", "this.setAttribute('src','/aow4db/Icons/Text/mp.png')");
    imag.setAttribute("width", "40");
    imag.setAttribute("height", "40");

    btn.setAttribute(
        "style",
        "background-image: linear-gradient(to right, rgb(95 47 162 / 0%), rgb(146 47 162 / 25%), rgb(222 88 228 / 50%), rgb(138 47 162 / 26%), rgb(151 47 162 / 0%));"
    );

    let spa = CreatePassiveSlotToolTip(abilityIcon, abilityName, abilityDescr);
    div.appendChild(btn);

    btn.appendChild(imag);

    //tex.appendChild(spa);

    btn.append(tex);
    addTooltipListeners(btn, spa);
}

function CreatePassiveSlotToolTip(abilityIcon, abilityName, abilityDescr) {
    let spa = document.createElement("SPAN");

    abilityDescr = abilityDescr.replaceAll("<bulletlist></bullet>", "<bulletlist>");
    abilityDescr = abilityDescr.replaceAll("</bullet></bulletlist>", "</bullet></bullet></bulletlist>");
    abilityDescr = abilityDescr.replaceAll("<br></br>", "<br>");

    spa.innerHTML =
        '<div class="abilityHighLighter"><img style="float:left; position:relative; top:-7px; height:30px; width:30px" src="/aow4db/Icons/UnitIcons/' +
        abilityIcon +
        '.png"><p style="color: #d7c297;>' +
        '<span style="font-size=20px;">' +
        abilityName.toUpperCase() +
        "</p>" +
        "</div>" +
        "<hr>" +
        AddTagIconsForStatusEffects(abilityDescr);

    // abilityHighlighter.appendChild(spa);

    return spa;
}

function combineDamageStrings(str1, str2) {
    // Split both input strings into arrays of words and numbers
    const arr1 = str1.match(/[+-]?\d+<\w+><\/\w+>/g) || [];
    const arr2 = str2.match(/[+-]?\d+<\w+><\/\w+>/g) || [];

    // Create a dictionary to store tag counts
    const tagCounts = {};

    // Loop through the first array
    for (const item of arr1) {
        const parts = item.trim().match(/([+-]?\d+)<(\w+)><\/\2>/);
        if (parts && parts.length === 3) {
            const count = parseInt(parts[1], 10);
            const tag = parts[2];

            // Add to or subtract from the dictionary
            tagCounts[tag] = (tagCounts[tag] || 0) + count;
        }
    }

    // Loop through the second array
    for (const item of arr2) {
        const parts = item.trim().match(/([+-]?\d+)<(\w+)><\/\2>/);
        if (parts && parts.length === 3) {
            const count = parseInt(parts[1], 10);
            const tag = parts[2];

            // Add to or subtract from the dictionary
            tagCounts[tag] = (tagCounts[tag] || 0) + count;
        }
    }

    // Construct the result string
    const result = [];
    for (const tag in tagCounts) {
        if (tagCounts[tag] !== 0) {
            result.push(`${tagCounts[tag]}<${tag}></${tag}>`);
        }
    }

    return result.join(" ");
}

function addResistanceSlot(a, resistance, holder) {
    let abilityName,
        abilityIcon,
        abilityDescr,
        abilityDam = "";
    for (let j = 0; j < jsonUnitAbilities.length; j++) {
        if (a === jsonUnitAbilities[j].slug) {
            abilityName = jsonUnitAbilities[j].name;
            let firstPart;
            if (abilityName.indexOf("Immu") != -1) {
                firstPart = abilityName.split(" ")[0];
            } else {
                let nameclean = abilityName.split(">")[1];
                firstPart = nameclean.split(" ")[0];
            }

            abilityIcon = jsonUnitAbilities[j].icon;
            abilityDescr = jsonUnitAbilities[j].description;
            abilityDam = jsonUnitAbilities[j].damage;
            let btn = document.createElement("DIV");
            btn.className = "resistance_icon";
            btn.setAttribute("id", abilityName);
            let imag = document.createElement("IMG");
            imag.className = "unit_ability_icon";

            let spa = document.createElement("SPAN");

            spa.innerHTML =
                "<p>" +
                '<span style="font-size=20px; text-transform:uppercase; color:#deb887 ;">' +
                abilityName +
                "</p>" +
                "Added to Resistance <resistance></resistance> to calculate damage sustained from " +
                firstPart +
                ".";

            let num = "";
            let split;
            if (a.indexOf("weakness") !== -1) {
                split = a.split("weakness_");
                num = "-" + split[1];
            }
            if (a.indexOf("resistance") !== -1) {
                split = a.split("resistance_");
                num = split[1];
            }

            if (a.indexOf("immun") !== -1) {
                split = a.split("resistance_");
                num = "x";
            }

            const damageRedText = findBy(jsonAllFromPOLocalized, "id", "INTERFACE@TEXT");

            spa.innerHTML +=
                "<br><br>" +
                damageRedText.damage_reduction +
                ": <br> " +
                firstPart +
                ' <span style="color:white;">' +
                GetDamageReductionPercentage(resistance, num) +
                '</span> ( From <span style="color:white;">' +
                resistance +
                "</span> <resistance> </resistance>";
            if (num != undefined) {
                if (num > 0) {
                    spa.innerHTML += "+";
                }
                spa.innerHTML += num;
            }

            imag.setAttribute("width", "25");
            imag.setAttribute("height", "25");

            if (a.indexOf("Frost") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/frost_resistance.png");
                spa.innerHTML += "<defensefrost></defensefrost>";
            }
            if (a.indexOf("Blight") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/blight_resistance.png");
                spa.innerHTML += "<defenseblight></defenseblight>";
            }
            if (a.indexOf("Fire") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/fire_resistance.png");
                spa.innerHTML += "<defensefire></defensefire>";
            }
            if (a.indexOf("Spirit") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/spirit_resistance.png");
                spa.innerHTML += "<defensespirit></defensespirit>";
            }

            if (a.indexOf("Shock") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/lightning_resistance.png");
                spa.innerHTML += "<defenselightning></defenselightning>";
            }

            if (a.indexOf("weakness") !== -1) {
                split = a.split("weakness_");
                abilityDam = '<p class="resistanceNumber" style="color:red;">-' + split[1];
            }
            if (a.indexOf("resistance") !== -1) {
                split = a.split("resistance_");
                abilityDam = '<p class="resistanceNumber" style="color:lawngreen;">' + split[1];
            }

            if (a.indexOf("immun") !== -1) {
                split = a.split("resistance_");
                abilityDam = '<p class="resistanceNumber">IMM';
            }

            spa.innerHTML += ")";

            holder.appendChild(btn);
            btn.innerHTML = abilityDam;

            btn.appendChild(imag);

            // btn.append(spa);

            addTooltipListeners(btn, spa);

            return;
        }
    }
}

function addstatusResistanceSlot(a, holder) {
    let abilityName,
        abilityIcon,
        abilityDescr,
        abilityDam = "";

    let btn = document.createElement("DIV");
    btn.className = "resistance_icon";
    btn.id = "statusResistance";
    let imag = document.createElement("IMG");
    imag.className = "unit_ability_icon";

    spa = document.createElement("SPAN");

    spa.innerHTML = "<p>" + '<span style="color: #deb887 ;text-transform: uppercase">Status Resistance</span></p>';

    spa.innerHTML +=
        'Reduces the chance that the unit will be affeted by negative status effects. <br><br>Current Chance Reduction :  <span style="color:white;">' +
        GetDamageReductionPercentage(a, undefined) +
        "</span> ";

    imag.setAttribute("width", "25");
    imag.setAttribute("height", "25");

    imag.setAttribute("src", "/aow4db/Icons/Text/status_resistance.png");

    abilityDam = a;

    holder.appendChild(btn);
    btn.innerHTML = '<p class="resistanceNumber">' + abilityDam;

    btn.appendChild(imag);

    // btn.append(spa);

    addTooltipListeners(btn, spa);
}

async function showUnitsFromList(list, overwritetext) {
    SetCollapsibleButtonsAndDivs(overwritetext, list, "unit");
    SetButtonsAndDivs(list, overwritetext + "-button", "unit");
}

async function showUnitsWithIcon(list) {
    SetButtonsAndDivs(list, "buttonHolder", "unitTomeIcon");
}

async function spawnCard(string, divID) {
    if (divID === undefined) {
        divID = "units";
    }

    let doc = document.getElementById(divID);

    let iDiv = unit_card_template.content.cloneNode(true);
    const element = iDiv.firstElementChild;
    doc.appendChild(element);
    return element;
}

async function showUnitFromString(string, divID, subcultureCheck, resID) {
    let newDiv = await spawnCard(string, divID);
    showUnit(string, subcultureCheck, resID, newDiv);
}

function SetUpSpawnTable() {
    let coll = document.getElementsByClassName("collapsible");
    let content = document.getElementsByClassName("content");
    let j = "";
    for (j in content) {
        coll[j].classList.toggle("active");
        //  let content = this.nextElementSibling;
        if (content[j].style.display === "grid") {
            content[j].style.display = "none";
        } else {
            content[j].style.display = "grid";
        }
    }
}

function SetUpCombatEnc(event) {
    console.log("click");
    this.classList.toggle("active");

    // Get the next sibling element (which should be the content)
    let contentElement = this.nextElementSibling;

    // Toggle the display style of the content element
    if (contentElement.style.display === "grid") {
        contentElement.style.display = "none";
    } else {
        contentElement.style.display = "grid";
    }
    /*
    // Get all collapsible elements
    let collapsibles = document.getElementsByClassName("collapsible");

    // Iterate over each collapsible element
    for (const collapsible of collapsibles) {
        // Attach event listener to each collapsible
        collapsible.addEventListener("click", function () {
            // Toggle the "active" class on the current collapsible
          
        });
    }
    */
}

async function spawnEquipCards(list, divID) {
    if (divID === undefined) {
        divID = "equip";
    }
    let doc = document.getElementById(divID);
    for (let i = 0; i < list.length; i++) {
        let iDiv = item_card_template.content.cloneNode(true);
        doc.appendChild(iDiv);
    }
}

async function showEquipmentFromList(list, divID) {
    await spawnEquipCards(list, divID);
}

async function showSiegeProjects(list) {
    if (list === undefined) {
        let newDiv = await spawnSpellCards(jsonSiegeProjects, "dataHolder");
        for (let i = 0; i < jsonSiegeProjects.length; i++) {
            showSiegeProject(jsonSiegeProjects[i].name, true, newDiv[i]);
        }
    } else {
        let newDivList = await spawnSpellCards(list, "Siege Projects");
        for (let i = 0; i < list.length; i++) {
            showSiegeProject(list[i], true, newDivList[i]);
        }
    }
}

async function showStructures(list) {
    let newDivs = await spawnSpellCards(list, "Structures");
    for (let i = 0; i < list.length; i++) {
        showStructure(list[i], true, newDivs[i]);
    }
}

async function showEmpireTrees(list) {
    let cards = await spawnSpellCards(list, "Empire Tree");
    for (let i = 0; i < list.length; i++) {
        showEmpireTree(list[i], cards[i]);
    }
}

async function showWorldStructures(list) {
    let card = await spawnStructureCards(list, "World Structures");
    for (let i = 0; i < list.length; i++) {
        showWorldStructure(list[i], card[i]);
    }
}

async function spawnTomeCards(list, divID) {
    if (divID === undefined) {
        divID = "tome";
    }
    let doc = document.getElementById(divID);

    let iDiv = tome_card_template.content.cloneNode(true);
    let element = iDiv.firstElementChild;

    doc.appendChild(element);
    return element;
}

async function showTomeFromList2(string, divID) {
    let card = await spawnTomeCards(string, divID);

    showTome(string, card);
}

async function showTomeFromList(list, divID, overwritetext) {
    SetButtonsAndDivs(list, undefined, "tome");
}

async function spawnSpellCards(list, divID = "spell") {
    let listOfCreatedDivs = [];
    let doc = document.getElementById(divID);
    const frag = document.createDocumentFragment();

    listOfCreatedDivs = list.map(() => {
        const el = spell_card_template.content.firstElementChild.cloneNode(true);
        frag.appendChild(el);
        return el;
    });

    doc.appendChild(frag);

    return listOfCreatedDivs;
}

async function spawnItemCards(list, divID) {
    let newDivs = [];
    if (divID === undefined) {
        divID = "item";
    }
    let j = "";
    let doc = document.getElementById(divID);
    for (let i = 0; i < list.length; i++) {
        let iDiv = item_card_template.content.cloneNode(true);
        let element = iDiv.firstElementChild;
        doc.appendChild(iDiv);
        newDivs.push(element);
    }
    return newDivs;
}

async function spawnSkillCards(list, divID) {
    if (divID === undefined) {
        divID = "item";
    }
    let newDivArray = [];
    let doc = document.getElementById(divID);
    for (let i = 0; i < list.length; i++) {
        let iDiv = skill_card_template.content.cloneNode(true);
        const element = iDiv.firstElementChild;
        doc.appendChild(element);
        newDivArray.push(element);
    }
    return newDivArray;
}

async function spawnSpellCardSingle(list, divID) {
    if (divID === undefined) {
        divID = "spell";
    }
    let doc = document.getElementById(divID);

    const fragment = spell_card_template.content.cloneNode(true);
    const element = fragment.firstElementChild;
    doc.appendChild(element);
    return element;
}

async function spawnTomeCardSingle(list, divID) {
    if (divID === undefined) {
        divID = "tome";
    }
    let doc = document.getElementById(divID);

    let iDiv = tome_card_template.content.cloneNode(true);
    let element = iDiv.firstElementChild;
    doc.appendChild(element);
    return element;
}
async function spawnStructureCardSingle(list, divID) {
    if (divID === undefined) {
        divID = "spell";
    }
    let doc = document.getElementById(divID);

    const iDiv = structure_card_template.content.cloneNode(true);
    const element = iDiv.firstElementChild;
    doc.appendChild(element);
    return element;
}

async function spawnStructureCards(list, divID) {
    if (divID === undefined) {
        divID = "spell";
    }

    let listOfNewDivs = [];
    let doc = document.getElementById(divID);
    for (let i = 0; i < list.length; i++) {
        const iDiv = structure_card_template.content.cloneNode(true);
        const element = iDiv.firstElementChild;
        doc.appendChild(element);
        listOfNewDivs.push(element);
    }
    return listOfNewDivs;
}

async function showSpellFromList(list, divID) {
    let listOfNewDivs = await spawnSpellCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showSpell(list[i], true, listOfNewDivs[i]);
    }
}
async function showHeroTraitFromList(list, divID) {
    let cards = await spawnSpellCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showHeroTrait(list[i].id, cards[i]);
    }
}

async function showHeroGovFromList(list, divID) {
    let cards = await spawnSpellCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showHeroGov(list[i], undefined, cards[i]);
    }
}

async function showSkillFromList(list, divID) {
    let newDivs = await spawnSkillCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        // check if has description
        if ("description" in list[i]) {
            showSkill(
                list[i],
                "",
                list[i].icon,
                list[i].category_name,
                list[i].level_name,
                list[i].group_name,
                newDivs[i]
            );
        } else {
            showSkill(
                list[i],
                "true",
                list[i].icon,
                list[i].category_name,
                list[i].level_name,
                list[i].group_name,
                newDivs[i]
            );
        }
    }
}

async function showTraitFromList(list, divID) {
    let cards = await spawnSpellCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showTrait(list[i], cards[i]);
    }
}

async function showHeroAmbitionFromList(list, divID) {
    let cards = await spawnSpellCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showHeroAmbitions(list[i], cards[i]);
    }
}

async function showDestinyTraitsFromList(list, divID) {
    let cards = await spawnSpellCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showDestinyTrait(list[i], cards[i]);
    }
}

async function showItemFromList(list, divID) {
    let newDivs = await spawnItemCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showItem(list[i], newDivs[i]);
    }
}

async function showCosmicHappeningsWithArgument(argumentType, divID) {
    let list = [];
    list = findCosmicHappeningsWithArgument(argumentType);
    let cards = await spawnStructureCards(list, divID);
    for (let i = 0; i < list.length; i++) {
        showCosmicHappening(list[i], cards[i]);
    }
}

async function showWorldStructuresWithArgument(overwrite, argumentType, list, divID) {
    if (argumentType != undefined) {
        let newList = [];

        // get all matches
        const matches = findBy(jsonWorldStructures, "type", argumentType, { all: true });

        // extract just their ids
        newList = matches.map((item) => item.id);

        list = newList;
    }

    let cards = await spawnStructureCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showWorldStructure(list[i], cards[i]);
    }
}
async function showStructuresWithArgument(argument, divID, argumentType, includeProvince) {
    let list = [];
    list = findStructuresWithArgument(argument, argumentType, includeProvince);

    let newDivs = await spawnStructureCards(list, divID);

    for (let i = 0; i < list.length; i++) {
        showStructure(list[i], true, newDivs[i]);
    }
}

async function showItemsWithArgument(argumentType, overwritetext) {
    let list = [];
    list = findItemsWithArgument(argumentType);

    SetCollapsibleButtonsAndDivs(overwritetext, list, "item");
}

async function showSkillsWithArgument(signature, argumentType, overwritetext) {
    let list = [];
    list = findSkillsWithArgument(signature, argumentType);

    SetCollapsibleButtonsAndDivs(overwritetext, list, "skill");
}

async function showHeroAmbitions() {
    let list = [];
    list = findHeroAmbition();

    SetCollapsibleButtonsAndDivs("Hero Ambitions", list, "heroTrait");
}

async function showHeroGovernance() {
    let list = [];
    list = findHeroGovernance();

    SetCollapsibleButtonsAndDivs("Hero Governance", list, "heroGov");
}

async function showSpellsWithArgument(argument, argumentType, overwritetext) {
    let list = [];
    list = findSpellsWithArgument(argument, argumentType);

    if (overwritetext.indexOf(">") != -1) {
        overwritetext = overwritetext.split("/")[1];
        overwritetext = overwritetext.split(">")[1];
    }

    SetCollapsibleButtonsAndDivs(overwritetext, list, "spell");
}

async function showTraitsWithArgument(argument, overwritetext, affinity) {
    let list = [];
    list = findTraitsWithArgument(argument, affinity);

    SetCollapsibleButtonsAndDivs(overwritetext, list, "trait");
}

async function showSpellFromString(string, divID) {
    let newSpellDiv = await spawnSpellCardSingle(string, divID);
    let spellCard = showSpell(string, true, newSpellDiv);
    return spellCard;
}

async function showSiegeProjectFromString(string, divID) {
    const newSiegeDiv = await spawnSpellCardSingle(string, divID);
    showSiegeProject(string, true, newSiegeDiv);
}

async function showHeroGovernanceFromString(string, divID) {
    let card = await spawnSpellCardSingle(string, divID);
    showHeroGov(string, true, card);
}

async function showWorldStructureFromString(string, divID) {
    const worldDiv = await spawnStructureCardSingle(string, divID);
    showWorldStructure(string, worldDiv);
}

async function showTomeFromString(string, divID) {
    let card = await spawnTomeCardSingle(string, divID);
    showTome(string, card);
}

async function showStructureFromString(string, divID) {
    let strucDiv = await spawnStructureCardSingle(string, divID);
    showStructure(string, false, strucDiv);
}

async function showHeroSkillFromString(string, divID) {
    const skillCard = await spawnSpellCardSingle(string, divID);
    let skill = findBy(jsonHeroSkills, "id", string);

    // check if has description
    if ("description" in skill) {
        showSkill(skill, "", skill.icon, skill.category_name, skill.level_name, skill.group_name, skillCard);
    } else {
        showSkill(skill, "true", skill.icon, skill.category_name, skill.level_name, skill.group_name, skillCard);
    }
}

function findItemsWithArgument(argumentType) {
    // Step 1: filter items with argumentType
    const matchingItems = jsonHeroItems.filter((item) => item.slot.includes(argumentType) && item.tier_numerals);

    // Step 2: build a Set of resid for fast lookup
    const residSet = new Set(matchingItems.map((item) => item.resid));

    // Step 3: return matches from second list
    return jsonHeroItemsLocalized.filter((obj) => residSet.has(obj.resid));
}

function findSkillsWithArgument(signature, argumentType) {
    let j = "";

    let finalCheckedList = [];
    if (signature === "") {
        for (j in jsonHeroSkills) {
            if ("tree_name" in jsonHeroSkills[j]) {
                if (jsonHeroSkills[j].tree_name.indexOf(argumentType) !== -1) {
                    if (!isInArray(finalCheckedList, jsonHeroSkills[j])) {
                        finalCheckedList.push(jsonHeroSkills[j]);
                    }
                }
            }
        }
    } else if (signature === "sig") {
        for (j in jsonHeroSkills) {
            if ("type" in jsonHeroSkills[j]) {
                if (jsonHeroSkills[j].type === "signature") {
                    if (!isInArray(finalCheckedList, jsonHeroSkills[j])) {
                        finalCheckedList.push(jsonHeroSkills[j]);
                    }
                }
            }
        }
    } else if (signature === "pantheon") {
        for (j in jsonHeroSkills) {
            if ("type" in jsonHeroSkills[j]) {
                if (
                    jsonHeroSkills[j].group_name === "Pantheon Hero Skills" &&
                    jsonHeroSkills[j].name.indexOf("Ascension") != -1
                ) {
                    if (!isInArray(finalCheckedList, jsonHeroSkills[j])) {
                        finalCheckedList.push(jsonHeroSkills[j]);
                    }
                }
            }
        }
    }

    // Remove duplicate objects from the array
    const uniqueArray = finalCheckedList.filter((item, index) => {
        return index === finalCheckedList.findIndex((obj) => obj.id === item.id && obj.name === item.name);
    });
    return uniqueArray;
}

function findHeroGovernance() {
    let j = "";

    let finalCheckedList = [];

    for (j in jsonHeroGovernance) {
        finalCheckedList.push(jsonHeroGovernance[j]);
    }
    console.log(finalCheckedList);
    return finalCheckedList;
}

function findHeroAmbition() {
    let j = "";

    let finalCheckedList = [];

    for (j in jsonHeroAmbitions) {
        if (!isInArray(finalCheckedList, jsonHeroAmbitions[j])) {
            if (jsonHeroAmbitions[j].screen_description.indexOf("WIP") == -1) {
                finalCheckedList.push(jsonHeroAmbitions[j]);
            }
        }
    }

    // Remove duplicate objects from the array
    const uniqueArray = finalCheckedList.filter((item, index) => {
        return index === finalCheckedList.findIndex((obj) => obj.id === item.id && obj.name === item.name);
    });

    return uniqueArray;
}

function findEnchantmentsSpells() {
    let enchantmentList = [];
    for (let j = 0; j < jsonSpells.length; j++) {
        if (jsonSpells[j].spellType.indexOf("Unit Enchantment") != -1) {
            enchantmentList.push(jsonSpells[j]);
        }
    }
    return enchantmentList;
}

function findSpellsWithArgument(argumentaffinity, argumentType) {
    let i,
        output,
        affinity,
        textvalue,
        j,
        l,
        k,
        x,
        result = "";

    let finalCheckedList = [];
    if (argumentaffinity === "") {
        for (j in jsonSpells) {
            if (jsonSpells[j].spellType.indexOf(argumentType) !== -1 && jsonSpells[j].id != "invalid") {
                finalCheckedList.push(jsonSpells[j].id);
            }
        }
    } else {
        let listMod = [];
        for (i in jsonTomes) {
            affinity = jsonTomes[i].affinities;

            if (affinity != undefined) {
                if (affinity.toUpperCase().indexOf(argumentaffinity.toUpperCase()) !== -1) {
                    for (k in jsonTomes[i].skills) {
                        listMod.push(jsonTomes[i].skills[k].spell_slug);
                    }
                }
            } else {
                if (argumentaffinity === "General Research") {
                    if (jsonTomes[i].name.toUpperCase().indexOf("General Research".toUpperCase()) !== -1) {
                        for (k in jsonTomes[i].skills) {
                            listMod.push(jsonTomes[i].skills[k].spell_slug);
                        }
                    }
                }

                if (argumentaffinity === "Culture") {
                    if (
                        jsonTomes[i].name.toUpperCase().indexOf("Mystic".toUpperCase()) !== -1 ||
                        jsonTomes[i].name.toUpperCase().indexOf("Primal".toUpperCase()) !== -1 ||
                        jsonTomes[i].name.toUpperCase().indexOf("Feudal".toUpperCase()) !== -1 ||
                        jsonTomes[i].name.toUpperCase().indexOf("Barbarian".toUpperCase()) !== -1 ||
                        jsonTomes[i].name.toUpperCase().indexOf("Dark".toUpperCase()) !== -1 ||
                        jsonTomes[i].name.toUpperCase().indexOf("High".toUpperCase()) !== -1 ||
                        jsonTomes[i].name.toUpperCase().indexOf("Industrious".toUpperCase()) !== -1 ||
                        jsonTomes[i].name.toUpperCase().indexOf("Reaver".toUpperCase()) !== -1 ||
                        jsonTomes[i].name.toUpperCase().indexOf("Oathsworn".toUpperCase()) !== -1
                    ) {
                        for (k in jsonTomes[i].skills) {
                            listMod.push(jsonTomes[i].skills[k].spell_slug);
                        }
                    }
                }
            }
        }

        for (j in jsonSpells) {
            for (x in listMod) {
                if (listMod[x] === jsonSpells[j].id) {
                    if (jsonSpells[j].spellType.toUpperCase().indexOf(argumentType.toUpperCase()) !== -1) {
                        finalCheckedList.push(jsonSpells[j].id);
                    }
                }
            }
        }
    }
    // Remove duplicate objects from the array
    const uniqueArray = removeDuplicatesFromArray(finalCheckedList);
    return uniqueArray;
}

function removeDuplicatesFromArray(arr) {
    let unique = {};
    return arr.filter((item) => {
        if (!unique[item]) {
            unique[item] = true;
            return true;
        }
        return false;
    });
}

function ClearAffinityExtraTags(input) {
    input = input.replace(" Empire Astral Affinity", "<empireastral></empireastral>");
    input = input.replace(" Empire Nature Affinity", "");
    input = input.replace(" Empire Order Affinity", "");
    input = input.replace(" Empire Materium Affinity", "");
    input = input.replace(" Empire Chaos Affinity", "");
    input = input.replace(" Empire Shadow Affinity", "");
    return input;
}

function findTraitsWithArgument(argumentType, affinity) {
    let i,
        output,
        textvalue,
        j,
        l,
        k,
        x,
        result = "";

    let finalCheckedList = [];
    if (argumentType != "") {
        for (j in jsonFactionCreation2) {
            if (jsonFactionCreation2[j].type.toUpperCase().indexOf(argumentType.toUpperCase()) !== -1) {
                if (affinity != "") {
                    if ("affinities" in jsonFactionCreation2[j])
                        for (let index = 0; index < jsonFactionCreation2[j].affinities.length; index++) {
                            if (
                                jsonFactionCreation2[j].affinities[index].name
                                    .toUpperCase()
                                    .indexOf(affinity.toUpperCase()) != -1
                            ) {
                                if (
                                    jsonFactionCreation2[j].enabled == true &&
                                    jsonFactionCreation2[j].id != "guardians_of_nature__goodact__"
                                ) {
                                    finalCheckedList.push(jsonFactionCreation2[j].id);
                                }
                            }
                        }
                } else {
                    if (
                        jsonFactionCreation2[j].enabled == true &&
                        jsonFactionCreation2[j].id != "guardians_of_nature__goodact__"
                    ) {
                        finalCheckedList.push(jsonFactionCreation2[j].id);
                    }
                }
            }

            if (argumentType == "Visions") {
                if (jsonFactionCreation2[j].name.indexOf("Vision of") != -1) {
                    finalCheckedList.push(jsonFactionCreation2[j].id);
                }
            }
        }

        for (j in jsonFactionCreation) {
            if (jsonFactionCreation[j].type.toUpperCase() == argumentType.toUpperCase()) {
                finalCheckedList.push(jsonFactionCreation[j].id);
            }

            if (argumentType == "Visions") {
                if (jsonFactionCreation[j].type == "SubSociety") {
                    finalCheckedList.push(jsonFactionCreation[j].id);
                }
            }
        }
    }

    return finalCheckedList;
}

function findStructuresWithArgument(income, argumentType, includeprovince) {
    let i,
        output,
        affinity,
        textvalue,
        j,
        l,
        k,
        x,
        result = "";

    let finalCheckedList = [];
    if (argumentType != "") {
        for (j in jsonStructureUpgrades) {
            if (jsonStructureUpgrades[j].name.toUpperCase().indexOf(argumentType.toUpperCase()) !== -1) {
                if (includeprovince === jsonStructureUpgrades[j].is_sector_upgrade) {
                    finalCheckedList.push(jsonStructureUpgrades[j].id);
                }
            }
        }
    }
    if (income != "") {
        for (k in jsonStructureUpgrades) {
            if (jsonStructureUpgrades[k].id.toUpperCase().indexOf(income.toUpperCase()) !== -1) {
                if (includeprovince === jsonStructureUpgrades[k].is_sector_upgrade) {
                    finalCheckedList.push(jsonStructureUpgrades[k].id);
                }
            }
        }
    }

    return finalCheckedList;
}

function findCosmicHappeningsWithArgument(argumentType) {
    let j = 0;

    let finalCheckedList = [];

    for (j in jsonCosmicHappenings) {
        if (jsonCosmicHappenings[j].type == argumentType) {
            finalCheckedList.push(jsonCosmicHappenings[j].id);
        }
    }

    return finalCheckedList;
}

function showSubDiv(event, id) {
    // Get all divs with the class 'my-div'

    let thisNameAll = document.querySelectorAll(".subCultureName");

    for (let index = 0; index < thisNameAll.length; index++) {
        thisNameAll[index].style.color = "grey";
    }
    let thisName = document.getElementById("subCultureName" + id);
    if (thisName == null) {
        return;
    }
    thisName.style.color = "white";

    let divs = document.querySelectorAll(".subDiv");

    // Hide all divs
    divs.forEach(function (div) {
        div.style.display = "none";
    });

    // Show the specific div with the given id
    let specificDiv = document.getElementById(id);
    if (specificDiv) {
        specificDiv.style.display = "block";

        // Find the first div with the class "targetClass" within the parent div
        let targetDiv = specificDiv.querySelector(".dataholder");
        // Get the first child element of the parent div
        let firstChild = targetDiv.firstElementChild;

        // Set the display property of the first child to block
        openDiv(null, firstChild.id);
    }
}

function showUnit(unitID, subcultureCheck, resID, divOrigin) {
    let unitEN = jsonUnits.find(
        (entry) =>
            entry.id === unitID &&
            (subcultureCheck === undefined || entry.sub_culture_name === subcultureCheck) &&
            depCheckResID(entry.resid) == false
    );

    if (unitEN == undefined) {
        unitEN = jsonUnitsLocalized.find(
            (entry) =>
                entry.id === unitID &&
                (subcultureCheck === undefined || entry.sub_culture_name === subcultureCheck) &&
                depCheckResID(entry.resid) == false
        );
    }

    if (!unitEN) {
        console.warn(`Couldn't find unit: ${unitID}`);
        return;
    }

    // Exit if subcultureCheck is provided and doesn't match
    if (subcultureCheck && unitEN.sub_culture_name !== subcultureCheck) {
        console.log("subcult check but wrong");
        return;
    }

    // Exit if resID is provided and doesn't match
    if (resID !== undefined && unitEN.resid !== resID) {
        return;
    }

    let unitLoc = jsonUnitsLocalized.find((entry) => entry.resid === unitEN.resid);
    // console.log(unitLoc.name);

    let unitCard = document.getElementById("unitCard");
    if (unitCard == undefined) {
        unitCard = document.getElementById("unitCard" + unitEN.id);
    }
    if (unitCard == undefined) {
        unitCard = document.getElementById("unitCard" + unitEN.id + unitEN.sub_culture_name);
    }

    imagelink = unitCard.querySelector("img#vid");
    imagelink.setAttribute("src", "/aow4db/PreviewsAvif/" + unitEN.id + ".avif");
    if (imagelink.getAttribute("src") === "/aow4db/PreviewsAvif/undefined") {
        imagelink.setAttribute("src", "/aow4db/PreviewsAvif/abductor.avif");
    }
    // }
    if (subcultureCheck == undefined) {
        unitCard.setAttribute("id", "unitCard" + unitID);
    } else {
        unitCard.setAttribute("id", "unitCard" + unitID + subcultureCheck);
    }

    let activeEnchantList;
    if (!unitCard.hasOwnProperty("activeEnchantList")) {
        activeEnchantList = [];
        unitCard.activeEnchantList = activeEnchantList;
    } else {
        activeEnchantList = unitCard.activeEnchantList;
    }
    unitNameDiv = unitCard.querySelector("span#unitstring");
    // clear
    unitNameDiv.innerHTML = "";
    let name = unitLoc.name;

    unitNameDiv.innerHTML += name.toUpperCase();

    if ("DLC" in unitEN) {
        let newDivForMount = AddDLCTag(unitEN.DLC);
        unitNameDiv.append(newDivForMount);
    }

    // if in the list of mounted, add tooltip
    if (MountedSpecialList.includes(unitID) || CheckIfOptionalCavalry(unitID)) {
        let newDivForMount = document.createElement("DIV");
        newDivForMount.className = "mountToolTip";

        imag = document.createElement("IMG");
        imag.setAttribute("src", "/aow4db/Icons/Text/MountInteraction.png");
        imag.setAttribute("height", "35px");

        spa = document.createElement("SPAN");

        spa.innerHTML =
            "If an <hyperlink>Exotic Mount Trait</hyperlink> is chosen, this unit gains that mount, even if it was not mounted before";

        newDivForMount.appendChild(imag);
        newDivForMount.appendChild(spa);
        newDivForMount.setAttribute(
            "style",
            "    text-transform: none;width: 1px;margin-left: 30px;height: 20px;float: left;"
        );
        // get position of button
        addTooltipListeners(newDivForMount, spa);
        unitNameDiv.append(newDivForMount);
    }

    let hpspan = document.createElement("span");

    const hpText = findBy(jsonAllFromPOLocalized, "id", "CONCEPT@HITPOINTS");
    hpspan.innerHTML =
        '<span style="color:burlywood;text-transform: uppercase ">' +
        hpText.hyperlink +
        '</span><br><span style="font-size: 14px;">' +
        hpText.description +
        "</span>";
    let hpTooltip = unitCard.querySelector("div#hp_tt");

    addTooltipListeners(hpTooltip, hpspan);

    let hp = unitCard.querySelector("p#hp");

    let hpvalue = unitEN.hp;
    hp.innerHTML = unitEN.hp;

    const critText = findBy(jsonAllFromPOLocalized, "id", "CONCEPT@CRITICAL_HIT");

    let critspan = document.createElement("span");
    critspan.innerHTML =
        '<span style="color:burlywood;text-transform: uppercase;">Critical Hit Chance</span><br><span style="font-size: 14px;">' +
        critText.description +
        "</span>";
    let critTooltip = unitCard.querySelector("div#crit_tt");

    addTooltipListeners(critTooltip, critspan);

    let crit = unitCard.querySelector("p#crit");
    crit.innerHTML = "+" + 0 + "%";

    const damageRedText = findBy(jsonAllFromPOLocalized, "id", "INTERFACE@TEXT");

    const defenseText = findBy(jsonAllFromPOLocalized, "id", "INTERFACE@HUD_GENERAL_INFO");
    let armorspan = document.createElement("span");
    armorspan.innerHTML =
        '<span style="color:burlywood;text-transform: uppercase ">Defense</span><br><span style="font-size: 14px;">' +
        defenseText.armor_description +
        damageRedText.damage_reduction +
        " : " +
        '<br><damagePhysical></damagePhysical> :  <span style="color:white;">' +
        GetDamageReductionPercentage(unitEN.armor) +
        '</span> ( From <span style="color:white;">' +
        unitEN.armor +
        "</span> <defense> </defense>)" +
        "</p></span>";
    let armorTooltip = unitCard.querySelector("div#armor_tt");

    addTooltipListeners(armorTooltip, armorspan);

    armor = unitCard.querySelector("p#armor");
    let armorValue = unitEN.armor;
    armor.innerHTML = armorValue;

    shield = unitCard.querySelector("p#resistence");
    let shieldValue = unitEN.resistance;
    shield.innerHTML = shieldValue;

    mp = unitCard.querySelector("p#mp");
    mp.innerHTML = unitEN.mp;

    tier = unitCard.querySelector("p#tier");
    //

    prodcost = unitCard.querySelector("p#productioncost");
    prodcost.innerHTML = "Cost: " + unitEN.cost;
    let additionalBlight, additionalShock, additionalFire, additionalSpirit, additionalFrost;
    movementDiv = document.createElement("div");

    let unitStat = unitCard.querySelector("div#unitstat");
    unitStat.innerHTML = "";

    let resistanceHolder = unitCard.querySelector("div#resistanceholder");
    resistanceHolder.innerHTML = "";

    let unitType = "";
    for (let j in unitLoc.secondary_passives) {
        let unitTypeTest = addUnitTypeIcon(unitEN.secondary_passives[j].slug, unitStat, unitCard);
        if (unitTypeTest != "") {
            unitType = unitTypeTest;
        }
        /*if (unitEN.secondary_passives[j].slug.indexOf("floating") != -1) {
            movementDiv.innerHTML =
                'Movement Abilities :  <span style="color:white;"> <bullet>Floating</bullet></span><br>';
        }
        if (unitEN.secondary_passives[j].slug.indexOf("flying") != -1) {
            movementDiv.innerHTML =
                'Movement Abilities :  <span style="color:white;"> <bullet>Flying</bullet></span><br>';
        }*/
    }
    let mpspan = document.createElement("span");
    mpspan.innerHTML =
        '<span style="color:burlywood;text-transform: uppercase;">Move Points</span><br>' +
        movementDiv.innerHTML +
        '</p><span style="font-size: 14px;">' +
        defenseText.move_points_description +
        "</span>";
    let mpTooltip = unitCard.querySelector("div#mp_tt");

    addTooltipListeners(mpTooltip, mpspan);

    if (CheckIfFormUnit(unitEN)) {
        btn = document.createElement("DIV");
        btn.className = "unittype_icon";
        imag = document.createElement("IMG");
        span = document.createElement("SPAN");
        imag.setAttribute("src", "/aow4db/Icons/FactionCreation/human.png");

        imag.setAttribute("width", "40");
        imag.setAttribute("height", "40");

        span.innerHTML =
            '<img style="float:left; height:30px; width:30px" src="/aow4db/Icons/FactionCreation/human.png"><p style="color: #d7c297" class="abilityHighLighter">' +
            '<span style="font-size=20px;">FORM UNIT</span></p>' +
            "<br> This unit will use a Form and Form Traits";

        unitStat.appendChild(btn);

        addTooltipListeners(btn, span);

        btn.appendChild(imag);
    }

    // find enchant button, give it unit data

    let enchantButton = unitCard.querySelector("button#enchantButton");
    let enchantHolder = unitCard.querySelector("div#enchantHolder");
    let activeEnchant = unitCard.querySelector("div#activeEnchants");

    enchantButton.param = unitType;
    enchantButton.activeListHolder = activeEnchant;
    enchantButton.unit = unitEN.id;
    enchantButton.unitData = unitEN;
    enchantButton.originDiv = unitCard;

    enchantButton.activeEnchantList = activeEnchantList;
    enchantButton.addEventListener("click", ShowPossibleEnchantments);

    // make a list on the unit, not on the buttons

    let unitTabHolder = unitCard.querySelector("div#unitabholder");
    unitTabHolder.innerHTML = "";

    const ab = jsonUnitAbilities.find((entry) => entry.slug === unitEN.medal_rewards_5[0].slug);
    // champion upgrade
    let splitName = null;
    if (ab.name.indexOf("Champion") != -1) {
        splitName = ab;
    }

    for (let k in unitLoc.abilities) {
        // check if its got a unique medal

        addAbilityslot(unitEN.abilities[k].slug, unitTabHolder, activeEnchantList, null, splitName);
    }

    if (unitEN.status_resistance != "0") {
        addstatusResistanceSlot(unitEN.status_resistance, resistanceHolder);
    }

    for (let z in unitEN.resistances) {
        addResistanceSlot(unitEN.resistances[z].slug, unitEN.resistance, resistanceHolder);
        if (unitEN.resistances[z].slug.toUpperCase().indexOf("BLIGHT") != -1) {
            additionalBlight = ReturnWeaknessOrResistanceNumber(unitEN.resistances[z].slug);
        }
        if (unitEN.resistances[z].slug.toUpperCase().indexOf("FIRE") != -1) {
            additionalFire = ReturnWeaknessOrResistanceNumber(unitEN.resistances[z].slug);
        }
        if (unitEN.resistances[z].slug.toUpperCase().indexOf("FROST") != -1) {
            additionalFrost = ReturnWeaknessOrResistanceNumber(unitEN.resistances[z].slug);
        }

        if (unitEN.resistances[z].slug.toUpperCase().indexOf("LIGHTNING") != -1) {
            additionalShock = ReturnWeaknessOrResistanceNumber(unitEN.resistances[z].slug);
        }
        if (unitEN.resistances[z].slug.toUpperCase().indexOf("SPIRIT") != -1) {
            additionalSpirit = ReturnWeaknessOrResistanceNumber(unitEN.resistances[z].slug);
        }
    }

    const tierText = findBy(jsonAllFromPOLocalized, "id", "INTERFACE@TEXT");
    tier.innerHTML = tierText.tier + " " + romanize(unitEN.tier) + ": " + unitEN.upkeep;

    let summonInfo = canBeSummoned(unitEN.id);
    if (summonInfo == true) {
        tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(unitEN.tier, "");
    }

    let critChance = 0;
    let lowUpkeep = false;
    let faithfulUpkeep = false;
    let x = "";

    let t = "";

    let y = "";
    for (y in unitEN.secondary_passives) {
        if (unitEN.secondary_passives[y].icon == "findMgicOrinIcon") {
            if (lowUpkeep === true) {
                tier.innerHTML = "Tier " + romanize(unitEN.tier) + ": " + getSummonedUpkeep(unitEN.tier, 0.75);
            } else if (faithfulUpkeep === true) {
                tier.innerHTML = "Tier " + romanize(unitEN.tier) + ": " + getSummonedUpkeep(unitEN.tier, 0.9);
            } else {
                tier.innerHTML = "Tier " + romanize(unitEN.tier) + ": " + getSummonedUpkeep(unitEN.tier, "");
            }

            if (summonInfo.length > 0) {
                let p = "";
                for (p in summonInfo) {
                    let castcost = "";
                    if (summonInfo[p].tactical === true) {
                        castcost = summonInfo[p].operation_point_cost + "<casttactical></casttactical>";
                    } else {
                        castcost = summonInfo[p].operation_point_cost + "<caststrategic></caststrategic>";
                    }
                    prodcost.innerHTML = "<br> Spell: " + summonInfo[p].casting_cost + castcost;
                }
            }
        }
    }
    for (x in activeEnchantList) {
        for (k = 0; k < jsonEnchantments.length; k++) {
            if (jsonEnchantments[k].id === activeEnchantList[x].id) {
                if ("hp" in jsonEnchantments[k]) {
                    hpvalue += jsonEnchantments[k].hp;
                    hp.innerHTML = hpvalue + "*";
                }
                if ("mp" in jsonEnchantments[k]) {
                    mp.innerHTML = jsonEnchantments[k].mp + "*";
                }

                if ("resistance" in jsonEnchantments[k]) {
                    shieldValue += jsonEnchantments[k].resistance;
                    shield.innerHTML = shieldValue + "*";
                }
                if ("armor" in jsonEnchantments[k]) {
                    armorValue += jsonEnchantments[k].armor;
                    armor.innerHTML = armorValue + "*";
                }
                if ("crit" in jsonEnchantments[k]) {
                    critChance += parseInt(jsonEnchantments[k].crit);
                    crit.setAttribute("style", "display:block");
                    crit.innerHTML = "+" + critChance + "%";
                }
                if ("passive" in jsonEnchantments[k]) {
                    for (t = 0; t < jsonEnchantments[k].passive.length; t++) {
                        addPassiveslot(jsonEnchantments[k].passive[t].slug, unitTabHolder, true);

                        if (jsonEnchantments[k].passive[t].slug.indexOf("faithful") != -1) {
                            console.log("faithful found");
                            tier.innerHTML =
                                "Tier " +
                                romanize(unitEN.tier) +
                                ": " +
                                ReduceUpkeepPercentage(unitEN.upkeep, 0.9) +
                                "*";
                            let faithfulUpkeep = true;
                        }
                    }
                }

                if ("passive_unique" in jsonEnchantments[k]) {
                    for (t = 0; t < jsonEnchantments[k].passive_unique.length; t++) {
                        let overwrite = "";
                        if ("overwriteName" in jsonEnchantments[k].passive_unique[t]) {
                            overwrite = jsonEnchantments[k].passive_unique[t].overwriteName;
                        }
                        addUniquePassiveSlot(
                            activeEnchantList[x],
                            jsonEnchantments[k].passive_unique[t].description,
                            unitTabHolder,
                            overwrite
                        );
                    }
                }

                if ("active" in jsonEnchantments[k]) {
                    for (t = 0; t < jsonEnchantments[k].active.length; t++) {
                        addAbilityslot(jsonEnchantments[k].active[t].slug, unitTabHolder, activeEnchantList, true);
                    }
                }
            }
        }
    }

    for (let x = 0; x < unitEN.primary_passives.length; x++) {
        addPassiveslot(unitEN.primary_passives[x].slug, unitTabHolder);

        if (unitEN.primary_passives[x].icon == "findlowmaintenanceicon") {
            if (unitEN.upkeep.indexOf("influence") != -1) {
                tier.innerHTML =
                    "Tier " + romanize(unitEN.tier) + ": " + ReduceUpkeepPercentage(unitEN.upkeep, 0.75) + "*";
            } else {
                tier.innerHTML =
                    "Tier " + romanize(unitEN.tier) + ": " + ReduceUpkeepPercentage(unitEN.upkeep, 0.75) + ">*";
            }
            let lowUpkeep = true;

            if (summonInfo.length > 0) {
                tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(unitEN.tier, 0.75) + "*";
            }
        }

        if (unitEN.primary_passives[x].slug.indexOf("high_maintenance") != -1) {
            if (unitEN.upkeep.indexOf("influence") != -1) {
                tier.innerHTML =
                    "Tier " + romanize(unitEN.tier) + ": " + ReduceUpkeepPercentage(unitEN.upkeep, 1.5) + "*";
            } else {
                tier.innerHTML =
                    "Tier " + romanize(unitEN.tier) + ": " + ReduceUpkeepPercentage(unitEN.upkeep, 1.5) + ">*";
            }

            let lowUpkeep = true;

            if (summonInfo.length > 0) {
                if (unitEN.upkeep.indexOf("influence") != -1) {
                    tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(unitEN.tier, 1.5) + "*";
                } else {
                    tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(unitEN.tier, 1.5) + ">*";
                }
            }
        }

        if (unitEN.primary_passives[x].slug.indexOf("faithful") != -1) {
            if (unitEN.upkeep.indexOf("influence") != -1) {
                tier.innerHTML =
                    "Tier " + romanize(unitEN.tier) + ": " + ReduceUpkeepPercentage(unitEN.upkeep, 0.9) + "*";
            } else {
                tier.innerHTML =
                    "Tier " + romanize(unitEN.tier) + ": " + ReduceUpkeepPercentage(unitEN.upkeep, 0.9) + ">*";
            }

            let faithfulUpkeep = true;

            if (summonInfo.length > 0) {
                if (unitEN.upkeep.indexOf("influence") != -1) {
                    tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(unitEN.tier, 0.9) + "*";
                } else {
                    tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(unitEN.tier, 0.9) + ">*";
                }
            }
        }
    }

    y = "";

    function createResistanceEntry(type, label, baseResistance, additionalValue) {
        // Handle immunity special case
        if (additionalValue === "immune") {
            return `${label}: Immune<br>`;
        }

        let totalReduction = GetDamageReductionPercentage(baseResistance, additionalValue);
        let valueText = additionalValue != null ? (additionalValue > 0 ? `+${additionalValue}` : additionalValue) : "";
        let tagName = `defense${type.toLowerCase()}`;

        return `${label} : <span style="color:white;">${totalReduction}</span> 
        ( From <span style="color:white;">${baseResistance}</span> 
        <resistance></resistance>${valueText ? ` ${valueText}<${tagName}></${tagName}>` : ""}
        )<br>`;
    }

    function generateResistanceHTML(unitEN, resistances) {
        const base = unitEN.resistance;
        let resistanceHTML = "";

        for (const res of resistances) {
            resistanceHTML += createResistanceEntry(res.type, res.label, base, res.value);
        }

        return resistanceHTML;
    }

    // Define your resistance types and values here
    const resistances = [
        { type: "blight", label: "<damageBlight></damageBlight>", value: additionalBlight },
        { type: "shock", label: "<damageLightning></damageLightning>", value: additionalShock },
        { type: "fire", label: "<damageFire></damageFire", value: additionalFire },
        { type: "spirit", label: "<damageSpirit></damageSpirit>", value: additionalSpirit },
        { type: "frost", label: "<damageFrost></damageFrost>", value: additionalFrost }
    ];

    // Create the tooltip content
    const resistanceDiv = document.createElement("div");
    resistanceDiv.innerHTML = generateResistanceHTML(unitEN, resistances);

    const resistanceSpan = document.createElement("span");
    resistanceSpan.innerHTML =
        '<span style="color:burlywood; text-transform: uppercase;">Resistance</span><br><span style="font-size: 14px;">' +
        defenseText.resistance_description +
        "<br><br>" +
        damageRedText.damage_reduction +
        ":<br>" +
        resistanceDiv.innerHTML +
        "</span>";

    const resistanceTooltip = unitCard.querySelector("div#resistence_tt");
    addTooltipListeners(resistanceTooltip, resistanceSpan);
    addLevelUpInfo(unitEN, unitID, unitCard);
    // backtrack origin;
    backtrackUnitOrigins(unitEN, unitEN.name, unitCard);
}

function canBeSummoned(id) {
    if (findParentByNested(jsonSpells, "summoned_units", "slug", id) != undefined) {
        return true;
    }
    return false;
}

function getSummonedUpkeep(tier, lowMaintenance) {
    const upkeepTable = {
        1: "8<mana></mana>",
        2: "12<mana></mana>",
        3: "20<mana></mana>",
        4: "30<mana></mana> 3<influence></influence>",
        5: "60<mana></mana> 7<influence></influence>"
    };
    const base = upkeepTable[tier];
    if (!base) return ""; // fallback if invalid tier

    return lowMaintenance ? ReduceUpkeepPercentage(base, lowMaintenance) : base;
}

function createFoundUnitInHereIcon(parent, imgSrc, imgFallbackSrc, link, tooltipText, overIcon) {
    let btn = document.createElement("DIV");
    btn.className = "unittype_icon";
    let imag = document.createElement("IMG");
    let spa = document.createElement("SPAN");

    spa.innerHTML = tooltipText;
    imag.setAttribute("src", imgSrc);
    imag.setAttribute("onerror", `this.setAttribute('src','${imgFallbackSrc}')`);
    imag.setAttribute("width", "60");
    imag.setAttribute("height", "60");

    btn.appendChild(imag);

    /* if(overIcon != undefined){
        // add icon type
         let imagOver = document.createElement("IMG");
          imagOver.setAttribute("src", overIcon);
          imagOver.setAttribute("width", "60");
    imagOver.setAttribute("height", "60");
        btn.appendChild(imagOver);
        
        
    }*/
    let wrap = btn.innerHTML;
    btn.innerHTML = `<a href="${link}" target="_blank">${wrap}</a>`;

    addTooltipListeners(btn, spa);
    parent.appendChild(btn);
}

function backtrackUnitOrigins(unitData, name, holder) {
    if (name == "Guardian" || name == "Astra") {
        name = name + " ";
    }

    let holderOrigin = holder.querySelectorAll("div#originHolder")[0];
    holderOrigin.innerHTML = "";
    let culture = "thing";
    if ("culture_name" in unitData) {
        culture = unitData.culture_name.toLowerCase();
    }

    if (culture != "thing") {
        const capitalized = culture.charAt(0).toUpperCase() + culture.slice(1);
        const tooltipText = `Culture Unit from <hyperlink>${capitalized}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/Text/${culture}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/${capitalized}Units.html`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let subculture = "";
    if ("sub_culture_name" in unitData && !architectCultureUnits.includes(unitData.id)) {
        subculture = unitData.sub_culture_name.toLowerCase().replaceAll(" ", "_");
        if (culture == "primal") {
            subculture = "primal_" + subculture;
        }
    }
    if (subculture != "") {
        const capitalized = subculture.charAt(0).toUpperCase() + subculture.slice(1);
        const tooltipText = `Subculture Unit from <hyperlink>${capitalized}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/Text/${subculture}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        //  const link = `/aow4db/HTML/${capitalized}Units.html`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, null, tooltipText);
    }

    let tomes = CheckIfInTomes(unitData.id);
    for (let x = 0; x < tomes.length; x++) {
        const tooltipText = `Unit production unlocked from Tier <hyperlink>${romanize(tomes[x].tier)} - ${showAffinitySymbols(tomes[x])} ${tomes[x].name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/TomeIcons/${tomes[x].id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?tome=${tomes[x].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let spells = CheckIfInSpells(unitData.id, name);

    for (let x = 0; x < spells.length; x++) {
        let tierandnameoftome = backtraceTomeNameAndTier(spells[x].id);
        let tooltipText =
            tierandnameoftome != ""
                ? `Unit mentioned in Spell: <hyperlink>${spells[x].name}</hyperlink> <br>in Tier <hyperlink>${romanize(tierandnameoftome.tier)} - ${showAffinitySymbols(tierandnameoftome)} ${tierandnameoftome.name}</hyperlink>`
                : `Unit mentioned in Spell: <hyperlink>${spells[x].name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/SpellIcons/${spells[x].id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?spell=${spells[x].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let siege = CheckIfInSiege(name);
    for (let x = 0; x < siege.length; x++) {
        const tooltipText = `Unit mentioned in Siege Project <hyperlink>${siege[x].name}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/SiegeProjectIcons/${siege[x].icon}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?siege=${siege[x].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let struc = CheckIfInStructure(unitData.id, name);
    for (let x = 0; x < struc.length; x++) {
        const tooltipText = `Unit mentioned in Structure <hyperlink>${struc[x].name}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/UpgradeIcons/${struc[x].icon}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?structure=${struc[x].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let traitFound = CheckIfInTraits(unitData.id);
    for (let x = 0; x < traitFound.length; x++) {
        const tooltipText = `Unit added by Faction Trait <hyperlink>${traitFound[x].name}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/TraitIcons/${traitFound[x].id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?trait=${traitFound[x].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let wonder = CheckIfInAncientWonder(unitData.id);
    for (let x = 0; x < wonder.length; x++) {
        // if landmark different text:
        let tooltipText = "";
        if (wonder[x].type == "Landmark") {
            tooltipText = `Unit unlocked from <landmark></landmark> <hyperlink>${wonder[x].type}</<hyperlink> : <hyperlink>${wonder[x].name}</<hyperlink>`;
        } else {
            tooltipText = `Rally Unit unlocked from <hyperlink>${wonder[x].type}</<hyperlink> : <hyperlink>${wonder[x].name}</<hyperlink>`;
        }
        if ("other_unlock" in wonder[x]) {
            tooltipText = `Unit available in <hyperlink>${wonder[x].type}</<hyperlink> : <hyperlink>${wonder[x].name}</<hyperlink>`;
        }
        const imgSrc = `/aow4db/Icons/StructurePics/${wonder[x].id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?wonder=${wonder[x].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText, wonder[x]);
    }

    let tree = CheckIfInEmpireTree(name);
    for (let x = 0; x < tree.length; x++) {
        const tooltipText = `Unit mentioned in <hyperlink>${tree[x].category} ${tree[x].required_level}</<hyperlink> : <hyperlink>${tree[x].name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/EmpireProgressionIcons/${tree[x].id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/EmpireTree.html`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let unitAbility = CheckIfFromAbility(name);

    for (let x = 0; x < unitAbility.length; x++) {
        const tooltipText = `Unit mentioned in Ability <hyperlink>${unitAbility[x][1].name}</hyperlink> of Unit <hyperlink>${unitAbility[x][0].name}</hyperlink>`;
        const imgSrc =
            unitAbility[0] != ""
                ? `/aow4db/Icons/UnitIcons/${unitAbility[x][1].icon}.png`
                : `/aow4db/Icons/HeroSkillIcons/${unitAbility[x][1].icon}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Units.html?unit=${unitAbility[x][0].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let heroSkill = CheckIfFromHeroSkill(name);
    for (let x = 0; x < heroSkill.length; x++) {
        const tooltipText = `Unit mentioned in Hero Skill <hyperlink>${heroSkill[x][1].name}</hyperlink>`;
        const imgSrc =
            heroSkill[x][0] != ""
                ? `/aow4db/Icons/UnitIcons/${heroSkill[x][0].icon}.png`
                : `/aow4db/Icons/HeroSkillIcons/${heroSkill[x][1].icon}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?skill=${heroSkill[x][1].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let governance = CheckIfFromGovernance(name);
    for (let x = 0; x < governance.length; x++) {
        const tooltipText = `Unit mentioned in Governance <hyperlink>${governance[x].name}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/GovernanceIcons/${governance[x].icon}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?governance=${governance[x].id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    let evolve = CheckIfEvolveTarget(unitData.id);
    if (evolve != "") {
        const tooltipText = `Evolved/Promoted from Unit <hyperlink>${evolve.name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/UnitIcons/evolve.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Units.html?unit=${evolve.id}`;
        createFoundUnitInHereIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }
}

function showAffinitySymbols(tomes) {
    if (tomes.affinities === undefined) {
        return "";
    }
    let affinitiesdual = tomes.affinities.split(", ");

    let allAffinity = "";
    let i = "";
    for (i in affinitiesdual) {
        let affinities = affinitiesdual[i];

        allAffinity += affinities;
    }
    allAffinity = ClearAffinityExtraTags(duplicateTags(allAffinity));
    allAffinity = allAffinity.replaceAll(",", "");

    return allAffinity;
}

function CheckIfInSpells(unitID, unitName) {
    let spell = [];
    // check for duplicates

    const escapedName = escapeRegex(unitName.trim()).replace(/\s+/g, "\\s+");
    // Match <hyperlink> NAME </hyperlink> with flexible spaces around name
    const regex = new RegExp(`<hyperlink>\\s*${escapedName}\\s*<\\/hyperlink>`, "i");

    let spellIDChecker = [];
    let i = 0;
    for (i in jsonSpells) {
        if ("summoned_units" in jsonSpells[i] && jsonSpells[i].id != "invalid") {
            let k = 0;
            for (k in jsonSpells[i].summoned_units) {
                if (unitID === jsonSpells[i].summoned_units[k].slug) {
                    if (!isInArray(spellIDChecker, jsonSpells[i].id)) {
                        spell.push(jsonSpells[i]);
                        spellIDChecker.push(jsonSpells[i].id);
                    }
                }
            }
        }
        if (regex.test(jsonSpells[i].description)) {
            if (!isInArray(spellIDChecker, jsonSpells[i].id)) {
                spell.push(jsonSpells[i]);
                spellIDChecker.push(jsonSpells[i].id);
            }
        }
    }
    return spell;
}

function CheckIfFromAbility(unitName) {
    let ability = new Set();
    let i = 0;
    const escapedName = escapeRegex(unitName.trim()).replace(/\s+/g, "\\s+");
    // Match <hyperlink> NAME </hyperlink> with flexible spaces around name
    const regex = new RegExp(`<hyperlink>\\s*${escapedName}\\s*<\\/hyperlink>`, "i");

    for (i in jsonUnitAbilities) {
        if (unitName === "Fire Runestone") {
            unitName = "Runestone";
        }
        if (regex.test(jsonUnitAbilities[i].description)) {
            //   if (jsonUnitAbilities[i].description.indexOf(unitName) != -1) {
            ability.add(jsonUnitAbilities[i]);
        }
    }

    let unitslugLookup = new Set();

    const arrayAbilities = Array.from(ability);

    for (let x = 0; x < arrayAbilities.length; x++) {
        let j = 0;
        for (j in jsonUnits) {
            let k = 0;
            for (k in jsonUnits[j].abilities) {
                if (jsonUnits[j].abilities[k].slug === arrayAbilities[x].slug) {
                    unitslugLookup.add([jsonUnits[j], arrayAbilities[x]]);
                }
            }
            let l = 0;
            for (l in jsonUnits[j].primary_passives) {
                if (jsonUnits[j].primary_passives[l].slug === arrayAbilities[x].slug) {
                    unitslugLookup.add([jsonUnits[j], arrayAbilities[x]]);
                }
            }
        }
    }
    // console.log(unitslugLookup);
    return Array.from(unitslugLookup);
}

function CheckIfFromHeroSkill(unitName) {
    let resultslist = new Set();
    let hero = new Set();
    const escapedName = escapeRegex(unitName.trim()).replace(/\s+/g, "\\s+");
    // Match <hyperlink> NAME </hyperlink> with flexible spaces around name
    const regex = new RegExp(`<hyperlink>\\s*${escapedName}\\s*<\\/hyperlink>`, "i");

    for (let i in jsonUnitAbilities) {
        if (regex.test(jsonUnitAbilities[i].description)) {
            hero.add(jsonUnitAbilities[i]);
        }
    }

    const heroList = Array.from(hero);
    let j = 0;
    for (j in jsonHeroSkills) {
        for (let x = 0; x < heroList.length; x++) {
            if ("abilities" in jsonHeroSkills[j]) {
                let k = 0;
                for (k in jsonHeroSkills[j].abilities) {
                    if (jsonHeroSkills[j].abilities[k].slug === heroList[x].slug) {
                        resultslist.add([heroList[x], jsonHeroSkills[j]]);
                    }
                }
            }
        }
        let k = 0;

        if (regex.test(jsonHeroSkills[j].description)) {
            resultslist.add(["", jsonHeroSkills[j]]);
        }
    }
    console.log(Array.from(resultslist));
    return Array.from(resultslist);
}

function CheckIfFromGovernance(unitName) {
    let governance = new Set();

    const escapedName = escapeRegex(unitName.trim()).replace(/\s+/g, "\\s+");
    // Match <hyperlink> NAME </hyperlink> with flexible spaces around name
    const regex = new RegExp(`<hyperlink>\\s*${escapedName}\\s*<\\/hyperlink>`, "i");

    let i = 0;
    for (i in jsonHeroGovernance) {
        if (jsonHeroGovernance[i].screen_description.indexOf(unitName) != -1) {
            governance.add(jsonHeroGovernance[i]);
        }
    }
    return Array.from(governance);
}

function CheckIfInSiege(unitName) {
    let siege = new Set();
    let i = 0;

    const escapedName = escapeRegex(unitName.trim()).replace(/\s+/g, "\\s+");
    // Match <hyperlink> NAME </hyperlink> with flexible spaces around name
    const regex = new RegExp(`<hyperlink>\\s*${escapedName}\\s*<\\/hyperlink>`, "i");

    for (i in jsonSiegeProjects) {
        if (regex.test(jsonSiegeProjects[i].description)) {
            siege.add(jsonSiegeProjects[i]);
        }
    }
    return Array.from(siege);
}

function CheckIfInStructure(id, unitName) {
    let structure = new Set();
    let i = 0;
    if (unitName == "Architect") {
        // skip architect as a word
        return [];
    }

    const escapedName = escapeRegex(unitName.trim()).replace(/\s+/g, "\\s+");
    // Match <hyperlink> NAME </hyperlink> with flexible spaces around name
    const regex = new RegExp(`<hyperlink>\\s*${escapedName}\\s*<\\/hyperlink>`, "i");
    if (unitName == "Titan") {
        const archonGate = findBy(jsonStructureUpgrades, "id", "_teleporter___archon_gate");
        structure.add(archonGate);
        return Array.from(structure);
    }

    for (i in jsonStructureUpgrades) {
        if (jsonStructureUpgrades[i].description.indexOf(unitName) != -1) {
            structure.add(jsonStructureUpgrades[i]);
        }

        if (jsonStructureUpgrades[i].description.indexOf(unitName) != -1) {
            structure.add(jsonStructureUpgrades[i]);
        }

        for (const [keyword, units] of Object.entries(unlockableUnitsMapStructures)) {
            if (jsonStructureUpgrades[i].id.indexOf(keyword) != -1) {
                // right structure
                if (units.includes(id)) {
                    structure.add(jsonStructureUpgrades[i]);
                }
            }
        }
    }

    return Array.from(structure);
}

function CheckIfInTomes(unitID) {
    let tome = new Set();

    if (unitID == "young_frost_dragon" || unitID == "young_obsidian_dragon" || unitID == "young_golden_dragon") {
        unitID = "young_fire_dragon";
    }
    let i = 0;

    for (i in jsonTomes) {
        let k = 0;
        for (k in jsonTomes[i].skills) {
            if ("unit_slug" in jsonTomes[i].skills[k]) {
                if (unitID === jsonTomes[i].skills[k].unit_slug) {
                    tome.add(jsonTomes[i]);
                }
            }
        }
    }
    return Array.from(tome);
}

function CheckIfInEmpireTree(unitName) {
    let tree = new Set();

    const escapedName = escapeRegex(unitName.trim()).replace(/\s+/g, "\\s+");
    // Match <hyperlink> NAME </hyperlink> with flexible spaces around name
    const regex = new RegExp(`<hyperlink>\\s*${escapedName}\\s*<\\/hyperlink>`, "i");
    let i = "";
    for (i in jsonEmpire) {
        if (regex.test(jsonEmpire[i].description)) {
            tree.add(jsonEmpire[i]);
        }
    }

    return Array.from(tree);
}

function CheckIfEvolveTarget(unitID) {
    let evolve = "";
    let i,
        k = "";
    for (i in jsonUnits) {
        if ("evolve_target" in jsonUnits[i]) {
            if (unitID === jsonUnits[i].evolve_target) {
                evolve = jsonUnits[i];
            }
        }
    }
    return evolve;
}

function CheckIfInTraits(unitID) {
    let wonder = new Set();
    let i,
        k = "";
    for (i in jsonFactionCreation) {
        if ("unit_unlocks" in jsonFactionCreation[i]) {
            for (k in jsonFactionCreation[i].unit_unlocks) {
                if (unitID === jsonFactionCreation[i].unit_unlocks[k].slug) {
                    wonder.add(jsonFactionCreation[i]);
                }
            }
        }
    }
    return Array.from(wonder);
}

function CheckIfInAncientWonder(unitID) {
    let wonder = new Set();
    let i,
        k = "";
    for (i in jsonWorldStructures) {
        if ("unit_unlocks" in jsonWorldStructures[i]) {
            for (k in jsonWorldStructures[i].unit_unlocks) {
                if (unitID === jsonWorldStructures[i].unit_unlocks[k].slug) {
                    wonder.add(jsonWorldStructures[i]);
                }
            }
        }
    }
    return Array.from(wonder);
}

function ReduceUpkeepPercentage(value, percentage) {
    let number = value.split("<");
    let reducedUpkeep = Math.round(percentage * parseInt(number[0]));
    let comb = reducedUpkeep + "<" + number[1] + "<" + number[2];
    if (number.length > 2) {
        comb += "<" + number[3] + "<" + number[4];
    }

    return comb;
}

function ReturnWeaknessOrResistanceNumber(slug) {
    if (slug.indexOf("weakness") !== -1) {
        let split = slug.split("weakness_");
        abilityDam = "-" + split[1];
    }
    if (slug.indexOf("resistance") !== -1) {
        let split = slug.split("resistance_");
        abilityDam = split[1];
    }
    if (slug.indexOf("immunity") !== -1) {
        abilityDam = "immune";
    }

    return abilityDam;
}

function GetDamageReductionPercentage(number, additionalNumber) {
    if (additionalNumber === undefined) {
        additionalNumber = 0;
    }
    let combinedDefense = parseInt(number) + parseInt(additionalNumber);
    let defensePercentage = 0;
    if (combinedDefense >= 0) {
        defensePercentage = 1 - Math.pow(0.9, combinedDefense);
    } else {
        defensePercentage = -(1 - Math.pow(0.9, -combinedDefense));
    }

    let percentage = Math.round(defensePercentage * 100);
    if (percentage > 0) {
        percentage = '<span style="color:lawngreen">' + percentage + "%</span>";
    }
    if (percentage < 0) {
        percentage = '<span style="color:red">' + percentage + "%</span>";
    }

    if (additionalNumber === "x") {
        percentage = "Immune";
    }
    return percentage;
}
function addLevelUpInfo(units, a, holder) {
    const levelup = holder.querySelector("div#levelup");
    levelup.innerHTML = "";

    const xpByTier = {
        1: 4,
        2: 6,
        3: 8,
        4: 10,
        5: 12
    };
    const xpNeeded = xpByTier[units.tier] || 0;
    const evolveTarget = units.evolve_target;

    const medals = [
        { name: "Soldier", icon: "medal_soldier", xp: 1, rewards: units.medal_rewards_2 },
        { name: "Veteran", icon: "medal_veteran", xp: 2, rewards: units.medal_rewards_3 },
        { name: "Elite", icon: "medal_elite", xp: 3, rewards: units.medal_rewards_4 },
        { name: "Champion", icon: "medal_champion", xp: 4, rewards: units.medal_rewards_5 },
        {
            name: "Legend",
            icon: "medal_legend",
            xp: evolveTarget ? 4 : 10,
            rewards: evolveTarget ? [] : units.medal_rewards_6
        }
    ];

    // Add medal sections
    for (const medal of medals) {
        addMedalEntry(medal.name, medal.icon, xpNeeded * medal.xp, levelup);
        addRewards(medal.rewards, levelup);
    }

    // If the unit evolves, show evolution link
    if (evolveTarget) {
        const levelText = `<bullet> Evolves/Promotes into <hyperlink><a href="/aow4db/HTML/Units.html?unit=${evolveTarget}" target="_blank">${lookupUnit(evolveTarget)}</a></hyperlink></bullet>`;
        levelup.append(NewLevelUpEntry(levelText));
    }
}

function addMedalEntry(name, icon, xp, container) {
    const levelText = `<p style="color: #aadb9c;"> <${icon}></${icon}> ${name} - ${xp}<xp></xp></p>`;
    container.append(NewLevelUpEntry(levelText));
}

function addRewards(rewards = [], container) {
    for (const reward of rewards) {
        const isTooltip = reward.slug.includes("medal") || reward.slug.includes("champion_");
        const rewardText = `<bullet>${lookupSlug(reward.slug)}</bullet>`;

        if (isTooltip) {
            const entry = NewLevelUpEntry(`<p class="levelup_medal">${rewardText}`);
            const tooltip = document.createElement("span");
            tooltip.innerHTML = lookupSlugFull(reward.slug).description;
            addTooltipListeners(entry, tooltip);
            container.append(entry);
        } else {
            container.append(NewLevelUpEntry(rewardText));
        }
    }
}

function NewLevelUpEntry(spanEntry) {
    let newEntryDiv = document.createElement("div");
    newEntryDiv.innerHTML = spanEntry;
    return newEntryDiv;
}

function lookupUnit(id) {
    return findBy(jsonUnits, "id", id).name || "Couldn't find this";
}

function lookupSlug(slug) {
    return (
        findBy(jsonUnitAbilitiesLocalized, "slug", slug).name.replaceAll("<br></br>", "<br>") || "Couldn't find this"
    );
}

function lookupSlugFull(slug) {
    return findBy(jsonUnitAbilitiesLocalized, "slug", slug) || "Couldn't find this";
}

function showSiegeProject(id, showOrigin, divOrigin) {
    let siegeProject = findBy(jsonSiegeProjects, "name", id) || findBy(jsonSiegeProjects, "id", id);
    if (siegeProject != undefined) {
        const siegeLoc = findBy(jsonSiegeProjectsLocalized, "resid", siegeProject.resid);
        let modName = divOrigin.querySelector("#modname");
        modName.innerHTML = siegeLoc.name.toUpperCase();

        let descriptionDiv = divOrigin.querySelector("#moddescription");
        let description = "<hr>" + siegeLoc.description;

        description +=
            "<br>Fortification Damage:<br> +" +
            siegeLoc.siege_health_damage +
            " <siegehealthdamage></siegehealthdamage> Fortification Damage";

        let imagelink = divOrigin.querySelector("#modicon");

        imagelink.setAttribute("src", "/aow4db/Icons/SiegeProjectIcons/" + siegeProject.icon + ".png");
        descriptionDiv.innerHTML = description;

        let tier = divOrigin.querySelector("#modtier");

        tier.innerHTML = "<garrison></garrison> Siege Project";

        let cost = divOrigin.querySelector("#modcost");
        cost.innerHTML = "Cost:" + siegeLoc.cost;
        let tierSpell = backtraceTomeOriginAndTier(siegeProject, showOrigin, divOrigin);

        if (tierSpell != undefined) {
            let splitspell = tierSpell.split(",");
            modName.innerHTML +=
                '<span class="spell_tier" style="color:white;font-size:15px">  Tier ' +
                romanize(splitspell[0]) +
                "</span>";
            if ("DLC" in siegeProject && showOrigin) {
                let newDivForMount = AddDLCTag(siegeProject.DLC);

                modName.append(newDivForMount);
            }
        } else {
            modName.innerHTML += '<span class="spell_tier" style="color:white;font-size:15px">  Tier -</span>';
        }

        let upkeep = divOrigin.querySelector("#modupkeep");

        upkeep.innerHTML = "";
    } else {
        console.log("couldn't find siege project " + id);
    }
}

function showEmpireUpgrade(skill, showOrigin, divOrigin) {
    let upkeep = divOrigin.querySelector("#modupkeep");

    upkeep.innerHTML = "";

    let modName = divOrigin.querySelector("#modname");
    modName.innerHTML = skill.name.toUpperCase();
    let descriptionDiv = divOrigin.querySelector("#moddescription");
    let description = "<hr>" + skill.description;

    let imagelink = divOrigin.querySelector("#modicon");

    let imageLinkName = skill.name.replaceAll(" ", "_").toLowerCase();
    imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + imageLinkName + ".png");

    descriptionDiv.innerHTML = description;

    let tier = divOrigin.querySelector("#modtier");

    tier.innerHTML = "<empire></empire> Empire Upgrade";

    let cost = divOrigin.querySelector("#modcost");
    cost.innerHTML = "";
}

function showTome(a, divOrigin) {
    let modName,
        description,
        cost,
        type,
        tier,
        k,
        j,
        l,
        descriptionDiv = "";
    let found = false;

    let tomeEN = jsonTomes.find((entry) => entry.id === a);
    if (tomeEN === undefined) {
        console.log("Couldn't find tome: " + a);
        return;
    }
    let tomeLoc = jsonTomesLocalized.find((entry) => entry.resid === tomeEN.resid);

    modName = divOrigin.querySelector("#tomename");
    modName.innerHTML = "";

    modName.innerHTML += tomeLoc.name;
    if ("DLC" in tomeEN) {
        let newDivForMount = AddDLCTag(tomeEN.DLC);

        modName.append(newDivForMount);
    }

    descriptionDiv = divOrigin.querySelector("#tomedescription");
    description = tomeLoc.gameplay_description;
    if ("affinities" in tomeEN) {
        let affinitiesdual = tomeEN.affinities.split(", ");

        let allAffinity = "";
        for (let i = 0; i < affinitiesdual.length; i++) {
            let affinities = affinitiesdual[i].split(" ");
            allAffinity += affinities[0] + affinities[1];

            allAffinity = expandTags(allAffinity);
            allAffinity = allAffinity.replaceAll(",", "");
        }

        descriptionDiv.innerHTML = "Tier " + romanize(tomeEN.tier) + " - " + allAffinity + " " + "<br>" + description;
    } else {
        descriptionDiv.innerHTML = description;
    }
    descriptionDiv.innerHTML += "<hr>";

    let loreDescription = tomeLoc.lore_description;
    loreDescription = loreDescription.replace(String.fromCharCode(92), "");
    loreDescription = loreDescription.replace(String.fromCharCode(92), "");

    loreDescription += "<br> -" + tomeLoc.lore_author;
    let descriptionLoreDiv = divOrigin.querySelector("#tomeloredescription");
    descriptionLoreDiv.innerHTML = loreDescription;

    let unitTypesDiv = divOrigin.querySelector("#initialBonusList");

    let div = document.createElement("DIV");

    if ("affinities" in tomeLoc) {
        let affinitiesdual = tomeLoc.affinities.split(", ");

        let allAffinity = "";
        for (let i = 0; i < affinitiesdual.length; i++) {
            let affinities = affinitiesdual[i].split(" ");
            // add a new line for each additional affinity
            if (i !== 0) {
                allAffinity += "<br>";
            }
            // example output: +1 <empirenature></empirenature> Nature Affinity
            allAffinity += `+${affinities[0]} ${affinities[1]} ${affinities[3]} ${affinities[4]}`;
        }
        div.innerHTML = allAffinity;
        unitTypesDiv.appendChild(div);
    }
    // tome passives
    l = "";
    if ("passives" in tomeLoc) {
        for (l in tomeLoc.passives) {
            let div = document.createElement("DIV");
            div.className = "initialBonusText";

            div.innerHTML = "<unit></unit>" + tomeLoc.passives[l].name;

            let spa = document.createElement("SPAN");
            spa.innerHTML = tomeLoc.passives[l].type + "<br>";
            spa.innerHTML += tomeLoc.passives[l].description;

            addTooltipListeners(div, spa);

            unitTypesDiv.appendChild(div);
        }
    }
    //  special province improvements

    if ("initial_upgrades" in tomeEN) {
        for (let l = 0; l < tomeEN.initial_upgrades.length; l++) {
            let div = document.createElement("DIV");
            div.className = "initialBonusText";
            let structureEntryLoc = GetStructure(tomeEN.initial_upgrades[l].upgrade_slug);
            let name = structureEntryLoc.name;
            div.innerHTML = name;

            let spa = document.createElement("SPAN");
            spa.innerHTML =
                '<span style="color: #deb887 ;text-transform: uppercase">' +
                name +
                "</span>" +
                structureEntryLoc.description;

            //  div.appendChild(spa);
            unitTypesDiv.appendChild(div);

            addTooltipListeners(div, spa);

            unitTypesDiv.appendChild(div);
        }
    }

    for (let l = 0; l < jsonExtraAscendedInfo.length; l++) {
        // remove duplicates

        if (jsonExtraAscendedInfo[l].description.indexOf(tomeEN.name) != -1) {
            let div = document.createElement("DIV");
            div.className = "initialBonusText";
            let name = GetHeroSkillName(jsonExtraAscendedInfo[l].id);
            div.innerHTML = "<pantheon></pantheon>" + name;

            let heroSkillIconAndDesc = GetHeroSkillDescription(jsonExtraAscendedInfo[l].id);

            if (heroSkillIconAndDesc != undefined) {
                let spa2;
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
                let title = document.createElement("SPAN");
                title.innerHTML = heroSkillIconAndDesc[1].name.toUpperCase();
                title.setAttribute("style", "color:#deb887 ");

                title.innerHTML += "<br>" + "Ascension Skill" + "<br><br>";

                spa2.prepend(title);
                //div.appendChild(spa2);
                addTooltipListeners(div, spa2);
                unitTypesDiv.appendChild(div);
            }
        }
    }

    // casting points
    div = document.createElement("DIV");
    div.className = "initialBonusText initialBonusCastingPoints";
    let amount = "";
    if (tomeEN.tier != 0) {
        amount = 5;
    }

    if (amount != "") {
        div.innerHTML =
            "+" + amount + "<casttactical></casttactical>" + "+" + amount + "<caststrategic></caststrategic>";
    }

    unitTypesDiv.appendChild(div);

    let skillHolder = divOrigin.querySelector("#tome_unlocks");

    function addTomeSkillCard(holder, callback) {
        const fragment = spell_card_template.content.cloneNode(true);
        const element = fragment.firstElementChild;
        holder.appendChild(element);
        callback(element);
    }

    for (const skill of tomeEN.skills) {
        // this one doesnt have a slug for some reason, architect spell
        if (skill.name === "Conjure Elemental") {
            addTomeSkillCard(skillHolder, (el) => showSpell("conjure_elemental", false, el));
        }
        if ("spell_slug" in skill) {
            //  console.log(skill.spell_slug);
            addTomeSkillCard(skillHolder, (el) => showSpell(skill.spell_slug, false, el));
        }
        if ("unit_slug" in skill) {
            addTomeSkillCard(skillHolder, (el) => showUnitUnlock(skill, el));
        }
        if ("upgrade_slug" in skill) {
            addTomeSkillCard(skillHolder, (el) => showStructure(skill.upgrade_slug, false, el));
        }
        if (skill.type === "<hyperlink>Empire Bonus</hyperlink>") {
            addTomeSkillCard(skillHolder, (el) => showEmpireUpgrade(skill, false, el));
        }
        if (skill.type && skill.type.indexOf("Siege") !== -1) {
            addTomeSkillCard(skillHolder, (el) => showSiegeProject(skill.name, false, el));
        }
    }

    let imagelink = divOrigin.querySelector("#tomeicon");
    imagelink.setAttribute("src", "/aow4db/Icons/TomeIcons/" + tomeEN.icon + ".png");
    imagelink.setAttribute("id", "tomeicon" + a);

    // backtraceTomeOriginAndTier(jsonSpells[j].id);
}

function ShowPossibleEnchantments(evt) {
    let unitType = evt.currentTarget.param;
    let activeEnchantList;
    let holder = evt.currentTarget.originDiv.querySelectorAll("div#enchantHolder")[0];
    if (!evt.currentTarget.originDiv.hasOwnProperty("activeEnchantList")) {
        activeEnchantList = evt.currentTarget.activeEnchantList;
        holder.activeEnchantList = activeEnchantList;
    } else {
        console.log("already has list");
        activeEnchantList = evt.currentTarget.originDiv.activeEnchantList;
    }

    unitType = unitType.replaceAll("_", " ");

    let list = findEnchantmentsSpells();

    let compatibleList = [];
    let exclusionList = [];
    let i = "";

    // check if culture
    if ("culture_name" in evt.currentTarget.unitData) {
        culture = evt.currentTarget.unitData.culture_name.toLowerCase();
    } else {
        culture = "none";
    }

    for (i = 0; i < list.length; i++) {
        let j = "";

        if (list[i].id === "brutal_mark") {
            if (culture == "barbarian") {
                exclusionList.push(list[i]);
            }
        }
        if (list[i].id === "signet_of_knighthood") {
            if (culture == "feudal") {
                exclusionList.push(list[i]);
            }
        }
        if (list[i].id === "scroll_of_attunement") {
            if (culture == "mystic") {
                exclusionList.push(list[i]);
            }
        }
        if (list[i].id === "ciphers_of_dissonance") {
            if (culture == "mystic") {
                exclusionList.push(list[i]);
            }
        }
        if (list[i].id === "brand_of_wrath") {
            if (culture == "dark") {
                exclusionList.push(list[i]);
            }
        }
        if (list[i].id === "dormant_enchantment") {
            if (culture == "high") {
                exclusionList.push(list[i]);
            }
        }
        if (list[i].id === "rune_of_industry") {
            if (culture == "industrious") {
                exclusionList.push(list[i]);
            }
        }
        if (
            list[i].id === "pledge_of_strife" ||
            list[i].id === "pledge_of_righteousness" ||
            list[i].id === "pledge_of_harmony"
        ) {
            if (culture == "oathsworn") {
                exclusionList.push(list[i]);
            }
        }
        if (list[i].id === "engraving_of_focus") {
            if (culture == "reaver") {
                exclusionList.push(list[i]);
            }
        }
        if (culture == "primal") {
            if (
                list[i].id === "crocodile_primal_communion" ||
                list[i].id === "wolf_primal_communion" ||
                list[i].id === "sabertooth_primal_communion" ||
                list[i].id === "crow_primal_communion" ||
                list[i].id === "mammoth_primal_communion" ||
                list[i].id === "spider_primal_communion" ||
                list[i].id === "serpent_primal_communion"
            ) {
                exclusionList.push(list[i]);
            }
        }

        // Usage:
        const enchant = list[i];
        const unitData = evt.currentTarget.unitData;

        if (
            isCompatibleForEnchantment(enchant, unitData, unitType, activeEnchantList, exclusionList) &&
            !isInArray(activeEnchantList, enchant) &&
            !isInArray(exclusionList, enchant)
        ) {
            compatibleList.push(enchant);
        }
    }

    // sort list alphabetically
    compatibleList = compatibleList.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // Convert names to uppercase for case-insensitive comparison
        const nameB = b.name.toUpperCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        return 0; // Names are equal
    });

    holder.innerHTML = "";

    let activeHolder = evt.currentTarget.activeListHolder;

    for (let i = 0; i < compatibleList.length; i++) {
        let enchantEntry = createTooltipForEnchant(compatibleList[i]);

        enchantEntry.addEventListener("click", SetEnchantment);
        enchantEntry.enchant = compatibleList[i];
        enchantEntry.activeHolder = activeHolder;
        enchantEntry.activeEnchantList = activeEnchantList;
        enchantEntry.originDiv = evt.currentTarget.originDiv;
        enchantEntry.unit = evt.currentTarget.unit;

        holder.appendChild(enchantEntry);
    }
}

function hasPassiveForEnchantment(unitData, type) {
    // type to slug dictionary
    const thisAb = jsonUnitAbilitiesLocalized.find((entry) => entry.name === type);
    if (thisAb == undefined) {
        return false;
    }
    console.log(thisAb.name + type);

    return unitData.secondary_passives.some((p) => p.slug === thisAb.slug);
}

function isCompatibleForEnchantment(enchant, unitData, unitType, activeEnchantList, exclusionList) {
    for (const req of enchant.enchantment_requisites) {
        const rawReq = req.requisite;
        const parts = rawReq.split("> ");
        const type = parts[1];

        if (type) {
            if (type === unitType.toLowerCase()) return true;
            if (hasPassiveForEnchantment(unitData, type)) return true;
        } else {
            if (rawReq === "Units that Evolve" && hasPassiveForEnchantment(unitData, "Evolve")) return true;
            if (rawReq === "Tier I" && unitData.tier == 1) return true;

            const normalized = rawReq.replaceAll(" ", "_").toLowerCase();
            const nestedType = normalized.split("> ")[1] || normalized;
            if (hasPassiveForEnchantment(unitData, nestedType)) return true;
        }
    }
    return false;
}

function createTooltipForEnchant(item) {
    let span = document.createElement("span");
    let enchantEntry = document.createElement("Button");
    enchantEntry.className = "enchantButton";
    const image = document.createElement("img");
    let text = document.createElement("div");
    image.setAttribute("width", "20");
    image.setAttribute("height", "20");
    image.setAttribute("src", "/aow4db/Icons/SpellIcons/" + item.icon + ".png");
    text.textContent = item.name;
    text.className = "tooltip";
    text.setAttribute("style", "padding:0px");
    
    

    span.innerHTML = AddTagIconsForStatusEffects(item.description);
    

    addTooltipListeners(enchantEntry, span);

    //   unitTypesDiv.appendChild(div);
    enchantEntry.appendChild(image);
    enchantEntry.appendChild(text);

    return enchantEntry;
}

function SetEnchantment(evt) {
    if (!isInArray(evt.currentTarget.activeEnchantList, evt.currentTarget.enchant)) {
        evt.currentTarget.originDiv.activeEnchantList.push(evt.currentTarget.enchant);
        evt.currentTarget.remove();
        let activeEnch = document.createElement("Div");
        activeEnch.className = "enchantButton";
        const image = document.createElement("img");

        image.setAttribute("width", "40");
        image.setAttribute("height", "40");
        image.setAttribute("src", "/aow4db/Icons/SpellIcons/" + evt.currentTarget.enchant.icon + ".png");

        activeEnch.className = "tooltip";
        activeEnch.setAttribute("style", "padding: 0px");
        let span = document.createElement("span");
        span.innerHTML = evt.currentTarget.enchant.name + "<hr>" + evt.currentTarget.enchant.description;
        span.setAttribute("style", "left: 50px;");

        addTooltipListeners(activeEnch, span);

        //activeEnch.appendChild(span);
        activeEnch.appendChild(image);
        // activeEnch.activeEnchantList = evt.currentTarget.activeEnchantList;
        activeEnch.thisEnchant = evt.currentTarget.enchant;

        activeEnch.unit = evt.currentTarget.unit;
        activeEnch.originDiv = evt.currentTarget.originDiv;
        activeEnch.activeHolder = evt.currentTarget.activeHolder;

        activeEnch.addEventListener("click", RemoveActiveEnchant);

        let holder = evt.currentTarget.activeHolder;
        let unit = evt.currentTarget.unit;
        holder.appendChild(activeEnch);
    }
    showUnit(evt.currentTarget.unit);
}

function RemoveActiveEnchant(evt) {
    let origin = evt.currentTarget.originDiv;

    origin.activeEnchantList = origin.activeEnchantList.filter((item) => item !== evt.currentTarget.thisEnchant);

    showUnit(evt.currentTarget.unit);
    evt.currentTarget.remove();
}

function GetAbilityInfo(ability) {
    let spa;
    if ("accuracy" in ability) {
        let abilityReq = "";
        let abilityName = ability.name.toUpperCase();
        if (ability.requisites === undefined) {
            abilityReq = "";
        } else {
            abilityReq = ability.requisites;
        }

        let abilityMod = "";

        let l = 0;
        for (l in ability.modifiers) {
            abilityName += "&#11049";
            abilityMod += "<bullet>" + AddTagIconsForStatusEffects(ability.modifiers[l].name) + "<br>"; // AddTagIconsForStatusEffects(ability.modifiers[l].name) + "<br>";
            abilityMod += ability.modifiers[l].description + "</bullet><br>";
        }

        // add notes

        abilityNote = "";
        let Cooldown = "";
        let Once = "";

        for (let l = 0; l < ability.notes.length; l++) {
            if (ability.notes[l] === undefined) {
            } else {
                if (ability.notes[l].note.indexOf("Cooldown") != -1) {
                    Cooldown = ability.notes[l].note;
                } else if (ability.notes[l].note.indexOf("once per") != -1) {
                    Once = ability.notes[l].note;
                } else {
                    abilityNote += "<br>" + ability.notes[l].note;
                }
            }
        }

        let abilityEncht = "";

        abilityRange = ability.range + "<range></range>";
        abilityAcc = ability.accuracy + "<accuracy></accuracy>";

        let abilityIconType = GetAbilityBackground(ability.damage);
        spa = GetAbilityToolTip(ability);
    } else {
        spa = CreatePassiveSlotToolTip(ability.icon, ability.name, ability.description);
    }
    return spa;
}

function GetStructure(structureID) {
    let struc = findBy(jsonStructureUpgradesLocalized, "id", structureID);
    let strucNameLoc;
    // if it cant find the EN one, try loc directly
    if (struc == undefined) {
        strucNameLoc = findBy(jsonStructureUpgradesLocalized, "id", structureID);
        return strucNameLoc || "Not found + " + structureID;
    } else {
        strucNameLoc = findBy(jsonStructureUpgradesLocalized, "resid", struc.resid);
    }

    return strucNameLoc || "Not found + " + structureID;
}

function GetHeroSkillName(skillID) {
    return findBy(jsonHeroSkills, "id", skillID).name || undefined;
}

function GetHeroSkillDescription(skillID) {
    let array = ["", ""];
    let j = 0;
    for (j in jsonHeroSkills) {
        if (jsonHeroSkills[j].id == skillID) {
            if ("abilities" in jsonHeroSkills[j]) {
                for (let k = 0; k < jsonUnitAbilities.length; k++) {
                    if (jsonUnitAbilities[k].slug.indexOf(jsonHeroSkills[j].abilities[0].slug) != -1) {
                        array[0] = jsonUnitAbilities[k];
                    }
                }
            }
            array[1] = jsonHeroSkills[j];

            return array;
        }
    }
}

function showStructure(a, showOrigin, divOrigin) {
    const structureEN = jsonStructureUpgrades.find((entry) => entry.id == a);
    if (structureEN === undefined) {
        console.log("Couldn't find structure: " + a);
        return;
    }

    const structureLoc = jsonStructureUpgradesLocalized.find((entry) => entry.resid == structureEN.resid);

    let modcard = divOrigin;
    let modName = divOrigin.querySelector("#modname");
    let nameString = "";
    nameString = structureLoc.name.toUpperCase();

    if (nameString.indexOf("<br>")) {
        nameString = nameString.replace("<br>", "");
        nameString = nameString.replace("<br>", "");
    }

    modName.innerHTML = nameString;
    // backtracktome
    let tomeNameandTier = backtraceStructureToTomeNameAndTier(structureEN.id);
    modName.className = "mod_name";
    let descriptionDiv = divOrigin.querySelector("#moddescription");
    let description = "";
    if (structureLoc.requirement_description != "") {
        description += "<yellowText>Requirement: </yellowText><br>";
        description += structureLoc.requirement_description + "<br><br>";
    }

    if (structureLoc.prediction_description != "") {
        description += "<yellowText>Full Description: </yellowText><br>";
    } else {
        description += "<yellowText> Description: </yellowText><br>";
    }
    description += structureLoc.description;

    if (structureLoc.prediction_description != "") {
        description +=
            "<br><br><yellowText> Base Income Description:</yellowText><br>" + structureLoc.prediction_description;
    }

    let imagelink = divOrigin.querySelector("#modicon");

    if (a.startsWith("_")) {
        a = a.replace("_", "");
    }

    imagelink.setAttribute("src", "/aow4db/Icons/UpgradeIcons/" + structureLoc.icon + ".png");
    if (a.indexOf("town_hall_iii_") != -1) {
        description += "<br><br> Unlocks T3 Culture Units";
    }
    if (a.indexOf("town_hall_ii_") != -1) {
        description += "<br><br> Unlocks T2 Culture Units";
    }

    descriptionDiv.innerHTML = AddTagIconsForStatusEffects(description);

    descriptionDiv.setAttribute("id", "modicon" + a);

    let unitTypesDiv = divOrigin.querySelector("#affectUnitTypes");
    unitTypesDiv.setAttribute("style", "float: left;display: grid;grid-template-columns: 200px 200px;font-size: 15px;");

    let tier = divOrigin.querySelector("#modtier");
    if (structureLoc.is_sector_upgrade) {
        if (tomeNameandTier != "") {
            if (tomeNameandTier[1] != 0) {
                tier.innerHTML = "<br> Tier " + romanize(tomeNameandTier[1]) + " - " + tomeNameandTier[0] + "<br>";
            } else {
                tier.innerHTML = "<br>" + tomeNameandTier[0] + "<br>";
            }
        }
        modName.innerHTML += "<br> <hyperlink><structure></structure> Province Improvement</hyperlink>";
    } else {
        tier.innerHTML = "<hyperlink><structure></structure> City Structure</hyperlink>";
    }

    let cost = divOrigin.querySelector("#modcost");
    cost.className = "spell_cost";
    cost.innerHTML = "Build Cost: " + structureLoc.cost;

    //let name = backtraceTomeOriginAndTier(structureEN, showOrigin);

    if ("DLC" in structureEN) {
        let newDivForMount = AddDLCTag(structureEN.DLC);
        modName.append(newDivForMount);
    }

    for (const [keyword, units] of Object.entries(unlockableUnitsMapStructures)) {
        addUnlockableUnitsToStructure(a, keyword, units, descriptionDiv, unitTypesDiv);
    }
    found = true;

    return modcard;
}

function addUnlockableUnitsToStructure(a, keyword, unitList, descriptionDiv, unitTypesDiv) {
    if (a.indexOf(keyword) !== -1) {
        descriptionDiv.innerHTML += "<br>Unlocks Production of:";

        for (let i = 0; i < unitList.length; i++) {
            let div = document.createElement("DIV");
            div.innerHTML =
                "<bullet>" +
                '<a href="/aow4db/HTML/Units.html?unit=' +
                unitList[i] +
                '" target="_blank">' +
                GetUnitTierAndName(unitList[i]) +
                "</a>" +
                "</bullet>";
            unitTypesDiv.append(div);
        }
    }
}

function showCosmicHappening(a, divOrigin) {
    let modName,
        description,
        j,
        nameString = "";
    let found = false;

    for (j in jsonCosmicHappenings) {
        if (a === jsonCosmicHappenings[j].id) {
            modName = divOrigin.querySelector("#modname");
            nameString = "";
            nameString = jsonCosmicHappenings[j].name.toUpperCase();

            if (modName == undefined) {
            }
            modName.innerHTML = nameString;
            modName.className = "mod_name";

            let descriptionDiv = divOrigin.querySelector("#moddescription");
            descriptionDiv.setAttribute("style", "max-width:560px;");
            description = jsonCosmicHappenings[j].description;

            if ("extraLookup" in jsonCosmicHappenings[j]) {
                const valueLookup = findBy(jsonAllFromPOLocalized, "id", jsonCosmicHappenings[j].extraLookup);
                description = valueLookup.description;

                modName.innerHTML = valueLookup.name.toUpperCase();
            }
            descriptionDiv.innerHTML = AddTagIconsForStatusEffects(description);

            let imagelink = divOrigin.querySelector("#modicon");

            let categoryLink = jsonCosmicHappenings[j].category.replaceAll(" ", "");
            categoryLink = categoryLink.replaceAll("of", "Of");
            imagelink.setAttribute("src", "/aow4db/Icons/CosmicHappenings/category_icon_" + categoryLink + ".png");

            let preview = divOrigin.querySelector("#structurepreview");
            let imagePos = jsonCosmicHappenings[j].image;

            preview.className = "cosmicHappeningPic";
            preview.setAttribute("style", 'background-image: url("/aow4db/Icons/CosmicHappenings/' + imagePos);

            preview.setAttribute("src", "/aow4db/Icons/Interface/Runecircle.png");

            let modtier = divOrigin.querySelector("#modtier");
            modtier.innerHTML = "Category: " + jsonCosmicHappenings[j].category;

            let modcost = divOrigin.querySelector("#modcost");
            let duration = jsonCosmicHappenings[j].duration;
            if (duration == -1) {
                duration = "Variable";
            } else {
                duration += "<turn></turn>";
            }
            modcost.innerHTML = "Duration: " + duration;

            // find combat enchantment
            found = true;
        }
    }
    if (found === false) {
        console.log("Couldn't find cosmic happening: " + a);
    }
}

function showWorldStructure(a, divOrigin) {
    let modName,
        description,
        cost,
        type,
        tier,
        nameString = "";
    let found = false;

    let structure = jsonWorldStructures.find((structure) => structure.id === a);
    if (!structure) {
        console.log("Couldn't find structure world: " + a);
        return;
    }

    modName = divOrigin.querySelector("#modname");
    nameString = "";
    nameString = structure.name.toUpperCase();

    if (nameString.indexOf("<br>")) {
        nameString = nameString.replace("<br>", "");
        nameString = nameString.replace("<br>", "");
    }
    modName.innerHTML = nameString;

    modName.className = "mod_name";
    let loreDiv = divOrigin.querySelector("#loreText");

    if ("lore" in structure) {
        loreDiv.innerHTML = structure.lore;
        loreDiv.innerHTML += "<br><br>" + structure.author;
    }

    let descriptionDiv = divOrigin.querySelector("#moddescription");
    descriptionDiv.setAttribute("style", "max-width:560px;");
    description = "";

    if (structure.type.indexOf("wonder") != -1) {
        description = structure.type + "<br><br>";
    } else {
    }

    if ("description" in structure) {
        description += structure.description;
    }

    if ("prediction_description" in structure) {
        if (structure.prediction_description != "") {
            description += "<br>" + structure.prediction_description;
        }
    }

    // extra lookup
    if ("extraLookup" in structure) {
        const valueLookup = findBy(jsonAllFromPOLocalized, "id", structure.extraLookup);
        if ("hyperlink" in valueLookup) {
            modName.innerHTML = valueLookup.hyperlink.toUpperCase();
        } else if ("name" in valueLookup) {
            modName.innerHTML = valueLookup.name.split("^")[0].toUpperCase();
        }
        if ("description_short" in valueLookup) {
            description += valueLookup.description_short;
        }
        if ("lore" in valueLookup) {
            description += "<helpColor>" + valueLookup.lore + "</helpColor>" + "<br><br>";
        }

        if ("nodeType" in structure) {
            const valueLookup = findBy(jsonAllFromPOLocalized, "id", "INTERFACE@COUNTS_AS");
            const nodeType = structure.nodeType.split("&");
            //   console.log(valueLookup);
            description +=
                "<bullet>" +
                valueLookup[nodeType[0]] +
                " +5<influence></influence>" +
                nodeType[1] +
                "-5 <happiness></happiness> </bullet>";
        }
        if ("fpg_description" in valueLookup) {
            description += valueLookup.fpg_description;
        } else if ("description" in valueLookup) {
            description += valueLookup.description;
        }
    }

    if ("DLC" in structure) {
        let newDivForMount = AddDLCTag(structure.DLC);
        modName.append(newDivForMount);
    }

    let imagelink = divOrigin.querySelector("#modicon");

    if (structure.type.indexOf("wonder") != -1) {
        imagelink.remove();
    } else if (structure.type.indexOf("Landmark") != -1) {
        imagelink.setAttribute("src", "/aow4db/Icons/Text/landmark.png");
        imagelink.setAttribute("id", "modicon" + a);
        imagelink.setAttribute("style", "background-image: none");
    } else {
        imagelink.setAttribute("src", "/aow4db/Icons/WorldStructures/" + a + ".png");
        imagelink.setAttribute("id", "modicon" + a);
        imagelink.setAttribute("style", "background-image: none");
    }
    descriptionDiv.innerHTML = "";

    const eventDiv = divOrigin.querySelector("#event");

    eventDiv.innerHTML = "";

    if (structure.type.indexOf("Ancient") != 1) {
        //console.log("found ancient wonder" + structure.type);
        if ("events" in structure) {
            // events are here
            for (var i in structure.events) {
                //  console.log(structure.events[i]);
                eventDiv.appendChild(CreateAncientWonderEventSetup(structure.events[i].name, structure));
            }
        }
        //descriptionDiv.innerHTML +=
        //   "Combat Enchantments depend on story event choices when entering the Ancient Wonder. <br><br>";
    }
    let unitTypesDiv = divOrigin.querySelector("#affectUnitTypes");

    unitTypesDiv.setAttribute(
        "style",
        "display: grid; justify-content: center;grid-template-columns: 200px 200px;font-size: 15px;"
    );

    if ("unit_unlocks" in structure) {
        if ("other_unlock" in structure) {
            description += "<br>Unit Reward:<br>";
        } else {
            description += "<br>Rally Units:<br>";
        }

        for (let x = 0; x < structure.unit_unlocks.length; x++) {
            let div = document.createElement("DIV");
            div.setAttribute("style", "margin-right: 20px;");
            div.innerHTML =
                '<a href="/aow4db/HTML/Units.html?unit=' +
                structure.unit_unlocks[x].slug +
                '" target="_blank">' +
                GetUnitTierAndName(structure.unit_unlocks[x].slug) +
                "</a>" +
                "</bullet>";
            unitTypesDiv.appendChild(div);
        }
    }

    let spellDesc = "";
    if ("spell_unlocks" in structure) {
        // if a lookup link
        if (structure.spell_unlocks.indexOf("@") != -1) {
            const valueLookup = findBy(jsonAllFromPOLocalized, "id", structure.spell_unlocks);

            const div = document.createElement("span");

            div.setAttribute("id", "test");
            div.setAttribute("style", "color:white; text-decoration:underline");
            if ("description" in valueLookup) {
                spellDesc = valueLookup.description;
            }
            if ("name" in valueLookup) {
                div.innerHTML = valueLookup.name;
                description = description.replaceAll(
                    "<casttactical></casttactical> <hyperlink>Combat Enchantment</hyperlink>",
                    div.outerHTML + "<casttactical></casttactical> <hyperlink>Combat Enchantment</hyperlink>"
                );
            }
        } else {
            description = description.replaceAll(
                "<casttactical></casttactical> <hyperlink>Combat Enchantment</hyperlink>",
                structure.spell_unlocks + "<casttactical></casttactical> <hyperlink>Combat Enchantment</hyperlink>"
            );
        }
    }

    descriptionDiv.innerHTML = AddTagIconsForStatusEffects(description);
    descriptionDiv.innerHTML = descriptionDiv.innerHTML.replaceAll("{LOC.CONCEPT@HITPOINTS@NAME}", "<hp></hp>");
    const insertDiv = divOrigin.querySelector("#test");
    const spaDes2 = document.createElement("span");

    if (insertDiv != undefined && spellDesc != "") {
        spaDes2.innerHTML = insertDiv.innerHTML.toUpperCase() + "<br>" + spellDesc;
        addTooltipListeners(insertDiv, spaDes2);
    }

    //insertDiv =

    //descriptionDiv.innerHTML = AddTagIconsForStatusEffects(descriptionDiv.innerHTML);

    let preview = divOrigin.querySelector("#structurepreview");
    preview.setAttribute("src", "/aow4db/Icons/StructurePics/" + a + ".png");

    tier = divOrigin.querySelector("#modtier");

    tier.innerHTML = "";

    cost = divOrigin.querySelector("#modcost");
    cost.innerHTML = "";
}

function getEventStructureNameByPrefix(obj, prefix) {
    return Object.entries(obj)
        .filter(([key]) => key.startsWith(prefix + "_"))
        .map(([_, value]) => value);
}

function getStoryParts(obj, prefix, lookup) {
    return Object.entries(obj)
        .filter(([key]) => key.startsWith(prefix + "_story"))
        .map(([_, value]) => value);
}

function CreateAncientWonderEventSetup(eventHandle, structure) {
    const divHolder = document.createElement("div");
    const div = document.createElement("div");

    div.className = "combatEnchantment";
    const TitleHolder = document.createElement("button");
    TitleHolder.className = "collapsible";
    TitleHolder.onclick = SetUpCombatEnc;
    const AlternateNames = document.createElement("div");
    divHolder.appendChild(TitleHolder);
    divHolder.appendChild(div);

    if ("nameOverrides" in structure) {
        // names
        const overrides = findBy(jsonAllFromPOLocalized, "id", structure.nameOverrides);

        const rightSites = getEventStructureNameByPrefix(overrides, eventHandle);

        for (var i in rightSites) {
            AlternateNames.innerHTML += " <ancientwonder></ancientwonder>" + rightSites[i];
        }
        // story
        const story = findBy(jsonAllFromPOLocalized, "id", structure[eventHandle + "_story"]);
        //const rightStoryParts = getEventStructureNameByPrefix(overrides, eventHandle);
        if (story != undefined) {
            const titleSide = document.createElement("div");
            TitleHolder.appendChild(titleSide);
            TitleHolder.appendChild(AlternateNames);
            
            const titleChanged = story.title;
            titleSide.innerHTML = "<quest></quest>" + titleChanged;
            TitleHolder.setAttribute("style", "display:flex;justify-content: space-between;font-size:small");

            const title = document.createElement("div");

            title.className = "eventTitleSegment";
            title.innerHTML = story.title;
            div.appendChild(title);
            const headerPart = document.createElement("div");
            headerPart.className = "eventBodySegment";
            const storyHeader = findBy(jsonAllFromPOLocalized, "id", story.id + "@BODY_HEADER");
            let headerText = storyHeader
                ? storyHeader.hero_is_playerle || storyHeader.hero_is_playelea
                : story.body_header;
            headerPart.innerHTML = processStoryEventText(headerText);
            div.appendChild(headerPart);
            const lorePart = document.createElement("div");
            lorePart.className = "eventLoreSegment";
            const storyLore = findBy(jsonAllFromPOLocalized, "id", story.id + "@BODY_LORE");
            let loreText = storyLore ? storyLore.hero_is_playerle || storyLore.hero_is_playelea : story.body_lore;
            lorePart.innerHTML = processStoryEventText(loreText);
            div.appendChild(lorePart);

            const footerPart = document.createElement("div");
            footerPart.className = "eventBodySegment";
            const storyFooter = findBy(jsonAllFromPOLocalized, "id", story.id + "@BODY_FOOTER");
            let footerText = storyFooter
                ? storyFooter.hero_is_playerle || storyFooter.hero_is_playelea
                : story.body_footer;
            footerPart.innerHTML = processStoryEventText(footerText);
            div.appendChild(footerPart);

            // options
            const buttons = getEventStructureNameByPrefix(story, "button");
            for (let j in buttons) {
                const button = document.createElement("div");
                button.className = "button-event";
                div.appendChild(button);
                button.innerHTML += processStoryEventText(buttons[j]);
            }

           
        }
         // combat
            const combatReveal = document.createElement("div");
            combatReveal.setAttribute("style", "display: flex;justify-content: space-between;");
            div.appendChild(combatReveal);

            // spawnsets
            const spawnset = structure[eventHandle + "_spawnset"];
            if (spawnset != undefined) {
                const spawnHolder = document.createElement("Div");
                spawnHolder.style.width = "400px";
                const spawnSetMultiple = [];

                for (let k in spawnset) {
                    const result = findByFuzzy(jsonSpawnSetsStrat, "pool", spawnset[k]);
                    if(result != undefined){
                        
                    spawnSetMultiple.push(result);
                    }
                }
                console.log(spawnSetMultiple + " " + eventHandle);

                combatReveal.appendChild(spawnHolder);
                spawnHolder.innerHTML += "Linked Spawnsets: <br>";
                

                for (let j in spawnSetMultiple) {
                    for (const unit of spawnSetMultiple[j].units) {
                        spawnHolder.innerHTML += "<bullet> <unit></unit>" + unit + "</bullet>";
                    }
                    for (const other of spawnSetMultiple[j].others) {
                        spawnHolder.innerHTML += "<bullet> <ench></ench>" + other + "</bullet>";
                    }
                    for (const type of spawnSetMultiple[j].type) {
                        spawnHolder.innerHTML += "<bullet> <other></other>" + type + "</bullet>";
                    }
                }
                    
                
            }
            // combat
            const combatEnch = structure[eventHandle + "_combat"];
            const combatEnchHolder = document.createElement("div");
            combatEnchHolder.setAttribute("style", "display: grid;");
          
            if (combatEnch != undefined) {
                for (let index = 0; index < combatEnch.length; index++) {
                    console.log("here " + combatEnch[index]);
                    const child = FindCombatEnchantment(combatEnch[index]);
                    combatEnchHolder.appendChild(child);
                }
            }
              combatReveal.appendChild(combatEnchHolder);
        }

        // combat enchantment
    

    // div.innerHTML = eventHandle;
    // console.log(eventHandle);
    return divHolder;
}

function processStoryEventText(text) {
    return text;
    text = text.replaceAll("<EventHero.FirstName></EventHero.FirstName>", "<hyperlink>Hero Name</hyperlink>");
    text = text.replaceAll("<EventHero></EventHero>", "<hyperlink>Hero</hyperlink>");
    text = text.replaceAll("<PlayerLeader.Title></PlayerLeader.Title>", "<hyperlink>Hero</hyperlink>");
    text = text.replaceAll("<EnemyUnit></EnemyUnit>", "<hyperlink>EnemyUnit</hyperlink>");
    text = text.replaceAll("<EventStructure></EventStructure>", "<hyperlink>EventStructure</hyperlink>");
    text = text.replaceAll("<<m:", "<hyperlink>");
    text = text.replaceAll("<<P:", "<hyperlink>");
    text = text.replaceAll("<<p:", "<hyperlink>");
    text = text.replaceAll("<<r:", "<hyperlink>");
    text = text.replaceAll("<Event", "");
    text = text.replaceAll("<<Cp:", "<hyperlink>");

    text = text.replaceAll("<<o:", "<hyperlink>");
    text = text.replaceAll(">>", "</hyperlink>");
    return text;
}

function FindCombatEnchantment(combatID) {
    let info = document.createElement("DIV");
    info.style.width = "400px";

    let collapsibleC = document.createElement("DIV");
    //collapsibleC.className = "combatEnchantment";
    let name;
    let description;

    const valueLookup = findBy(jsonAllFromPOLocalized, "id", combatID);
    console.log(combatID);
    if ("description" in valueLookup) {
        description = valueLookup.description;
    }
    if ("name" in valueLookup) {
        name = valueLookup.name;
    }

    const combatsplit = combatID.split("@");
    // console.log(combatsplit);
    const imagelink = combatsplit[combatsplit.length - 1];

    let div = document.createElement("DIV");
    div.innerHTML =
        '<img style="float:left; height:80px; padding:10px" src="/aow4db/Icons/CombatEnchantments/' +
        imagelink.toLowerCase() +
        '.png"><p style="color: #aa84f6;>' +
        '<span style="font-size=20px;">' +
        name +
        "</p>" +
        "</br>" +
        description;

    collapsibleC.append(div);
    info.appendChild(collapsibleC);
    return info;
}

function showDestinyTrait(trait, divOrigin) {
    const traitEN = findBy(jsonDestiny, "id", trait);

    if (traitEN != undefined) {
        const modName = divOrigin.querySelector("#modname");
        let nameString = "";
        nameString = traitEN.name.toUpperCase();
        nameString += "<br>" + traitEN.category;

        modName.innerHTML = nameString;
        // backtracktome

        modName.className = "mod_name";
        let descriptionDiv = divOrigin.querySelector("#moddescription");
        let description = "Trigger: <br>";

        description += traitEN.trigger;

        const imagelink = divOrigin.querySelector("#modicon");

        imagelink.setAttribute("src", "/aow4db/Icons/EmpireProgressionIcons/" + traitEN.id + ".png");

        imagelink.setAttribute("style", "background-image: none");
        descriptionDiv.innerHTML = description;
        descriptionDiv.setAttribute("style", "max-width: 380px");

        const unitTypesDiv = divOrigin.querySelector("#affectUnitTypes");

        descriptionDiv.innerHTML += "<br><br>Effect: <br>";
        let l = 0;
        for (l in traitEN.gains) {
            let div = document.createElement("DIV");
            div.innerHTML = "<bullet>" + traitEN.gains[l].description + "</bullet>";
            descriptionDiv.appendChild(div);
        }

        const tier = divOrigin.querySelector("#modtier");

        tier.innerHTML = "";

        const cost = divOrigin.querySelector("#modcost");
        cost.innerHTML = "";
    }
}

function showEmpireTree(a, divOrigin) {
    let modName,
        description,
        cost,
        type,
        tier,
        j,
        nameString = "";
    let found = false;

    for (j in jsonEmpire) {
        if (a === jsonEmpire[j].id) {
            modName = divOrigin.querySelector("#modname");
            nameString = "";
            nameString = jsonEmpireLocalized[j].name.toUpperCase();
            nameString += "<br>" + jsonEmpireLocalized[j].category;

            modName.innerHTML = nameString;
            // backtracktome

            modName.className = "mod_name";
            let descriptionDiv = divOrigin.querySelector("#moddescription");
            description = "<hr>";

            description += jsonEmpireLocalized[j].description;

            let imagelink = divOrigin.querySelector("#modicon");

            if (a.startsWith("_")) {
                a = a.replace("_", "");
            }

            imagelink.setAttribute("src", "/aow4db/Icons/EmpireProgressionIcons/" + a + ".png");

            descriptionDiv.innerHTML = description;

            tier = divOrigin.querySelector("#modtier");
            tier.innerHTML = "XP required: " + jsonEmpire[j].required_xp + jsonEmpire[j].required_affinity;

            cost = divOrigin.querySelector("#modcost");

            cost.innerHTML = "Cost: " + jsonEmpire[j].cost;

            found = true;
        }
    }
    if (found === false) {
        console.log("Couldn't find mod: " + a);
    }
}

function GetCostUnit(id) {
    let i = 0;
    for (i in jsonUnits) {
        if (id === jsonUnits[i].id) {
            return jsonUnits[i].cost;
        }
    }
}

function showUnitUnlock(a, divOrigin) {
    const unitEN = findBy(jsonUnits, "id", a.unit_slug);
    const unitLoc = findBy(jsonUnitsLocalized, "resid", unitEN.resid);
    let modName = divOrigin.querySelector("#modname");
    modName.innerHTML = unitLoc.name.toUpperCase();
    let descriptionDiv = divOrigin.querySelector("#moddescription");

    let description = "<hr>" + a.description;

    let imagelink = divOrigin.querySelector("#modicon");

    let unitTypesDiv = divOrigin.querySelector("#affectUnitTypes");

    if (a.name === "Young Dragon") {
        let alldragons = ["young_fire_dragon", "young_frost_dragon", "young_obsidian_dragon", "young_golden_dragon"];
        let i = "";
        for (i in alldragons) {
            let div = document.createElement("DIV");
            div.innerHTML =
                "<bullet>" +
                '<a href="/aow4db/HTML/Units.html?unit=' +
                alldragons[i] +
                '" target="_blank">' +
                GetUnitTierAndName(alldragons[i]) +
                "</a>" +
                "</bullet>";
            unitTypesDiv.appendChild(div);
        }
    } else {
        let div = document.createElement("DIV");
        div.innerHTML =
            '<a href ="/aow4db/HTML/Units.html?unit=' +
            a.unit_slug +
            '" target="_blank">' +
            GetUnitTierAndName(a.unit_slug) +
            "</a>" +
            "</bullet>";
        unitTypesDiv.appendChild(div);
    }

    imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + a.unit_slug + ".png");

    descriptionDiv.innerHTML = description;

    let tier = divOrigin.querySelector("#modtier");

    tier.innerHTML = "<unit></unit> " + a.type;

    modName.innerHTML += '<span style="color:white;font-size:15px">  Tier ' + romanize(a.tier) + "</span>";

    let cost = divOrigin.querySelector("#modcost");
    cost.innerHTML = "Recruit Cost: " + GetCostUnit(a.unit_slug);

    let upkeep = divOrigin.querySelector("#modupkeep");
    upkeep.innerHTML = "";
}

const SpellDuplicateExclusionList = []; // [4514010629343, 4514010628856];

function showSpell(a, showOrigin, divOrigin) {
    let spellFoundEN = findBy(jsonSpells, "id", a);
    // if it cant find th EN one, try loc one
    if (spellFoundEN == undefined) {
        spellFoundEN = findBy(jsonSpellsLocalized, "id", a);
    }

    if (spellFoundEN != undefined) {
        let spellFound = findBy(jsonSpellsLocalized, "resid", spellFoundEN.resid);
        let modCard = divOrigin;

        let modName = modCard.querySelector("#modname");
        modName.innerHTML = spellFound.name.toUpperCase();
        let description = "<hr>";
        let descriptionDiv = modCard.querySelector("#moddescription");

        let upkeep = modCard.querySelector("#modupkeep");
        if ("upkeep" in spellFoundEN) {
            upkeep.innerHTML = "Upkeep: " + spellFoundEN.upkeep;
        }

        description += spellFound.description.replaceAll("<bulletlist></bullet>", "<bulletlist>");
        description = AddTagIconsForStatusEffects(description);
       // description = description.replaceAll("</bullet></bulletlist>", "</bullet></bullet></bulletlist>");
      //  description = description.replaceAll("<br></br>", "<br>");

        let unitTypesDiv = modCard.querySelector("#affectUnitTypes");

        if (spellFound.enchantment_requisites != undefined) {
            description += "<br><greenText>Affected Unit Types: </greenText><br>";
        }
        let l = 0;
        for (l in spellFound.enchantment_requisites) {
            let div = document.createElement("DIV");
            div.setAttribute("style", "margin-right: 20px;");
            div.innerHTML = "<bullet>" + spellFound.enchantment_requisites[l].requisite + "</bullet>";
            unitTypesDiv.appendChild(div);
        }
        if ("summoned_units" in spellFound) {
            description += "<br>Summoned Units:<br>";

            let x = 0;
            for (x in spellFound.summoned_units) {
                let div = document.createElement("DIV");
                div.setAttribute("style", "margin-right: 20px;");
                div.innerHTML =
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    spellFound.summoned_units[x].slug +
                    '" target="_blank">' +
                    GetUnitTierAndName(spellFoundEN.summoned_units[x].slug) +
                    "</a>";
                unitTypesDiv.appendChild(div);
            }
        }
        descriptionDiv.innerHTML = description;

        const Pairs = [
            { id: "call_wild_animal", spawnset: "SUMMON_WILD_ANIMAL" },
            { id: "call_greater_animal", spawnset: "SUMMON_GREATER_WILD_ANIMAL" },
            { id: "summon_elemental", spawnset: "SUMMON_ELEMENTAL" },
            { id: "awaken_the_forest", spawnset: "AWAKEN_THE_FOREST" },
            { id: "demonic_summoning", spawnset: "DEMONIC_SUMMONING" },
            { id: "raise_undead_army", spawnset: "RAISE_UNDEAD_ARMY" }
        ];

        const match = Pairs.find((p) => p.id === a);
        if (match) {
            const results = [];
            // skip if not found
            // extra info
            // call_wild_animal = SUMMON_WILD_ANIMAL
            const info = document.createElement("DIV");
            info.innerHTML =
                '<button type="button" class="collapsible"onclick="SetUpSpawnTable()">SPAWN CHANCES</button>';
            let collapsibleC = document.createElement("DIV");
            collapsibleC.classList = "content";
            
            
            const related = jsonSpawnTables.filter((t) => t.category.startsWith(match.spawnset + "_"));
            if(a === "call_greater_animal"){
                 
               const extra = jsonSpawnTables.filter((t) => t.category.startsWith("SUMMON_GREATER_GREATER_ANIMAL_CAT"));
             console.log(extra);
               
                related.push(...extra);
            }
           
            // 3️⃣ Combine all items for the same category name
            for (const entry of related) {
                // Check if we already have this category in results
                let existing = results.find((r) => r.category === entry.category);
                if (!existing) {
                    // If not, create it
                    existing = { category: entry.category, items: [] };
                    results.push(existing);
                }
                // Add new items
                existing.items.push(...entry.items);
            }
            for (const entry of results) {
                
                let div = ConvertSpawnTable(entry, match.spawnset);
                collapsibleC.append(div);
            }

            info.append(collapsibleC);
            descriptionDiv.append(info);
        }

        let tier = modCard.querySelector("#modtier");
        tier.innerHTML = spellFound.spellType;

        let cost = modCard.querySelector("#modcost");
        cost.innerHTML = "Cost: " + spellFoundEN.casting_cost;

        if (spellFound.tactical === true) {
            cost.innerHTML += " " + spellFoundEN.operation_point_cost + "<casttactical></casttactical>";
        } else {
            cost.innerHTML += " " + spellFoundEN.operation_point_cost + "<caststrategic></caststrategic>";
        }

        let imagelink = modCard.querySelector("#modicon");

        let imageLinkName = "";
        if (spellFound.icon != undefined) {
            imageLinkName = spellFound.icon;
        } else {
            imageLinkName = spellFound.id;
        }

        if (incorrectIconOverrideList.includes(spellFound.id)) {
            imageLinkName += "2";
        }
        imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + imageLinkName + ".png");
        let tierSpell = backtraceTomeOriginAndTier(spellFoundEN, showOrigin, modCard);

        if (tierSpell != undefined) {
            let splitspell = tierSpell.split(",");
            modName.innerHTML +=
                '<span class="spell_tier" style="color:white;font-size:15px">  Tier ' +
                romanize(splitspell[0]) +
                "</span>";
            if ("DLC" in spellFound && showOrigin) {
                let newDivForMount = AddDLCTag(spellFound.DLC);
                modName.append(newDivForMount);
            }
        } else {
            modName.innerHTML += '<span class="spell_tier" style="color:white;font-size:15px"> Tier - </span>';
        }
        return modCard;
    } else {
        console.log("couldn't find spell " + a);
    }
}

function GetCultureUnitsOf(cultureName, subCultureName) {
    const SCOUT_SLUG = "000003fe00000060"; // scout

    // Build a lookup map once for O(1) access
    const unitMap = new Map(jsonUnits.map((u) => [u.id, u]));

    // Collect unique IDs for the culture
    const idSet = new Set();
    for (const unit of jsonUnits) {
        if (unit.culture_name === cultureName && unit.id != "") {
            if (subCultureName != undefined) {
                if ("sub_culture_name" in unit && unit.sub_culture_name == subCultureName) {
                    idSet.add(unit.id);
                }
            } else {
                idSet.add(unit.id);
            }
        }
    }

    // Convert to array of unit objects
    const units = Array.from(idSet).map((id) => unitMap.get(id));

    // Sort: special slug units first, then by tier
    units.sort((a, b) => {
        const aSpecial = a.secondary_passives?.some((p) => p.slug === SCOUT_SLUG) ? 1 : 0;
        const bSpecial = b.secondary_passives?.some((p) => p.slug === SCOUT_SLUG) ? 1 : 0;

        if (aSpecial !== bSpecial) {
            return bSpecial - aSpecial; // put "special" units first
        }
        return a.tier - b.tier;
    });

    // Return only IDs
    return units.map((u) => u.id);
}

function GetAllTomesWithAffinity(affinity, dualOnly) {
    let arrayResultPlain = [];
    let arrayResultDual = [];
    let arrayResultGeneral = [];
    for (const tome of jsonTomes) {
        if ("affinities" in tome) {
            if (dualOnly != undefined) {
                if (tome.affinities.indexOf("1") != -1) {
                    arrayResultDual.push(tome);
                }
            } else {
                if (tome.affinities.indexOf(affinity) != -1) {
                    if (tome.affinities.indexOf("2") != -1) {
                        arrayResultPlain.push(tome);
                    } else {
                        arrayResultDual.push(tome);
                    }
                }
            }
        } else if (affinity == "general") {
            // general and cultures
            if (tome.id != "") {
                arrayResultPlain.push(tome);
            }
        }
    }
    if (affinity != "general") {
        arrayResultPlain.sort((a, b) => a.tier - b.tier);
        arrayResultDual.sort((a, b) => a.tier - b.tier);
    } else {
        arrayResultPlain.reverse();
    }
    console.log(arrayResultPlain);

    const merged = arrayResultPlain
        .concat(arrayResultDual) // put them together
        .map((a) => a.id); // take only the `id` field

    return merged;
}

function FindFormUnits() {
    let unitsList = [];
    let i = 0;
    for (i in jsonUnits) {
        if (extraFormUnitsList.includes(jsonUnits[i].id)) {
            if (!isInArray(unitsList, jsonUnits[i].id)) {
                unitsList.push(jsonUnits[i]);
            }
        }
    }

    // Sort the units list by tier
    unitsList.sort((a, b) => a.tier - b.tier);

    // Define the maximum length of each subarray
    const maxLength = 10;

    // Split the array into smaller arrays by tier
    let splitArrays = [];
    let currentArray = [];

    let skip = false;
    if (unitsList.length > maxLength) {
        unitsList.forEach((item, index) => {
            currentArray.push(item);

            // Check if it's the last item or the tier changes
            if (index === unitsList.length - 1 || unitsList[index + 1].tier !== item.tier) {
                // Check if there's a gap of more than 1 in the tier
                if (index < unitsList.length - 1 && unitsList[index + 1].tier - item.tier > 1) {
                    // Insert "empty" entry
                    const gap = unitsList[index + 1].tier - item.tier;
                    for (let i = 1; i < gap; i++) {
                        splitArrays.push(currentArray);
                        currentArray = [];
                    }
                }

                splitArrays.push(currentArray);
                currentArray = [];
            }
        });
    } else {
        splitArrays.push(unitsList);
    }

    let sortedUnitListArray = [];

    let z = 0;
    for (z in splitArrays) {
        let unitsSorted = [];
        let x = 0;
        for (x in splitArrays[z]) {
            unitsSorted.push(splitArrays[z][x].id);
        }
        sortedUnitListArray.push(unitsSorted);
    }

    return sortedUnitListArray;
}

function FindUnitsWithSecondaryPassive(trait) {
    // lookup slug
    const ability = jsonUnitAbilities.find((entry) => entry.name.replaceAll(" ", "_").toLowerCase() === trait);
    // need to find a way to check tiers as well
    let unitsList = [];
    let i = 0;
    for (i in jsonUnits) {
        let j = 0;
        for (j in jsonUnits[i].secondary_passives) {
            if (jsonUnits[i].secondary_passives[j].slug === ability.slug) {
                //  if (!isInArray(unitsList, jsonUnits[i])) {

                unitsList.push(jsonUnits[i]);
                //  }
            }
        }
    }

    // Sort the units list by tier
    unitsList.sort((a, b) => a.tier - b.tier);

    // Define the maximum length of each subarray
    const maxLength = 10;

    // Split the array into smaller arrays by tier
    let splitArrays = [];
    let currentArray = [];

    let skip = false;
    if (unitsList.length > maxLength) {
        unitsList.forEach((item, index) => {
            currentArray.push(item);

            // Check if it's the last item or the tier changes
            if (index === unitsList.length - 1 || unitsList[index + 1].tier !== item.tier) {
                // Check if there's a gap of more than 1 in the tier
                if (index < unitsList.length - 1 && unitsList[index + 1].tier - item.tier > 1) {
                    // Insert "empty" entry
                    const gap = unitsList[index + 1].tier - item.tier;
                    for (let i = 1; i < gap; i++) {
                        splitArrays.push(currentArray);
                        currentArray = [];
                    }
                }

                splitArrays.push(currentArray);
                currentArray = [];
            }
        });
    } else {
        splitArrays.push(unitsList);
    }

    let sortedUnitListArray = [];

    let z = 0;
    for (z in splitArrays) {
        let unitsSorted = [];
        let x = 0;
        for (x in splitArrays[z]) {
            if ("sub_culture_name" in splitArrays[z][x] && !architectCultureUnits.includes(splitArrays[z][x].id)) {
                let newEntry = splitArrays[z][x].id + "," + splitArrays[z][x].sub_culture_name;

                if (!isInArray(unitsSorted, newEntry)) {
                    unitsSorted.push(newEntry);
                }
            } else {
                if (!isInArray(unitsSorted, splitArrays[z][x].id)) {
                    unitsSorted.push(splitArrays[z][x].id);
                }
            }
        }
        sortedUnitListArray.push(unitsSorted);
    }

    return sortedUnitListArray;
}

function showItem(itemLoc, divOrigin) {
    let modName = divOrigin.querySelector("#modname");
    // console.log(a.id);
    if (itemLoc.id.indexOf("pantheon") != -1) {
        modName.innerHTML = "<pantheon></pantheon>" + itemLoc.name.toUpperCase();
    } else {
        modName.innerHTML = itemLoc.name.toUpperCase();
    }

    let descriptionDiv = divOrigin.querySelector("#moddescription");

    descriptionDiv.innerHTML = "<hr>";
    if ("description" in itemLoc) {
        descriptionDiv.innerHTML += itemLoc.description + "<br>";
    }
    // const fragment = document.createElement("span");

    if ("ability_slugs" in itemLoc) {
        for (const slugObj of itemLoc.ability_slugs) {
            const ability = abilityMap[slugObj.slug];
            if (!ability) continue;
            const abTooltips = document.createElement("div");
            if ("range" in ability) {
                const abilityElement = GetAbilityToolTip(ability); //
                abTooltips.appendChild(abilityElement);
            } else {
                const passiveElement = CreatePassiveSlotToolTip(ability.icon, ability.name, ability.description); //
                abTooltips.appendChild(passiveElement);
            }
            abTooltips.className = "itemAbility";

            descriptionDiv.innerHTML += abTooltips.innerHTML;
        }
    }

    if ("DLC" in itemLoc) {
        let dlctag = AddDLCTag(itemLoc.DLC);
        modName.append(dlctag);
    }

    let unitTypesDiv = divOrigin.querySelector("#affectUnitTypes");

    for (let i = 0; i < itemLoc.disabled_slots.length; i++) {
        let div = document.createElement("DIV");
        div.innerHTML = "&#11049" + itemLoc.disabled_slots[i].slot_name;
        unitTypesDiv.appendChild(div);
    }
    if (itemLoc.disabled_slots.length > 0) {
        descriptionDiv.innerHTML += "Disabled slots: <br>";
    }

    let tier = divOrigin.querySelector("#spell_tier");
    tier.innerHTML = itemLoc.tier;

    let cost = divOrigin.querySelector("#modcost");
    let costText = itemLoc.slot + "<br>";
    // add classes
    if ("hero_classes" in itemLoc) {
        for (let i = 0; i < itemLoc.hero_classes.length; i++) {
            costText += itemLoc.hero_classes[i].name + " , ";
        }
    }
    costText += "<br>";
    if ("hero_types" in itemLoc) {
        for (let i = 0; i < itemLoc.hero_types.length; i++) {
            costText += itemLoc.hero_types[i].name + " , ";
        }
    }
    cost.innerHTML = costText;

    let imagelink = divOrigin.querySelector("#modicon");
    imagelink.remove();

    let tomeOriginIcon = divOrigin.querySelector("#originTomeIcon");
    tomeOriginIcon.setAttribute("src", "/aow4db/Icons/UnitIcons/" + itemLoc.icon + ".png");
}

function showTraitSetup(currentTrait, divOrigin, loc) {
    if (loc == "loc") {
        const traitLoc = findBy(jsonFactionCreation2Localized, "icon", currentTrait.icon);
        if (traitLoc == undefined) {
            console.log(currentTrait);
        }
        currentTrait = traitLoc;
    }

    let modName = divOrigin.querySelector("#modname");
    modName.innerHTML = currentTrait.name.toUpperCase();

    let descriptionDiv = divOrigin.querySelector("#moddescription");

    descriptionDiv.innerHTML = "";

    let div = document.createElement("DIV");

    // build up description:

    if ("lore_description" in currentTrait) {
        descriptionDiv.innerHTML += '<hr> <span class="loreText">' + currentTrait.lore_description + "</span>";
    }

    if ("effect_descriptions" in currentTrait) {
        descriptionDiv.innerHTML += '<br><br><span class="mod_name">EFFECTS: </span><bulletlist>';
        let k = "";
        for (k in currentTrait.effect_descriptions) {
            descriptionDiv.innerHTML += "<bullet>" + currentTrait.effect_descriptions[k].name + "</bullet>";
        }
        descriptionDiv.innerHTML += "</bulletlist>";
    }

    if ("description" in currentTrait || "extraLookup" in currentTrait) {
        if ("requirement" in currentTrait) {
            if (currentTrait.requirement.indexOf("Vision of Destiny") != -1) {
                // vision trait setup
                if ("rewards" in currentTrait) {
                }
                descriptionDiv.innerHTML += "Earn 500 points by:<br>";
            }
        }
        if ("extraLookup" in currentTrait) {
            const valueLookup = findBy(jsonAllFromPOLocalized, "id", currentTrait.extraLookup);
            // console.log(currentTrait.extraLookup);
            if ("hyperlink" in valueLookup) {
                modName.innerHTML = valueLookup.hyperlink.toUpperCase();
            } else if ("name" in valueLookup) {
                modName.innerHTML = valueLookup.name.toUpperCase();
            }
            if ("description_short" in valueLookup) {
                descriptionDiv.innerHTML += valueLookup.description_short;
            }
            if ("lore" in valueLookup) {
                descriptionDiv.innerHTML += valueLookup.lore;
            }
            if ("bio" in valueLookup) {
                descriptionDiv.innerHTML += valueLookup.bio;
            }
            if ("fpg_description" in valueLookup) {
                descriptionDiv.innerHTML += valueLookup.fpg_description;
            } else if ("description" in valueLookup) {
                descriptionDiv.innerHTML += valueLookup.description;
            }

            if ("extraLookup2" in currentTrait) {
                const valueLookup2 = findBy(jsonAllFromPOLocalized, "id", currentTrait.extraLookup2);
                // console.log(valueLookup2);
                if ("hyperlink" in valueLookup2) {
                    modName.innerHTML = valueLookup2.hyperlink.toUpperCase();
                } else if ("name" in valueLookup2) {
                    modName.innerHTML = valueLookup2.name.toUpperCase();
                }
                if ("lore" in valueLookup2) {
                    descriptionDiv.innerHTML += valueLookup2.lore;
                }
                if ("fpg_description" in valueLookup2) {
                    descriptionDiv.innerHTML += valueLookup2.fpg_description;
                } else if ("description" in valueLookup2) {
                    descriptionDiv.innerHTML += valueLookup2.description;
                }
            }
        } else {
            descriptionDiv.innerHTML += currentTrait.description;
        }
    }

    if ("DLC" in currentTrait) {
        let newDivForMount = AddDLCTag(currentTrait.DLC);
        modName.append(newDivForMount);
    }

    if ("starting_bonuses" in currentTrait) {
        descriptionDiv.innerHTML += '<br><br><span class="mod_name">STARTING BONUS: </span><bulletlist>';
        let k = "";
        for (k in currentTrait.starting_bonuses) {
            if ("structure_upgrade_slug" in currentTrait.starting_bonuses[k]) {
                descriptionDiv.innerHTML +=
                    "<bullet>" + currentTrait.starting_bonuses[k].structure_upgrade_slug + "</bullet>";
            }
            if ("empire_progression_slug" in currentTrait.starting_bonuses[k]) {
                descriptionDiv.innerHTML +=
                    "<bullet>" + currentTrait.starting_bonuses[k].empire_progression_slug + "</bullet>";
            }
            if ("description" in currentTrait.starting_bonuses[k]) {
                descriptionDiv.innerHTML += "<bullet>" + currentTrait.starting_bonuses[k].description + "</bullet>";
            }
        }
        descriptionDiv.innerHTML += "</bulletlist>";
    }

    if ("incompatible_society_traits" in currentTrait) {
        descriptionDiv.innerHTML += '<br><br><span class="mod_name">INCOMPATIBLE WITH: </span><bulletlist>';
        let k = "";
        for (k in currentTrait.incompatible_society_traits) {
            descriptionDiv.innerHTML += "<bullet>" + currentTrait.incompatible_society_traits[k].name + "</bullet>";
        }
        descriptionDiv.innerHTML += "</bulletlist>";
    }

    if ("objective" in currentTrait) {
        descriptionDiv.innerHTML += "<br><hr><span style='color:beige'>Objective: </span><br>";
        const valueLookup = findBy(jsonAllFromPOLocalized, "id", currentTrait.objective);
        if (valueLookup) {
            descriptionDiv.innerHTML += valueLookup.objective_1 + "<br>";
            descriptionDiv.innerHTML += valueLookup.objective_2 ? valueLookup.objective_2 + "<br>" : "";
            descriptionDiv.innerHTML += valueLookup.objective_3 ? valueLookup.objective_3 + "<br>" : "";
        }
    }

    if ("rewards" in currentTrait) {
        descriptionDiv.innerHTML += "<br><hr><span style='color:beige'>Rewards: </span><br>";
        for (let i in currentTrait.rewards) {
            //console.log(currentTrait.rewards[i]);
            const valueLookup = findBy(jsonAllFromPOLocalized, "id", currentTrait.rewards[i]);
            if (valueLookup) {
                descriptionDiv.innerHTML += valueLookup.city_cap_buff
                    ? "<bullet>" + valueLookup.city_cap_buff + "</bullet>"
                    : "";
                descriptionDiv.innerHTML += valueLookup.throne_city_buff
                    ? "<bullet>" + valueLookup.throne_city_buff + "</bullet>"
                    : "";
                descriptionDiv.innerHTML += valueLookup.unit_reward
                    ? "<bullet>" + valueLookup.unit_reward + "</bullet>"
                    : "";
                descriptionDiv.innerHTML += valueLookup.war ? "<bullet>" + valueLookup.war + "</bullet>" : "";

                descriptionDiv.innerHTML += valueLookup.war_houses
                    ? "<bullet>" + valueLookup.war_houses + "</bullet>"
                    : "";
                descriptionDiv.innerHTML += valueLookup.name ? "<bullet>" + valueLookup.name + "<br>" : "";
                descriptionDiv.innerHTML += valueLookup.description ? valueLookup.description + "</bullet>" : "";
            }
        }
    }

    if ("unit_unlocks" in currentTrait) {
        descriptionDiv.innerHTML += "<br><span style='color:beige'>Rally Units:</span><br>";

        for (let x = 0; x < currentTrait.unit_unlocks.length; x++) {
            let div = document.createElement("DIV");
            div.setAttribute("style", "margin-right: 20px;");
            div.innerHTML =
                '<a href="/aow4db/HTML/Units.html?unit=' +
                currentTrait.unit_unlocks[x].slug +
                '" target="_blank">' +
                GetUnitTierAndName(currentTrait.unit_unlocks[x].slug) +
                "</a>" +
                "</bullet>";
            descriptionDiv.appendChild(div);
        }
    }

    let tier = divOrigin.querySelector("#modtier");
    tier.innerHTML = "";
    if ("affinity" in currentTrait) {
        let splitAff = currentTrait.affinity.split(",");
        let j = "";
        for (j in splitAff) {
            tier.innerHTML += splitAff[j];
        }
    }

    let cost = divOrigin.querySelector("#modcost");
    cost.innerHTML = "";
    if (currentTrait.type == "form") {
        cost.innerHTML = "Form- " + currentTrait.point_cost + " Points";
    } else if (currentTrait.type == "society") {
        cost.innerHTML = "Society";
    }

    let imagelink = divOrigin.querySelector("#modicon");
    let iconLink = currentTrait.icon;
    if (iconLink == undefined) {
        // fallback
        iconLink = currentTrait.id;
    }
    if (iconLink.startsWith("_")) {
        iconLink = iconLink.split("_").slice(1).join("_");
    }

    imagelink.setAttribute("src", "/aow4db/Icons/TraitIcons/" + iconLink + ".png");
    imagelink.setAttribute("style", "background-image:none");
    imagelink.setAttribute("onerror", "this.setAttribute('src','/aow4db/Icons/Text/empty.png')");
}

function showTrait(a, divOrigin) {
    let modName,
        description,
        cost,
        type,
        tier = "";
    let found = false;
    let i = "";
    for (i in jsonFactionCreation2) {
        if (jsonFactionCreation2[i].id === a) {
            let currentTrait = jsonFactionCreation2[i];

            showTraitSetup(currentTrait, divOrigin, "loc");
        }
    }
    for (i in jsonFactionCreation) {
        if (jsonFactionCreation[i].id === a) {
            let currentTrait = jsonFactionCreation[i];
            showTraitSetup(currentTrait, divOrigin);
        }
    }
}

function showHeroTrait(a, divOrigin) {
    let modName,
        description,
        cost,
        type,
        tier = "";
    let found = false;
    let i = "";

    let thisAmbition = jsonHeroAmbitions.find((entry) => entry.id === a);
    console.log(thisAmbition + " " + a);
    let thisAmbitionLoc = jsonHeroAmbitionsLocalized.find((entry) => entry.icon === thisAmbition.icon);

    modName = divOrigin.querySelector("#modname");
    modName.innerHTML = thisAmbitionLoc.name.toUpperCase();

    let descriptionDiv = divOrigin.querySelector("#moddescription");

    descriptionDiv.innerHTML = "";
    if (thisAmbition.available_to_rulers == false) {
        descriptionDiv.innerHTML =
            "<hr>" + "<helpText>Only Available to Heroes</helpText><br><br>" + thisAmbitionLoc.screen_description;
    } else {
        descriptionDiv.innerHTML = "<hr>" + thisAmbitionLoc.screen_description;
    }

    tier = divOrigin.querySelector("#modtier");
    tier.innerHTML = "";

    let imagelink = divOrigin.querySelector("#modicon");
    imagelink.setAttribute("src", "/aow4db/Icons/AmbitionIcons/" + thisAmbition.icon + ".png");
    imagelink.setAttribute("style", "background-image:none");

    let unitTypesDiv = divOrigin.querySelector("#affectUnitTypes");

    unitTypesDiv.setAttribute("style", "position: relative;display: block");
    // get ambitions
    for (let j = 0; j < thisAmbition.ambitions.length; j++) {
        // major ambition:
        if (thisAmbition.ambitions[j].type == "major") {
            let dis = document.createElement("div");

            let rewardProperty = "";

            for (let f = 0; f < thisAmbition.ambitions[j].reward_properties.length; f++) {
                rewardProperty =
                    '<span style="color:#deb887" >' +
                    thisAmbitionLoc.ambitions[j].reward_properties[f].name.toUpperCase() +
                    "</span><hr><span>" +
                    thisAmbitionLoc.ambitions[j].reward_properties[f].screen_description +
                    "</span>";
            }

            dis.innerHTML +=
                "<bulletlist><yellowText>Major Ambition</yellowText><bullet>" +
                thisAmbitionLoc.ambitions[j].screen_description +
                "</bullet><bullet>Reward: " +
                thisAmbitionLoc.ambitions[j].reward_renown +
                "<renown></renown> Renown</bullet><br>" +
                "<greenText>Skill reward</greenText><br>" +
                rewardProperty +
                "</bullet></bulletlist><br><br>";
            unitTypesDiv.appendChild(dis);
        }

        // Minor Ambition
        if (thisAmbition.ambitions[j].type == "minor") {
            let dis = document.createElement("div");

            dis.innerHTML +=
                "<bulletlist><yellowText>Minor Ambition</yellowText><bullet>" +
                thisAmbitionLoc.ambitions[j].screen_description +
                "<br></bullet><bullet>Reward: " +
                thisAmbitionLoc.ambitions[j].reward_renown +
                "<renown></renown> Renown(repeatable)</bullet></bulletlist>";
            unitTypesDiv.appendChild(dis);
        }
    }

    found = true;
}

function showHeroGov(data, check, divOrigin) {
    let modName,
        description,
        cost,
        type,
        tier = "";
    let found = false;

    let thisGovernance = data;
    modName = divOrigin.querySelector("#modname");
    modName.innerHTML = thisGovernance.name.toUpperCase();

    let descriptionDiv = divOrigin.querySelector("#moddescription");

    descriptionDiv.innerHTML = "";

    descriptionDiv.innerHTML = "<hr>" + thisGovernance.screen_description;

    tier = divOrigin.querySelector("#modtier");
    tier.innerHTML = "";

    let imagelink = divOrigin.querySelector("#modicon");
    imagelink.setAttribute("src", "/aow4db/Icons/GovernanceIcons/" + thisGovernance.icon.toLowerCase() + ".png");
    imagelink.setAttribute("style", "background-image:none");
    found = true;
}

function showSkill(a, checkInAbilities, icon_slug, category, level, group_name, divOrigin) {
    const skillEN = jsonHeroSkills.find((entry) => entry.id === a.id);
    const skillLoc = jsonHeroSkillsLocalized.find((entry) => entry.resid === skillEN.resid);
    let modName = divOrigin.querySelector("#modname");

    modName.innerHTML = skillLoc.name.toUpperCase();

    let descriptionDiv = divOrigin.querySelector("#moddescription");
    descriptionDiv.innerHTML = "";
    if ("group_name" in skillLoc) {
        let span = document.createElement("span");
        span.innerHTML = skillLoc.group_name;
        //  console.log(span.innerHeight);
        descriptionDiv.append(span);
    }

    let unitTypesDiv = divOrigin.querySelector("#affectUnitTypes");

    let tier = divOrigin.querySelector("#spell_tier");
    if (tier == undefined) {
        tier = divOrigin.querySelector("#modtier");
    }
    tier.innerHTML = "";

    if (category != undefined) {
        tier.innerHTML += "<br>" + skillLoc.category + " - " + level;
        tier.innerHTML += "<br>" + group_name;
    }

    let cost = divOrigin.querySelector("#modcost");
    cost.innerHTML = "";

    let imagelink = divOrigin.querySelector("#modicon");
    if (a.type === "signature") {
        imagelink.className = "smallerIcon";
        imagelink.setAttribute("src", "/aow4db/Icons/UnitIcons/" + icon_slug + ".png");
        imagelink.setAttribute("id", "modicon" + a.id);

        cost.innerHTML = transformString(a.hero_property);
        // spa.setAttribute("style", "width: 360px");
    } else {
        imagelink.remove();
    }

    if ("DLC" in a) {
        let newDivForMount = AddDLCTag(a.DLC);
        modName.append(newDivForMount);
    }

    if (checkInAbilities != "") {
        let j = 0;
        let spa;
        for (j in jsonUnitAbilitiesLocalized) {
            let k = 0;
            for (k in skillLoc.abilities) {
                if (jsonUnitAbilitiesLocalized[j].slug === skillLoc.abilities[k].slug) {
                    let abilityName = jsonUnitAbilitiesLocalized[j].name;
                    let abilityReq = "";

                    spa = GetAbilityInfo(jsonUnitAbilitiesLocalized[j]);

                    spa.className = "itemAbility";
                    spa.setAttribute("style", "width:380px");
                    descriptionDiv.append(spa);

                    found = true;
                }
            }
        }
    } else {
        let spa = CreatePassiveSlotToolTip(skillLoc.icon, skillLoc.name, skillLoc.description);
        spa.className = "itemAbility";
        descriptionDiv.append(spa);

        found = true;

        return;
    }

    let ascendedInfo = findBy(jsonExtraAscendedInfo, "id", a.id);
    if (ascendedInfo != undefined) {
        if ("extraspell" in ascendedInfo) {
            const fragment = spell_card_template.content.cloneNode(true);
            const element = fragment.firstElementChild;
            // Access the root element in the DocumentFragment

            // Apply the style to the root element
            if (element) {
                element.style.left = "-40px";
                element.style.position = "relative";
            }
            descriptionDiv.appendChild(element);
            showSpell(ascendedInfo.extraspell, false, element);
        }
        descriptionDiv.innerHTML += "One of Following Tomes Researched : <br>" + ascendedInfo.description;
    }

    if (found === false) {
        console.log("Couldn't find skill: " + a.id);
    }
}

function AddDLCTag(dlcname) {
    let newDivForMount = document.createElement("DIV");
    dlcname = dlcname.replaceAll(" ", "");
    newDivForMount.className = "mountToolTip";

    imag = document.createElement("IMG");
    imag.setAttribute("height", "25px");

    spa = document.createElement("SPAN"); // Trim spaces just in case
    const dlcKey = (dlcname || "").trim();
    const dlcInfo = dlcMap[dlcKey];

    if (dlcInfo) {
        imag.setAttribute("src", dlcInfo.src);
        spa.innerHTML = dlcInfo.text;
    }
    newDivForMount.appendChild(imag);

    addTooltipListeners(newDivForMount, spa);
    newDivForMount.setAttribute(
        "style",
        "text-transform: none;width: 1px;left: -32px;position: relative;margin-left: 30px;height: 20px;float: left;"
    );
    return newDivForMount;
}

function backtraceTomeOriginAndTier(spell, showorigin, modCard) {
    let tomespells = findParentByNested(jsonTomes, "skills", "name", spell.name);
    if (tomespells != undefined) {
        if (showorigin) {
            const tomeOriginAff = modCard.querySelector("#originTomeAffinities");
            const tomeOriginName = modCard.querySelector("#originTomeName");
            const originTomeTier = modCard.querySelector("#originTomeTier");
            if ("affinities" in tomespells) {
                tomeOriginAff.innerHTML = showAffinitySymbols(tomespells);
            }
            originTomeTier.innerHTML += romanize(tomespells.tier);
            tomeOriginName.innerHTML += tomespells.name;

            const tomeOriginIcon = modCard.querySelector("#originTomeIcon");
            tomeOriginIcon.setAttribute("src", "/aow4db/Icons/TomeIcons/" + tomespells.icon + ".png");
            const wrap = tomeOriginName.innerHTML;
            tomeOriginName.innerHTML =
                '<a href="/aow4db/HTML/Spells.html?tome=' + tomespells.id + '" target="_blank">' + wrap + "</a>";

            return tomespells.tier + "," + tomespells.id;
        } else {
            return tomespells.tier + "," + tomespells.id;
        }
    }
}

function backtraceStructureToTomeNameAndTier(structure) {
    let tome =
        findParentByNested(jsonTomesLocalized, "initial_upgrades", "upgrade_slug", structure) ||
        findParentByNested(jsonTomesLocalized, "skills", "upgrade_slug", structure);
    if (tome != undefined) {
        let array = [];
        if ("affinities" in tome) {
            array.push(
                ClearAffinityExtraTags(duplicateTags(tome.affinities)).replaceAll(",", "") + "<br> " + tome.name
            );
        } else {
            array.push(tome.name);
        }
        array.push(tome.tier);
        array.push(tome.id);

        return array;
    } else {
        return "";
    }
}

function backtraceTomeNameAndTier(spell) {
    return findParentByNested(jsonTomesLocalized, "skills", "spell_slug", spell) || "";
}
