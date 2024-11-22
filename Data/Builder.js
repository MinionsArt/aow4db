var searchParams = new URLSearchParams(window.location.search);
var sorting = searchParams.get("sort");
var currentView = "";

function CheckBoxTooltips() {
    var checkboxTooltip = document.getElementById("tooltipCheckbox");

    if (checkboxTooltip.checked === true) {
        addTooltipListeners(hoverDiv, null);
    } else {
        removeToolTipListeners(hoverDiv);
    }
    updateUserSettings({
        tooltipselectable: checkboxTooltip.checked
    });
}

// Set user settings
function setUserSettings(settings) {
    localStorage.setItem("userSettings", JSON.stringify(settings));
}

// Update user settings
function updateUserSettings(updatedSettings) {
    const currentSettings = getUserSettings();
    if (currentSettings) {
        const newSettings = {
            ...currentSettings,
            ...updatedSettings
        };
        setUserSettings(newSettings);
    }
}
// Get user settings
function getUserSettings() {
    const storedSettings = localStorage.getItem("userSettings");
    return storedSettings ? JSON.parse(storedSettings) : null;
}

function fetchJsonFiles(filePaths) {
    return Promise.all(
        filePaths.map((filePath) =>
            fetch(filePath).then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
        )
    );
}
var jsonSiegeProjects,
    jsonHeroSkills,
    jsonHeroItems,
    jsonFactionCreation2,
    jsonTomes,
    jsonUnitAbilities,
    jsonEmpire,
    jsonSpells,
    jsonStructureUpgrades,
    jsonCombatEnchantments,
    jsonWorldStructures,
    jsonEnchantments,
    jsonSpawnTables,
    jsonFactionCreation,
    jsonHeroAmbitions,
    jsonBuilderLookUp,
    jsonExtraAscendedInfo,
    jsonItemForge,
    jsonCosmicHappenings,
    jsonHeroSkillsBeta,
    jsonAbilitiesBeta,
    jsonBuilderHeroLookUp,
    jsonHeroGovernance;

async function GetAllData() {
    const jsonFilePaths = [
        "/aow4db/Data/HeroItems.json",
        "/aow4db/Data/HeroSkills.json",
        "/aow4db/Data/SiegeProjects.json",
        "/aow4db/Data/Units.json",
        "/aow4db/Data/Traits.json",
        "/aow4db/Data/Tomes.json",
        "/aow4db/Data/Abilities.json",
        "/aow4db/Data/EmpireProgression.json",
        "/aow4db/Data/Spells.json",
        "/aow4db/Data/StructureUpgrades.json",
        "/aow4db/Data/CombatEnchantments.json",
        "/aow4db/Data/WorldStructures.json",
        "/aow4db/Data/EnchantmentTables.json",
        "/aow4db/Data/SpawnTables.json",
        "/aow4db/Data/FactionCreation.json",
        "/aow4db/Data/Destinies.json",
        "/aow4db/Data/BuilderLookup.json",
        "/aow4db/Data/AscendedInfo.json",
        "/aow4db/Data/ItemForge.json",
        "/aow4db/Data/CosmicHappenings.json",
        "/aow4db/Data/BuilderLookupHero.json",
        "/aow4db/Data/Governance.json"
    ];
    await fetchJsonFiles(jsonFilePaths)
        .then((dataArray) => {
            dataArray.forEach((data, index) => {
                // console.log(`Data from ${jsonFilePaths[index]}:`, data);
                if (index == 0) {
                    jsonHeroItems = data;
                } else if (index == 1) {
                    jsonHeroSkills = data;
                } else if (index == 2) {
                    jsonSiegeProjects = data;
                } else if (index == 3) {
                    jsonUnits = data;
                } else if (index == 4) {
                    jsonFactionCreation2 = data;
                } else if (index == 5) {
                    jsonTomes = data;
                } else if (index == 6) {
                    jsonUnitAbilities = data;
                } else if (index == 7) {
                    jsonEmpire = data;
                } else if (index == 8) {
                    jsonSpells = data;
                } else if (index == 9) {
                    jsonStructureUpgrades = data;
                } else if (index == 10) {
                    jsonCombatEnchantments = data;
                } else if (index == 11) {
                    jsonWorldStructures = data;
                } else if (index == 12) {
                    jsonEnchantments = data;
                } else if (index == 13) {
                    jsonSpawnTables = data;
                } else if (index == 14) {
                    jsonFactionCreation = data;
                } else if (index == 15) {
                    jsonHeroAmbitions = data;
                } else if (index == 16) {
                    jsonBuilderLookUp = data;
                } else if (index == 17) {
                    jsonExtraAscendedInfo = data;
                } else if (index == 18) {
                    jsonItemForge = data;
                } else if (index == 19) {
                    jsonCosmicHappenings = data;
                } else if (index == 20) {
                    jsonBuilderHeroLookUp = data;
                } else if (index == 21) {
                    jsonHeroGovernance = data;
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching JSON files:", error.message);
        });
}
async function CheckData() {
    if (jsonSiegeProjects === undefined) {
        await GetAllData();
        // Example usage

        const storedSettings = getUserSettings();
        if (storedSettings === null) {
            setUserSettings({
                tooltipselectable: false,
                fontSize: "16px"
            });
        } else {
            var checkboxTooltip = document.getElementById("tooltipCheckbox");
            checkboxTooltip.checked = storedSettings.tooltipselectable;

            if (checkboxTooltip.checked === true) {
                addTooltipListeners(hoverDiv, null);
            } else {
                removeToolTipListeners(hoverDiv);
            }
        }

        HandlePage();
    }
}

var highCultureUnits = ["lightseeker", "dawn_defender", "dusk_hunter", "sun_priest", "daylight_spear", "awakener"];
var barbarianCultureUnits = ["pathfinder", "sunderer", "warrior", "war_shaman", "fury", "berserker"];
var darkCultureUnits = ["outrider", "pursuer", "dark_warrior", "warlock", "night_guard", "dark_knight"];
var feudalCultureUnits = ["scout", "peasant_pikeman", "archer", "bannerman", "defender", "knight"];
var industriousCultureUnits = ["pioneer", "anvil_guard", "arbalest", "steelshaper", "halberdier", "bastion"];
var mysticCultureUnits = [
    "mystic_projection",
    "arcane_guard",
    "arcanist",
    "soother",
    "spellshield",
    "spellbreaker",
    "spellweaver",
    "summoner"
];
var reaverCultureUnits = ["observer", "mercenary", "harrier", "overseer", "magelock", "dragoon", "magelock_cannon"];
var primalCultureUnits = [
    "spirit_tracker",
    "protector",
    "primal_darter",
    "primal_charger",
    "animist",
    "ancestral_warden"
];

var MountedSpecialList = [
    "pioneer",
    "pathfinder",
    "scout",
    "lightseeker",
    "knight",
    "outrider",
    "dark_knight",
    "tyrant_knight",
    "wildspeaker",
    "houndmaster",
    "spellbreaker",
    "dragoon",
    "spirit_tracker",
    "spellshield"
];

var extraFormUnitsList = [
    "phantasm_warrior",
    "evoker",
    "white_witch",
    "necromancer",
    "zombie",
    "decaying_zombie",
    "skeleton",
    "chaplain",
    "zealot",
    "inquisitor",
    "glade_runner",
    "pyromancer",
    "warbreed",
    "exemplar",
    "transmuter",
    "zephyr_archer",
    "afflictor",
    "stormbringer",
    "constrictor",
    "pyre_templar",
    "monk",
    "shade",
    "tyrant_knight",
    "wildspeaker",
    "houndmaster"
];

var incorrectIconOverrideList = [
    "summon_zealot",
    "summon_lightbringer",
    "conjure_divine_beacon",
    "summon_lesser_snow_spirit",
    "summon_wind_rager",
    "summon_balor",
    "summon_lesser_magma_spirit",
    "summon_horned_god",
    "summon_corrupt_soul"
];

function GetUnitTierAndName(id, subcultureCheck) {
    for (var i = 0; i < jsonUnits.length; i++) {
        var unit = jsonUnits[i];

        // Check if the ID matches
        if (id !== unit.id) {
            continue;
        }

        // Skip deprecated units
        if (unit.primary_passives.length > 0 && unit.primary_passives[0].slug === "deprecated_unit!") {
            continue;
        }

        // Check if subculture matches if provided
        if (subcultureCheck !== undefined && "sub_culture_name" in unit && unit.sub_culture_name !== subcultureCheck) {
            continue;
        }

        // Prepare the unit's name
        var name = unit.name;

        // Add mount special tags if applicable
        if (MountedSpecialList.includes(id) || CheckIfOptionalCavalry(id)) {
            name += " <mountSpecial></mountSpecial>";
        }

        // Add subculture tags if available
        if ("sub_culture_name" in unit) {
            var subculture = unit.sub_culture_name.toLowerCase().replaceAll(" ", "_");
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

function CheckIfFormUnit(id) {
    if (
        MountedSpecialList.includes(id) ||
        highCultureUnits.includes(id) ||
        barbarianCultureUnits.includes(id) ||
        darkCultureUnits.includes(id) ||
        feudalCultureUnits.includes(id) ||
        industriousCultureUnits.includes(id) ||
        mysticCultureUnits.includes(id) ||
        reaverCultureUnits.includes(id) ||
        primalCultureUnits.includes(id) ||
        extraFormUnitsList.includes(id)
    ) {
        if (id !== "observer" && id != "magelock_cannon") {
            return true;
        }
    } else {
        return false;
    }
}

function GetUnitTierAndNameTome(id) {
    for (var i = 0; i < jsonTomes.length; i++) {
        if (id === jsonTomes[i].id) {
            return romanize(jsonTomes[i].tier) + " - " + jsonTomes[i].name;
        }
    }
}

function GetSiegeProjectName(id) {
    for (var i = 0; i < jsonSiegeProjects.length; i++) {
        if (id === jsonSiegeProjects[i].id) {
            return jsonSiegeProjects[i].name;
        }
    }
}

function GetUnitNamePlain(id) {
    for (var i = 0; i < jsonUnits.length; i++) {
        if (id === jsonUnits[i].id) {
            return jsonUnits[i].name;
        }
    }
}

function GetSpellTierAndName(id) {
    for (var i = 0; i < jsonSpells.length; i++) {
        if (id === jsonSpells[i].id) {
            return jsonSpells[i].name;
        }
    }
}

function ShowUnitFromLink() {
    var unitID = searchParams.get("unit");
    document.title = "Age of Wonders 4 Database - " + GetUnitTierAndName(unitID).split(">")[2];
    showUnitFromString(unitID, "dataHolder");
}

function ShowSpellFromLink() {
    var spellID = searchParams.get("spell");
    if (spellID != undefined) {
        document.title = "Age of Wonders 4 Database - " + GetSpellTierAndName(spellID).split(">")[2];
        showSpellFromString(spellID, "dataHolder");
    }

    var SiegeID = searchParams.get("siege");
    if (SiegeID != undefined) {
        document.title = "Age of Wonders 4 Database - " + "Siege Project";
        showSiegeProjectFromString(SiegeID, "dataHolder");
    }

    var WonderID = searchParams.get("wonder");
    if (WonderID != undefined) {
        document.title = "Age of Wonders 4 Database - " + "Wonder";
        showWorldStructureFromString(WonderID, "dataHolder");
    }

    var TomeID = searchParams.get("tome");
    if (TomeID != undefined) {
        document.title = "Age of Wonders 4 Database - " + "Tome";
        showTomeFromString(TomeID, "dataHolder");
    }

    var StrucID = searchParams.get("structure");
    if (StrucID != undefined) {
        document.title = "Age of Wonders 4 Database - " + "Structure";
        showStructureFromString(StrucID, "dataHolder");
    }

    var SkillID = searchParams.get("skill");
    if (SkillID != undefined) {
        document.title = "Age of Wonders 4 Database - " + "Hero Skill";
        showHeroSkillFromString(SkillID, "dataHolder");
    }
}

function getUnitTypeTag(passivesList) {
    // Mapping slugs to their corresponding HTML tags
    const slugToTag = {
        fighter_unit: "<unitFighter></unitFighter>",
        shock_unit: "<unitShock></unitShock>",
        skirmisher_unit: "<unitSkirmisher></unitSkirmisher>",
        support_unit: "<unitSupport></unitSupport>",
        scout_unit: "<unitScout></unitScout>",
        ranged_unit: "<unitRanged></unitRanged>",
        battle_mage_unit: "<unitBattlemage></unitBattlemage>",
        polearm_unit: "<unitPolearm></unitPolearm>",
        shield_unit: "<unitShield></unitShield>",
        tower: "<unitTower></unitTower>",
        siegecraft: "<unitSiegecraft></unitSiegecraft>",
        mythic_unit: "<unitMythic></unitMythic>",
        civilian: "<unitCivilian></unitCivilian>"
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

    if (parent === undefined) {
        var buttonHolder = document.getElementById("buttonHolder");
    } else {
        var buttonHolder = document.getElementById(parent);
    }
    var btn = document.createElement("BUTTON");

    btn.className = "w3-bar-item w3-button tablink";
    btn.type = "button";
    btn.innerHTML = '<i class="fa fa-solid fa-list"></i>';
    btn.setAttribute("onclick", 'openDiv(event, "' + list + '")');

    var firstChild = buttonHolder.firstChild;
    buttonHolder.insertBefore(btn, firstChild);
}

function SetButtonsAndDivs(list, parent, cardType, otherParent, subcultureCheck) {
    AddListView(list, parent);
    //console.log(list);
    for (let i = 0; i < list.length; i++) {
        if (list[i].includes(",")) {
            var test = list[i].split(",");

            subcultureCheck = test[1];
            list[i] = test[0];
        }
        if (parent === undefined) {
            var buttonHolder = document.getElementById("buttonHolder");
        } else {
            var buttonHolder = document.getElementById(parent);
        }

        if (otherParent === undefined) {
            var dataHolder = document.getElementById("dataHolder");
        } else {
            var dataHolder = document.getElementById(otherParent);
        }
        var div = document.createElement("DIV");
        div.className = "w3-container w3-border city";
        if (subcultureCheck == undefined) {
            div.setAttribute("id", list[i]);
        } else {
            div.setAttribute("id", list[i] + subcultureCheck);
        }
        dataHolder.appendChild(div);

        var btn = document.createElement("BUTTON");
        btn.className = "w3-bar-item w3-button tablink";
        btn.type = "button";
        if (subcultureCheck == undefined) {
            btn.setAttribute("id", list[i] + "-button");
        } else {
            btn.setAttribute("id", list[i] + subcultureCheck + "-button");
        }

        switch (cardType) {
            case "unitTomeIcon":
                var splitIcon = list[i].split(":");
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
                if (subcultureCheck == undefined) {
                    showUnitFromString(list[i], list[i]);
                    btn.innerHTML = GetUnitTierAndName(list[i]);
                    btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "',)");
                } else {
                    showUnitFromString(list[i], list[i] + subcultureCheck, subcultureCheck);
                    btn.innerHTML = GetUnitTierAndName(list[i], subcultureCheck);
                    btn.setAttribute("onclick", "openDiv(event,'" + list[i] + subcultureCheck + "',)");
                }

                break;
            case "subcultureUnit":
                showUnitFromString(list[i], list[i]);
                btn.innerHTML = GetUnitTierAndName(list[i]);
                btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "',)");
                break;
            case "tome":
                showTomeFromList2(list[i], list[i]);
                btn.innerHTML = GetUnitTierAndNameTome(list[i]);
                btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "',)");
                break;
            case "searchUnit":
                if (subcultureCheck != undefined) {
                    // div.setAttribute("id", list[i] + subcultureCheck);
                    showUnitFromString(list[i], list[i] + subcultureCheck, subcultureCheck);
                    btn.innerHTML = GetUnitTierAndName(list[i], subcultureCheck);
                    btn.setAttribute("onclick", "openDiv(event,'" + list[i] + subcultureCheck + "',true)");
                } else {
                    //  div.setAttribute("id", list[i]);
                    showUnitFromString(list[i], list[i]);
                    btn.innerHTML = GetUnitTierAndName(list[i]);
                    btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "',true)");
                }

                break;
            case "searchSpell":
                showSpellFromString(list[i], list[i]);
                btn.innerHTML = GetSpellTierAndName(list[i]);
                btn.setAttribute("onclick", "openDiv(event,'" + list[i] + "')");
                break;
        }

        buttonHolder.appendChild(btn);

        AddTriangleForDLCUnits(cardType, list[i], btn);
        var holderHeight = buttonHolder.offsetHeight;
        dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px; margin-left:200px");
    }
}

function AddTriangleForDLCUnits(type, string, div) {
    var DLCCheck = CheckForDLCContent(type, string);
    //console.log(DLCCheck);
    if (DLCCheck != null) {
        var triangle = document.createElement("DIV");
        triangle.className = DLCCheck.replace(" ", "") + "triangle";

        // triangle.setAttribute("style", "top: -19px;right: -18px;");
        // triangle.setAttribute("style", "top: -65px;right: -214px;");

        div.appendChild(triangle);
    }
}

function CheckForDLCContent(type, string) {
    if (type.toLowerCase().indexOf("unit") != -1) {
        for (var i = 0; i < jsonUnits.length; i++) {
            if (jsonUnits[i].id == string) {
                if ("DLC" in jsonUnits[i]) {
                    return jsonUnits[i].DLC;
                }
            }
        }
    }
    if (type.toLowerCase() == "tome") {
        for (var index = 0; index < jsonTomes.length; index++) {
            if (jsonTomes[index].id == string) {
                if ("DLC" in jsonTomes[index]) {
                    return jsonTomes[index].DLC;
                }
            }
        }
    }
    return null;
}

function SetCollapsibleButtonsAndDivs(overwrite, list, cardType) {
    var modName,
        description,
        cost,
        type,
        tier,
        i,
        nameString = "";
    var buttonHolder = document.getElementById("buttonHolder");
    var btn = document.createElement("BUTTON");
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

    if (cardType != "unit" && cardType != "searchUnit") {
        btn.className = "w3-bar-item w3-button tablink";
        var dataHolder = document.getElementById("dataHolder");
        var holderHeight = buttonHolder.offsetHeight + 50;
        dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
        var div = document.createElement("DIV");

        div.className = "w3-container w3-border city";
        div.setAttribute("id", overwrite);

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
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showItemFromList(list, overwrite);
            break;
        case "trait":
            showTraitFromList(list, overwrite);
            break;
        case "searchSkill":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showSkillFromList(list, overwrite);
            break;
        case "searchItem":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showItemFromList(list, overwrite);
            break;
        case "searchSiege":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showSiegeProjects(list, overwrite);
            break;
        case "searchEmpire":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showEmpireTrees(list, overwrite);
            break;
        case "searchTraits":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showTraitFromList(list, overwrite);
            break;
        case "searchDestiny":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showDestinyTraitsFromList(list, overwrite);
            break;
        case "searchStruct":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showStructures(list, overwrite);
            break;
        case "searchWorldStruct":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showWorldStructures(list, overwrite);
            break;
        case "searchSpell":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showSpellFromList(list, overwrite);
            break;
        case "tome":
            var holderHeight = buttonHolder.offsetHeight;
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
            showTomeFromList2(list, overwrite);
            break;
        case "unit":
            btn.className = "collapsibleUnits";
            var content = document.createElement("DIV");
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

    var i, x, tablinks;
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
        var parentDiv = document.getElementById("dataHolder");

        // Get all direct children of the parent div
        var children = parentDiv.children;

        // Loop through each child and set its display to "block"
        for (var j = 0; j < children.length; j++) {
            children[j].style.display = "block";
        }
    } else {
        var currentEl = document.getElementById(cityName);
        if (currentEl != null) {
            currentEl.style.display = "block";
        }

        var currenturl = window.location.href.split("?")[0];
        var currentadditive = currenturl.split("&")[1];
        if (currentadditive === undefined) {
            currentadditive = "";
        }
        if (search === undefined) {
            window.history.replaceState({}, "foo", currenturl + "?type=" + cityName + "&" + currentadditive);
        }

        if (sorting != undefined) {
            var splits = sorting.split(":");
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
    var optional = false;
    var i = "";
    var j = "";
    for (i in jsonUnits) {
        if (name === jsonUnits[i].id) {
            for (j in jsonUnits[i].secondary_passives) {
                if (jsonUnits[i].secondary_passives[j].slug === "optional_cavalry") {
                    optional = true;
                }
            }
        }
    }
    return optional;
}

function addUnitTypeIcon(a, holder, origin) {
    var icontext,
        iconsrc,
        iconName,
        j,
        btn,
        imag,
        spa = "";
    for (j in jsonUnitAbilities) {
        if (a === jsonUnitAbilities[j].slug) {
            icontext = jsonUnitAbilities[j].description.replaceAll("<bulletlist></bullet>", "<bulletlist>");
            icontext = icontext.replaceAll("</bullet></bulletlist>", "</bullet></bullet></bulletlist>");
            icontext = icontext.replaceAll("<br></br>", "<br>");

            var unitType = "";
            iconsrc = a;
            iconName = jsonUnitAbilities[j].name;

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
            iconName = jsonUnitAbilities[j].name;

            if (origin != "") {
                if (
                    iconName === "Shock Unit" ||
                    iconName === "Shield Unit" ||
                    iconName === "Fighter Unit" ||
                    iconName === "Support Unit" ||
                    iconName === "Battle Mage Unit" ||
                    iconName === "Skirmisher Unit" ||
                    iconName === "Scout Unit" ||
                    iconName === "Polearm Unit" ||
                    iconName === "Ranged Unit" ||
                    iconName === "Mythic Unit" ||
                    iconName === "Tower" ||
                    iconName === "Siegecraft" ||
                    iconName === "Civilian"
                ) {
                    unitRole = origin.querySelectorAll("img#unit_role")[0];
                    unitType = iconsrc;
                    unitRole.setAttribute("src", "/aow4db/Icons/Text/" + iconsrc + ".png");
                }
            }
            holder.appendChild(btn);

            btn.appendChild(imag);
            // btn.append(spa);

            addTooltipListeners(btn, spa);

            return unitType;
        }
    }
}

function addAbilityslot(a, holder, list, enchant) {
    var abilityName,
        abilityIcon,
        abilityDescr,
        abilityDam,
        abilityEncht,
        abilityAcc,
        abilityRange,
        abilityType,
        abilityNote,
        j,
        splitDamageString,
        abilityDamType,
        abilityReq,
        abilityMod = "";

    for (j in jsonUnitAbilities) {
        if (a === jsonUnitAbilities[j].slug) {
            abilityDam = "";
            if ("damage" in jsonUnitAbilities[j]) {
                abilityDam = jsonUnitAbilities[j].damage;
            }

            abilityType = jsonUnitAbilities[j].actionPoints;

            abilityRange = jsonUnitAbilities[j].range;

            abilityName = jsonUnitAbilities[j].name;
            abilityIcon = jsonUnitAbilities[j].icon;

            abilityReq = "";
            if ("requisites" in jsonUnitAbilities[j]) {
                abilityReq = jsonUnitAbilities[j].requisites;
            }

            abilityMod = "";

            if ("modifiers" in jsonUnitAbilities[j]) {
                for (var l = 0; l < jsonUnitAbilities[j].modifiers.length; l++) {
                    abilityName += '<span style="color:#addd9e;font-size: 20px">&#11049</span>';
                    abilityMod += "<bullet>" + jsonUnitAbilities[j].modifiers[l].name + "<br>";
                    abilityMod += jsonUnitAbilities[j].modifiers[l].description + "</bullet><br>";
                }
            }

            var combinedReq = "";
            var m = "";
            for (m in abilityReq) {
                combinedReq += abilityReq[m].requisite + ",";
            }

            abilityEncht = "";
            var k = "";
            var p = "";
            var t = "";

            for (p = 0; p < list.length; p++) {
                var foundEnchantment = false;

                for (k = 0; k < jsonEnchantments.length; k++) {
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
                                                    parseInt(jsonEnchantments[k].attack[t].range) +
                                                        parseInt(abilityRange)
                                                ) + "*";
                                        }
                                    }
                                }
                            }
                        }
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
                                                var doubled = doubleNumbers(jsonEnchantments[k].damage_change);
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
                                                var doubled = doubleNumbers(jsonEnchantments[k].damage_change);
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
                                            var doubled = doubleNumbers(jsonEnchantments[k].damage_change);
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
                        }
                    }
                }
                if (foundEnchantment == false) {
                    console.log("missing enchantment info for : " + list[p].name);
                }
            }

            // add notes

            abilityNote = "";
            var Cooldown = "";
            var Once = "";
            for (l in jsonUnitAbilities[j].notes) {
                if (jsonUnitAbilities[j].notes[l] === undefined) {
                } else {
                    if (jsonUnitAbilities[j].notes[l].note.indexOf("Cooldown") != -1) {
                        Cooldown = jsonUnitAbilities[j].notes[l].note;
                    } else if (jsonUnitAbilities[j].notes[l].note.indexOf("once per") != -1) {
                        Once = jsonUnitAbilities[j].notes[l].note;
                    } else {
                        abilityNote += "<br>" + jsonUnitAbilities[j].notes[l].note;
                    }
                }
            }

            //  abilityDam = jsonUnitAbilities[j].damage;
            abilityRange = abilityRange + "<range></range>";
            abilityAcc = jsonUnitAbilities[j].accuracy + "<accuracy></accuracy>";

            var tooltipName = document.createElement("SPAN");
            var btn = document.createElement("DIV");
            /// tooltipName.style.fontSize = "20px";
            tooltipName.innerHTML = "test";
            btn.className = "unit_abilityslot";
            // if (n === true) {
            //   btn.style.backgroundColor = "rgb(73, 0, 80)";
            //}
            var imag = document.createElement("IMG");
            imag.className = "unit_ability_icon";
            //  var spa = document.createElement("SPAN");
            var tex = document.createElement("DIV");
            tex.className = "tooltip";
            tex.innerHTML = abilityName;
            tex.setAttribute("style", "color:white");
            // tex.setAttribute('onclick', '');
            var dam = document.createElement("DIV");
            dam.className = "ability_damage";
            dam.innerHTML = abilityDam;

            abilityDescr = jsonUnitAbilities[j].description + "<br>";
            abilityDescr = abilityDescr.replaceAll("</br>", "");

            var abilityIconType = "";
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
            if (Cooldown != "") {
                var imageExtra = document.createElement("IMG");
                imageExtra.setAttribute("src", "/aow4db/Icons/Text/turn.png");
                imageExtra.setAttribute("style", " position: absolute; height: 18px; left: 0px;bottom: 4px;");
                btn.append(imageExtra);
            }

            if (Once != "") {
                var imageExtra = document.createElement("IMG");
                imageExtra.setAttribute("src", "/aow4db/Icons/Text/once.png");
                imageExtra.setAttribute("style", " position: absolute; height: 18px; left: 0px;bottom: 4px;");
                btn.append(imageExtra);
            }

            var spa = GetAbilityToolTip(
                jsonUnitAbilities[j],
                abilityDam,
                abilityName,
                abilityIconType,
                abilityAcc,
                abilityRange,
                abilityMod,
                abilityEncht,
                abilityNote,
                abilityReq,
                Cooldown,
                Once
            );

            if (abilityName.indexOf("Defense Mode") > -1) {
                spa.innerHTML =
                    '<div class="leftAbility" style="color:#d7c297;"> <p class="abilityHighLighter">' +
                    abilityName.toUpperCase() +
                    "</p>";
                spa.innerHTML += '<div style="clear:both"> </div>' + "<br>";
                spa.innerHTML += jsonUnitAbilities[j].description;
                dam.innerHTML = "";
            }

            if (enchant) {
                btn.setAttribute(
                    "style",
                    "background-image: linear-gradient(to right, rgb(95 47 162 / 0%), rgb(146 47 162 / 25%), rgb(222 88 228 / 50%), rgb(138 47 162 / 26%), rgb(151 47 162 / 0%));"
                );
            }

            holder.append(btn);
            // tex.appendChild(spa);
            btn.ability = jsonUnitAbilities[j];
            btn.appendChild(imag);
            var divider = document.createElement("div");
            divider.setAttribute("style", "display: flex;justify-content: space-between;width: 100%;");
            divider.append(tex);
            divider.append(dam);
            btn.append(divider);

            //btn.tooltipData = span;

            addTooltipListeners(tex, spa);
        }
    }
}

