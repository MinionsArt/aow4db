const unlockableUnitsMapStructures = {
    wildlife_sanctuary: ["goretusk_piglet", "dread_spider_hatchling", "vampire_spider_hatchling", "razorback", "warg"],
    demon_gate: ["inferno_puppy", "gremlin", "inferno_hound", "chaos_eater"],
    wyvern_eyrie: ["fire_wyvern", "frost_wyvern", "gold_wyvern", "obsidian_wyvern"],
    accursed_shrine: ["accursed_ogre", "accursed_blade", "accursed_trickster"],
    shrine_of_prosperity: ["blessed_dragon", "radiant_guardian", "righteous_judge"]
};


function cleanTranslation(text) {
  if (!text) return text;

  return text
    // Remove ^fa{[1]}fn{[2]} style markers
    .replace(/\^fa\{\[\d+\]\}fn\{\[\d+\]\}/g, "")
    // Remove any ^ followed by a single letter (e.g. ^m, ^N, ^a)
    .replace(/\^[a-zA-Z]/g, "")
    // Clean up leftover spaces
    .trim();
}

const architectCultureUnits = ["surveyor", "cultivator", "earthbreaker", "guardian", "shademaker", "architect"];

const MountedSpecialList = [
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

const extraFormUnitsList = [
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
    "houndmaster",
    "geomancer",
    "paladin",
    "oracle", "pain_bringer", "blood_cultist"
];

const incorrectIconOverrideList = [
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

const extraAbilities = [];

const extraSkills = [
    {
        group_name: "Battlesaint - Hero Skill Group",
        icon: "0000048D000018CC",
        type: "normal",
        description: "This and adjecent friendly units gain 50% Morale Resistance",

        resid: 5222680234436,
        tree_name: "<classBattlesaint></classBattlesaint> Battlesaint",
        name: "Spiritual Guide",
        tree_pos_x: 350.0,
        tree_pos_y: 650.0,
        id: "hs_battlesaint_spiritual_guide",
        required_skills: [
            {
                resid: 5222680234415
            },
            {
                resid: 5222680234413
            }
        ]
    },
    {
  "group_name": "Warlock - Skill Group",
  "icon": "000004C000000B45",
  "type": "normal",
  "resid": 5222680234769,
  "tree_name": "<classWarlock></classWarlock> Warlock",
  "name": "Hexseeking Bolts",
  "tree_pos_x": 250.0,
  "tree_pos_y": 150.0,
  "id": "hs_warlock_hexseeking_bolts",
  "description": "Attacks and <hyperlink>Debuff</hyperlink> abilities against the target of Hex pact:<bulletlist><bullet>Always Hit.</bullet><bullet>Ignore 3 Status Resistance against the target of Hex Pact</bullet></bulletlist>",
  "required_skills": [
   {
    "resid": 5222680234747
   }
  ]
 },
    {
        group_name: "Ritualist - Hero Skill Group",
        icon: "0000048B00000336",
        type: "normal",
        name: "Fortifying Support",
        tree_pos_x: 600.0,
        id: "hs_ritualist_fortifying_support",
        excluded_skills: [
            {
                resid: 4995046966069
            }
        ],
        resid: 5222680235172,
        tree_name: "<classRitualist></classRitualist> Ritualist",
        tree_pos_y: 450.0,
        description:
            "<bulletlist><hyperlink>Support</hyperlink> abilities now grant:<bullet> +3 Status Resistance for 3 <turn></turn> Turns.</bullet></bulletlist>",
        required_skills: [
            {
                resid: 5222680233603
            },
            {
                resid: 5222680233749
            }
        ]
    }
];

function fetchJsonFiles(filePaths) {
    return Promise.all(
        filePaths.map((filePath) =>
            fetch(filePath).then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return  response.json();
            })
        )
    );
}
var jsonSiegeProjects;

const dlcMap = {
   
    DRAGONLORDS: {
        src: "/aow4db/Icons/Text/DragonDawn.png",
        text: "Part of the Dragon Dawn DLC"
    },
     EMPIRESANDASHES: {
        src: "/aow4db/Icons/Text/EmpiresAshes.png",
        text: "Part of the Empires & Ashes DLC"
    },
    PRIMALFURY: {
        src: "/aow4db/Icons/Text/PrimalFury.png",
        text: "Part of the Primal Fury DLC"
    },
    ELDRITCHREALMS: {
        src: "/aow4db/Icons/Text/EldritchRealms.png",
        text: "Part of the Eldritch Realms DLC"
    },
    HERALDOFGLORY: {
        src: "/aow4db/Icons/Text/herald_of_glory.png",
        text: "Part of the Herald of Glory DLC"
    },
    WAYSOFWAR: {
        src: "/aow4db/Icons/Text/waysofwar.png",
        text: "Part of the Ways of War DLC"
    },
    GIANTKINGS: {
        src: "/aow4db/Icons/Text/GKLogo.png",
        text: "Part of the Giant Kings DLC"
    },
    ARCHONPROPHECY: {
        src: "/aow4db/Icons/Text/ArchonProphecy.png",
        text: "Part of the Archon Prophecy DLC"
    }, COSMICWANDERER: {
        src: "/aow4db/Icons/Text/CosmicWanderer.png",
        text: "Part of the Cosmic Wanderer DLC"
    },THRONESOFBLOOD: {
        src: "/aow4db/Icons/Text/ThronesOfBlood.png",
        text: "Part of the Thrones of Blood DLC"
    }
};

