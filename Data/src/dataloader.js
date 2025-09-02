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