function doubleNumbers(inputString) {
    // Regular expression to match numbers
    var regex = /\b\d+\b/g;

    // Replace each matched number with its double
    var result = inputString.replace(regex, function (match) {
        // Convert the matched number to an integer and double it
        var doubledNumber = parseInt(match) * 2;
        // Return the doubled number as a string
        return doubledNumber.toString();
    });

    return result;
}

function TurnOnTooltip(spa) {
    // Configuration of the observer: observe changes to child nodes

    hoverDiv = document.getElementById("hoverDiv");
    // console.log('Mouse entered the div');
    hoverDiv.style.display = "block";
    if (spa != null) {
        hoverDiv.innerHTML = spa.innerHTML;
    }
}

function TurnOffTooltip() {
    hoverDiv = document.getElementById("hoverDiv");
    hoverDiv.style.display = "none";
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

function updateHoverDivPosition(event) {
    const settings = getUserSettings();

    var offset = 2;
    if (settings.tooltipselectable) {
        hoverDiv.setAttribute("Style", "pointer-events: all;");
    } else {
        hoverDiv.setAttribute("Style", "pointer-events: none;");
        offset = 10;
    }

    var normalizedPos = getNormalizedPosition(event);
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

function GetAbilityBackground(abilityDam) {
    if (abilityDam != undefined) {
        splitDamageString = abilityDam.split(">");
        if (splitDamageString[0].indexOf("phys") != -1) {
            var abilityIconType = "ability_icon_phys";
        } else if (splitDamageString[0].indexOf("frost") != -1) {
            var abilityIconType = "ability_icon_frost";
        } else if (splitDamageString[0].indexOf("blight") != -1) {
            var abilityIconType = "ability_icon_blight";
        } else if (splitDamageString[0].indexOf("spirit") != -1) {
            var abilityIconType = "ability_icon_spirit";
        } else if (splitDamageString[0].indexOf("fire") != -1) {
            var abilityIconType = "ability_icon_fire";
        } else if (splitDamageString[0].indexOf("lightning") != -1) {
            var abilityIconType = "ability_icon_light";
        } else {
            var abilityIconType = "ability_icon";
        }
    } else {
        var abilityIconType = "ability_icon";
    }
    return abilityIconType;
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

function GetAbilityToolTip(
    ability,
    abilityDam,
    abilityName,
    abilityIconType,
    abilityAcc,
    abilityRange,
    abilityMod,
    abilityEncht,
    abilityNote,
    abilityReq,
    cooldown,
    once
) {
    // block one, header
    // image
    var spa = document.createElement("SPAN");
    var abilityHighlighter = document.createElement("DIV");
    abilityHighlighter.className = "abilityHighLighter";
    abilityHighlighter.innerHTML =
        "<img style=\"float:left; height:50px; width:50px; background-image:url('/aow4db/Icons/Interface/" +
        abilityIconType +
        '.png\');background-repeat: no-repeat;background-size: 50px" src="/aow4db/Icons/UnitIcons/' +
        ability.icon +
        '.png">';

    // name and damage

    var line1 = document.createElement("DIV");
    line1.setAttribute("style", "display: flex;justify-content: space-between;");
    var nameHolder = document.createElement("DIV");
    nameHolder.className = "abilityLineSlot";
    nameHolder.setAttribute("style", "color:#d7c297;");
    nameHolder.innerHTML = abilityName.toUpperCase();

    var damageHolder = document.createElement("DIV");
    damageHolder.className = "abilityLineSlot";
    damageHolder.innerHTML = abilityDam;

    line1.appendChild(nameHolder);
    line1.appendChild(damageHolder);
    abilityHighlighter.append(line1);

    // block accuracy range abilitytype
    var line2 = document.createElement("DIV");
    line2.setAttribute("style", "display: flex;justify-content: space-between;");
    var accrangeHolder = document.createElement("DIV");

    var accuracy = document.createElement("DIV");
    accuracy.innerHTML = abilityAcc;
    accuracy.className = "abilityLineSlot";

    var range = document.createElement("DIV");
    range.innerHTML = abilityRange;
    range.className = "abilityLineSlot";

    // action point type
    var actionPoint = document.createElement("DIV");
    actionPoint.innerHTML = ability.actionPoints;
    actionPoint.className = "abilityLineSlot";

    // action point name

    var actionPointName = LookUpActionPointsName(ability.actionPoints);
    if (actionPointName != undefined) {
        actionPoint.innerHTML +=
            "<br>" + '<span style="color: lightskyblue; font-size:14px">' + actionPointName + "</span>";
    }

    accrangeHolder.appendChild(accuracy);
    accrangeHolder.appendChild(range);
    ////spa.append(accrangeHolder);

    var typeHolder = document.createElement("DIV");
    typeHolder.appendChild(actionPoint);

    line2.appendChild(accrangeHolder);
    line2.appendChild(typeHolder);
    abilityHighlighter.append(line2);

    spa.append(abilityHighlighter);

    // block 2, descrp
    spa.innerHTML += "<hr> " + ability.description + "<br>";

    // modifiers
    if (abilityMod != "") {
        spa.innerHTML += '<span style="color:#addd9e;font-size: 14px">' + abilityMod + "</span>";
    }
    if (abilityEncht != "") {
        spa.innerHTML += '<span style="color:#aa84f6;font-size: 14px">' + abilityEncht + "</span>";
    }

    // block 3, req
    //notes

    spa.innerHTML += '<span style="color:#a4a4a6; font-size: 13px">' + abilityNote + "</span>";

    var bottomLine = document.createElement("DIV");
    bottomLine.setAttribute("style", "display: flex;justify-content: space-between;");
    var reqs = document.createElement("DIV");
    if (abilityReq != "") {
        var i = "";
        for (i in abilityReq) {
            var newReq = document.createElement("DIV");
            newReq.innerHTML = abilityReq[i].requisite;
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
            newReq.className = "requisiteSlot";
            reqs.appendChild(newReq);
        }
    }
    bottomLine.appendChild(reqs);

    if (cooldown != "") {
        var cooldownDiv = document.createElement("DIV");
        cooldownDiv.innerHTML = cooldown;
        cooldownDiv.setAttribute("style", "margin:5px");
        //  cooldownDiv.setattri() = "requisiteSlot";
        bottomLine.appendChild(cooldownDiv);
    }
    if (once != "") {
        var onceDiv = document.createElement("DIV");
        onceDiv.innerHTML = "<once></once> Once per battle";
        onceDiv.setAttribute("style", "margin:5px");
        //  cooldownDiv.setattri() = "requisiteSlot";
        bottomLine.appendChild(onceDiv);
    }

    spa.append(bottomLine);

    return spa;
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
    var abilityName,
        abilityIcon,
        abilityDescr,
        j = "";
    for (j in jsonUnitAbilities) {
        if (a === jsonUnitAbilities[j].slug) {
            abilityName = jsonUnitAbilities[j].name;
            abilityIcon = jsonUnitAbilities[j].slug;
            abilityDescr = jsonUnitAbilities[j].description;

            var btn = document.createElement("DIV");
            btn.className = "unit_passiveslot";
            var imag = document.createElement("IMG");
            imag.className = "unit_ability_icon";

            var tex = document.createElement("DIV");
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

            var spa = CreatePassiveSlotToolTip(abilityIcon, abilityName, abilityDescr);
            div.appendChild(btn);

            btn.appendChild(imag);

            //tex.appendChild(spa);

            btn.append(tex);
            addTooltipListeners(tex, spa);
        }
    }
}

function addUniquePassiveSlot(enchantment, descr, div, overwrite) {
    var abilityName,
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

    var btn = document.createElement("DIV");
    btn.className = "unit_passiveslot";
    var imag = document.createElement("IMG");
    imag.className = "unit_ability_icon";

    var tex = document.createElement("DIV");
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

    var spa = CreatePassiveSlotToolTip(abilityIcon, abilityName, abilityDescr);
    div.appendChild(btn);

    btn.appendChild(imag);

    //tex.appendChild(spa);

    btn.append(tex);
    addTooltipListeners(btn, spa);
}

function CreateUniquePassiveSlotToolTip(abilityIcon, abilityName, abilityDescr) {
    var spa = document.createElement("SPAN");

    spa.innerHTML =
        '<img style="float:left; height:30px; width:30px" src="/aow4db/Icons/SpellIcons/' +
        abilityIcon +
        '.png"><p style="color: #d7c297;>' +
        '<span style="font-size=20px;">' +
        abilityName.toUpperCase() +
        "</p>" +
        "<hr>" +
        abilityDescr;

    return spa;
}

function CreatePassiveSlotToolTip(abilityIcon, abilityName, abilityDescr) {
    var spa = document.createElement("SPAN");

    abilityDescr = abilityDescr.replaceAll("<bulletlist></bullet>", "<bulletlist>");
    abilityDescr = abilityDescr.replaceAll("</bullet></bulletlist>", "</bullet></bullet></bulletlist>");
    abilityDescr = abilityDescr.replaceAll("<br></br>", "<br>");

    spa.innerHTML =
        '<div class="abilityHighLighter"><img style="float:left; height:30px; width:30px" src="/aow4db/Icons/UnitIcons/' +
        abilityIcon +
        '.png"><p style="color: #d7c297;>' +
        '<span style="font-size=20px;">' +
        abilityName.toUpperCase() +
        "</p>" +
        "</div>" +
        "<hr>" +
        abilityDescr;

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
    var abilityName,
        abilityIcon,
        abilityDescr,
        abilityDam = "";
    for (var j = 0; j < jsonUnitAbilities.length; j++) {
        if (a === jsonUnitAbilities[j].slug) {
            abilityName = jsonUnitAbilities[j].name;
            if (abilityName.indexOf("Immu") != -1) {
                var firstPart = abilityName.split(" ")[0];
            } else {
                var nameclean = abilityName.split(">")[1];
                var firstPart = nameclean.split(" ")[0];
            }

            abilityIcon = jsonUnitAbilities[j].icon;
            abilityDescr = jsonUnitAbilities[j].description;
            abilityDam = jsonUnitAbilities[j].damage;
            var btn = document.createElement("DIV");
            btn.className = "resistance_icon";
            btn.setAttribute("id", abilityName);
            var imag = document.createElement("IMG");
            imag.className = "unit_ability_icon";

            var spa = document.createElement("SPAN");

            spa.innerHTML =
                "<p>" +
                '<span style="font-size=20px; text-transform:uppercase; color:#deb887 ;">' +
                abilityName +
                "</p>" +
                "Added to Resistance <resistance></resistance> to calculate damage sustained from " +
                firstPart +
                ".";

            var num = "";
            if (a.indexOf("weakness") !== -1) {
                var split = a.split("weakness_");
                num = "-" + split[1];
            }
            if (a.indexOf("resistance") !== -1) {
                var split = a.split("resistance_");
                num = split[1];
            }

            if (a.indexOf("immun") !== -1) {
                var split = a.split("resistance_");
                num = "x";
            }

            spa.innerHTML +=
                "<br><br>Damage Reduction: <br> " +
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

            if (a.indexOf("frost") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/frost_resistance.png");
                spa.innerHTML += "<defensefrost></defensefrost>";
            }
            if (a.indexOf("blight") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/blight_resistance.png");
                spa.innerHTML += "<defenseblight></defenseblight>";
            }
            if (a.indexOf("fire") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/fire_resistance.png");
                spa.innerHTML += "<defensefire></defensefire>";
            }
            if (a.indexOf("spirit") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/spirit_resistance.png");
                spa.innerHTML += "<defensespirit></defensespirit>";
            }
            if (a.indexOf("lightning") !== -1) {
                imag.setAttribute("src", "/aow4db/Icons/Text/lightning_resistance.png");
                spa.innerHTML += "<defenselightning></defenselightning>";
            }

            if (a.indexOf("weakness") !== -1) {
                var split = a.split("weakness_");
                abilityDam = '<p class="resistanceNumber" style="color:red;">-' + split[1];
            }
            if (a.indexOf("resistance") !== -1) {
                var split = a.split("resistance_");
                abilityDam = '<p class="resistanceNumber" style="color:lawngreen;">' + split[1];
            }

            if (a.indexOf("immun") !== -1) {
                var split = a.split("resistance_");
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
    var abilityName,
        abilityIcon,
        abilityDescr,
        abilityDam = "";

    var btn = document.createElement("DIV");
    btn.className = "resistance_icon";
    btn.id = "statusResistance";
    var imag = document.createElement("IMG");
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

function EliteSkill(a) {
    var nam = "";
    for (var j = 0; j < jsonUnitAbilities.length; j++) {
        if (a === jsonUnitAbilities[j].slug) {
            nam = jsonUnitAbilities[j].name;
        }
    }
    return nam;
}

function addEliteSkill(a) {
    var abilityName,
        abilityIcon,
        abilityDescr = "";
    for (var j = 0; j < jsonUnitAbilities.length; j++) {
        if (a === jsonUnitAbilities[j].slug) {
            abilityName = jsonUnitAbilities[j].name;
            abilityIcon = jsonUnitAbilities[j].slug;
            abilityDescr = jsonUnitAbilities[j].description;

            var btn = document.createElement("DIV");
            btn.className = "unit_elite_skill";
            var imag = document.createElement("IMG");
            imag.className = "unit_ability_icon";
            var spa = document.createElement("SPAN");
            var tex = document.createElement("DIV");
            tex.className = "tooltip";
            tex.setAttribute("onclick", "");
            tex.innerHTML = abilityName;
            spa.innerHTML = "<p>" + '<span style="font-size=20px">' + abilityName + "</p>" + "<hr>" + abilityDescr;
            imag.setAttribute("src", "/aowp/UI/elite_rank.png");
            imag.setAttribute("width", "40");
            imag.setAttribute("height", "40");

            document.getElementById("unitabholder").appendChild(btn);
            // document.getElementById("unitabholder").setAttribute("id", "unitabholder" + b);

            // tex.appendChild(spa);

            btn.appendChild(imag);
            btn.append(tex);

            addTooltipListeners(tex, spa);
        }
    }
}
async function spawnCards(list, divID) {
    if (divID === undefined) {
        divID = "units";
    }
    var doc = document.getElementById(divID);
    for (var i = 0; i < list.length; i++) {
        var iDiv = unit_card_template.content.cloneNode(true);
        doc.appendChild(iDiv);
    }
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

    var doc = document.getElementById(divID);

    var iDiv = unit_card_template.content.cloneNode(true);
    doc.appendChild(iDiv);
}

async function showUnitFromString(string, divID, subcultureCheck, resID) {
    await spawnCard(string, divID);
    showUnit(string, subcultureCheck, resID);
}

var ascendingOrder = false;

function sortDivs(sortType, savedOrder) {
    var i = "";

    // 2 - Detemine the selector
    if (savedOrder != null) {
        ascendingOrder = savedOrder;
    } else {
        ascendingOrder = !ascendingOrder;
    }

    var buttontargets = document.getElementsByClassName("sortingButton");

    for (i in buttontargets) {
        buttontargets[i].className = "sortingButton";
    }
    var currentbutton = document.getElementById(sortType + "-button");

    if (ascendingOrder) {
        currentbutton.className += " activeDown";
    } else {
        currentbutton.className += " activeUp";
    }

    // 3 - Choose the wanted order
    //  ascendingOrder = !ascendingOrder;
    const isNumeric = true;

    // 4 - Select all elements
    var container;
    if (currentView === "") {
        container = document.getElementById("dataHolder");
    } else {
        container = document.getElementById(currentView);
    }

    var element = [...container.querySelectorAll(".mod_card")];

    var selector = (element) => element.querySelector(".mod_name").innerHTML;
    if (sortType === "tier") {
        selector = (element) => element.querySelector(".spell_tier").innerHTML;
    }
    if (sortType === "cost") {
        selector = (element) => element.querySelector(".spell_cost").innerHTML;
    }

    // 5 - Find their parent
    const parentElement = container;

    // 6 - Sort the elements
    const collator = new Intl.Collator(undefined, {
        numeric: isNumeric,
        sensitivity: "base"
    });

    element
        .sort((elementA, elementB) => {
            const [firstElement, secondElement] = ascendingOrder ? [elementA, elementB] : [elementB, elementA];

            var textOfFirstElement = selector(firstElement);

            var textOfSecondElement = selector(secondElement);
            if (sortType === "tier") {
                var fields = textOfFirstElement.split("Tier ", 3);
                textOfFirstElement = deromanize(fields[1]);
                var fields2 = textOfSecondElement.split("Tier ", 3);
                textOfSecondElement = deromanize(fields2[1]);
            }

            return collator.compare(textOfFirstElement, textOfSecondElement);
        })
        .forEach((element) => parentElement.appendChild(element));

    var currenturl = window.location.href.split("&")[0];

    window.history.replaceState({}, "foo", currenturl + "&sort=" + sortType + ":" + ascendingOrder);
    sorting = sortType + ":" + ascendingOrder;
}

async function SetCollapsibleStuff() {
    var coll = document.getElementsByClassName("collapsibleUnits");

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            var contents = document.getElementsByClassName("contentUnits");
            var content = this.nextElementSibling;

            for (j = 0; j < contents.length; j++) {
                if (contents[j].style != null) {
                    if (contents[j].style.display === "grid") {
                        if (contents[j].id === content.id) {
                        } else {
                            coll[j].classList.toggle("active");
                            contents[j].style.display = "none";
                        }
                    }
                }
            }
            this.classList.toggle("active");

            if (content.style.display === "grid") {
                content.style.display = "none";
            } else {
                content.style.display = "grid";
            }

            var buttonHolder = document.getElementById("buttonHolder");
            var holderHeight = buttonHolder.offsetHeight;
            var dataHolder = document.getElementById("dataHolder");
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px; margin-left:200px");
        });
    }

    var buttonHolder = document.getElementById("buttonHolder");
    var holderHeight = buttonHolder.offsetHeight;
    var dataHolder = document.getElementById("dataHolder");
    dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;; margin-left:200px");
}

async function SetLevelUpStuff() {
    var coll = document.getElementsByClassName("collapsibleLevelup");
    var content = document.getElementsByClassName("contentLevelup");
    var i = "";

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            //this.classList.toggle("active");

            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
            //  var j = "";
            // for (j = 0; j < content.length; j++) {
            //   coll[j].classList.toggle("active");

            //}
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const product = searchParams.get("type");

    if (product != undefined) {
        var splits = product.split("&");
        closeTabLinks(product);

        document.getElementById(splits[0] + "-button").className += " w3-red";

        // grab the subculture if available

        var subCulture = splits[0].split(/(?=[A-Z])/);
        if (subCulture.length > 1) {
            var test = subCulture.slice(1).join("");
            await showSubDiv(null, test);
        }

        // open div with type
        await openDiv(event, splits[0]);
    }
}

function SetUpSpawnTable() {
    var coll = document.getElementsByClassName("collapsible");
    var content = document.getElementsByClassName("content");
    var j = "";
    for (j in content) {
        coll[j].classList.toggle("active");
        //  var content = this.nextElementSibling;
        if (content[j].style.display === "grid") {
            content[j].style.display = "none";
        } else {
            content[j].style.display = "grid";
        }
    }
}

function SetUpCombatEnc() {
    // Get all collapsible elements
    var collapsibles = document.getElementsByClassName("collapsible");

    // Iterate over each collapsible element
    for (const collapsible of collapsibles) {
        // Attach event listener to each collapsible
        collapsible.addEventListener("click", function () {
            // Toggle the "active" class on the current collapsible
            this.classList.toggle("active");

            // Get the next sibling element (which should be the content)
            var contentElement = this.nextElementSibling;

            // Toggle the display style of the content element
            if (contentElement.style.display === "grid") {
                contentElement.style.display = "none";
            } else {
                contentElement.style.display = "grid";
            }
        });
    }
}

async function spawnEquipCards(list, divID) {
    if (divID === undefined) {
        divID = "equip";
    }
    var doc = document.getElementById(divID);
    for (var i = 0; i < list.length; i++) {
        var iDiv = item_card_template.content.cloneNode(true);
        doc.appendChild(iDiv);
    }
}

async function showEquipmentFromList(list, divID) {
    await spawnEquipCards(list, divID);

    /* for (var i = 0; i < list.length; i++) {

         showEquipment(list[i], divID);

     };*/
}

async function showSiegeProjects(list) {
    if (list === undefined) {
        await spawnSpellCards(jsonSiegeProjects, "dataHolder");
        for (var i = 0; i < jsonSiegeProjects.length; i++) {
            showSiegeProject(jsonSiegeProjects[i].name, true);
        }
    } else {
        await spawnSpellCards(list, "Siege Projects");
        for (i in list) {
            showSiegeProject(list[i], true);
        }
    }
}

async function showStructures(list) {
    await spawnSpellCards(list, "Structures");
    for (var i = 0; i < list.length; i++) {
        showStructure(list[i], true);
    }
}

async function showEmpireTrees(list) {
    await spawnSpellCards(list, "Empire Tree");
    for (var i = 0; i < list.length; i++) {
        showEmpireTree(list[i]);
    }
}

async function showWorldStructures(list) {
    await spawnStructureCards(list, "World Structures");
    for (var i = 0; i < list.length; i++) {
        showWorldStructure(list[i]);
    }
}

async function spawnTomeCards(list, divID) {
    if (divID === undefined) {
        divID = "tome";
    }
    var doc = document.getElementById(divID);

    var iDiv = tome_card_template.content.cloneNode(true);
    doc.appendChild(iDiv);
}

async function showTomeFromList2(string, divID) {
    await spawnTomeCards(string, divID);

    showTome(string, divID);
}

async function showTomeFromList(list, divID, overwritetext) {
    SetButtonsAndDivs(list, undefined, "tome");
}

async function spawnSpellCards(list, divID) {
    if (divID === undefined) {
        divID = "spell";
    }
    var doc = document.getElementById(divID);
    for (var i = 0; i < list.length; i++) {
        var iDiv = spell_card_template.content.cloneNode(true);
        doc.appendChild(iDiv);
    }
}

async function spawnItemCards(list, divID) {
    if (divID === undefined) {
        divID = "item";
    }
    var j = "";
    var doc = document.getElementById(divID);
    for (var i = 0; i < list.length; i++) {
        var iDiv = item_card_template.content.cloneNode(true);
        doc.appendChild(iDiv);
    }
}

async function spawnSkillCards(list, divID) {
    if (divID === undefined) {
        divID = "item";
    }
    var j = "";
    var doc = document.getElementById(divID);
    for (var i = 0; i < list.length; i++) {
        var iDiv = skill_card_template.content.cloneNode(true);
        doc.appendChild(iDiv);
    }
}

async function spawnSpellCardSingle(list, divID) {
    if (divID === undefined) {
        divID = "spell";
    }
    var doc = document.getElementById(divID);

    var iDiv = spell_card_template.content.cloneNode(true);
    doc.appendChild(iDiv);
}

async function spawnTomeCardSingle(list, divID) {
    if (divID === undefined) {
        divID = "tome";
    }
    var doc = document.getElementById(divID);

    var iDiv = tome_card_template.content.cloneNode(true);
    doc.appendChild(iDiv);
}
async function spawnStructureCardSingle(list, divID) {
    if (divID === undefined) {
        divID = "spell";
    }
    var doc = document.getElementById(divID);

    var iDiv = structure_card_template.content.cloneNode(true);
    doc.appendChild(iDiv);
}

async function spawnStructureCards(list, divID) {
    if (divID === undefined) {
        divID = "spell";
    }
    var doc = document.getElementById(divID);
    for (var i = 0; i < list.length; i++) {
        var iDiv = structure_card_template.content.cloneNode(true);
        doc.appendChild(iDiv);
    }
}

async function showSpellFromList(list, divID) {
    await spawnSpellCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        showSpell(list[i], true);
    }
}
async function showHeroTraitFromList(list, divID) {
    await spawnSpellCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        showHeroTrait(list[i].id, true);
    }
}

async function showHeroGovFromList(list, divID) {
    await spawnSpellCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        showHeroGov(list[i].id, true);
    }
}

async function showSkillFromList(list, divID) {
    await spawnSkillCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        // check if has description
        if ("description" in list[i]) {
            showSkill(list[i], "", list[i].icon, list[i].category_name, list[i].level_name, list[i].group_name);
        } else {
            showSkill(list[i], "true", list[i].icon, list[i].category_name, list[i].level_name, list[i].group_name);
        }
    }
}

