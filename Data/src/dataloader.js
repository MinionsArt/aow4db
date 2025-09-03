
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
                return response.json();
            })
        )
    );
}
var jsonSiegeProjects;

async function GetAllData(selectedLang) {
    var basePathEN;
    //if(selectedLang == "Beta"){
    //         basePathEN = `/aow4db/Data/Beta/`;
    //  }else{
    basePathEN = `/aow4db/Data/EN/`;
    // }
    //  const basePathEN = `/aow4db/Data/EN/`;
    const basePathLocal = `/aow4db/Data/${selectedLang}/`;

    const fileNamesGeneric = [
        "EnchantmentTables.json",
        "SpawnTables.json",
        "BuilderLookup.json",
        "AscendedInfo.json",
        "BuilderLookupHero.json",
        "ItemForge.json"
    ];
    const fileNames = [
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
        "CombatEnchantments.json",
        "WorldStructures.json",
        "FactionCreation.json",
        "Destinies.json",
        "CosmicHappenings.json",
        "Governance.json",
        "StatusEffects.json",
        "ExtraToolTips.json",
        "UI.json"
    ];

    // Create file paths
    const filesToFetchGeneric = fileNamesGeneric.map((f) => basePathEN + f);
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
            "jsonItemForge"
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
            "jsonCombatEnchantments",
            "jsonWorldStructures",
            "jsonFactionCreation",
            "jsonHeroAmbitions",
            "jsonCosmicHappenings",
            "jsonHeroGovernance",
            "jsonStatusEffects",
            "jsonExtraTooltips",
            "jsonUI"
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

async function CheckData() {
    if (jsonSiegeProjects === undefined) {
        var storedSettings = getUserSettings();
        if (storedSettings === null) {
            setUserSettings({
                tooltipselectable: false,
                fontSize: "16px",
                showBeta: false,
                language: "EN"
            });
            storedSettings = getUserSettings();
        }
        checkboxTooltip = document.getElementById("tooltipCheckbox");
        checkboxTooltip.checked = storedSettings.tooltipselectable;

        checkboxNumbers = document.getElementById("numbersCheckbox");
        checkboxNumbers = document.getElementById("numbersCheckbox");
        checkboxNumbers.checked = storedSettings.isolateNumber;

        showBetaTooltip = document.getElementById("showBetaCheckbox");
        showBetaTooltip.checked = storedSettings.showBeta;

        languageSelect = document.getElementById("languageSelect");
        languageSelect.value = "EN";
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

        //  if (storedSettings.showBeta) {
        //      await GetAllData("Beta");
        //  } else {
        await GetAllData(storedSettings.language);
        //}

        AddExtraData();

        jsonUnitAbilitiesLocalized.forEach((a) => (abilityMap[a.slug] = a));
        HandlePage();
        Localize();
    }
}

const patchDates = [
    // date ranges of patches
    { name: "Griffon 1.1", from: new Date("2025-08-114"), to: new Date("2025-11-29") },
    { name: "Griffon 1.0", from: new Date("2025-08-12"), to: new Date("2025-11-14") },
    { name: "Ogre 1.2.1", from: new Date("2025-05-13"), to: new Date("2025-08-12") },
    { name: "Ogre 1.2", from: new Date("2025-04-26"), to: new Date("2025-05-13") }
];