async function GetAllData(selectedLang) {
    let basePathEN = `/aow4db/Data/EN/`;

    if(selectedLang == "BETA"){
            basePathEN = `/aow4db/Data/BETA/`;
     }

    const basePathGen = `/aow4db/Data/GEN/`;
    // }
    //  const basePathEN = `/aow4db/Data/EN/`;
    const basePathLocal = `/aow4db/Data/${selectedLang}/`;

    const fileNamesGeneric = [
        "EnchantmentTables.json",
        "all_spawnsets.json",
        "BuilderLookup.json",
        "AscendedInfo.json",
        "BuilderLookupHero.json",
        "ItemForge.json",
        "UI.json",
        "FactionCreation.json",
        "StatusEffects.json",
        "ExtraToolTips.json",
        "CombatEnchantments.json",
        "WorldStructures.json",
        "CosmicHappenings.json",
        "CityTree.json",
        "all_spawnsets_strategic.json",
        "FreeCities.json"
    ];
    const fileNames = [
        // ingame dump files
        "HeroItems.json",
        "HeroSkills.json",
        "SiegeProjects.json",
        "Units.json",
        "Traits.json",
        "Tomes.json",
        "Abilities.json",
        "EmpireProgression.json",
        "Spells.json",
        "StructureUpgrades.json",
        "Destinies.json",
        "Governance.json",
        // non-ingame-dump-json-files
        "UI.json",
        "all.json"
    ];

    // Create file paths
    const filesToFetchGeneric = fileNamesGeneric.map((f) => basePathGen + f);
    const filesToFetchEN = fileNames.map((f) => basePathEN + f);
    const filesToFetchLocal = fileNames.map((f) => basePathLocal + f);

    try {
        const [dataGen, dataEN, dataLocal, templatesHtml] = await Promise.all([
            fetchJsonFiles(filesToFetchGeneric),
            fetchJsonFiles(filesToFetchEN),
            fetchJsonFiles(filesToFetchLocal),
            fetch("/aow4db/HTML/templates.html").then((res) => res.text())
        ]);

        const genericTargets = [
            "jsonEnchantments",
            "jsonSpawnTables",
            "jsonBuilderLookUp",
            "jsonExtraAscendedInfo",
            "jsonBuilderHeroLookUp",
            "jsonItemForge",
            "jsonUIGeneric",
            "jsonFactionCreation",
            "jsonStatusEffects",
            "jsonExtraTooltips",
             "jsonCombatEnchantments",
        "jsonWorldStructures",
        "jsonCosmicHappenings",
            "jsonCityTreeNodes",
            "jsonSpawnSetsStrat",
            "jsonFreeCities"
        ];
        const targets = [
            "jsonHeroItems",
            "jsonHeroSkills",
            "jsonSiegeProjects",
            "jsonUnits",
            "jsonFactionCreation2",
            "jsonTomes",
            "jsonUnitAbilities",
            "jsonEmpire",
            "jsonSpells",
            "jsonStructureUpgrades",
            "jsonHeroAmbitions",
            "jsonHeroGovernance",
            "jsonUI",
            "jsonAllFromPO"
        ];

        // Assign data to global vars
        genericTargets.forEach((key, i) => {
            window[key] = dataGen[i];
        });

        targets.forEach((key, i) => {
            window[key] = dataEN[i];
            window[key + "Localized"] = dataLocal[i];
        });

        // Inject the template HTML into the page
        const templateContainer = document.createElement("div");
        templateContainer.innerHTML = templatesHtml;
        document.body.appendChild(templateContainer); // or attach to a hidden container
    } catch (error) {
        console.error("Error loading data or templates:", error.message);
    }
}

function AddExtraData() {
    // add extra data to the main data set
    jsonHeroSkills = [...jsonHeroSkills, ...extraSkills];
    jsonHeroSkillsLocalized = [...jsonHeroSkillsLocalized, ...extraSkills];

    jsonUnitAbilities = [...jsonUnitAbilities, ...extraAbilities];
    jsonUnitAbilitiesLocalized = [...jsonUnitAbilitiesLocalized, ...extraAbilities];

    jsonUnitAbilities = [...jsonUnitAbilities, ...jsonExtraTooltips];
    jsonUnitAbilitiesLocalized = [...jsonUnitAbilitiesLocalized, ...jsonExtraTooltips];
}