async function showTraitFromList(list, divID) {
    await spawnSpellCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        showTrait(list[i]);
    }
}

async function showDestinyTraitsFromList(list, divID) {
    await spawnSpellCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        showDestinyTrait(list[i]);
    }
}

async function showItemFromList(list, divID) {
    await spawnItemCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        showItem(list[i]);
    }
}

async function showCosmicHappeningsWithArgument(argumentType, divID) {
    var list = [];
    list = findCosmicHappeningsWithArgument(argumentType);
    await spawnStructureCards(list, divID);
    for (var i = 0; i < list.length; i++) {
        showCosmicHappening(list[i]);
    }
}

async function showWorldStructuresWithArgument(overwrite, argumentType, list, divID) {
    await spawnStructureCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        showWorldStructure(list[i]);
    }
}
async function showStructuresWithArgument(argument, divID, argumentType, includeProvince) {
    var list = [];
    list = findStructuresWithArgument(argument, argumentType, includeProvince);

    await spawnStructureCards(list, divID);

    for (var i = 0; i < list.length; i++) {
        showStructure(list[i], true);
    }
}

async function showItemsWithArgument(argumentType, overwritetext) {
    var list = [];
    list = findItemsWithArgument(argumentType);

    SetCollapsibleButtonsAndDivs(overwritetext, list, "item");
}

async function showSkillsWithArgument(signature, argumentType, overwritetext) {
    var list = [];
    list = findSkillsWithArgument(signature, argumentType);

    SetCollapsibleButtonsAndDivs(overwritetext, list, "skill");
}

async function showHeroAmbitions() {
    var list = [];
    list = findHeroAmbition();

    SetCollapsibleButtonsAndDivs("Hero Ambitions", list, "heroTrait");
}

async function showHeroGovernance() {
    var list = [];
    list = findHeroGovernance();

    SetCollapsibleButtonsAndDivs("Hero Governance", list, "heroGov");
}

async function showSpellsWithArgument(argument, argumentType, overwritetext) {
    var list = [];
    list = findSpellsWithArgument(argument, argumentType);

    if (overwritetext.indexOf(">") != -1) {
        overwritetext = overwritetext.split("/")[1];
        overwritetext = overwritetext.split(">")[1];
    }

    SetCollapsibleButtonsAndDivs(overwritetext, list, "spell");
}

async function showTraitsWithArgument(argument, overwritetext, affinity) {
    var list = [];
    list = findTraitsWithArgument(argument, affinity);

    SetCollapsibleButtonsAndDivs(overwritetext, list, "trait");
}

async function showSpellFromString(string, divID) {
    await spawnSpellCardSingle(string, divID);
    var spellCard = showSpell(string, true);
    return spellCard;
}

async function showSiegeProjectFromString(string, divID) {
    await spawnSpellCardSingle(string, divID);
    showSiegeProject(string, true);
}

async function showWorldStructureFromString(string, divID) {
    await spawnStructureCardSingle(string, divID);
    showWorldStructure(string);
}

async function showTomeFromString(string, divID) {
    await spawnTomeCardSingle(string, divID);
    showTome(string);
}

async function showStructureFromString(string, divID) {
    await spawnStructureCardSingle(string, divID);
    showStructure(string);
}

async function showHeroSkillFromString(string, divID) {
    await spawnSpellCardSingle(string, divID);
    var skill = findHeroSkill(string);

    // check if has description
    if ("description" in skill) {
        showSkill(skill, "", skill.icon, skill.category_name, skill.level_name, skill.group_name);
    } else {
        showSkill(skill, "true", skill.icon, skill.category_name, skill.level_name, skill.group_name);
    }
}

function findHeroSkill(skillID) {
    for (var i = 0; i < jsonHeroSkills.length; i++) {
        if (jsonHeroSkills[i].id === skillID) {
            return jsonHeroSkills[i];
        }
    }
}

function findItemsWithArgument(argumentType) {
    var j = "";

    var finalCheckedList = [];

    for (j in jsonHeroItems) {
        if (jsonHeroItems[j].slot.indexOf(argumentType) !== -1 && jsonHeroItems[j].tier != undefined) {
            finalCheckedList.push(jsonHeroItems[j]);
        }
    }

    return finalCheckedList;
}

function findSkillsWithArgument(signature, argumentType) {
    var j = "";

    var finalCheckedList = [];
    if (signature === "") {
        for (j in jsonHeroSkills) {
            if ("category_name" in jsonHeroSkills[j]) {
                if (
                    jsonHeroSkills[j].category_name.indexOf(argumentType) !== -1 &&
                    jsonHeroSkills[j].group_name != "Pantheon Hero Skills"
                ) {
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
    } else if (signature === "pantheon_weapon") {
        for (j in jsonHeroSkills) {
            if ("type" in jsonHeroSkills[j]) {
                if (
                    jsonHeroSkills[j].group_name === "Pantheon Hero Skills" &&
                    jsonHeroSkills[j].name.indexOf("Ascension") == -1
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
    var j = "";

    var finalCheckedList = [];

    for (j in jsonHeroGovernance) {
        if ("type" in jsonHeroGovernance[j]) {
            if (!isInArray(finalCheckedList, jsonHeroGovernance[j])) {
                finalCheckedList.push(jsonHeroGovernance[j]);
            }
        } else {
            if (!isInArray(finalCheckedList, jsonHeroGovernance[j])) {
                finalCheckedList.push(jsonHeroGovernance[j]);
            }
        }
    }

    // Remove duplicate objects from the array
    const uniqueArray = finalCheckedList.filter((item, index) => {
        return index === finalCheckedList.findIndex((obj) => obj.id === item.id && obj.name === item.name);
    });
    return uniqueArray;
}

function findHeroAmbition() {
    var j = "";

    var finalCheckedList = [];

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
    var enchantmentList = [];
    for (var j = 0; j < jsonSpells.length; j++) {
        if (jsonSpells[j].spellType.indexOf("Unit Enchantment") != -1) {
            enchantmentList.push(jsonSpells[j]);
        }
    }
    return enchantmentList;
}

function findSpellsWithArgument(argumentaffinity, argumentType) {
    var i,
        output,
        affinity,
        textvalue,
        j,
        l,
        k,
        x,
        result = "";

    var finalCheckedList = [];
    if (argumentaffinity === "") {
        for (j in jsonSpells) {
            if (jsonSpells[j].spellType.indexOf(argumentType) !== -1) {
                finalCheckedList.push(jsonSpells[j].id);
            }
        }
    } else {
        var listMod = [];
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
    var i,
        output,
        affinity,
        textvalue,
        j,
        l,
        k,
        x,
        result = "";

    var finalCheckedList = [];
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
        }

        for (j in jsonFactionCreation) {
            if (jsonFactionCreation[j].type.toUpperCase().indexOf(argumentType.toUpperCase()) !== -1) {
                finalCheckedList.push(jsonFactionCreation[j].id);
            }
        }
    }

    return finalCheckedList;
}

function findStructuresWithArgument(income, argumentType, includeprovince) {
    var i,
        output,
        affinity,
        textvalue,
        j,
        l,
        k,
        x,
        result = "";

    var finalCheckedList = [];
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
    var j = 0;

    var finalCheckedList = [];

    for (j in jsonCosmicHappenings) {
        if (jsonCosmicHappenings[j].type == argumentType) {
            finalCheckedList.push(jsonCosmicHappenings[j].id);
        }
    }

    return finalCheckedList;
}

function checkModRequirements(unit) {
    var j,
        check,
        checksplit,
        checknot,
        checknotsplit = "";
    for (j in jsonSpells) {
        checksplit = jsonSpells[j].check.split(" ");
        checknotsplit = jsonSpells[j].checknot.split(" ");
        for (var k = 0; k < checksplit.length; k++) {
            if (divs[i].innerHTML.indexOf(checksplit[k]) !== -1) {
                // something
            }
        }
    }
}

function showModsFromList(list, divId) {
    for (let i = 0; i < list.length; i++) {
        var iDiv = mod_card_template.content.cloneNode(true);
        if (divId === undefined) {
            document.getElementById("mods").appendChild(iDiv);
        } else {
            document.getElementById(divId).appendChild(iDiv);
        }
        showMod(list[i]);
    }
}

function showSubDiv(event, id) {
    // Get all divs with the class 'my-div'

    var thisNameAll = document.querySelectorAll(".subCultureName");

    for (let index = 0; index < thisNameAll.length; index++) {
        thisNameAll[index].style.color = "grey";
    }
    var thisName = document.getElementById("subCultureName" + id);
    if (thisName == null) {
        return;
    }
    thisName.style.color = "white";

    var divs = document.querySelectorAll(".subDiv");

    // Hide all divs
    divs.forEach(function (div) {
        div.style.display = "none";
    });

    // Show the specific div with the given id
    var specificDiv = document.getElementById(id);
    if (specificDiv) {
        specificDiv.style.display = "block";

        // Find the first div with the class "targetClass" within the parent div
        var targetDiv = specificDiv.querySelector(".dataholder");
        // Get the first child element of the parent div
        var firstChild = targetDiv.firstElementChild;

        // Set the display property of the first child to block
        openDiv(null, firstChild.id);
    }
}

function showUnit(a, subcultureCheck, resID) {
    var hp,
        mp,
        shield,
        armor,
        j,
        k,
        x,
        y,
        z,
        unitNameDiv,
        imagelink,
        prodcost,
        tier,
        name = "";
    var found = false;
    var keepgoing = true;
    var stopHere = false;

    for (let i = 0; i < jsonUnits.length; i++) {
        if (a === jsonUnits[i].id) {
            if (subcultureCheck == undefined) {
            } else {
                if ("sub_culture_name" in jsonUnits[i]) {
                    if (subcultureCheck == jsonUnits[i].sub_culture_name) {
                        stopHere = false;
                    } else {
                        stopHere = true;

                        //return;
                    }
                }
            }
            if (resID === undefined) {
            } else {
                if (resID != jsonUnits[i].resid) {
                    stopHere = true;
                }
            }
            if (jsonUnits[i].primary_passives.length > 0) {
                if (jsonUnits[i].primary_passives[0].slug == "deprecated_unit!") {
                    // skip if deprecated
                    keepgoing = false;
                } else {
                    keepgoing = true;
                }
            } else {
                keepgoing = true;
            }
            if (keepgoing && !stopHere) {
                var unitCard = document.getElementById("unitCard");
                if (unitCard == undefined) {
                    unitCard = document.getElementById("unitCard" + a);
                } else {
                    // imagelink = unitCard.querySelectorAll('video#vid')[0];
                    //imagelink.setAttribute('src', "/aow4db/Previews/" + jsonUnits[i].id + ".mp4");
                    //if (imagelink.getAttribute('src') === "/aow4db/Previews/undefined") {
                    //  imagelink.setAttribute('src', "/aow4db/Previews/placeholder.mp4");
                    //}
                    imagelink = unitCard.querySelectorAll("img#vid")[0];
                    imagelink.setAttribute("src", "/aow4db/PreviewsAvif/" + jsonUnits[i].id + ".avif");
                    if (imagelink.getAttribute("src") === "/aow4db/PreviewsAvif/undefined") {
                        imagelink.setAttribute("src", "/aow4db/PreviewsAvif/abductor.avif");
                    }
                }
                if (subcultureCheck == undefined) {
                    unitCard.setAttribute("id", "unitCard" + a);
                } else {
                    unitCard.setAttribute("id", "unitCard" + a + subcultureCheck);
                }

                var activeEnchantList;
                if (!unitCard.hasOwnProperty("activeEnchantList")) {
                    activeEnchantList = [];
                    unitCard.activeEnchantList = activeEnchantList;
                } else {
                    activeEnchantList = unitCard.activeEnchantList;
                }
                unitNameDiv = unitCard.querySelectorAll("span#unitstring")[0];
                // clear
                unitNameDiv.innerHTML = "";
                name = jsonUnits[i].name;
                unitNameDiv.innerHTML += name.toUpperCase();

                if ("DLC" in jsonUnits[i]) {
                    var newDivForMount = AddDLCTag(jsonUnits[i].DLC);
                    unitNameDiv.append(newDivForMount);
                }

                // if in the list of mounted, add tooltip
                if (MountedSpecialList.includes(a) || CheckIfOptionalCavalry(a)) {
                    var newDivForMount = document.createElement("DIV");
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

                var hpspan = document.createElement("span");
                hpspan.innerHTML =
                    '<span style="color:burlywood;text-transform: uppercase ">Hit Points</span><br><span style="font-size: 14px;"><bullet>Hit Points represent the amount of damage a unit can take before being defeated</bullet> <bullet>Most units will take Casualties as their Hit Points drop.</bullet></span>';
                var hpTooltip = unitCard.querySelectorAll("div#hp_tt")[0];

                addTooltipListeners(hpTooltip, hpspan);

                hp = unitCard.querySelectorAll("p#hp")[0];

                var hpvalue = jsonUnits[i].hp;
                hp.innerHTML = jsonUnits[i].hp;

                var critspan = document.createElement("span");
                critspan.innerHTML =
                    '<span style="color:burlywood;text-transform: uppercase;">Critical Hit Chance</span><br><span style="font-size: 14px;">Chance to deliver a critical hit for increased damage</span>';
                var critTooltip = unitCard.querySelectorAll("div#crit_tt")[0];

                addTooltipListeners(critTooltip, critspan);

                var crit = unitCard.querySelectorAll("p#crit")[0];
                crit.innerHTML = "+" + 0 + "%";

                var armorspan = document.createElement("span");
                armorspan.innerHTML =
                    '<span style="color:burlywood;text-transform: uppercase ">Defense</span><br><span style="font-size: 14px;">Defense reduces physical damage.Damage Reduction: ' +
                    '<br>Physical :  <span style="color:white;">' +
                    GetDamageReductionPercentage(jsonUnits[i].armor) +
                    '</span> ( From <span style="color:white;">' +
                    jsonUnits[i].armor +
                    "</span> <defense> </defense>)" +
                    "</p></span>";
                var armorTooltip = unitCard.querySelectorAll("div#armor_tt")[0];

                addTooltipListeners(armorTooltip, armorspan);

                armor = unitCard.querySelectorAll("p#armor")[0];
                var armorValue = jsonUnits[i].armor;
                armor.innerHTML = armorValue;

                shield = unitCard.querySelectorAll("p#resistence")[0];
                var shieldValue = jsonUnits[i].resistance;
                shield.innerHTML = shieldValue;

                mp = unitCard.querySelectorAll("p#mp")[0];
                mp.innerHTML = jsonUnits[i].mp;

                tier = unitCard.querySelectorAll("p#tier")[0];
                //

                prodcost = unitCard.querySelectorAll("p#productioncost")[0];
                prodcost.innerHTML = "Cost: " + jsonUnits[i].cost;
                var additionalBlight, additionalShock, additionalFire, additionalSpirit, additionalFrost;
                movementDiv = document.createElement("div");

                unitStat = unitCard.querySelectorAll("div#unitstat")[0];
                unitStat.innerHTML = "";

                var resistanceHolder = unitCard.querySelectorAll("div#resistanceholder")[0];
                resistanceHolder.innerHTML = "";

                var unitType = "";
                for (j in jsonUnits[i].secondary_passives) {
                    var unitTypeTest = addUnitTypeIcon(jsonUnits[i].secondary_passives[j].slug, unitStat, unitCard);

                    if (unitTypeTest != "") {
                        unitType = unitTypeTest;
                    }

                    if (jsonUnits[i].secondary_passives[j].slug.indexOf("floating") != -1) {
                        movementDiv.innerHTML =
                            'Movement Abilities :  <span style="color:white;"> <bullet>Floating</bullet></span><br>';
                    }

                    if (jsonUnits[i].secondary_passives[j].slug.indexOf("flying") != -1) {
                        movementDiv.innerHTML =
                            'Movement Abilities :  <span style="color:white;"> <bullet>Flying</bullet></span><br>';
                    }
                }

                var mpspan = document.createElement("span");
                mpspan.innerHTML =
                    '<span style="color:burlywood;text-transform: uppercase;">Move Points</span><br>' +
                    movementDiv.innerHTML +
                    '</p><span style="font-size: 14px;">Move points represent how far a unit can move in one turn on the world map and in combat</span>';
                var mpTooltip = unitCard.querySelectorAll("div#mp_tt")[0];

                addTooltipListeners(mpTooltip, mpspan);

                if (CheckIfFormUnit(a)) {
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

                var enchantButton = unitCard.querySelectorAll("button#enchantButton")[0];
                var enchantHolder = unitCard.querySelectorAll("div#enchantHolder")[0];
                var activeEnchant = unitCard.querySelectorAll("div#activeEnchants")[0];

                enchantButton.param = unitType;
                enchantButton.activeListHolder = activeEnchant;
                enchantButton.unit = a;
                enchantButton.unitData = jsonUnits[i];
                enchantButton.originDiv = unitCard;

                enchantButton.activeEnchantList = activeEnchantList;
                enchantButton.addEventListener("click", ShowPossibleEnchantments);

                // make a list on the unit, not on the buttons

                var unitTabHolder = unitCard.querySelectorAll("div#unitabholder")[0];
                unitTabHolder.innerHTML = "";

                for (k in jsonUnits[i].abilities) {
                    addAbilityslot(jsonUnits[i].abilities[k].slug, unitTabHolder, activeEnchantList);
                }

                if (jsonUnits[i].status_resistance != "0") {
                    addstatusResistanceSlot(jsonUnits[i].status_resistance, resistanceHolder);
                }

                for (z in jsonUnits[i].resistances) {
                    addResistanceSlot(jsonUnits[i].resistances[z].slug, jsonUnits[i].resistance, resistanceHolder);
                    if (jsonUnits[i].resistances[z].slug.toUpperCase().indexOf("BLIGHT") != -1) {
                        additionalBlight = ReturnWeaknessOrResistanceNumber(jsonUnits[i].resistances[z].slug);
                    }
                    if (jsonUnits[i].resistances[z].slug.toUpperCase().indexOf("FIRE") != -1) {
                        additionalFire = ReturnWeaknessOrResistanceNumber(jsonUnits[i].resistances[z].slug);
                    }
                    if (jsonUnits[i].resistances[z].slug.toUpperCase().indexOf("FROST") != -1) {
                        additionalFrost = ReturnWeaknessOrResistanceNumber(jsonUnits[i].resistances[z].slug);
                    }

                    if (jsonUnits[i].resistances[z].slug.toUpperCase().indexOf("LIGHTNING") != -1) {
                        additionalShock = ReturnWeaknessOrResistanceNumber(jsonUnits[i].resistances[z].slug);
                    }
                    if (jsonUnits[i].resistances[z].slug.toUpperCase().indexOf("SPIRIT") != -1) {
                        additionalSpirit = ReturnWeaknessOrResistanceNumber(jsonUnits[i].resistances[z].slug);
                    }
                }

                tier.innerHTML = "Tier " + romanize(jsonUnits[i].tier) + ": " + jsonUnits[i].upkeep;

                var summonInfo = canBeSummoned(jsonUnits[i].id);
                if (summonInfo.length > 0) {
                    tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(jsonUnits[i].tier, "");
                    var p = "";
                    for (p in summonInfo) {
                        var castcost = "";
                        if (summonInfo[p].tactical === true) {
                            castcost = summonInfo[p].operation_point_cost + "<casttactical></casttactical>";
                        } else {
                            castcost = summonInfo[p].operation_point_cost + "<caststrategic></caststrategic>";
                        }
                        prodcost.innerHTML += "<br> Spell: " + summonInfo[p].casting_cost + castcost;
                    }
                }

                var critChance = 0;
                var lowUpkeep = false;
                var faithfulUpkeep = false;
                var x = "";

                var k = "";

                var t = "";

                var y = "";
                for (y in jsonUnits[i].secondary_passives) {
                    if (jsonUnits[i].secondary_passives[y].slug.indexOf("magic_origin") != -1) {
                        if (lowUpkeep === true) {
                            tier.innerHTML =
                                "Tier " +
                                romanize(jsonUnits[i].tier) +
                                ": " +
                                getSummonedUpkeep(jsonUnits[i].tier, 0.75);
                        } else if (faithfulUpkeep === true) {
                            tier.innerHTML =
                                "Tier " +
                                romanize(jsonUnits[i].tier) +
                                ": " +
                                getSummonedUpkeep(jsonUnits[i].tier, 0.9);
                        } else {
                            tier.innerHTML =
                                "Tier " + romanize(jsonUnits[i].tier) + ": " + getSummonedUpkeep(jsonUnits[i].tier, "");
                        }

                        if (summonInfo.length > 0) {
                            var p = "";
                            for (p in summonInfo) {
                                var castcost = "";
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
                                            romanize(jsonUnits[i].tier) +
                                            ": " +
                                            ReduceUpkeepPercentage(jsonUnits[i].upkeep, 0.9) +
                                            "*";
                                        var faithfulUpkeep = true;
                                    }
                                }
                            }

                            if ("passive_unique" in jsonEnchantments[k]) {
                                for (t = 0; t < jsonEnchantments[k].passive_unique.length; t++) {
                                    var overwrite = "";
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
                                    addAbilityslot(
                                        jsonEnchantments[k].active[t].slug,
                                        unitTabHolder,
                                        activeEnchantList,
                                        true
                                    );
                                }
                            }
                        }
                    }
                }

                var x = "";
                for (x in jsonUnits[i].primary_passives) {
                    addPassiveslot(jsonUnits[i].primary_passives[x].slug, unitTabHolder);

                    if (jsonUnits[i].primary_passives[x].slug.indexOf("low_maintenance") != -1) {
                        if (jsonUnits[i].upkeep.indexOf("influence") != -1) {
                            tier.innerHTML =
                                "Tier " +
                                romanize(jsonUnits[i].tier) +
                                ": " +
                                ReduceUpkeepPercentage(jsonUnits[i].upkeep, 0.75) +
                                "*";
                        } else {
                            tier.innerHTML =
                                "Tier " +
                                romanize(jsonUnits[i].tier) +
                                ": " +
                                ReduceUpkeepPercentage(jsonUnits[i].upkeep, 0.75) +
                                ">*";
                        }
                        var lowUpkeep = true;

                        if (summonInfo.length > 0) {
                            tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(jsonUnits[i].tier, 0.75) + "*";
                        }
                    }

                    if (jsonUnits[i].primary_passives[x].slug.indexOf("high_maintenance") != -1) {
                        if (jsonUnits[i].upkeep.indexOf("influence") != -1) {
                            tier.innerHTML =
                                "Tier " +
                                romanize(jsonUnits[i].tier) +
                                ": " +
                                ReduceUpkeepPercentage(jsonUnits[i].upkeep, 1.5) +
                                "*";
                        } else {
                            tier.innerHTML =
                                "Tier " +
                                romanize(jsonUnits[i].tier) +
                                ": " +
                                ReduceUpkeepPercentage(jsonUnits[i].upkeep, 1.5) +
                                ">*";
                        }

                        var lowUpkeep = true;

                        if (summonInfo.length > 0) {
                            if (jsonUnits[i].upkeep.indexOf("influence") != -1) {
                                tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(jsonUnits[i].tier, 1.5) + "*";
                            } else {
                                tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(jsonUnits[i].tier, 1.5) + ">*";
                            }
                        }
                    }

                    if (jsonUnits[i].primary_passives[x].slug.indexOf("faithful") != -1) {
                        if (jsonUnits[i].upkeep.indexOf("influence") != -1) {
                            tier.innerHTML =
                                "Tier " +
                                romanize(jsonUnits[i].tier) +
                                ": " +
                                ReduceUpkeepPercentage(jsonUnits[i].upkeep, 0.9) +
                                "*";
                        } else {
                            tier.innerHTML =
                                "Tier " +
                                romanize(jsonUnits[i].tier) +
                                ": " +
                                ReduceUpkeepPercentage(jsonUnits[i].upkeep, 0.9) +
                                ">*";
                        }

                        var faithfulUpkeep = true;

                        if (summonInfo.length > 0) {
                            if (jsonUnits[i].upkeep.indexOf("influence") != -1) {
                                tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(jsonUnits[i].tier, 0.9) + "*";
                            } else {
                                tier.innerHTML += "<br> Summoned: " + getSummonedUpkeep(jsonUnits[i].tier, 0.9) + ">*";
                            }
                        }
                    }
                }

                y = "";

                var resistanceDiv = document.createElement("div");
                resistanceDiv.innerHTML =
                    'Blight :  <span style="color:white;">' +
                    GetDamageReductionPercentage(jsonUnits[i].resistance, additionalBlight) +
                    '</span> ( From <span style="color:white;">' +
                    jsonUnits[i].resistance +
                    "</span> <resistance> </resistance>";
                if (additionalBlight != undefined) {
                    if (additionalBlight > 0) {
                        resistanceDiv.innerHTML += "+";
                    }
                    resistanceDiv.innerHTML += additionalBlight + "<defenseblight></defenseblight>";
                    if (additionalBlight === "immune") {
                        resistanceDiv.innerHTML = "Blight: Immune";
                    }
                }

                resistanceDiv.innerHTML += ")<br>";

                resistanceDiv.innerHTML +=
                    'Shock :  <span style="color:white;">' +
                    GetDamageReductionPercentage(jsonUnits[i].resistance, additionalShock) +
                    '</span> ( From <span style="color:white;">' +
                    jsonUnits[i].resistance +
                    "</span> <resistance> </resistance>";
                if (additionalShock != undefined) {
                    if (additionalShock > 0) {
                        resistanceDiv.innerHTML += "+";
                    }
                    resistanceDiv.innerHTML += additionalShock + "<defenselightning></defenselightning>";
                }

                resistanceDiv.innerHTML += ")<br>";

                resistanceDiv.innerHTML +=
                    'Fire :  <span style="color:white;">' +
                    GetDamageReductionPercentage(jsonUnits[i].resistance, additionalFire) +
                    '</span> ( From <span style="color:white;">' +
                    jsonUnits[i].resistance +
                    "</span> <resistance> </resistance>";
                if (additionalFire != undefined) {
                    if (additionalFire > 0) {
                        resistanceDiv.innerHTML += "+";
                    }
                    resistanceDiv.innerHTML += additionalFire + "<defensefire></defensefire>";
                }

                resistanceDiv.innerHTML += ")<br>";

                resistanceDiv.innerHTML +=
                    'Spirit :  <span style="color:white;">' +
                    GetDamageReductionPercentage(jsonUnits[i].resistance, additionalSpirit) +
                    '</span> ( From <span style="color:white;">' +
                    jsonUnits[i].resistance +
                    "</span> <resistance> </resistance>";
                if (additionalSpirit != undefined) {
                    if (additionalSpirit > 0) {
                        resistanceDiv.innerHTML += "+";
                    }
                    resistanceDiv.innerHTML += additionalSpirit + "<defensespirit></defensespirit>";
                }

                resistanceDiv.innerHTML += ")<br>";

                resistanceDiv.innerHTML +=
                    'Frost :  <span style="color:white;">' +
                    GetDamageReductionPercentage(jsonUnits[i].resistance, additionalFrost) +
                    '</span> ( From <span style="color:white;">' +
                    jsonUnits[i].resistance +
                    "</span> <resistance> </resistance>";
                if (additionalFrost != undefined) {
                    if (additionalFrost > 0) {
                        resistanceDiv.innerHTML += "+";
                    }
                    resistanceDiv.innerHTML += additionalFrost + "<defensefrost></defensefrost>";
                }

                resistanceDiv.innerHTML += ")";

                var resistencespan = document.createElement("span");
                resistencespan.innerHTML =
                    '<span style="color:burlywood;text-transform: uppercase ">Resistance</span><br><span style="font-size: 14px;">Resistance reduces all non-physical damage.<br><br>Damage Reduction:' +
                    resistanceDiv.innerHTML +
                    "</p> </span>";
                var resistenceTooltip = unitCard.querySelectorAll("div#resistence_tt")[0];

                addTooltipListeners(resistenceTooltip, resistencespan);

                addLevelUpInfo(jsonUnits[i], a, unitCard);

                // backtrack origin;

                backtrackUnitOrigins(jsonUnits[i], name, unitCard);
                found = true;
                break;
            }
        }
    }
    if (found === false) {
        console.log("Couldn't find unit: " + a + i);
    }
}

function addTooltipListeners(tooltip, span) {
    tooltip.addEventListener("mouseenter", function (event) {
        TurnOnTooltip(span);
        if (tooltip != hoverDiv) {
            updateHoverDivPosition(event);
        }
    });

    tooltip.addEventListener("mouseleave", function () {
        TurnOffTooltip();
    });
}

function removeToolTipListeners(tooltip) {
    tooltip.removeEventListener("mouseenter", tooltip);

    tooltip.removeEventListener("mouseleave", tooltip);
}

function canBeSummoned(id) {
    var i = "";
    var k = "";
    var summonInf = [];
    // check for duplicates
    var spellIDChecker = [];
    for (i in jsonSpells) {
        if ("summoned_units" in jsonSpells[i]) {
            for (k in jsonSpells[i].summoned_units) {
                if (jsonSpells[i].summoned_units[k].slug === id) {
                    if (!isInArray(spellIDChecker, jsonSpells[i].id)) {
                        summonInf.push(jsonSpells[i]);
                        spellIDChecker.push(jsonSpells[i].id);
                    }
                }
            }
        }
    }
    return summonInf;
}

function getSummonedUpkeep(tier, lowMaintenance) {
    if (tier === 1) {
        if (lowMaintenance != "") {
            return ReduceUpkeepPercentage("8<mana></mana>", lowMaintenance);
        } else {
            return "8<mana></mana>";
        }
    }
    if (tier === 2) {
        if (lowMaintenance != "") {
            return ReduceUpkeepPercentage("12<mana></mana>", lowMaintenance);
        } else {
            return "12<mana></mana>";
        }
    }
    if (tier === 3) {
        if (lowMaintenance != "") {
            return ReduceUpkeepPercentage("20<mana></mana>", lowMaintenance);
        } else {
            return "20<mana></mana>";
        }
    }
    if (tier === 4) {
        if (lowMaintenance != "") {
            return ReduceUpkeepPercentage("30<mana></mana> 3<influence></influence>", lowMaintenance);
        } else {
            return "30<mana></mana> 3<influence></influence>";
        }
    }
    if (tier === 5) {
        if (lowMaintenance != "") {
            return ReduceUpkeepPercentage("60<mana></mana> 7<influence></influence>", lowMaintenance);
        } else {
            return "60<mana></mana> 7<influence></influence>";
        }
    }
}

function createUnitTypeIcon(parent, imgSrc, imgFallbackSrc, link, tooltipText) {
    var btn = document.createElement("DIV");
    btn.className = "unittype_icon";
    var imag = document.createElement("IMG");
    var spa = document.createElement("SPAN");

    spa.innerHTML = tooltipText;
    imag.setAttribute("src", imgSrc);
    imag.setAttribute("onerror", `this.setAttribute('src','${imgFallbackSrc}')`);
    imag.setAttribute("width", "60");
    imag.setAttribute("height", "60");

    btn.appendChild(imag);
    var wrap = btn.innerHTML;
    btn.innerHTML = `<a href="${link}" target="_blank">${wrap}</a>`;

    addTooltipListeners(btn, spa);
    parent.appendChild(btn);
}

function backtrackUnitOrigins(unitData, name, holder) {
    var holderOrigin = holder.querySelectorAll("div#originHolder")[0];
    holderOrigin.innerHTML = "";
    var culture = "thing";
    if ("culture_name" in unitData) {
        culture = unitData.culture_name.toLowerCase();
    }

    if (culture != "thing") {
        const capitalized = culture.charAt(0).toUpperCase() + culture.slice(1);
        const tooltipText = `Culture Unit from <hyperlink>${capitalized}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/Text/${culture}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/${capitalized}Units.html`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var subculture = "";
    if ("sub_culture_name" in unitData) {
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
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, null, tooltipText);
    }

    var tomes = CheckIfInTomes(unitData.id);
    if (tomes != "") {
        const tooltipText = `Unit production unlocked from Tier <hyperlink>${romanize(tomes.tier)} - ${showAffinitySymbols(tomes)} ${tomes.name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/TomeIcons/${tomes.id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?tome=${tomes.id}`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var spells = CheckIfInSpells(unitData.id, name);
    var x = "";
    for (var x in spells) {
        var tierandnameoftome = backtraceTomeNameAndTier(spells[x].id);
        var tooltipText =
            tierandnameoftome != ""
                ? `Unit mentioned in Spell: <hyperlink>${spells[x].name}</hyperlink> <br>in Tier <hyperlink>${romanize(tierandnameoftome.tier)} - ${showAffinitySymbols(tierandnameoftome)} ${tierandnameoftome.name}</hyperlink>`
                : `Unit mentioned in Spell: <hyperlink>${spells[x].name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/SpellIcons/${spells[x].id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?spell=${spells[x].id}`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var siege = CheckIfInSiege(name);
    if (siege != "") {
        const tooltipText = `Unit mentioned in Siege Project <hyperlink>${siege.name}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/SiegeIcons/${siege.id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?siege=${siege.id}`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var struc = CheckIfInStructure(name);
    if (struc != "") {
        const tooltipText = `Unit mentioned in Structure <hyperlink>${struc.name}</hyperlink>`;
        const imgSrc = `/aow4db/Icons/UpgradeIcons/${struc.id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?structure=${struc.id}`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var wonder = CheckIfInAncientWonder(unitData.id);
    if (wonder != "") {
        const tooltipText = `Rally Unit unlocked from <hyperlink>${wonder.type}</<hyperlink> : <hyperlink>${wonder.name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/StructurePics/${wonder.id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?wonder=${wonder.id}`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var tree = CheckIfInEmpireTree(name);
    if (tree != "") {
        const tooltipText = `Unit mentioned in <hyperlink>${tree.category} ${tree.required_level}</<hyperlink> : <hyperlink>${tree.name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/EmpireProgressionIcons/${tree.id}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/EmpireTree.html`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var unitAbility = CheckIfFromAbility(name);
    if (unitAbility != "") {
        const tooltipText = `Unit mentioned in Ability <hyperlink>${unitAbility[1].name}</hyperlink> of Unit <hyperlink>${unitAbility[0].name}</hyperlink>`;
        const imgSrc =
            unitAbility[0] != ""
                ? `/aow4db/Icons/UnitIcons/${unitAbility[1].icon}.png`
                : `/aow4db/Icons/HeroSkillIcons/${unitAbility[1].icon}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Units.html?unit=${unitAbility[0].id}`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var heroSkill = CheckIfFromHeroSkill(name);
    if (heroSkill != "") {
        const tooltipText = `Unit mentioned in Hero Skill <hyperlink>${heroSkill[1].name}</hyperlink>`;
        const imgSrc =
            heroSkill[0] != ""
                ? `/aow4db/Icons/UnitIcons/${heroSkill[0].icon}.png`
                : `/aow4db/Icons/HeroSkillIcons/${heroSkill[1].icon}.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Spells.html?skill=${heroSkill[1].id}`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }

    var evolve = CheckIfEvolveTarget(unitData.id);
    if (evolve != "") {
        const tooltipText = `Evolved from Unit <hyperlink>${evolve.name}</<hyperlink>`;
        const imgSrc = `/aow4db/Icons/UnitIcons/evolve.png`;
        const imgFallbackSrc = `/aow4db/Icons/Text/mp.png`;
        const link = `/aow4db/HTML/Units.html?unit=${evolve.id}`;
        createUnitTypeIcon(holderOrigin, imgSrc, imgFallbackSrc, link, tooltipText);
    }
}

function showAffinitySymbols(tomes) {
    if (tomes.affinities === undefined) {
        return "";
    }
    var affinitiesdual = tomes.affinities.split(", ");

    var allAffinity = "";
    var i = "";
    for (i in affinitiesdual) {
        var affinities = affinitiesdual[i];

        allAffinity += affinities;
    }
    allAffinity = ClearAffinityExtraTags(duplicateTags(allAffinity));
    allAffinity = allAffinity.replaceAll(",", "");

    return allAffinity;
}

function CheckIfInSpells(unitID, unitName) {
    var spell = [];
    // check for duplicates
    var spellIDChecker = [];
    var i = 0;
    for (i in jsonSpells) {
        if ("summoned_units" in jsonSpells[i]) {
            var k = 0;
            for (k in jsonSpells[i].summoned_units) {
                if (unitID === jsonSpells[i].summoned_units[k].slug) {
                    if (!isInArray(spellIDChecker, jsonSpells[i].id)) {
                        spell.push(jsonSpells[i]);
                        spellIDChecker.push(jsonSpells[i].id);
                    }
                }
            }
        }
        if (jsonSpells[i].description.indexOf(">" + unitName) != -1) {
            if (!isInArray(spellIDChecker, jsonSpells[i].id)) {
                spell.push(jsonSpells[i]);
                spellIDChecker.push(jsonSpells[i].id);
            }
        }
    }

    return spell;
}

function CheckIfFromAbility(unitName) {
    var ability = "";
    var i = 0;
    for (i in jsonUnitAbilities) {
        if (unitName === "Fire Runestone") {
            unitName = "Runestone";
        }
        if (jsonUnitAbilities[i].description.indexOf(" " + unitName) != -1) {
            ability = jsonUnitAbilities[i];
        }
    }

    var unitslugLookup = "";
    if (ability != "") {
        var j = 0;
        for (j in jsonUnits) {
            var k = 0;
            for (k in jsonUnits[j].abilities) {
                if (jsonUnits[j].abilities[k].slug === ability.slug) {
                    unitslugLookup = [];
                    unitslugLookup.push(jsonUnits[j]);
                    unitslugLookup.push(ability);
                }
            }
            var l = 0;
            for (l in jsonUnits[j].primary_passives) {
                if (jsonUnits[j].primary_passives[l].slug === ability.slug) {
                    unitslugLookup = [];
                    unitslugLookup.push(jsonUnits[j]);
                    unitslugLookup.push(ability);
                }
            }
        }
    }

    return unitslugLookup;
}

function CheckIfFromHeroSkill(unitName) {
    var resultslist = "";
    var hero = "";
    var i = 0;
    for (i in jsonUnitAbilities) {
        if (jsonUnitAbilities[i].description.indexOf(unitName) != -1) {
            hero = jsonUnitAbilities[i];
        }
    }

    var j = 0;
    for (j in jsonHeroSkills) {
        if (hero != "") {
            if ("abilities" in jsonHeroSkills[j]) {
                var k = 0;
                for (k in jsonHeroSkills[j].abilities) {
                    if (jsonHeroSkills[j].abilities[k].slug === hero.slug) {
                        resultslist = [];
                        resultslist.push(hero);
                        resultslist.push(jsonHeroSkills[j]);
                    }
                }
            }
        } else {
            var k = 0;
            for (k in jsonHeroSkills[j].description) {
                if (jsonHeroSkills[j].description.indexOf(unitName) != -1) {
                    resultslist = [];
                    resultslist.push(hero);
                    resultslist.push(jsonHeroSkills[j]);
                }
            }
        }
    }

    return resultslist;
}

function CheckIfInSiege(unitName) {
    var siege = "";
    var i = 0;
    for (i in jsonSiegeProjects) {
        if (jsonSiegeProjects[i].description.indexOf(">" + unitName) != -1) {
            siege = jsonSiegeProjects[i];
        }
    }
    return siege;
}

function CheckIfInStructure(unitName) {
    var structure = "";
    var i = 0;
    for (i in jsonStructureUpgrades) {
        if (unitName === "Warg") {
            unitName = "Warg<";
        }
        if (unitName === "Archer") {
            unitName = "Archer<";
        }
        if (jsonStructureUpgrades[i].prediction_description.indexOf(">" + unitName) != -1) {
            structure = jsonStructureUpgrades[i];
        }

        if (jsonStructureUpgrades[i].description.indexOf(">" + unitName) != -1) {
            structure = jsonStructureUpgrades[i];
        }
    }
    return structure;
}

function CheckIfInTomes(unitID) {
    var tome = "";

    if (unitID == "young_frost_dragon" || unitID == "young_obsidian_dragon" || unitID == "young_golden_dragon") {
        unitID = "young_fire_dragon";
    }
    var i = 0;

    for (i in jsonTomes) {
        var k = 0;
        for (k in jsonTomes[i].skills) {
            if ("unit_slug" in jsonTomes[i].skills[k]) {
                if (unitID === jsonTomes[i].skills[k].unit_slug) {
                    tome = jsonTomes[i];
                }
            }
        }
    }
    return tome;
}

function CheckIfInEmpireTree(unitNameUnique) {
    var tree = "";
    var i,
        k = "";
    for (i in jsonEmpire) {
        if (jsonEmpire[i].description.indexOf(">" + unitNameUnique) != -1) {
            tree = jsonEmpire[i];
        }
    }

    return tree;
}

function CheckIfEvolveTarget(unitID) {
    var evolve = "";
    var i,
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

function CheckIfInAncientWonder(unitID) {
    var wonder = "";
    var i,
        k = "";
    for (i in jsonWorldStructures) {
        if ("unit_unlocks" in jsonWorldStructures[i]) {
            for (k in jsonWorldStructures[i].unit_unlocks) {
                if (unitID === jsonWorldStructures[i].unit_unlocks[k].slug) {
                    wonder = jsonWorldStructures[i];
                }
            }
        }
    }
    return wonder;
}

function ReduceUpkeepPercentage(value, percentage) {
    var number = value.split("<");
    var reducedUpkeep = Math.round(percentage * parseInt(number[0]));
    var comb = reducedUpkeep + "<" + number[1] + "<" + number[2];
    if (number.length > 2) {
        comb += "<" + number[3] + "<" + number[4];
    }

    return comb;
}

function ReturnWeaknessOrResistanceNumber(slug) {
    if (slug.indexOf("weakness") !== -1) {
        var split = slug.split("weakness_");
        abilityDam = "-" + split[1];
    }
    if (slug.indexOf("resistance") !== -1) {
        var split = slug.split("resistance_");
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
    var combinedDefense = parseInt(number) + parseInt(additionalNumber);

    if (combinedDefense >= 0) {
        var defensePercentage = 1 - Math.pow(0.9, combinedDefense);
    } else {
        var defensePercentage = -(1 - Math.pow(0.9, -combinedDefense));
    }

    var percentage = Math.round(defensePercentage * 100);
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
    var levelup = holder.querySelectorAll("div#levelup")[0];
    levelup.innerHTML = "";
    evolveTarget = units.evolve_target;

    if (units.tier === 1) {
        xpNeeded = 4;
    }
    if (units.tier === 2) {
        xpNeeded = 6;
    }
    if (units.tier === 3) {
        xpNeeded = 8;
    }
    if (units.tier === 4) {
        xpNeeded = 10;
    }
    if (units.tier === 5) {
        xpNeeded = 12;
    }

    var levelText = "";
    levelText = '<p style="  color: #aadb9c;"> <medal_soldier></medal_soldier> Soldier - ' + xpNeeded + "<xp></xp></p>";
    levelup.append(NewLevelUpEntry(levelText));

    //levelText +=
    var i = 0;
    for (i in units.medal_rewards_2) {
        levelText = "<bullet>" + lookupSlug(units.medal_rewards_2[i].slug) + "</bullet>";
        levelup.append(NewLevelUpEntry(levelText));
    }
    levelText =
        '<p style="  color: #aadb9c;"> <medal_veteran></medal_veteran> Veteran - ' + xpNeeded * 2 + "<xp></xp></p>";
    levelup.append(NewLevelUpEntry(levelText));
    var i = 0;
    for (i in units.medal_rewards_3) {
        levelText = "<bullet>" + lookupSlug(units.medal_rewards_3[i].slug) + "</bullet>";
        levelup.append(NewLevelUpEntry(levelText));
    }
    levelText = '<p style="  color: #aadb9c;"> <medal_elite></medal_elite> Elite - ' + xpNeeded * 3 + "<xp></xp></p>";
    levelup.append(NewLevelUpEntry(levelText));

    var i = 0;
    for (i in units.medal_rewards_4) {
        if (units.medal_rewards_4[i].slug.indexOf("medal") != -1) {
            levelText = '<p class="levelup_medal">' + "<bullet>" + lookupSlug(units.medal_rewards_4[i].slug);

            var test = NewLevelUpEntry(levelText);
            var spanText = document.createElement("span");

            spanText.innerHTML = lookupSlugDescription(units.medal_rewards_4[i].slug);
            addTooltipListeners(test, spanText);
            levelup.append(test);
        } else {
            levelText = "<bullet>" + lookupSlug(units.medal_rewards_4[i].slug) + "</bullet>";
            levelup.append(NewLevelUpEntry(levelText));
        }
    }

    levelText =
        '<p style="  color: #aadb9c;"> <medal_champion></medal_champion> Champion - ' + xpNeeded * 4 + "<xp></xp></p>";
    levelup.append(NewLevelUpEntry(levelText));
    var i = 0;
    for (i in units.medal_rewards_5) {
        if (units.medal_rewards_5[i].slug.indexOf("medal") != -1) {
            levelText = '<p class="levelup_medal">' + "<bullet>" + lookupSlug(units.medal_rewards_5[i].slug);

            var test = NewLevelUpEntry(levelText);
            var spanText = document.createElement("span");

            spanText.innerHTML = lookupSlugDescription(units.medal_rewards_5[i].slug);
            addTooltipListeners(test, spanText);
            levelup.append(test);
        } else {
            levelText = "<bullet>" + lookupSlug(units.medal_rewards_5[i].slug) + "</bullet>";
            levelup.append(NewLevelUpEntry(levelText));
        }
    }
    if (evolveTarget != undefined) {
        levelText = '<p style="  color: #aadb9c;"> <medal_legend></medal_legend> Legend - ' +  xpNeeded * 4 + "<xp></xp></p>";
        levelup.append(NewLevelUpEntry(levelText));

        levelText =
            '<bullet> Evolves into <hyperlink> <a href="/aow4db/HTML/Units.html?unit=' +
            evolveTarget +
            '" target="_blank">' +
            lookupUnit(evolveTarget) +
            "</a></hyperlink></bullet>";
        levelup.append(NewLevelUpEntry(levelText));
    }
    if (evolveTarget == undefined) {
        levelText =
            '<p style="  color: #aadb9c;"> <medal_legend></medal_legend> Legend - ' + xpNeeded * 10 + "<xp></xp></p>";
        levelup.append(NewLevelUpEntry(levelText));
        for (let i = 0; i < units.medal_rewards_6.length; i++) {
            if (units.medal_rewards_6[i].slug.indexOf("medal") != -1) {
                levelText = '<p class="levelup_medal">' + "<bullet>" + lookupSlug(units.medal_rewards_6[i].slug);

                var test = NewLevelUpEntry(levelText);
                var spanText = document.createElement("span");
                spanText.innerHTML = lookupSlugDescription(units.medal_rewards_6[i].slug);
                addTooltipListeners(test, spanText);
                levelup.append(test);
            } else {
                levelText = "<bullet>" + lookupSlug(units.medal_rewards_6[i].slug) + "</bullet>";
                levelup.append(NewLevelUpEntry(levelText));
            }
        }
    }

    //levelup.innerHTML += levelText;
}

function NewLevelUpEntry(spanEntry) {
    var newEntryDiv = document.createElement("div");
    newEntryDiv.innerHTML = spanEntry;
    return newEntryDiv;
}

function lookupUnit(id) {
    var j = 0;
    for (j in jsonUnits) {
        if (id === jsonUnits[j].id) {
            return jsonUnits[j].name;
        }
    }
    return "Couldn't find this";
}

function lookupSlugDescription(slug) {
    var j = 0;
    for (j in jsonUnitAbilities) {
        if (slug === jsonUnitAbilities[j].slug) {
            if (slug === "legend_medal_killing_momentum") {
                return "Unit regains Action Points when killing another unit. Works once per Turn";
            } else {
                return jsonUnitAbilities[j].description;
            }
        }
    }
    return "Couldn't find this";
}

function lookupSlug(slug) {
    var j = 0;
    for (j in jsonUnitAbilities) {
        if (slug === jsonUnitAbilities[j].slug) {
            return jsonUnitAbilities[j].name.replaceAll("<br></br>", "<br>");
        }
    }
    return "Couldn't find this";
}

function romanize(num) {
    if (isNaN(num)) return NaN;
    var digits = String(+num).split(""),
        key = [
            "",
            "C",
            "CC",
            "CCC",
            "CD",
            "D",
            "DC",
            "DCC",
            "DCCC",
            "CM",
            "",
            "X",
            "XX",
            "XXX",
            "XL",
            "L",
            "LX",
            "LXX",
            "LXXX",
            "XC",
            "",
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX"
        ],
        roman = "",
        i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function deromanize(str) {
    str = str.toUpperCase();
    var validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
    var token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    var key = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    var num = 0,
        m;
    if (!(str && validator.test(str))) return false;
    while (m == token.exec(str)) num += key[m[0]];
    return num;
}

function showSiegeProject(id, showOrigin) {
    var modName,
        description,
        cost,
        type,
        tier,
        i = "";
    var found = false;

    for (i in jsonSiegeProjects) {
        if (id === jsonSiegeProjects[i].name) {
            modName = document.getElementById("modname");
            modName.innerHTML = jsonSiegeProjects[i].name.toUpperCase();
            modName.setAttribute("id", "modname" + jsonSiegeProjects[i].name);
            descriptionDiv = document.getElementById("moddescription");
            description = "<hr>" + jsonSiegeProjects[i].description;

            description +=
                "<br>Fortification Damage:<br> +" +
                jsonSiegeProjects[i].siege_health_damage +
                " <siegehealthdamage></siegehealthdamage> Fortification Damage";

            imagelink = document.getElementById("modicon");

            unitTypesDiv = document.getElementById("affectUnitTypes");
            unitTypesDiv.setAttribute("id", "affectUnitTypes" + jsonSiegeProjects[i].name);

            imagelink.setAttribute("src", "/aow4db/Icons/SiegeIcons/" + jsonSiegeProjects[i].id + ".png");
            imagelink.setAttribute("id", "modicon" + jsonSiegeProjects[i].name);
            descriptionDiv.innerHTML = description;
            descriptionDiv.setAttribute("id", "moddescription" + jsonSiegeProjects[i].name);

            tier = document.getElementById("modtier");

            tier.innerHTML = "<garrison></garrison> Siege Project";

            tier.setAttribute("id", "modtier" + jsonSiegeProjects[i].name);

            cost = document.getElementById("modcost");
            cost.innerHTML = "Cost:" + jsonSiegeProjects[i].cost;
            cost.setAttribute("id", "modcost" + jsonSiegeProjects[i].name);

            var tierSpell = backtraceTomeOriginAndTier(jsonSiegeProjects[i].name, showOrigin);

            if (tierSpell != undefined) {
                var splitspell = tierSpell.split(",");
                modName.innerHTML +=
                    '<span style="color:white;font-size:15px">  Tier ' + romanize(splitspell[0]) + "</span>";
                if ("DLC" in jsonSiegeProjects[i] && showOrigin) {
                    var newDivForMount = AddDLCTag(jsonSiegeProjects[i].DLC);

                    modName.append(newDivForMount);
                }
            }

            var tomeOrigin = document.getElementById("originTome");
            tomeOrigin.setAttribute("id", "originTome" + id);
            var tomeOriginIcon = document.getElementById("originTomeIcon");
            tomeOriginIcon.setAttribute("id", "originTomeIcon" + id);

            var upkeep = document.getElementById("modupkeep");

            upkeep.innerHTML = "";
            upkeep.setAttribute("id", "modupkeep" + id);

            found = true;
        }
        if (id === jsonSiegeProjects[i].id) {
            modName = document.getElementById("modname");
            modName.innerHTML = jsonSiegeProjects[i].name.toUpperCase();
            modName.setAttribute("id", "modname" + jsonSiegeProjects[i].name);
            descriptionDiv = document.getElementById("moddescription");
            description = "<hr>" + jsonSiegeProjects[i].description;

            description +=
                "<br>Fortification Damage:<br> +" +
                jsonSiegeProjects[i].siege_health_damage +
                " <siegehealthdamage></siegehealthdamage> Fortification Damage";

            imagelink = document.getElementById("modicon");

            unitTypesDiv = document.getElementById("affectUnitTypes");
            unitTypesDiv.setAttribute("id", "affectUnitTypes" + jsonSiegeProjects[i].name);

            imagelink.setAttribute("src", "/aow4db/Icons/SiegeIcons/" + jsonSiegeProjects[i].id + ".png");
            imagelink.setAttribute("id", "modicon" + jsonSiegeProjects[i].name);
            descriptionDiv.innerHTML = description;
            descriptionDiv.setAttribute("id", "modicon" + jsonSiegeProjects[i].name);

            tier = document.getElementById("modtier");

            tier.innerHTML = "<garrison></garrison> Siege Project";

            tier.setAttribute("id", "modtier" + jsonSiegeProjects[i].name);

            cost = document.getElementById("modcost");
            cost.innerHTML = "Cost:" + jsonSiegeProjects[i].cost;
            cost.setAttribute("id", "modcost" + jsonSiegeProjects[i].name);

            var tierSpell = backtraceTomeOriginAndTier(jsonSiegeProjects[i].id, showOrigin);

            if (tierSpell != undefined) {
                var splitspell = tierSpell.split(",");
                modName.innerHTML +=
                    '<span style="color:white;font-size:15px">  Tier ' + romanize(splitspell[0]) + "</span>";
                if ("DLC" in jsonSiegeProjects[i] && showOrigin) {
                    var newDivForMount = AddDLCTag(jsonSiegeProjects[i].DLC);

                    modName.append(newDivForMount);
                }
            }

            var tomeOrigin = document.getElementById("originTome");
            tomeOrigin.setAttribute("id", "originTome" + id);
            var tomeOriginIcon = document.getElementById("originTomeIcon");
            tomeOriginIcon.setAttribute("id", "originTomeIcon" + id);

            var upkeep = document.getElementById("modupkeep");

            upkeep.innerHTML = "";
            upkeep.setAttribute("id", "modupkeep" + id);

            found = true;
        }
    }
}

function showEmpireUpgrade(skill, showOrigin) {
    var modName,
        description,
        cost,
        type,
        tier,
        i = "";

    var upkeep = document.getElementById("modupkeep");

    upkeep.innerHTML = "";
    upkeep.setAttribute("id", "modupkeep" + skill.name);

    modName = document.getElementById("modname");
    modName.innerHTML = skill.name.toUpperCase();
    modName.setAttribute("id", "modname" + skill.name);
    descriptionDiv = document.getElementById("moddescription");
    description = "<hr>" + skill.description;

    imagelink = document.getElementById("modicon");

    unitTypesDiv = document.getElementById("affectUnitTypes");
    unitTypesDiv.setAttribute("id", "affectUnitTypes" + skill.name);

    var imageLinkName = skill.name.replaceAll(" ", "_").toLowerCase();
    imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + imageLinkName + ".png");
    imagelink.setAttribute("id", "modicon" + skill.name);
    descriptionDiv.innerHTML = description;
    descriptionDiv.setAttribute("id", "modicon" + skill.name);

    tier = document.getElementById("modtier");

    tier.innerHTML = "<empire></empire> Empire Upgrade";

    tier.setAttribute("id", "modtier" + skill.name);

    cost = document.getElementById("modcost");
    cost.innerHTML = "";
    cost.setAttribute("id", "modcost" + skill.name);

    var tomeOrigin = document.getElementById("originTome");
    tomeOrigin.setAttribute("id", "originTome" + skill.name);
    var tomeOriginIcon = document.getElementById("originTomeIcon");
    tomeOriginIcon.setAttribute("id", "originTomeIcon" + skill.name);
}

function showTome(a, div) {
    var modName,
        description,
        cost,
        type,
        tier,
        k,
        j,
        l,
        descriptionDiv = "";
    var found = false;
    for (j in jsonTomes) {
        if (a === jsonTomes[j].id) {
            modName = document.getElementById("tomename");
            modName.innerHTML = "";

            modName.innerHTML += jsonTomes[j].name;
            if ("DLC" in jsonTomes[j]) {
                var newDivForMount = AddDLCTag(jsonTomes[j].DLC);

                modName.append(newDivForMount);
            }

            modName.setAttribute("id", "tomename" + a);
            descriptionDiv = document.getElementById("tomedescription");
            description = jsonTomes[j].gameplay_description;
            if ("affinities" in jsonTomes[j]) {
                var affinitiesdual = jsonTomes[j].affinities.split(", ");

                var allAffinity = "";
                for (var i = 0; i < affinitiesdual.length; i++) {
                    var affinities = affinitiesdual[i].split(" ");
                    allAffinity += affinities[0] + affinities[1];
                    console.log(allAffinity);
                    allAffinity = expandTags(allAffinity);
                    allAffinity = allAffinity.replaceAll(",", "");
                }

                descriptionDiv.innerHTML =
                    "Tier " + romanize(jsonTomes[j].tier) + " - " + allAffinity + " " + "<br>" + description;
            } else {
                descriptionDiv.innerHTML = description;
            }
            descriptionDiv.innerHTML += "<hr>";

            descriptionDiv.setAttribute("id", "tomedescription" + a);
            loreDescription = jsonTomes[j].lore_description;
            loreDescription = loreDescription.replace(String.fromCharCode(92), "");
            loreDescription = loreDescription.replace(String.fromCharCode(92), "");

            loreDescription += "<br> -" + jsonTomes[j].lore_author;
            descriptionLoreDiv = document.getElementById("tomeloredescription");
            descriptionLoreDiv.innerHTML = loreDescription;

            unitTypesDiv = document.getElementById("initialBonusList");

            var div = document.createElement("DIV");

            if ("affinities" in jsonTomes[j]) {
                var affinitiesdual = jsonTomes[j].affinities.split(", ");

                var allAffinity = "";
                for (var i = 0; i < affinitiesdual.length; i++) {
                    var affinities = affinitiesdual[i].split(" ");
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
            var l = "";
            if ("passives" in jsonTomes[j]) {
                for (l in jsonTomes[j].passives) {
                    var div = document.createElement("DIV");
                    div.className = "initialBonusText";

                    div.innerHTML = "<unit></unit>" + jsonTomes[j].passives[l].name;

                    var spa = document.createElement("SPAN");
                    spa.innerHTML = jsonTomes[j].passives[l].type + "<br>";
                    spa.innerHTML += jsonTomes[j].passives[l].description;

                    addTooltipListeners(div, spa);

                    unitTypesDiv.appendChild(div);
                }
            }
            //  special province improvements
            var l = "";
            if ("initial_upgrades" in jsonTomes[j]) {
                for (l in jsonTomes[j].initial_upgrades) {
                    var div = document.createElement("DIV");
                    div.className = "initialBonusText";
                    var name = GetStructureName(jsonTomes[j].initial_upgrades[l].upgrade_slug);
                    div.innerHTML = name;

                    var spa = document.createElement("SPAN");
                    spa.innerHTML =
                        '<span style="color: #deb887 ;text-transform: uppercase">' +
                        name +
                        "</span>" +
                        GetStructureDescription(jsonTomes[j].initial_upgrades[l].upgrade_slug);

                    //  div.appendChild(spa);
                    unitTypesDiv.appendChild(div);

                    addTooltipListeners(div, spa);

                    unitTypesDiv.appendChild(div);
                }
            }
            var l = "";
            if ("hero_skills" in jsonTomes[j]) {
                for (l in jsonTomes[j].hero_skills) {
                    // remove duplicates
                    if (l != 0) {
                        if (jsonTomes[j].hero_skills[l].slug === jsonTomes[j].hero_skills[l - 1].slug) {
                            break;
                        }
                    }
                    var div = document.createElement("DIV");
                    div.className = "initialBonusText";
                    var name = GetHeroSkillName(jsonTomes[j].hero_skills[l].slug);
                    div.innerHTML = "<hero></hero>" + name;

                    var heroSkillIconAndDesc = GetHeroSkillDescription(jsonTomes[j].hero_skills[l].slug);

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
                        addTooltipListeners(div, spa2);
                        unitTypesDiv.appendChild(div);
                    }
                }
            }
            // casting points
            var div = document.createElement("DIV");
            div.className = "initialBonusText initialBonusCastingPoints";
            var amount = "";
            if (
                jsonTomes[j].tier === 1 ||
                jsonTomes[j].tier === 2 ||
                jsonTomes[j].tier === 3 ||
                jsonTomes[j].tier === 4 ||
                jsonTomes[j].tier === 5
            ) {
                amount = 5;
            }

            if (amount != "") {
                div.innerHTML =
                    "+" + amount + "<casttactical></casttactical>" + "+" + amount + "<caststrategic></caststrategic>";
            }

            unitTypesDiv.appendChild(div);

            unitTypesDiv.setAttribute("id", "initialBonusList" + a);

            descriptionLoreDiv.setAttribute("id", "tomeloredescription" + a);
            skillHolder = document.getElementById("tome_unlocks");

            for (k in jsonTomes[j].skills) {
                if ("spell_slug" in jsonTomes[j].skills[k]) {
                    var iDiv = spell_card_template.content.cloneNode(true);
                    skillHolder.appendChild(iDiv);
                    showSpell(jsonTomes[j].skills[k].spell_slug, false);
                }
                if ("unit_slug" in jsonTomes[j].skills[k]) {
                    var iDiv = spell_card_template.content.cloneNode(true);
                    skillHolder.appendChild(iDiv);

                    showUnitUnlock(jsonTomes[j].skills[k]);
                }

                // stormport for some reason doesnt have an upgrade slug
                if ("upgrade_slug" in jsonTomes[j].skills[k]) {
                    var iDiv = spell_card_template.content.cloneNode(true);
                    skillHolder.appendChild(iDiv);
                    showStructure(jsonTomes[j].skills[k].upgrade_slug, false);
                }
                if ("type" in jsonTomes[j].skills[k]) {
                    if (jsonTomes[j].skills[k].type == "<hyperlink>Empire Bonus</hyperlink>") {
                        var iDiv = spell_card_template.content.cloneNode(true);
                        skillHolder.appendChild(iDiv);
                        showEmpireUpgrade(jsonTomes[j].skills[k], false);
                    }
                }
                if (jsonTomes[j].skills[k].type.indexOf("Siege") != -1) {
                    var iDiv = spell_card_template.content.cloneNode(true);
                    skillHolder.appendChild(iDiv);
                    showSiegeProject(jsonTomes[j].skills[k].name, false);
                }
            }
            skillHolder.setAttribute("id", "tome_unlocks" + a);

            imagelink = document.getElementById("tomeicon");
            imagelink.setAttribute("src", "/aow4db/Icons/TomeIcons/" + a + ".png");
            imagelink.setAttribute("id", "tomeicon" + a);

            // backtraceTomeOriginAndTier(jsonSpells[j].id);

            found = true;
        }
    }
    if (found === false) {
        console.log("Couldn't find tome: " + a);
    }
}

function expandTags(input) {
    // Regular expression to match patterns like "2<empirearcana></empirearcana>"
    const tagPattern = /(\d+)(<.*?>.*?<\/.*?>)/g;

    // Function to replace each match with the expanded form
    const expanded = input.replace(tagPattern, (match, count, tag) => {
        // Repeat the tag the specified number of times
        return tag.repeat(Number(count));
    });

    return expanded;
}

function ShowPossibleEnchantments(evt) {
    var unitType = evt.currentTarget.param;
    var activeEnchantList;
    var holder = evt.currentTarget.originDiv.querySelectorAll("div#enchantHolder")[0];
    // var holder = document.getElementById("enchantHolder" + evt.currentTarget.holder);
    if (!evt.currentTarget.originDiv.hasOwnProperty("activeEnchantList")) {
        activeEnchantList = evt.currentTarget.activeEnchantList;
        holder.activeEnchantList = activeEnchantList;
    } else {
        console.log("already has list");
        activeEnchantList = evt.currentTarget.originDiv.activeEnchantList;
    }

    unitType = unitType.replaceAll("_", " ");

    var list = findEnchantmentsSpells();

    var compatibleList = [];
    var exclusionList = [];
    var i = "";

    // check if culture
    if ("culture_name" in evt.currentTarget.unitData) {
        culture = evt.currentTarget.unitData.culture_name.toLowerCase();
    } else {
        culture = "none";
    }

    // console.log(culture);
    for (i = 0; i < list.length; i++) {
        var j = "";

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
        for (j = 0; j < list[i].enchantment_requisites.length; j++) {
            var requisite = list[i].enchantment_requisites[j].requisite;
            var type = list[i].enchantment_requisites[j].requisite.toLowerCase().split("> ");

            if (type[1] != undefined) {
                if (type[1] === unitType) {
                    if (!isInArray(activeEnchantList, list[i]) && !isInArray(exclusionList, list[i]))
                        compatibleList.push(list[i]);
                } else {
                    var passives = "";
                    for (passives in evt.currentTarget.unitData.secondary_passives) {
                        if (evt.currentTarget.unitData.secondary_passives[passives].slug === type[1].toLowerCase()) {
                            if (!isInArray(activeEnchantList, list[i]) && !isInArray(exclusionList, list[i]))
                                compatibleList.push(list[i]);
                        }
                    }
                }
            } else {
                if (requisite === "Units that Evolve") {
                    var passives = "";
                    for (passives in evt.currentTarget.unitData.secondary_passives) {
                        if (evt.currentTarget.unitData.secondary_passives[passives].slug === "evolve") {
                            if (!isInArray(activeEnchantList, list[i]) && !isInArray(exclusionList, list[i]))
                                compatibleList.push(list[i]);
                        }
                    }
                } else if (requisite === "Tier I") {
                    if (evt.currentTarget.unitData.tier == 1) {
                        if (!isInArray(activeEnchantList, list[i]) && !isInArray(exclusionList, list[i]))
                            compatibleList.push(list[i]);
                    }
                } else {
                    requisite = requisite.replaceAll(" ", "_");

                    var type = requisite.split("> ");

                    if (type[1] != undefined) {
                        requisite = type[1];
                    }
                    var passives = "";
                    for (passives in evt.currentTarget.unitData.secondary_passives) {
                        if (evt.currentTarget.unitData.secondary_passives[passives].slug === requisite.toLowerCase()) {
                            if (!isInArray(activeEnchantList, list[i]) && !isInArray(exclusionList, list[i]))
                                compatibleList.push(list[i]);
                        }
                    }
                }
            }
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

    var activeHolder = evt.currentTarget.activeListHolder;

    for (let i = 0; i < compatibleList.length; i++) {
        var enchantEntry = createTooltipForEnchant(compatibleList[i]);

        enchantEntry.addEventListener("click", SetEnchantment);
        enchantEntry.enchant = compatibleList[i];
        enchantEntry.activeHolder = activeHolder;
        enchantEntry.activeEnchantList = activeEnchantList;
        enchantEntry.originDiv = evt.currentTarget.originDiv;
        enchantEntry.unit = evt.currentTarget.unit;

        holder.appendChild(enchantEntry);
    }
}

function createTooltipForEnchant(item) {
    var span = document.createElement("span");
    var enchantEntry = document.createElement("Button");
    enchantEntry.className = "enchantButton";
    const image = document.createElement("img");
    var text = document.createElement("div");
    image.setAttribute("width", "20");
    image.setAttribute("height", "20");
    image.setAttribute("src", "/aow4db/Icons/SpellIcons/" + item.icon + ".png");
    text.textContent = item.name;
    text.className = "tooltip";
    text.setAttribute("style", "padding:0px");

    span.innerHTML = item.description;

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
        var activeEnch = document.createElement("Div");
        activeEnch.className = "enchantButton";
        const image = document.createElement("img");

        image.setAttribute("width", "40");
        image.setAttribute("height", "40");
        image.setAttribute("src", "/aow4db/Icons/SpellIcons/" + evt.currentTarget.enchant.icon + ".png");

        activeEnch.className = "tooltip";
        activeEnch.setAttribute("style", "padding: 0px");
        var span = document.createElement("span");
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

        var holder = evt.currentTarget.activeHolder;
        var unit = evt.currentTarget.unit;
        holder.appendChild(activeEnch);
    }
    showUnit(evt.currentTarget.unit);
}

function RemoveActiveEnchant(evt) {
    var origin = evt.currentTarget.originDiv;

    origin.activeEnchantList = origin.activeEnchantList.filter((item) => item !== evt.currentTarget.thisEnchant);

    showUnit(evt.currentTarget.unit);
    evt.currentTarget.remove();
}

function GetAbilityInfo(ability) {
    if ("accuracy" in ability) {
        var abilityName = ability.name.toUpperCase();
        if (ability.requisites === undefined) {
            var abilityReq = "";
        } else {
            var abilityReq = ability.requisites;
        }

        var abilityMod = "";

        var l = 0;
        for (l in ability.modifiers) {
            abilityName += "&#11049";
            abilityMod += "<bullet>" + ability.modifiers[l].name + "<br>";
            abilityMod += ability.modifiers[l].description + "</bullet><br>";
        }

        // add notes

        abilityNote = "";
        var Cooldown = "";
        var Once = "";
        var l = 0;
        for (l in ability.notes) {
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

        var abilityEncht = "";

        abilityRange = ability.range + "<range></range>";
        abilityAcc = ability.accuracy + "<accuracy></accuracy>";

        var abilityIconType = GetAbilityBackground(ability.damage);
        var spa = GetAbilityToolTip(
            ability,
            ability.damage,
            abilityName,
            abilityIconType,
            abilityAcc,
            abilityRange,
            abilityMod,
            abilityEncht,
            abilityNote,
            abilityReq,
            Cooldown,
            Once
        );
    } else {
        var spa = CreatePassiveSlotToolTip(ability.icon, ability.name, ability.description);
    }
    return spa;
}

function GetStructureName(structureID) {
    var j = 0;
    for (j in jsonStructureUpgrades) {
        if (jsonStructureUpgrades[j].id.indexOf(structureID) != -1) {
            return jsonStructureUpgrades[j].name;
        }
    }
}

function GetHeroSkillName(skillID) {
    var j = 0;
    for (j in jsonHeroSkills) {
        if (jsonHeroSkills[j].id == skillID) {
            return jsonHeroSkills[j].name;
        }
    }
}

function GetHeroSkillDescription(skillID) {
    var array = ["", ""];
    var j = 0;
    for (j in jsonHeroSkills) {
        if (jsonHeroSkills[j].id == skillID) {
            if ("abilities" in jsonHeroSkills[j]) {
                for (var k = 0; k < jsonUnitAbilities.length; k++) {
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

function GetStructureDescription(structureID) {
    var j = 0;
    for (j in jsonStructureUpgrades) {
        if (jsonStructureUpgrades[j].id === structureID) {
            return jsonStructureUpgrades[j].description;
        }
    }
}

function showStructure(a, showOrigin) {
    var modName,
        description,
        cost,
        type,
        tier,
        j,
        nameString,
        modCard = "";
    var found = false;
    for (j in jsonStructureUpgrades) {
        if (a === jsonStructureUpgrades[j].id) {
            // exception
            if (a === "_teleporter___teleporter") {
                if (jsonStructureUpgrades[j].is_sector_upgrade === false) {
                    continue;
                }
            }
            modcard = document.getElementById("spell_card");

            modcard.setAttribute("id", "spell_card" + a);
            modName = document.getElementById("modname");
            nameString = "";
            nameString = jsonStructureUpgrades[j].name.toUpperCase();

            if (nameString.indexOf("<br>")) {
                nameString = nameString.replace("<br>", "");
                nameString = nameString.replace("<br>", "");
            }

            modName.innerHTML = nameString;
            // backtracktome
            var tomeNameandTier = backtraceStructureToTomeNameAndTier(a);

            modName.setAttribute("id", "modname" + a);

            modName.className = "mod_name";
            descriptionDiv = document.getElementById("moddescription");
            description = "<hr>";

            if (jsonStructureUpgrades[j].requirement_description != "") {
                description += "<yellowText>Requirement: </yellowText><br>";
                description += jsonStructureUpgrades[j].requirement_description + "<br><br>";
            }

            if (jsonStructureUpgrades[j].prediction_description != "") {
                description += "<yellowText>Full Description: </yellowText><br>";
            } else {
                description += "<yellowText> Description: </yellowText><br>";
            }
            description += jsonStructureUpgrades[j].description;

            if (jsonStructureUpgrades[j].prediction_description != "") {
                description +=
                    "<br><br><yellowText> Base Income Description:</yellowText><br>" +
                    jsonStructureUpgrades[j].prediction_description;
            }

            imagelink = document.getElementById("modicon");

            if (a.startsWith("_")) {
                a = a.replace("_", "");
            }

            imagelink.setAttribute("src", "/aow4db/Icons/UpgradeIcons/" + a + ".png");
            if (a.indexOf("town_hall_iii_") != -1) {
                description += "<br><br> Unlocks T3 Culture Units";
            }
            if (a.indexOf("town_hall_ii_") != -1) {
                description += "<br><br> Unlocks T2 Culture Units";
            }
            imagelink.setAttribute("id", "modicon" + a);
            descriptionDiv.innerHTML = description;

            descriptionDiv.setAttribute("id", "modicon" + a);

            unitTypesDiv = document.getElementById("affectUnitTypes");
            unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);
            unitTypesDiv.setAttribute(
                "style",
                "float: left;display: grid;grid-template-columns: 200px 200px;font-size: 15px;"
            );

            tier = document.getElementById("modtier");
            if (jsonStructureUpgrades[j].is_sector_upgrade) {
                if (tomeNameandTier != "") {
                    if (tomeNameandTier[1] != 0) {
                        tier.innerHTML =
                            "<br> Tier " + romanize(tomeNameandTier[1]) + " - " + tomeNameandTier[0] + "<br>";
                    } else {
                        tier.innerHTML = "<br>" + tomeNameandTier[0] + "<br>";
                    }
                }
                modName.innerHTML += "<br> <hyperlink><structure></structure> Province Improvement</hyperlink>";
            } else {
                tier.innerHTML = "<hyperlink><structure></structure> City Structure</hyperlink>";
            }
            tier.setAttribute("id", "modtier" + a);

            cost = document.getElementById("modcost");
            cost.className = "spell_cost";
            cost.innerHTML = "Build Cost: " + jsonStructureUpgrades[j].cost;
            cost.setAttribute("id", "modcost" + a);

            var name = backtraceTomeOriginAndTierForStructure(a, showOrigin);

            if ("DLC" in jsonStructureUpgrades[j]) {
                var newDivForMount = AddDLCTag(jsonStructureUpgrades[j].DLC);
                modName.append(newDivForMount);
            }

            var tomeOrigin = document.getElementById("originTome");
            tomeOrigin.setAttribute("id", "originTome" + a.id);
            var tomeOriginIcon = document.getElementById("originTomeIcon");
            tomeOriginIcon.setAttribute("id", "originTomeIcon" + a.id);

            if (a.indexOf("wildlife_sanctuary") != -1) {
                // unlock warg, razorback, hunter spider, goretustk piglet
                descriptionDiv.innerHTML += "<br>Unlocks Production of:";
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "goretusk_piglet" +
                    '" target="_blank">' +
                    GetUnitTierAndName("goretusk_piglet") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "dread_spider_hatchling" +
                    '" target="_blank">' +
                    GetUnitTierAndName("dread_spider_hatchling") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "vampire_spider_hatchling" +
                    '" target="_blank">' +
                    GetUnitTierAndName("vampire_spider_hatchling") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "razorback" +
                    '" target="_blank">' +
                    GetUnitTierAndName("razorback") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "warg" +
                    '" target="_blank">' +
                    GetUnitTierAndName("warg") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
            }

            if (a.indexOf("demon_gate") != -1) {
                // unlock warg, razorback, hunter spider, goretustk piglet
                descriptionDiv.innerHTML += "<br>Unlocks Production of:";
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "inferno_puppy" +
                    '" target="_blank">' +
                    GetUnitTierAndName("inferno_puppy") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "gremlin" +
                    '" target="_blank">' +
                    GetUnitTierAndName("gremlin") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "inferno_hound" +
                    '" target="_blank">' +
                    GetUnitTierAndName("inferno_hound") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
                var div = document.createElement("DIV");
                div.innerHTML =
                    "<bullet>" +
                    '<a href="/aow4db/HTML/Units.html?unit=' +
                    "chaos_eater" +
                    '" target="_blank">' +
                    GetUnitTierAndName("chaos_eater") +
                    "</a>" +
                    "</bullet>";
                unitTypesDiv.append(div);
            }

            var upkeep = document.getElementById("modupkeep");

            // upkeep.innerHTML = "";
            // upkeep.setAttribute("id", "modupkeep" + a.id);

            found = true;

            return modcard;
        }
    }
    if (found === false) {
        console.log("Couldn't find structure: " + a);
    }
}

function showCosmicHappening(a) {
    var modName,
        description,
        j,
        nameString = "";
    var found = false;

    for (j in jsonCosmicHappenings) {
        if (a === jsonCosmicHappenings[j].id) {
            modName = document.getElementById("modname");
            nameString = "";
            nameString = jsonCosmicHappenings[j].name.toUpperCase();

            if (modName == undefined) {
            }
            modName.innerHTML = nameString;

            modName.setAttribute("id", "modname" + a);
            modName.className = "mod_name";

            descriptionDiv = document.getElementById("moddescription");
            descriptionDiv.setAttribute("style", "max-width:560px; width:560px");
            description = jsonCosmicHappenings[j].description;
            descriptionDiv.innerHTML = description;
            descriptionDiv.setAttribute("id", "description" + a);

            var imagelink = document.getElementById("modicon");
            imagelink.setAttribute("id", "img" + a);
            var categoryLink = jsonCosmicHappenings[j].category.replaceAll(" ", "");
            categoryLink = categoryLink.replaceAll("of", "Of");
            imagelink.setAttribute("src", "/aow4db/Icons/CosmicHappenings/category_icon_" + categoryLink + ".png");

            var preview = document.getElementById("structurepreview");
            var imagePos = jsonCosmicHappenings[j].image;

            preview.setAttribute("id", "img" + a);
            preview.className = "cosmicHappeningPic";
            preview.setAttribute("style", 'background-image: url("/aow4db/Icons/CosmicHappenings/' + imagePos);

            preview.setAttribute("src", "/aow4db/Icons/Interface/Runecircle.png");

            var modtier = document.getElementById("modtier");
            modtier.innerHTML = "Category: " + jsonCosmicHappenings[j].category;
            modtier.setAttribute("id", "img" + a);

            var modcost = document.getElementById("modcost");
            var duration = jsonCosmicHappenings[j].duration;
            if (duration == -1) {
                duration = "Variable";
            } else {
                duration += "<turn></turn>";
            }
            modcost.innerHTML = "Duration: " + duration;
            modcost.setAttribute("id", "img" + a);

            // find combat enchantment
            found = true;
        }
    }
    if (found === false) {
        console.log("Couldn't find cosmic happening: " + a);
    }
}

function showWorldStructure(a) {
    var modName,
        description,
        cost,
        type,
        tier,
        nameString = "";
    var found = false;
    const structure = jsonWorldStructures.find((structure) => structure.id === a);
    if (!structure) {
        console.log("Couldn't find structure world: " + a);
        return;
    }

    modName = document.getElementById("modname");
    nameString = "";
    nameString = structure.name.toUpperCase();

    if (nameString.indexOf("<br>")) {
        nameString = nameString.replace("<br>", "");
        nameString = nameString.replace("<br>", "");
    }
    modName.innerHTML = nameString;
    if ("DLC" in structure) {
        var newDivForMount = AddDLCTag(structure.DLC);
        modName.append(newDivForMount);
    }
    modName.setAttribute("id", "modname" + a);
    modName.className = "mod_name";
    loreDiv = document.getElementById("loreText");

    loreDiv.setAttribute("id", "loreText" + a);
    if ("lore" in structure) {
        loreDiv.innerHTML = structure.lore;
        loreDiv.innerHTML += "<br><br>" + structure.author;
    }

    descriptionDiv = document.getElementById("moddescription");
    descriptionDiv.setAttribute("style", "max-width:560px; width:560px");
    description = "";

    if (structure.type.indexOf("wonder") != -1) {
        description = structure.type + "<br>";
    } else {
    }

    description += structure.description;

    if (structure.prediction_description != "") {
        description += "<br>" + structure.prediction_description;
    }

    imagelink = document.getElementById("modicon");

    if (structure.type.indexOf("wonder") != -1) {
        imagelink.remove();
    } else {
        imagelink.setAttribute("src", "/aow4db/Icons/WorldStructures/" + a + ".png");
        imagelink.setAttribute("id", "modicon" + a);
        imagelink.setAttribute("style", "background-image: none");
    }
    descriptionDiv.innerHTML = "";
    if (structure.type.indexOf("Ancient") != 1) {
        descriptionDiv.innerHTML +=
            "Combat Enchantments depend on story event choices when entering the Ancient Wonder. <br><br>";
    }
    unitTypesDiv = document.getElementById("affectUnitTypes");

    unitTypesDiv.setAttribute("style", "float: left;display: grid;grid-template-columns: 200px 200px;font-size: 15px;");
    FindCombatEnchantment(a);

    if ("unit_unlocks" in structure) {
        description += "<br>Rally Units:<br>";
        for (var x = 0; x < structure.unit_unlocks.length; x++) {
            var div = document.createElement("DIV");
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
    unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);

    descriptionDiv.innerHTML += description;

    descriptionDiv.setAttribute("id", "modicon" + a);

    preview = document.getElementById("structurepreview");
    preview.setAttribute("src", "/aow4db/Icons/StructurePics/" + a + ".png");
    preview.setAttribute("id", "structurepreview" + a);

    tier = document.getElementById("modtier");

    tier.setAttribute("id", "modtier" + a);
    tier.innerHTML = "";

    cost = document.getElementById("modcost");

    var tomeOrigin = document.getElementById("originTome");
    var tomeOriginIcon = document.getElementById("originTomeIcon");
    tomeOrigin.setAttribute("id", "originTome" + a);
    tomeOriginIcon.setAttribute("id", "originTomeIcon" + a);

    cost.setAttribute("id", "modcost" + a);
    cost.innerHTML = "";
}

function FindCombatEnchantment(id) {
    var i = "";
    for (i in jsonCombatEnchantments) {
        if (jsonCombatEnchantments[i].origin_structure === id) {
            info = document.createElement("DIV");

            info.innerHTML =
                '<button type="button" class="collapsible"  onclick="SetUpCombatEnc()"> Combat Enchantment - ' +
                jsonCombatEnchantments[i].name +
                "</button>";
            var collapsibleC = document.createElement("DIV");
            collapsibleC.className = "combatEnchantment";

            var div = document.createElement("DIV");
            div.innerHTML =
                '<img style="float:left; height:80px; padding:10px" src="/aow4db/Icons/CombatEnchantments/' +
                jsonCombatEnchantments[i].id +
                '.png"><p style="color: #aa84f6;>' +
                '<span style="font-size=20px;">' +
                jsonCombatEnchantments[i].name.toUpperCase() +
                "</p>" +
                "</br>" +
                jsonCombatEnchantments[i].description;

            collapsibleC.append(div);
            info.append(collapsibleC);
            descriptionDiv.append(info);
        }
    }
}

function ShowDestinyTraits() {
    var modName,
        description,
        cost,
        type,
        tier,
        j,
        nameString = "";
    var found = false;

    for (j in jsonDestiny.traits) {
        a = jsonDestiny.traits[j].id;
        var doc = document.getElementById("dataHolder");

        var iDiv = spell_card_template.content.cloneNode(true);
        doc.appendChild(iDiv);

        modName = document.getElementById("modname");
        nameString = "";
        nameString = jsonDestiny.traits[j].name.toUpperCase();

        modName.innerHTML = nameString;
        // backtracktome

        modName.setAttribute("id", "modname" + a);
        modName.className = "mod_name";
        descriptionDiv = document.getElementById("moddescription");
        description = "<hr> Trigger: <br>";

        description += jsonDestiny.traits[j].trigger;

        imagelink = document.getElementById("modicon");

        if (a.startsWith("_")) {
            a = a.replace("_", "");
        }

        imagelink.setAttribute("src", "/aow4db/Icons/EmpireProgressionIcons/" + a + ".png");
        imagelink.setAttribute("id", "modicon" + a);
        imagelink.setAttribute("style", "background-image: none");
        descriptionDiv.innerHTML = description;
        descriptionDiv.setAttribute("id", "modicon" + a);
        descriptionDiv.setAttribute("style", "max-width: 380px");

        unitTypesDiv = document.getElementById("affectUnitTypes");
        unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);

        descriptionDiv.innerHTML += "<br><br>Effect: <br>";
        var l = 0;
        for (l in jsonDestiny.traits[j].gains) {
            var div = document.createElement("DIV");
            div.innerHTML = "<bullet>" + jsonDestiny.traits[j].gains[l].description + "</bullet>";
            descriptionDiv.appendChild(div);
        }

        tier = document.getElementById("modtier");

        tier.setAttribute("id", "modtier" + a);
        tier.innerHTML = "";

        cost = document.getElementById("modcost");

        cost.innerHTML = jsonDestiny.traits[j].category;

        cost.setAttribute("id", "modcost" + a);

        found = true;
    }
}

function showDestinyTrait(trait) {
    var modName,
        description,
        cost,
        type,
        tier,
        j,
        nameString = "";
    var found = false;

    for (j in jsonDestiny.traits) {
        if (trait === jsonDestiny.traits[j].id) {
            a = jsonDestiny.traits[j].id;

            modName = document.getElementById("modname");
            nameString = "";
            nameString = jsonDestiny.traits[j].name.toUpperCase();
            nameString += "<br>" + jsonDestiny.traits[j].category;

            modName.innerHTML = nameString;
            // backtracktome

            modName.setAttribute("id", "modname" + a);
            modName.className = "mod_name";
            descriptionDiv = document.getElementById("moddescription");
            description = "Trigger: <br>";

            description += jsonDestiny.traits[j].trigger;

            imagelink = document.getElementById("modicon");

            if (a.startsWith("_")) {
                a = a.replace("_", "");
            }

            imagelink.setAttribute("src", "/aow4db/Icons/EmpireProgressionIcons/" + a + ".png");
            imagelink.setAttribute("id", "modicon" + a);
            imagelink.setAttribute("style", "background-image: none");
            descriptionDiv.innerHTML = description;
            descriptionDiv.setAttribute("id", "modicon" + a);
            descriptionDiv.setAttribute("style", "max-width: 380px");

            unitTypesDiv = document.getElementById("affectUnitTypes");
            unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);

            descriptionDiv.innerHTML += "<br><br>Effect: <br>";
            var l = 0;
            for (l in jsonDestiny.traits[j].gains) {
                var div = document.createElement("DIV");
                div.innerHTML = "<bullet>" + jsonDestiny.traits[j].gains[l].description + "</bullet>";
                descriptionDiv.appendChild(div);
            }

            tier = document.getElementById("modtier");

            tier.setAttribute("id", "modtier" + a);
            tier.innerHTML = "";

            cost = document.getElementById("modcost");
            cost.innerHTML = "";

            cost.setAttribute("id", "modcost" + a);

            found = true;
        }
    }
}

function showEmpireTree(a) {
    var modName,
        description,
        cost,
        type,
        tier,
        j,
        nameString = "";
    var found = false;

    for (j in jsonEmpire) {
        if (a === jsonEmpire[j].id) {
            modName = document.getElementById("modname");
            nameString = "";
            nameString = jsonEmpire[j].name.toUpperCase();
            nameString += "<br>" + jsonEmpire[j].category;

            modName.innerHTML = nameString;
            // backtracktome

            modName.setAttribute("id", "modname" + a);
            modName.className = "mod_name";
            descriptionDiv = document.getElementById("moddescription");
            description = "<hr>";

            description += jsonEmpire[j].description;

            imagelink = document.getElementById("modicon");

            if (a.startsWith("_")) {
                a = a.replace("_", "");
            }

            imagelink.setAttribute("src", "/aow4db/Icons/EmpireProgressionIcons/" + a + ".png");
            imagelink.setAttribute("id", "modicon" + a);
            descriptionDiv.innerHTML = description;
            descriptionDiv.setAttribute("id", "modicon" + a);

            unitTypesDiv = document.getElementById("affectUnitTypes");
            unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);

            tier = document.getElementById("modtier");

            tier.setAttribute("id", "modtier" + a);
            tier.innerHTML = "XP required: " + jsonEmpire[j].required_xp + jsonEmpire[j].required_affinity;

            cost = document.getElementById("modcost");

            cost.setAttribute("id", "modcost" + a);
            cost.innerHTML = "Cost: " + jsonEmpire[j].cost;

            found = true;
        }
    }
    if (found === false) {
        console.log("Couldn't find mod: " + a);
    }
}

function GetCostUnit(id) {
    var i = 0;
    for (i in jsonUnits) {
        if (id === jsonUnits[i].id) {
            return jsonUnits[i].cost;
        }
    }
}

function showUnitUnlock(a) {
    var modName,
        description,
        cost,
        type,
        tier,
        j = "";
    var found = false;

    modName = document.getElementById("modname");
    modName.innerHTML = a.name.toUpperCase();
    modName.setAttribute("id", "modname" + a);
    descriptionDiv = document.getElementById("moddescription");

    description = "<hr>" + a.description;

    imagelink = document.getElementById("modicon");

    unitTypesDiv = document.getElementById("affectUnitTypes");

    if (a.name === "Young Dragon") {
        var alldragons = ["young_fire_dragon", "young_frost_dragon", "young_obsidian_dragon", "young_golden_dragon"];
        var i = "";
        for (i in alldragons) {
            var div = document.createElement("DIV");
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

        unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);
    } else {
        var div = document.createElement("DIV");
        div.innerHTML =
            '<a href ="/aow4db/HTML/Units.html?unit=' +
            a.unit_slug +
            '" target="_blank">' +
            GetUnitTierAndName(a.unit_slug) +
            "</a>" +
            "</bullet>";
        unitTypesDiv.appendChild(div);

        unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);
    }

    imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + a.unit_slug + ".png");
    imagelink.setAttribute("id", "modicon" + a);
    descriptionDiv.innerHTML = description;
    descriptionDiv.setAttribute("id", "modicon" + a);

    tier = document.getElementById("modtier");

    tier.innerHTML = "<unit></unit> " + a.type;

    modName.innerHTML += '<span style="color:white;font-size:15px">  Tier ' + romanize(a.tier) + "</span>";

    tier.setAttribute("id", "modtier" + a);

    cost = document.getElementById("modcost");
    cost.innerHTML = "Recruit Cost: " + GetCostUnit(a.unit_slug);

    cost.setAttribute("id", "modcost" + a);

    var upkeep = document.getElementById("modupkeep");

    upkeep.innerHTML = "";
    upkeep.setAttribute("id", "modupkeep" + a.unit_slug);

    found = true;
}

function showSpell(a, showOrigin) {
    var modName,
        description,
        cost,
        type,
        tier,
        modCard = "";
    var found = false;
    for (let j = jsonSpells.length - 1; j >= 0; j--) {
        if (a === jsonSpells[j].id) {
            modCard = document.getElementById("spell_card");
            modCard.setAttribute("id", "spell_card" + a);
            modName = document.getElementById("modname");
            modName.innerHTML = jsonSpells[j].name.toUpperCase();
            modName.setAttribute("id", "modname" + a);
            description = "<hr>";
            descriptionDiv = document.getElementById("moddescription");

            var upkeep = document.getElementById("modupkeep");
            if ("upkeep" in jsonSpells[j]) {
                var upkeep = document.getElementById("modupkeep");
                upkeep.innerHTML = "Upkeep: " + jsonSpells[j].upkeep;
            }
            upkeep.setAttribute("id", "modupkeep" + a);

            description += jsonSpells[j].description.replaceAll("<bulletlist></bullet>", "<bulletlist>");
            description = description.replaceAll("</bullet></bulletlist>", "</bullet></bullet></bulletlist>");
            description = description.replaceAll("<br></br>", "<br>");

            unitTypesDiv = document.getElementById("affectUnitTypes");

            if (jsonSpells[j].enchantment_requisites != undefined) {
                description += "<br><greenText>Affected Unit Types: </greenText><br>";
            }
            var l = 0;
            for (l in jsonSpells[j].enchantment_requisites) {
                var div = document.createElement("DIV");
                div.setAttribute("style", "margin-right: 20px;");
                div.innerHTML = "<bullet>" + jsonSpells[j].enchantment_requisites[l].requisite + "</bullet>";
                unitTypesDiv.appendChild(div);
            }

            if ("summoned_units" in jsonSpells[j]) {
                description += "<br>Summoned Units:<br>";
                var x = 0;
                for (x in jsonSpells[j].summoned_units) {
                    var div = document.createElement("DIV");
                    div.setAttribute("style", "margin-right: 20px;");
                    div.innerHTML =
                        '<a href="/aow4db/HTML/Units.html?unit=' +
                        jsonSpells[j].summoned_units[x].slug +
                        '" target="_blank">' +
                        GetUnitTierAndName(jsonSpells[j].summoned_units[x].slug) +
                        "</a>";
                    unitTypesDiv.appendChild(div);
                }
            }

            unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);

            descriptionDiv.innerHTML = description;
            if (
                a === "summon_wild_animal" ||
                a === "summon_greater_animal" ||
                a === "awaken_the_forest" ||
                a === "demonic_summoning" ||
                a === "raise_undead_army"
            ) {
                // extra info

                info = document.createElement("DIV");
                info.innerHTML =
                    '<button type="button" class="collapsible"  onclick="SetUpSpawnTable()">Spawn Chances</button>';
                var collapsibleC = document.createElement("DIV");
                collapsibleC.classList = "content";

                for (let index = 0; index < jsonSpawnTables.length; index++) {
                    if (jsonSpawnTables[index].id == a) {
                        for (let j = 0; j < jsonSpawnTables[index].categories.length; j++) {
                            var div = ConvertSpawnTable(jsonSpawnTables[index].categories[j].table);
                            collapsibleC.append(div);
                        }
                    }
                }

                info.append(collapsibleC);
                descriptionDiv.append(info);
            }

            descriptionDiv.setAttribute("id", "moddescription" + a);
            //type = document.getElementById("modtype");
            //type.innerHTML = "Mod Type: " + jsonSpells[j].type;
            //type.setAttribute("id", "modtype" + a);
            tier = document.getElementById("modtier");
            tier.innerHTML = jsonSpells[j].spellType;
            tier.setAttribute("id", "modtier" + a);

            cost = document.getElementById("modcost");
            cost.innerHTML = "Cost: " + jsonSpells[j].casting_cost;

            if (jsonSpells[j].tactical === true) {
                cost.innerHTML += " " + jsonSpells[j].operation_point_cost + "<casttactical></casttactical>";
            } else {
                cost.innerHTML += " " + jsonSpells[j].operation_point_cost + "<caststrategic></caststrategic>";
            }
            cost.setAttribute("id", "modcost" + a);

            imagelink = document.getElementById("modicon");

            var imageLinkName = "";
            if (jsonSpells[j].icon != undefined) {
                imageLinkName = jsonSpells[j].icon;
            } else {
                imageLinkName = jsonSpells[j].id;
            }

            if (incorrectIconOverrideList.includes(jsonSpells[j].id)) {
                imageLinkName += "2";
            }
            imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + imageLinkName + ".png");
            imagelink.setAttribute("id", "modicon" + a);
            var tierSpell = backtraceTomeOriginAndTier(jsonSpells[j].id, showOrigin);

            if (tierSpell != undefined) {
                var splitspell = tierSpell.split(",");
                modName.innerHTML +=
                    '<span class="spell_tier" style="color:white;font-size:15px">  Tier ' +
                    romanize(splitspell[0]) +
                    "</span>";
                if ("DLC" in jsonSpells[j] && showOrigin) {
                    var newDivForMount = AddDLCTag(jsonSpells[j].DLC);
                    modName.append(newDivForMount);
                }
            }

            if (showOrigin === true) {
                var tomeOrigin = document.getElementById("originTome");
                tomeOrigin.setAttribute("id", "originTome" + jsonSpells[j].id);
                var tomeOriginIcon = document.getElementById("originTomeIcon");
                tomeOriginIcon.setAttribute("id", "originTomeIcon" + jsonSpells[j].id);
            }

            found = true;
            return modCard;
            //break;
        }
    }
    if (found === false) {
        console.log("Couldn't find mod: " + a);
    }
}

function ConvertSpawnTable(input) {
    const entries = input.split(",");

    const bulletListName = entries.shift(); // Get the first entry as the bullet list name

    // Calculate the percentages for each entry
    const entryCounts = {};
    for (const entry of entries) {
        entryCounts[entry] = (entryCounts[entry] || 0) + 1;
    }

    const percentages = entries.map((entry) => {
        const percentage = (entryCounts[entry] / entries.length) * 100;
        return {
            entry,
            percentage
        };
    });

    // Sort the percentages in descending order
    percentages.sort((a, b) => b.percentage - a.percentage);

    // Create a bullet list for the unique entries
    const uniqueEntries = [];
    const bulletList = document.createElement("DIV");

    bulletList.innerHTML = '<bulletList><span class="Test">' + bulletListName + "</span>";

    for (const { entry, percentage } of percentages) {
        const itemText = entry.replace(/_/g, " "); // Replace underscores with spaces

        if (!uniqueEntries.includes(itemText)) {
            uniqueEntries.push(itemText);
            bulletList.innerHTML += "<bullet>" + `${percentage.toFixed(0)}% - ${itemText}` + "</bullet>";
        }
    }
    bulletList.innerHTML += "</bulletList>";
    return bulletList;
}

function FindFormUnits() {
    var unitsList = [];
    var i = 0;
    for (i in jsonUnits) {
        /* if (jsonUnits[i].culture_name != undefined) {
            if (!isInArray(unitsList, jsonUnits[i].id)) {
                unitsList.push(jsonUnits[i]);
            }
        }*/
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
    var splitArrays = [];
    var currentArray = [];

    var skip = false;
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

    var sortedUnitListArray = [];

    var z = 0;
    for (z in splitArrays) {
        var unitsSorted = [];
        var x = 0;
        for (x in splitArrays[z]) {
            unitsSorted.push(splitArrays[z][x].id);
        }
        sortedUnitListArray.push(unitsSorted);
    }

    return sortedUnitListArray;
}

function FindUnitsWithSecondaryPassive(trait) {
    // need to find a way to check tiers as well
    var unitsList = [];
    var i = 0;
    for (i in jsonUnits) {
        var j = 0;
        for (j in jsonUnits[i].secondary_passives) {
            if (jsonUnits[i].secondary_passives[j].slug === trait) {
                if (!isInArray(unitsList, jsonUnits[i].id)) {
                    unitsList.push(jsonUnits[i]);
                }
            }
        }
    }

    // Sort the units list by tier
    unitsList.sort((a, b) => a.tier - b.tier);

    // Define the maximum length of each subarray
    const maxLength = 10;

    // Split the array into smaller arrays by tier
    var splitArrays = [];
    var currentArray = [];

    var skip = false;
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

    var sortedUnitListArray = [];

    var z = 0;
    for (z in splitArrays) {
        var unitsSorted = [];
        var x = 0;
        for (x in splitArrays[z]) {
            unitsSorted.push(splitArrays[z][x].id);
        }
        sortedUnitListArray.push(unitsSorted);
    }

    return sortedUnitListArray;
}

function showItem(a) {
    var modName,
        description,
        cost,
        type,
        tier = "";
    var found = false;
    var l = "";
    var j = "";
    var i = "";

    modName = document.getElementById("modname");
    modName.innerHTML = a.name.toUpperCase();

    modName.setAttribute("id", "modname" + a.id);
    descriptionDiv = document.getElementById("moddescription");

    descriptionDiv.innerHTML = "<hr>";
    if ("description" in a) {
        descriptionDiv.innerHTML += a.description + "<br>";
    }

    let lookup;
    if ("ability_slugs" in a) {
        l = 0;
        for (l in a.ability_slugs) {
            lookup = a.ability_slugs[l].slug;

            let spa = document.createElement("SPA");
            j = 0;
            for (j in jsonUnitAbilities) {
                if (jsonUnitAbilities[j].slug.indexOf(lookup) != -1) {
                    var abilityName = jsonUnitAbilities[j].name;

                    //   description = jsonUnitAbilities[j].description;

                    if ("accuracy" in jsonUnitAbilities[j]) {
                        let abilityReq = "";
                        if (jsonUnitAbilities[j].requisites === undefined) {
                            abilityReq = "";
                        } else {
                            abilityReq = jsonUnitAbilities[j].requisites;
                        }

                        let abilityMod = "";

                        let k = 0;
                        for (k in jsonUnitAbilities[j].modifiers) {
                            abilityName += "&#11049";
                            var name = jsonUnitAbilities[j].modifiers[k].name.replace("^N", "");
                            name = name.replace("^n", "");
                            abilityMod += "<bullet>" + name + "<br>";
                            abilityMod += jsonUnitAbilities[j].modifiers[k].description + "</bullet><br>";
                        }

                        // add notes

                        abilityNote = "";
                        let Cooldown = "";
                        let Once = "";
                        k = 0;
                        for (k in jsonUnitAbilities[j].notes) {
                            if (jsonUnitAbilities[j].notes[k] === undefined) {
                            } else {
                                if (jsonUnitAbilities[j].notes[k].note.indexOf("Cooldown") != -1) {
                                    Cooldown = jsonUnitAbilities[j].notes[k].note;
                                } else if (jsonUnitAbilities[j].notes[k].note.indexOf("once per") != -1) {
                                    Once = jsonUnitAbilities[j].notes[k].note;
                                } else {
                                    abilityNote += "<br>" + jsonUnitAbilities[j].notes[k].note;
                                }
                            }
                        }

                        var abilityEncht = "";
                        abilityRange = jsonUnitAbilities[j].range + "<range></range>";
                        abilityAcc = jsonUnitAbilities[j].accuracy + "<accuracy></accuracy>";

                        var abilityIconType = GetAbilityBackground(jsonUnitAbilities[j].damage);
                        spa = GetAbilityToolTip(
                            jsonUnitAbilities[j],
                            jsonUnitAbilities[j].damage,
                            abilityName,
                            abilityIconType,
                            abilityAcc,
                            abilityRange,
                            abilityMod,
                            abilityEncht,
                            abilityNote,
                            abilityReq,
                            Cooldown,
                            Once
                        );
                    } else {
                        spa = CreatePassiveSlotToolTip(
                            jsonUnitAbilities[j].icon,
                            jsonUnitAbilities[j].name,
                            jsonUnitAbilities[j].description
                        );
                    }

                    spa.className = "itemAbility";

                    spa.setAttribute("style", "width: 450px");

                    found = true;

                    descriptionDiv.append(spa);

                    break;
                }
            }
        }
    }

    if ("DLC" in a) {
        var dlctag = AddDLCTag(a.DLC);
        modName.append(dlctag);
    }

    unitTypesDiv = document.getElementById("affectUnitTypes");
    unitTypesDiv.setAttribute("id", "affectUnitTypes" + a.id);

    var div = document.createElement("DIV");
    i = 0;
    for (i in a.disabled_slots) {
        var div = document.createElement("DIV");
        div.innerHTML = "&#11049" + a.disabled_slots[i].slot_name;
        unitTypesDiv.appendChild(div);
    }
    if (a.disabled_slots.length > 0) {
        descriptionDiv.innerHTML += "Disabled slots: <br>";
    }

    descriptionDiv.setAttribute("id", "moddescription" + a.id);
    //type = document.getElementById("modtype");
    //type.innerHTML = "Mod Type: " + jsonSpells[j].type;
    //type.setAttribute("id", "modtype" + a);
    tier = document.getElementById("spell_tier");
    tier.innerHTML = a.tier;
    tier.setAttribute("id", "spell_tier" + a.id);

    cost = document.getElementById("modcost");
    cost.innerHTML = a.slot;

    cost.setAttribute("id", "modcost" + a.id);

    imagelink = document.getElementById("modicon");
    imagelink.remove();

    var tomeOriginIcon = document.getElementById("originTomeIcon");
    tomeOriginIcon.setAttribute("src", "/aow4db/Icons/UnitIcons/" + a.icon + ".png");
    // tomeOriginIcon.setAttribute("height", "130px");
    //  tomeOriginIcon.setAttribute("style", "margin-left:40px");
    tomeOriginIcon.setAttribute("id", "modicon" + a.id);
}

function showTraitSetup(currentTrait) {
    modName = document.getElementById("modname");
    modName.innerHTML = currentTrait.name.toUpperCase();

    modName.setAttribute("id", "modname" + currentTrait.id);
    descriptionDiv = document.getElementById("moddescription");

    if ("DLC" in currentTrait) {
        var newDivForMount = document.createElement("DIV");
        newDivForMount.className = "mountToolTip";

        imag = document.createElement("IMG");
        imag.setAttribute("height", "30px");

        spa = document.createElement("SPAN");

        if (currentTrait.DLC == "EMPIRESANDASHES ") {
            imag.setAttribute("src", "/aow4db/Icons/Text/EmpiresAshes.png");
            spa.innerHTML = "Part of the Empires & Ashes DLC";
        } else if (currentTrait.DLC == "DRAGONLORDS ") {
            imag.setAttribute("src", "/aow4db/Icons/Text/DragonDawn.png");
            spa.innerHTML = "Part of the Dragon Dawn DLC";
        } else if (currentTrait.DLC == "PRIMALFURY ") {
            imag.setAttribute("src", "/aow4db/Icons/Text/PrimalFury.png");
            spa.innerHTML = "Part of the Primal Fury DLC";
        } else if (currentTrait.DLC == "ELDRITCHREALMS ") {
            imag.setAttribute("src", "/aow4db/Icons/Text/EldritchRealms.png");
            spa.innerHTML = "Part of the Eldritch Realms DLC";
        } else if (currentTrait.DLC == "HERALDOFGLORY ") {
            imag.setAttribute("src", "/aow4db/Icons/Text/herald_of_glory.png");
            spa.innerHTML = "Part of the Herald of Glory DLC";
        } else if (currentTrait.DLC == "WAYSOFWAR ") {
            imag.setAttribute("src", "/aow4db/Icons/Text/waysofwar.png");
            spa.innerHTML = "Part of the Ways of War DLC";
        }

        newDivForMount.appendChild(imag);

        addTooltipListeners(newDivForMount, spa);
        newDivForMount.setAttribute(
            "style",
            "text-transform: none;width: 1px;left: -32px;position: relative;margin-left: 30px;height: 20px;float: left;"
        );
        // get position of button

        modName.append(newDivForMount);
    }

    descriptionDiv.innerHTML = "";

    unitTypesDiv = document.getElementById("affectUnitTypes");
    unitTypesDiv.setAttribute("id", "affectUnitTypes" + currentTrait.id);

    var div = document.createElement("DIV");

    // build up description:

    if ("lore_description" in currentTrait) {
        descriptionDiv.innerHTML += '<hr> <span class="loreText">' + currentTrait.lore_description + "</span>";
    }

    if ("effect_descriptions" in currentTrait) {
        descriptionDiv.innerHTML += '<br><br><span class="mod_name">EFFECTS: </span><bulletlist>';
        var k = "";
        for (k in currentTrait.effect_descriptions) {
            descriptionDiv.innerHTML += "<bullet>" + currentTrait.effect_descriptions[k].name + "</bullet>";
        }
        descriptionDiv.innerHTML += "</bulletlist>";
    }

    if ("description" in currentTrait) {
        descriptionDiv.innerHTML += currentTrait.description;
    }

    if ("starting_bonuses" in currentTrait) {
        descriptionDiv.innerHTML += '<br><br><span class="mod_name">STARTING BONUS: </span><bulletlist>';
        var k = "";
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
        var k = "";
        for (k in currentTrait.incompatible_society_traits) {
            descriptionDiv.innerHTML += "<bullet>" + currentTrait.incompatible_society_traits[k].name + "</bullet>";
        }
        descriptionDiv.innerHTML += "</bulletlist>";
    }

    descriptionDiv.setAttribute("id", "moddescription" + currentTrait.id);

    tier = document.getElementById("modtier");
    tier.innerHTML = "";
    if ("affinity" in currentTrait) {
        var splitAff = currentTrait.affinity.split(",");
        var j = "";
        for (j in splitAff) {
            tier.innerHTML += splitAff[j];
        }
    }
    tier.setAttribute("id", "modtier" + currentTrait.id);

    cost = document.getElementById("modcost");
    cost.innerHTML = "";
    if (currentTrait.type == "form") {
        cost.innerHTML = "Form- " + currentTrait.point_cost + " Points";
    } else if (currentTrait.type == "society") {
        cost.innerHTML = "Society";
    }

    cost.setAttribute("id", "modcost" + currentTrait.id);

    imagelink = document.getElementById("modicon");
    var iconLink = currentTrait.icon;
    if (iconLink.startsWith("_")) {
        iconLink = iconLink.split("_").slice(1).join("_");
    }

    imagelink.setAttribute("src", "/aow4db/Icons/FactionCreation/" + iconLink + ".png");
    imagelink.setAttribute("style", "background-image:none");
    imagelink.setAttribute("id", "modicon" + currentTrait.id);

    var tomeOriginIcon = document.getElementById("originTomeIcon");

    tomeOriginIcon.setAttribute("id", "modicon" + currentTrait.id);
}

function showTrait(a) {
    var modName,
        description,
        cost,
        type,
        tier = "";
    var found = false;
    var i = "";
    for (i in jsonFactionCreation2) {
        if (jsonFactionCreation2[i].id === a) {
            var currentTrait = jsonFactionCreation2[i];

            showTraitSetup(currentTrait);
        }
    }
    for (i in jsonFactionCreation) {
        if (jsonFactionCreation[i].id === a) {
            var currentTrait = jsonFactionCreation[i];
            showTraitSetup(currentTrait);
        }
    }
}

function showHeroTrait(a) {
    var modName,
        description,
        cost,
        type,
        tier = "";
    var found = false;
    var i = "";
    for (i in jsonHeroAmbitions) {
        if (jsonHeroAmbitions[i].id === a) {
            let thisAmbition = jsonHeroAmbitions[i];

            modName = document.getElementById("modname");
            modName.innerHTML = thisAmbition.name.toUpperCase();

            modName.setAttribute("id", "modname" + a);
            descriptionDiv = document.getElementById("moddescription");

            descriptionDiv.innerHTML = "";
            if (thisAmbition.available_to_rulers == false) {
                descriptionDiv.innerHTML =
                    "<hr>" + "<helpText>Only Available to Heroes</helpText><br><br>" + thisAmbition.screen_description;
            } else {
                descriptionDiv.innerHTML = "<hr>" + thisAmbition.screen_description;
            }

            descriptionDiv.setAttribute("id", "moddescription" + a);
            unitTypesDiv = document.getElementById("affectUnitTypes");

            unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);

            tier = document.getElementById("modtier");
            tier.innerHTML = "";

            tier.setAttribute("id", "modtier" + a);

            cost = document.getElementById("modcost");

            cost.setAttribute("id", "modcost" + a);

            imagelink = document.getElementById("modicon");
            imagelink.setAttribute("src", "/aow4db/Icons/AmbitionIcons/" + thisAmbition.icon + ".png");
            imagelink.setAttribute("style", "background-image:none");
            imagelink.setAttribute("id", "modicon" + a);

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
                            thisAmbition.ambitions[j].reward_properties[f].name.toUpperCase() +
                            "</span><hr><span>" +
                            thisAmbition.ambitions[j].reward_properties[f].screen_description +
                            "</span>";
                    }

                    dis.innerHTML +=
                        "<bulletlist><yellowText>Major Ambition</yellowText><bullet>" +
                        thisAmbition.ambitions[j].screen_description +
                        "</bullet><bullet>Reward: " +
                        thisAmbition.ambitions[j].reward_renown +
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
                        thisAmbition.ambitions[j].screen_description +
                        "<br></bullet><bullet>Reward: " +
                        thisAmbition.ambitions[j].reward_renown +
                        "<renown></renown> Renown(repeatable)</bullet></bulletlist>";
                    unitTypesDiv.appendChild(dis);
                }
            }

            var tomeOriginIcon = document.getElementById("originTomeIcon");

            tomeOriginIcon.setAttribute("id", "modicon" + a.id);
            found = true;
        }
    }
    if (found == false) {
        console.log("Didn't find :" + a);
    }
}

function showHeroGov(a) {
    var modName,
        description,
        cost,
        type,
        tier = "";
    var found = false;
    var i = "";
    for (i in jsonHeroGovernance) {
        if (jsonHeroGovernance[i].id === a) {
            let thisGovernance = jsonHeroGovernance[i];
            modName = document.getElementById("modname");
            modName.innerHTML = thisGovernance.name.toUpperCase();

            modName.setAttribute("id", "modname" + a);
            descriptionDiv = document.getElementById("moddescription");

            descriptionDiv.innerHTML = "";

            descriptionDiv.innerHTML = "<hr>" + thisGovernance.screen_description;

            descriptionDiv.setAttribute("id", "moddescription" + a);
            unitTypesDiv = document.getElementById("affectUnitTypes");

            unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);

            tier = document.getElementById("modtier");
            tier.innerHTML = "";

            tier.setAttribute("id", "modtier" + a);

            cost = document.getElementById("modcost");

            cost.setAttribute("id", "modcost" + a);

            imagelink = document.getElementById("modicon");
            imagelink.setAttribute(
                "src",
                "/aow4db/Icons/GovernanceIcons/" + thisGovernance.icon.toLowerCase() + ".png"
            );
            imagelink.setAttribute("style", "background-image:none");
            imagelink.setAttribute("id", "modicon" + a);

            var tomeOriginIcon = document.getElementById("originTomeIcon");

            tomeOriginIcon.setAttribute("id", "modicon" + a.id);
            found = true;
        }
    }
    if (found == false) {
        console.log("Didn't find :" + a);
    }
}

function transformString(inputString) {
    // Remove the word "Property"
    let transformedString = inputString.replace("Property", "");
    transformedString = transformedString.replace("/", ",");
    // Replace the specified words with the corresponding tags
    const replacements = {
        Astral: "<empirearcana></empirearcana>",
        Chaos: "<empirechaos></empirechaos>",
        Order: "<empireorder></empireorder>",
        Shadow: "<empireshadow></empireshadow>",
        Materium: "<empirematter></empirematter>",
        Elementum: "<empirematter></empirematter>",
        Nature: "<empirenature></empirenature>"
    };

    // Use a regular expression to replace all occurrences of the keys with the corresponding values
    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        transformedString = transformedString.replace(regex, value);
    }

    // Remove any extra spaces (especially around the removed "Property" word)
    transformedString = transformedString.trim();

    return transformedString;
}

function showSkill(a, checkInAbilities, icon_slug, category, level, group_name) {
    var modName,
        description,
        cost,
        type,
        tier = "";
    var found = false;
    var k = "";
    var j = "";

    modName = document.getElementById("modname");

    modName.innerHTML = a.name.toUpperCase();

    modName.setAttribute("id", "modname" + a.id);

    descriptionDiv = document.getElementById("moddescription");

    unitTypesDiv = document.getElementById("affectUnitTypes");

    descriptionDiv.setAttribute("id", "moddescription" + a.id);
    descriptionDiv.innerHTML = "";

    unitTypesDiv.setAttribute("id", "affectUnitTypes" + a.id);

    if (a.id === "summon_elemental") {
        descriptionDiv.innerHTML += "<br>Summoned Units:";
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "tide_spirit" +
            '" target="_blank">' +
            GetUnitTierAndName("tide_spirit") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "storm_spirit" +
            '" target="_blank">' +
            GetUnitTierAndName("storm_spirit") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "magma_spirit" +
            '" target="_blank">' +
            GetUnitTierAndName("magma_spirit") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "snow_spirit" +
            '" target="_blank">' +
            GetUnitTierAndName("snow_spirit") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "stone_spirit" +
            '" target="_blank">' +
            GetUnitTierAndName("stone_spirit") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
    }

    if (a.id === "summon_animal") {
        descriptionDiv.innerHTML += "<br>Summoned Units:";
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "unicorn" +
            '" target="_blank">' +
            GetUnitTierAndName("unicorn") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "nightmare" +
            '" target="_blank">' +
            GetUnitTierAndName("nightmare") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "thunderbird" +
            '" target="_blank">' +
            GetUnitTierAndName("thunderbird") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "goretusk_matriarch" +
            '" target="_blank">' +
            GetUnitTierAndName("goretusk_matriarch") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "caustic_worm" +
            '" target="_blank">' +
            GetUnitTierAndName("caustic_worm") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
    }

    if (a.id === "summon_undead") {
        descriptionDiv.innerHTML += "<br>Summoned Units:";

        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "corrupt_soul" +
            '" target="_blank">' +
            GetUnitTierAndName("corrupt_soul") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);

        var div = document.createElement("DIV");
        div.innerHTML =
            "<bullet>" +
            '<a href="/aow4db/HTML/Units.html?unit=' +
            "banshee" +
            '" target="_blank">' +
            GetUnitTierAndName("banshee") +
            "</a>" +
            "</bullet>";
        unitTypesDiv.append(div);
    }

    //type = document.getElementById("modtype");
    //type.innerHTML = "Mod Type: " + jsonSpells[j].type;
    //type.setAttribute("id", "modtype" + a);
    tier = document.getElementById("spell_tier");
    tier.innerHTML = "";
    if (category != undefined) {
        tier.innerHTML += "<br>" + category + " - " + level;
        tier.innerHTML += "<br>" + group_name;
    }
    tier.setAttribute("id", "spell_tier" + a.id);

    cost = document.getElementById("modcost");
    cost.innerHTML = "";

    cost.setAttribute("id", "modcost" + a.id);

    imagelink = document.getElementById("modicon");
    if (a.type === "signature") {
        imagelink.className = "smallerIcon";
        imagelink.setAttribute("src", "/aow4db/Icons/UnitIcons/" + icon_slug + ".png");
        imagelink.setAttribute("id", "modicon" + a.id);

        cost.innerHTML = transformString(a.hero_property);
        // spa.setAttribute("style", "width: 360px");
    } else {
        imagelink.remove();
    }

    var id = FindHeroSkillOrigin(a.id);

    if ("DLC" in a) {
        var newDivForMount = AddDLCTag(a.DLC);
        modName.append(newDivForMount);
    }

    var tomeOrigin = document.getElementById("originTome");
    tomeOrigin.setAttribute("id", "originTome" + a.id);
    var tomeOriginIcon = document.getElementById("originTomeIcon");
    tomeOriginIcon.setAttribute("id", "originTomeIcon" + a.id);

    if (a.id.indexOf("_transformation") != -1 || a.id.indexOf("_aspect") != -1) {
        // get position of button

        var newDivForMount = AddDLCTag();
        modName.append(newDivForMount);
    }

    if (checkInAbilities != "") {
        var j = 0;
        for (j in jsonUnitAbilities) {
            var k = 0;
            for (k in a.abilities) {
                if (jsonUnitAbilities[j].slug === a.abilities[k].slug) {
                    var abilityName = jsonUnitAbilities[j].name;

                    if ("accuracy" in jsonUnitAbilities[j]) {
                        if (jsonUnitAbilities[j].requisites === undefined) {
                            var abilityReq = "";
                        } else {
                            var abilityReq = jsonUnitAbilities[j].requisites;
                        }

                        var abilityMod = "";

                        var l = 0;
                        for (l in jsonUnitAbilities[j].modifiers) {
                            abilityName += "&#11049";
                            abilityMod += "<bullet>" + jsonUnitAbilities[j].modifiers[l].name + "<br>";
                            abilityMod += jsonUnitAbilities[j].modifiers[l].description + "</bullet><br>";
                        }

                        // add notes

                        abilityNote = "";
                        var Cooldown = "";
                        var Once = "";
                        var l = 0;
                        for (l in jsonUnitAbilities[j].notes) {
                            if (jsonUnitAbilities[j].notes[l] === undefined) {
                            } else {
                                if (jsonUnitAbilities[j].notes[l].note.indexOf("Cooldown") != -1) {
                                    Cooldown = jsonUnitAbilities[j].notes[l].note;
                                } else if (jsonUnitAbilities[j].notes[l].note.indexOf("once per") != -1) {
                                    Once = jsonUnitAbilities[j].notes[l].note;
                                } else {
                                    abilityNote += "<br>" + jsonUnitAbilities[j].notes[l].note;
                                }
                            }
                        }

                        var abilityEncht = "";

                        abilityRange = jsonUnitAbilities[j].range + "<range></range>";
                        abilityAcc = jsonUnitAbilities[j].accuracy + "<accuracy></accuracy>";

                        var abilityIconType = GetAbilityBackground(jsonUnitAbilities[j].damage);
                        var spa = GetAbilityToolTip(
                            jsonUnitAbilities[j],
                            jsonUnitAbilities[j].damage,
                            abilityName,
                            abilityIconType,
                            abilityAcc,
                            abilityRange,
                            abilityMod,
                            abilityEncht,
                            abilityNote,
                            abilityReq,
                            Cooldown,
                            Once
                        );
                    } else {
                        var spa = CreatePassiveSlotToolTip(
                            jsonUnitAbilities[j].icon,
                            jsonUnitAbilities[j].name,
                            jsonUnitAbilities[j].description
                        );
                    }

                    spa.className = "itemAbility";
                    spa.setAttribute("style", "width:380px");
                    descriptionDiv.append(spa);

                    found = true;
                }
            }
        }
    } else {
        var j = 0;
        for (j in jsonHeroSkills) {
            if (jsonHeroSkills[j].id === a.id) {
                var spa = CreatePassiveSlotToolTip(
                    jsonHeroSkills[j].icon,
                    jsonHeroSkills[j].name,
                    jsonHeroSkills[j].description
                );
                spa.className = "itemAbility";
                descriptionDiv.append(spa);

                found = true;

                return;
            }
        }
    }
    for (var j = 0; j < jsonExtraAscendedInfo.length; j++) {
        if (jsonExtraAscendedInfo[j].id == a.id) {
            if ("extraspell" in jsonExtraAscendedInfo[j]) {
                var iDiv = spell_card_template.content.cloneNode(true);
                // Access the root element in the DocumentFragment
                var rootElement = iDiv.querySelector("*");

                // Apply the style to the root element
                if (rootElement) {
                    rootElement.style.left = "-40px";
                    rootElement.style.position = "relative";
                }
                descriptionDiv.appendChild(iDiv);
                showSpell(jsonExtraAscendedInfo[j].extraspell, false);
            }
            descriptionDiv.innerHTML += "Tome(s) Researched : " + jsonExtraAscendedInfo[j].description;
        }
    }
    if (found === false) {
        console.log("Couldn't find skill: " + a.id);
    }
}

function AddDLCTag(dlcname) {
    var newDivForMount = document.createElement("DIV");
    newDivForMount.className = "mountToolTip";

    imag = document.createElement("IMG");
    imag.setAttribute("height", "25px");

    spa = document.createElement("SPAN");
    if (dlcname == "DRAGONLORDS ") {
        imag.setAttribute("src", "/aow4db/Icons/Text/DragonDawn.png");
        spa.innerHTML = "Part of the Dragon Dawn DLC";
    }
    if (dlcname == "EMPIRESANDASHES ") {
        imag.setAttribute("src", "/aow4db/Icons/Text/EmpiresAshes.png");
        spa.innerHTML = "Part of the Empires & Ashes DLC";
    }
    if (dlcname == "PRIMALFURY ") {
        imag.setAttribute("src", "/aow4db/Icons/Text/PrimalFury.png");
        spa.innerHTML = "Part of the Primal Fury DLC";
    }
    if (dlcname == "ELDRITCHREALMS ") {
        imag.setAttribute("src", "/aow4db/Icons/Text/EldritchRealms.png");
        spa.innerHTML = "Part of the Eldritch Realms DLC";
    }
    if (dlcname == "WAYSOFWAR ") {
        imag.setAttribute("src", "/aow4db/Icons/Text/waysofwar.png");
        spa.innerHTML = "Part of the Ways of War DLC";
    }
    if (dlcname == "HERALDOFGLORY ") {
        imag.setAttribute("src", "/aow4db/Icons/Text/heraldofglory.png");
        spa.innerHTML = "Part of the Herald of Glory DLC";
    }
    newDivForMount.appendChild(imag);

    addTooltipListeners(newDivForMount, spa);
    newDivForMount.setAttribute(
        "style",
        "text-transform: none;width: 1px;left: -32px;position: relative;margin-left: 30px;height: 20px;float: left;"
    );
    return newDivForMount;
}

function FindHeroSkillOrigin(id) {
    var j = 0;
    for (j in jsonTomes) {
        {
            if ("hero_skills" in jsonTomes[j]) {
                var k = 0;
                for (k in jsonTomes[j].hero_skills) {
                    if (jsonTomes[j].hero_skills[k].slug === id) {
                        var tomeOrigin = document.getElementById("originTome");
                        if ("affinities" in jsonTomes[j]) {
                            tomeOrigin.innerHTML = showAffinitySymbols(jsonTomes[j]) + "<br>";
                        }
                        tomeOrigin.innerHTML += romanize(jsonTomes[j].tier) + " - " + jsonTomes[j].name;
                        var tomeOriginIcon = document.getElementById("originTomeIcon");
                        tomeOriginIcon.setAttribute("src", "/aow4db/Icons/TomeIcons/" + jsonTomes[j].id + ".png");
                        var wrap = tomeOrigin.innerHTML;
                        tomeOrigin.innerHTML =
                            '<a href="/aow4db/HTML/Spells.html?tome=' +
                            jsonTomes[j].id +
                            '" target="_blank">' +
                            wrap +
                            "</a>";
                        return jsonTomes[j].id;
                    }
                }
            }
        }
    }
}

function backtraceTomeOriginAndTierForStructure(structure, showorigin) {
    var returning = "";
    var j = 0;
    for (j in jsonTomes) {
        var k = 0;
        for (k in jsonTomes[j].skills) {
            if (jsonTomes[j].skills[k].upgrade_slug === structure) {
                if (showorigin) {
                    var tomeOrigin = document.getElementById("originTome");
                    if ("affinities" in jsonTomes[j]) {
                        tomeOrigin.innerHTML = showAffinitySymbols(jsonTomes[j]);

                        tomeOrigin.innerHTML += "<br>";
                    }
                    tomeOrigin.innerHTML += romanize(jsonTomes[j].tier) + " - " + jsonTomes[j].name;
                    var tomeOriginIcon = document.getElementById("originTomeIcon");
                    tomeOriginIcon.setAttribute("src", "/aow4db/Icons/TomeIcons/" + jsonTomes[j].id + ".png");
                    var wrap = tomeOrigin.innerHTML;
                    tomeOrigin.innerHTML =
                        '<a href="/aow4db/HTML/Spells.html?tome=' +
                        jsonTomes[j].id +
                        '" target="_blank">' +
                        wrap +
                        "</a>";

                    returning = jsonTomes[j].id;
                }
            }
        }
    }
    return returning;
}

function uppercaseTextBetweenHyperlinks(str, elments) {
    const regex = /<hyperlink>(.*?)<\/hyperlink>/g;
    const replacedString = str.replace(regex, (match, p1) => `<hyperlink>${LookUpHyperLink(p1, elments)}</hyperlink>`);

    return replacedString;
}

function findDescriptionByName(name, nameElements) {
    for (let i = 0; i < nameElements.length; i++) {
        const nameElement = nameElements[i];
        const text = nameElement.innerText.trim().replace(/\[\w+\/\]/g, "");

        const modifiedStr = name.slice(0, -1);
        if (text.trim() === name.trim() || text.trim() === modifiedStr.trim()) {
            const parentElement = nameElement.parentElement;
            const prevElement = parentElement.previousElementSibling;
            const prevPrevElement = prevElement && prevElement.previousElementSibling;

            const nameText = parentElement.firstElementChild.innerText.trim();
            const descText = nameText.replace("@NAME", "@DESCRIPTION");

            if (prevElement && prevElement.querySelector(".src").innerText.trim() === descText) {
                return prevElement.querySelector(".tra").innerText.trim();
            } else if (prevPrevElement && prevPrevElement.querySelector(".src").innerText.trim() === descText) {
                return prevPrevElement.querySelector(".tra").innerText.trim();
            }
        }
    }

    return null;
}

function parseDescriptionWithHyperlink(string, elements) {
    var replacedText = string;

    replacedText = uppercaseTextBetweenHyperlinks(string, elements);

    return replacedText;
}

function replaceTagsWithString(str) {
    const regex = /<(\/?)([^>]+)>/g;
    const replacedString = str.replace(regex, "");

    return replacedString;
}

function InitializeLoca() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(savedHtmlContent, "text/html");

    const nameElements = doc.getElementsByClassName("tra");
    const nameLength = name.length;

    const elementsWithDescription = document.querySelectorAll('[id*="description"]');

    // Iterate over the matched elements
    elementsWithDescription.forEach(function (element) {
        // Check if element's innerHTML contains <hyperlink>
        if (element.innerHTML.includes("<hyperlink>")) {
            // Replace <hyperlink> with desired content

            element.innerHTML = parseDescriptionWithHyperlink(element.innerHTML, nameElements);
        }
    });
}

function LookUpHyperLink(str, elements, elementsLength) {
    var hyperlinkSpan = str;
    var description = "";
    // Example usage in a browser environment

    const noTagsName = replaceTagsWithString(str);

    description = findDescriptionByName(noTagsName, elements, elementsLength);

    if (description != null) {
        description = description.replace(/\[(\w+)\/?\]/g, "<$1></$1>");
        spa = document.createElement("SPAN");
        spa.className = "tooltiptext";

        spa.innerHTML =
            '<span style="font-size=20px; text-transform:uppercase; color:#deb887 ;">' +
            str +
            "</span> <br>" +
            description;
        hyperlinkSpan =
            '<span class="hyperlink" style="color:aliceblue">' +
            str +
            '<span class="tooltiphyperlink">' +
            spa.innerHTML +
            "</span>" +
            "</span>";
    }

    return hyperlinkSpan;
}

function backtraceTomeOriginAndTier(spell, showorigin) {
    if (spell === "create_bone_golem" && showorigin) {
        var tomeOrigin = document.getElementById("originTome");
        tomeOrigin.innerHTML = "<empireshadow></empireshadow><empireshadow></empireshadow> <br> II - Tome of Souls";

        var tomeOriginIcon = document.getElementById("originTomeIcon");
        tomeOriginIcon.setAttribute("src", "/aow4db/Icons/TomeIcons/tome_of_souls.png");
        var wrap = tomeOrigin.innerHTML;
        tomeOrigin.innerHTML = '<a href="/aow4db/HTML/Spells.html?tome=tome_of_souls" target="_blank">' + wrap + "</a>";
    } else {
        var j = 0;
        for (j in jsonTomes) {
            {
                var k = 0;
                for (k in jsonTomes[j].skills) {
                    if (jsonTomes[j].skills[k].spell_slug === spell) {
                        if (showorigin) {
                            var tomeOrigin = document.getElementById("originTome");
                            if ("affinities" in jsonTomes[j]) {
                                tomeOrigin.innerHTML = showAffinitySymbols(jsonTomes[j]);

                                tomeOrigin.innerHTML += "<br>";
                            }

                            tomeOrigin.innerHTML += romanize(jsonTomes[j].tier) + " - " + jsonTomes[j].name;

                            var tomeOriginIcon = document.getElementById("originTomeIcon");
                            tomeOriginIcon.setAttribute("src", "/aow4db/Icons/TomeIcons/" + jsonTomes[j].id + ".png");
                            var wrap = tomeOrigin.innerHTML;
                            tomeOrigin.innerHTML =
                                '<a href="/aow4db/HTML/Spells.html?tome=' +
                                jsonTomes[j].id +
                                '" target="_blank">' +
                                wrap +
                                "</a>";
                        }

                        return jsonTomes[j].skills[k].tier + "," + jsonTomes[j].id;
                    }

                    if (jsonTomes[j].skills[k].siege_project_slug === spell || jsonTomes[j].skills[k].name === spell) {
                        if (showorigin) {
                            var tomeOrigin = document.getElementById("originTome");
                            if ("affinities" in jsonTomes[j]) {
                                var affinitiesdual = jsonTomes[j].affinities.split(", ");

                                var allAffinity = "";
                                for (var i = 0; i < affinitiesdual.length; i++) {
                                    var affinities = affinitiesdual[i].split(" ");
                                    if (affinities[1] === 2) {
                                        allAffinity += affinities[0];
                                    }
                                    allAffinity += affinities[0];
                                }

                                tomeOrigin.innerHTML = allAffinity;

                                tomeOrigin.innerHTML += "<br>";
                            }

                            tomeOrigin.innerHTML += romanize(jsonTomes[j].tier) + " - " + jsonTomes[j].name;
                            var tomeOriginIcon = document.getElementById("originTomeIcon");
                            tomeOriginIcon.setAttribute("src", "/aow4db/Icons/TomeIcons/" + jsonTomes[j].id + ".png");
                            var wrap = tomeOrigin.innerHTML;
                            tomeOrigin.innerHTML =
                                '<a href="/aow4db/HTML/Spells.html?tome=' +
                                jsonTomes[j].id +
                                '" target="_blank">' +
                                wrap +
                                "</a>";
                        }

                        return jsonTomes[j].skills[k].tier + "," + jsonTomes[j].id;
                    }
                }
            }
        }
    }
}

function backtraceStructureToTomeNameAndTier(structure) {
    var array = [];
    var j = 0;
    for (j in jsonTomes) {
        if ("initial_upgrades" in jsonTomes[j]) {
            var k = 0;
            for (k in jsonTomes[j].initial_upgrades)
                if (structure.indexOf(jsonTomes[j].initial_upgrades[k].upgrade_slug) != -1) {
                    if (structure.indexOf("wildlife_sanctuary") != -1) {
                        array.push("2 <empirenature></empirenature> Tome of Beasts");
                    } else {
                        if ("affinities" in jsonTomes[j]) {
                            array.push(
                                ClearAffinityExtraTags(duplicateTags(jsonTomes[j].affinities)).replaceAll(",", "") +
                                    "<br> " +
                                    jsonTomes[j].name
                            );
                        } else {
                            array.push(jsonTomes[j].name);
                        }
                    }
                    if (structure.indexOf("wildlife_sanctuary") != -1) {
                        array.push(1);
                    } else {
                        array.push(jsonTomes[j].tier);
                    }

                    array.push(jsonTomes[j].id);
                    return array;
                }
        }
    }

    return "";
}

function backtraceTomeNameAndTier(spell) {
    var j = 0;
    for (j in jsonTomes) {
        {
            var k = 0;
            for (k in jsonTomes[j].skills) {
                if (jsonTomes[j].skills[k].spell_slug === spell) {
                    return jsonTomes[j];
                }
            }
        }
    }
    return "";
}

function addAbilityList(a) {
    var dam = "";
    var j = 0;
    for (j in jsonUnitAbilities) {
        if (a === jsonUnitAbilities[j].slug) {
            if (jsonUnitAbilities[j].damage) {
                dam = jsonUnitAbilities[j].damage;
            }
            return jsonUnitAbilities[j].name + dam + "<br>";
        }
    }
}

function addTypesList(a) {
    var dam = "";
    var j = 0;
    for (j in jsonUnitAbilities) {
        if (a === jsonUnitAbilities[j].slug) {
            return jsonUnitAbilities[j].name + "<br>";
        }
    }
}