const abilityMap = {};
const abilityNameMap = {};

async function CheckData() {
    if (jsonSiegeProjects === undefined) {
        let storedSettings = getUserSettings();
        if (storedSettings === null) {
            setUserSettings({
                tooltipselectable: false,
                fontSize: "16px",
                showBeta: false,
                language: "EN"
            });
            storedSettings = getUserSettings();
        }
        //checkboxTooltip = document.getElementById("tooltipCheckbox");
        checkboxTooltip.checked = storedSettings.tooltipselectable;

        //checkboxNumbers = document.getElementById("numbersCheckbox");
        //checkboxNumbers = document.getElementById("numbersCheckbox");
        checkboxNumbers.checked = storedSettings.isolateNumber;

        //showBetaTooltip = document.getElementById("showBetaCheckbox");
      //  showBetaTooltip.checked = storedSettings.showBeta;

        //  languageSelect = document.getElementById("languageSelect");
        languageSelect.value = storedSettings.language;
         //languageSelect.value = "EN";
        let hoverDiv = document.getElementById("hoverDiv");
        let hoverDiv2 = document.getElementById("hoverDiv2");
        if (checkboxTooltip.checked === true) {
            addTooltipListeners(hoverDiv, null);
            addTooltipListeners(hoverDiv2, null, "something");
        } else {
            removeToolTipListeners(hoverDiv);
            removeToolTipListeners(hoverDiv2);
        }
        CheckBoxTooltips();

       //   if (storedSettings.showBeta) {
     //        await GetAllData("BETA");
      //   } else {
        await GetAllData(storedSettings.language);
      //  }

        AddExtraData();

        jsonUnitAbilitiesLocalized.forEach((a) => (abilityMap[a.slug] = a));
        jsonUnitAbilitiesLocalized.forEach((a) => (abilityNameMap[a.name] = a));
        HandlePage();
        if (languageSelect.value != "EN") {
            LocalizeUI();
        }
    }
}

const patchDates = [
    // date ranges of patches
    { name: "Gargoyle 1.0", from: new Date("2025-11-11"), to: new Date("2026-11-29") },
    { name: "Griffon 1.1", from: new Date("2025-08-11"), to: new Date("2025-11-10") },
    { name: "Griffon 1.0", from: new Date("2025-08-12"), to: new Date("2025-11-14") },
    { name: "Ogre 1.2.1", from: new Date("2025-05-13"), to: new Date("2025-08-12") },
    { name: "Ogre 1.2", from: new Date("2025-04-26"), to: new Date("2025-05-13") }
];

function LocalizeUI(specific) {
    // general ui lookup first
    for (const id in jsonUIGeneric) {
        let el = "";
        if(specific != undefined){
              el = specific.querySelector("#" +id);
            console.log(el);
           
        }else{
              el = document.getElementById(id);
        }
       
        if (el != null) {
            let value = "error";

            // check if there is a lookup in the baseConceptLookup file
            if ("lookup" in jsonUIGeneric[id]) {
                let test = jsonUIGeneric[id].lookup;

                if (test.includes("&")) {
                    test = test.split("&");

                    const found = findBy(jsonAllFromPOLocalized, "id", test[0]);
                    if (found) {
                        value = found[test[1]];
                    }
                } else {
                    const found = findBy(jsonAllFromPOLocalized, "id", test);
                    if (found) {
                        value = found.hyperlink;
                    }
                }
             //   console.log(test);
                value = value.replaceAll("<hyperlink>", "");
                value = value.replaceAll("</hyperlink>", "");
                value = value.split("^")[0];
            } else if ("unit" in jsonUIGeneric[id]) {
                let test = jsonUIGeneric[id].unit;
                const abilityName = findBy(jsonUnitAbilities, "name", test);
                console.log(abilityName.name);
                const abilityNameLoc = findBy(jsonUnitAbilitiesLocalized, "slug", abilityName.slug);
                value = abilityNameLoc.name;
            } else {
                // Assumes the image is first, text second
                value = jsonUIGeneric[id].label;
            }

            el.childNodes[1].nodeValue = " " + value;
        }
    }
    // then specific for ones that arent in the po file translations
    for (const id in jsonUILocalized) {
        const el = document.getElementById(id);
        if (el) {
            let value = "error";

            // Assumes the image is first, text second
            value = jsonUILocalized[id].label;

            el.childNodes[1].nodeValue = " " + value;
        }
    }
}
