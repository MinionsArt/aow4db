const excludeListStructures = [
    "shadow_focus_crystal",
    "nature_focus_crystal",
    "materium_focus_crystal",
    "chaos_focus_crystal",
    "order_focus_crystal",
    "astral_focus_crystal"
];

const filterMap = {
    unitsCheck: "u",
    namesCheck: "un",
    abilityNamesCheck: "an",
    abilityDescriptionCheck: "ad",
    passivesCheck: "p",
    resistancesCheck: "r",
    spellsCheck: "s",
    siegeCheck: "sg",
    heroSkillsCheck: "hs",
    heroItemsCheck: "hi",
    ambitionsCheck: "ha",
    worldStructuresCheck: "ws",
    cityStructuresCheck: "cs",
    factionTraitCheck: "ft",
    empireTreeCheck: "et"
};

const input = document.getElementById("searchInput");
const output = document.getElementById("searchOutput");
const result = document.getElementById("searchResult");

// unit checks
const unitsChecked = document.getElementById("unitsCheck");
const namesChecked = document.getElementById("namesCheck");
const abilityNamesChecked = document.getElementById("abilityNamesCheck");
const abilityDescriptionChecked = document.getElementById("abilityDescriptionCheck");
const passivesChecked = document.getElementById("passivesCheck");
const resistancesChecked = document.getElementById("resistancesCheck");

// rest checks
const spellsChecked = document.getElementById("spellsCheck");
const siegeChecked = document.getElementById("siegeCheck");
const empireTreeChecked = document.getElementById("empireTreeCheck");
const heroSkillChecked = document.getElementById("heroSkillsCheck");
const factionTraitsChecked = document.getElementById("factionTraitCheck");
const heroItemsChecked = document.getElementById("heroItemsCheck");
const worldStructuresChecked = document.getElementById("worldStructuresCheck");
const cityStructuresChecked = document.getElementById("cityStructuresCheck");
const ambitionsChecked = document.getElementById("ambitionsCheck");

var deprecatedCheckList = ["000003e300005fe2", "000003e300005fe5", "000003e300005fe7", "000003e300005fe6"];

function normalizeText(str) {
    return Sanitize(str || "").toUpperCase();
}

function matches(text, keyword) {
    return normalizeText(text).includes(keyword);
}

function pushUnique(set, value) {
    if (value) set.add(value);
}

function isInArray(array, search) {
    return array.indexOf(search) >= 0;
}

async function rememberSearch() {
    // filter settings
     const rawSearch = window.location.search.replace(/&amp;/g, "&");
    let params = new URLSearchParams(rawSearch);
    const filters = (params.get("f") || "").split(",");
    if (filters != "") {
        for (const [id, code] of Object.entries(filterMap)) {
            const el = document.getElementById(id);
            if (el) el.checked = filters.includes(code);
        }
    }
    // restore keyword too, if you have it
    const keyword = params.get("q") || "";
    if (keyword != "") {
        input.value = keyword;
        searchData(searchKeyword);
    }
}

function getActiveFilters() {
    const active = [];
    for (const [id, code] of Object.entries(filterMap)) {
        const el = document.getElementById(id);
        if (el && el.checked) active.push(code);
    }
    return active.join(",");
}

function restoreFiltersFromURL() {}

function searchData(keywords) {
    let filter = "";

    output.innerHTML = "";
    if (keywords != undefined) {
        filter = keywords.toUpperCase();
    } else {
        filter = input.value.toUpperCase();
        keywords = input.value;
    }

    let test = filter;
    searchAll(test);
    let currenturl = window.location.href.split("?")[0];

    const filterState = getActiveFilters(); // f = filters

    const params = new URLSearchParams();
    params.set("q", keywords);
    params.set("f", getActiveFilters()); // f = filters
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);

    // window.history.replaceState({}, "foo", currenturl + "?search=" + keywords + ":" + filterState);

    // extra tooltip after search is done
    setTimeout(function () {
        HandleExtraTooltips();
    }, 2000);
}

function depCheckResID(resid) {
    let unit = findBy(jsonUnitsLocalized, "resid", resid);
    if (unit != undefined) {
        for (let l = 0; l < unit.primary_passives.length; l++) {
            if (deprecatedCheckList.includes(unit.primary_passives[l].slug)) {
                return true;
            }
        }
    }
    return false;
}

function DLCCheck(fieldToSearch){
     return fieldToSearch.toUpperCase() in dlcMap;
}

function DLCAdd(jsonLookup, DLC, type, toArray){
    const results = new Set();
      for (const unit of jsonLookup) {
              if("DLC" in unit){
                  if(unit.DLC.indexOf(DLC) != -1){
                      if(type == null){
                            results.add(unit);
                      }else{
                            results.add(unit[type]);
                      }
                     
                  }
              }
          }
  //  console.log(results);
    if(toArray){
        return Array.from(results);
    }else{
          return results;
    }
        
}

function returnUnitList(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.toLowerCase();
    const results = new Set();
    
   if (DLCCheck(fieldToSearch)){
      return DLCAdd(jsonUnits, fieldToSearch, "id", false);
   }
     
        


    // --- Name-based search ---

    for (const unit of jsonUnitsLocalized) {
        const enUnit = findBy(jsonUnits, "resid", unit.resid);
        if (namesChecked.checked) {
            if (unit.name.toLowerCase().includes(search) && !depCheckResID(unit.resid)) {
                let entry;

                if (unit.sub_culture_name && !architectCultureUnits.includes(enUnit.id)) {
                    entry = `${enUnit.id},${enUnit.sub_culture_name}`;
                } else {
                    entry = enUnit.id;
                }
                results.add(entry);
            }
        }

        if (resistancesChecked.checked) {
            if (Array.isArray(unit.resistances)) {
                for (const resistance of unit.resistances) {
                    if (
                        resistance.slug.toLowerCase().replaceAll("_", " ").includes(search) &&
                        !depCheckResID(unit.resid)
                    ) {
                        let entry;
                        if (unit.sub_culture_name && !architectCultureUnits.includes(enUnit.id)) {
                            entry = `${enUnit.id},${enUnit.sub_culture_name}`;
                        } else {
                            entry = enUnit.id;
                        }
                        results.add(entry);
                    }
                }
            }
        }
    }
    return results;
}

function returnEmpireTreeList(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();
    const results = new Set();
    
     if (DLCCheck(fieldToSearch)){
        
      return DLCAdd(jsonEmpire, fieldToSearch, "id", true);
   }

    for (const spell of jsonEmpireLocalized) {
        const name = spell.name?.toUpperCase() || "";
        const description = Sanitize(spell.description || "").toUpperCase();

        if (name.includes(search) || description.includes(search)) {
            const spellEN = findBy(jsonEmpire, "icon", spell.icon);
            results.add(spellEN.id);
        }
    }

    return Array.from(results);
}

function returnSpellList(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();
    const results = new Set();
    
     if (DLCCheck(fieldToSearch)){
        
      return DLCAdd(jsonSpells, fieldToSearch, "id", true);
   }

    for (const spell of jsonSpellsLocalized) {
        const name = spell.name?.toUpperCase() || "";
        const description = Sanitize(spell.description || "").toUpperCase();

        if (name.includes(search) || description.includes(search)) {
            const spellEN = findBy(jsonSpells, "resid", spell.resid);
            results.add(spellEN.id);
        }
    }

    return Array.from(results);
}

function returnAmbitionsList(fieldsToSearch) {
    if (!fieldsToSearch) return [];

    const search = fieldsToSearch.replaceAll("_", " ").toUpperCase();
    const results = new Set();
    
     if (DLCCheck(fieldsToSearch)){
        
      return DLCAdd(jsonHeroAmbitions, fieldsToSearch, null, true);
   }

    for (const trait of jsonHeroAmbitionsLocalized) {
        const name = trait.name?.toUpperCase() || "";
        const description = Sanitize(trait.description || "").toUpperCase();

        if (name.includes(search) || description.includes(search)) {
            const traitEN = findBy(jsonHeroAmbitions, "icon", trait.icon);
            results.add(traitEN);
        }
    }

    return Array.from(results);
}

function returnTraitsList(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();
    const results = new Set();
    
      if (DLCCheck(fieldToSearch)){
      
        let  setExtra = DLCAdd(jsonFactionCreation2, fieldToSearch, "id", true);
             const  setExtra2 = DLCAdd(jsonFactionCreation, fieldToSearch, "id", true);
           setExtra = new Set([...setExtra, ...setExtra2]);
       
      return Array.from(setExtra);
   }

    for (const trait of jsonFactionCreation2) {
        const name = trait.name?.toUpperCase() || "";
        const description = Sanitize(trait.description || "").toUpperCase();

        if (name.includes(search) || description.includes(search)) {
            results.add(trait.id);
        }
        if (Array.isArray(trait.effect_descriptions)) {
            for (const effect of trait.effect_descriptions) {
                if (effect.name.toUpperCase().includes(search)) {
                    const traitEN = findBy(jsonFactionCreation2, "icon", trait.icon);
                    results.add(traitEN.id);
                }
            }
        }
    }
    for (const trait of jsonFactionCreation) {
        const name = trait.name?.toUpperCase() || "";
        const description = Sanitize(trait.description || "").toUpperCase();

        if (name.includes(search) || description.includes(search)) {
            // const traitEN = findBy(jsonFactionCreation, "id", trait.id);
            results.add(trait.id);
        }
    }

    return Array.from(results);
}

function returnSkillList(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();
    const heroSlugs = new Set();
    const results = new Set();
    
      if (DLCCheck(fieldToSearch)){
        
      return DLCAdd(jsonHeroSkills, fieldToSearch, null, true);
   }

    const matches = (text) => text && text.toUpperCase().includes(search);

    // Collect matching unit abilities
    for (const ability of jsonUnitAbilitiesLocalized) {
        if (matches(ability.description) || matches(ability.name)) {
            const abilityEN = findBy(jsonUnitAbilities, "id", ability.id);
            heroSlugs.add(ability.slug);
        }

        if (Array.isArray(ability.modifiers)) {
            for (const mod of ability.modifiers) {
                if (matches(mod.description) || matches(mod.name)) {
                    const abilityEN = findBy(jsonUnitAbilities, "id", ability.id);

                    heroSlugs.add(ability.slug);
                    //break; // stop early if found
                }
            }
        }
    }
    console.log(heroSlugs);

    // Match hero skills
    for (const skill of jsonHeroSkillsLocalized) {
        // Ability match
        if (heroSlugs.size && Array.isArray(skill.abilities)) {
            if (skill.abilities.some((a) => heroSlugs.has(a.slug))) {
                const skillEN = findBy(jsonHeroSkills, "id", skill.id);

                results.add(skillEN);
                continue; // already matched, skip to next skill
            }
        }

        // Description / name match
        if (matches(Sanitize(skill.description || "")) || matches(skill.name)) {
            const skillEN = findBy(jsonHeroSkills, "id", skill.id);

            results.add(skillEN);
        }
    }

    // Return unique results as array
    return Array.from(results);
}

function returnEquipList(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();
    const equipSet = new Set();
    const resultsSet = new Set();
    
     
     if (DLCCheck(fieldToSearch)){
        
      return DLCAdd(jsonHeroItems, fieldToSearch, null, true);
   }

    // Collect abilities matching the search
    for (const ability of jsonUnitAbilitiesLocalized) {
        const matches = (text) => text && text.toUpperCase().includes(search);

        if (matches(ability.description) || matches(ability.name)) {
            const abilityEN = findBy(jsonUnitAbilities, "slug", ability.slug);

            equipSet.add(abilityEN.slug);
        }

        if (Array.isArray(ability.modifiers)) {
            for (const mod of ability.modifiers) {
                if (matches(mod.description) || matches(mod.name)) {
                    const abilityEN = findBy(jsonUnitAbilities, "slug", ability.slug);

                    equipSet.add(abilityEN.slug);
                    break; // stop early if already matched
                }
            }
        }
    }
    // Match items with those abilities

    for (const item of jsonHeroItemsLocalized) {
        if (item.ability_slugs?.some((a) => equipSet.has(a.slug))) {
            const itemEN = findBy(jsonHeroItems, "resid", item.resid);

            resultsSet.add(itemEN);
            continue; // skip description/name check if already matched
        }

        const matches = (text) => text && Sanitize(text).toUpperCase().includes(search);

        if (matches(item.description) || matches(item.name)) {
            const itemEN = findBy(jsonHeroItems, "resid", item.resid);

            resultsSet.add(itemEN);
        }
    }

    return Array.from(resultsSet);
}

function returnSiegeProj(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();
    const results = new Set();
    
      if (DLCCheck(fieldToSearch)){
        
      return DLCAdd(jsonSiegeProjects, fieldToSearch, "id", true);
   }

    for (const spell of jsonSiegeProjectsLocalized) {
        const name = spell.name?.toUpperCase() || "";
        const description = Sanitize(spell.description || "").toUpperCase();

        if (name.includes(search) || description.includes(search)) {
            const siegeEN = findBy(jsonSiegeProjects, "resid", spell.resid);

            results.add(siegeEN.id);
        }
    }

    return Array.from(results);
}

function Sanitize(string) {
    string = string.replaceAll("<hyperlink>", "");
    string = string.replaceAll("</hyperlink>", "");
    return string;
}

function returnWorldStructure(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();
    const results = new Set();
    
    
      if (DLCCheck(fieldToSearch)){
        
      return DLCAdd(jsonWorldStructures, fieldToSearch, "id", true);
   }

    for (const entry of jsonWorldStructures) {
        const name = entry.name?.toUpperCase() || "";
        const description = Sanitize(entry.description || "").toUpperCase();
  let description2  = "";
        if ("extraLookup" in entry) {
            const traitExtra = findBy(jsonAllFromPOLocalized, "id", entry.extraLookup);
            // console.log(Object.entries(traitExtra));
            if ("description" in traitExtra) {
               // console.log(traitExtra.description);
                   description2 = Sanitize(traitExtra.description || "").toUpperCase();
               // if (traitExtra.description.includes(search)) {
                 //   results.add(entry.id);
                //}
            }
        }

        if (name.includes(search) || description.includes(search) || description2.includes(search)) {
            results.add(entry.id);
        }
    }

    return Array.from(results);
}

function returnStructure(fieldToSearch) {
    if (!fieldToSearch) return [];

    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();
    const results = new Set();
    const excludeSet = new Set(excludeListStructures);
    
      if (DLCCheck(fieldToSearch)){
        
      return DLCAdd(jsonStructureUpgrades, fieldToSearch, "id", true);
   }

    const checkAndAdd = (struct, text) => {
        if (text && text.toUpperCase().includes(search) && !excludeSet.has(struct.id)) {
            const structEN = findBy(jsonStructureUpgrades, "resid", struct.resid);

            results.add(structEN.id);
        }
    };

    for (const struct of jsonStructureUpgradesLocalized) {
        // Name check
        checkAndAdd(struct, struct.name);
        checkAndAdd(struct, Sanitize(struct.description || ""));
        checkAndAdd(struct, Sanitize(struct.prediction_description || ""));
    }
    return Array.from(results);
}

function searchAll(keyword) {
    var i, textvalue, j, l;

    var fields = keyword.split("+", 3);
    let listSet = new Set();
    
    // return all DLC stuff
  
    if (unitsChecked.checked) {
        listSet = returnUnitList(fields[0]);
        listSet = returnAbilitiesUnits(fields[0], listSet);
    }
    let list = Array.from(listSet);

    let listspells = spellsChecked.checked ? returnSpellList(fields[0]) : "";
    let listSiegeProj = siegeChecked.checked ? returnSiegeProj(fields[0]) : "";
    let listskills = heroSkillChecked.checked ? returnSkillList(fields[0]) : "";
    let listTraits = factionTraitsChecked.checked ? returnTraitsList(fields[0]) : "";
   
    let listStructures = cityStructuresChecked.checked ? returnStructure(fields[0]) : "";
    let listWorldStructures = worldStructuresChecked.checked ? returnWorldStructure(fields[0]) : "";
    let listEmpireTree = empireTreeChecked.checked ? returnEmpireTreeList(fields[0]) : "";
    let listEquip = heroItemsChecked.checked ? returnEquipList(fields[0]) : "";
    let listAmbtions = ambitionsChecked.checked ? returnAmbitionsList(fields[0]) : "";

    var buttonHolder = document.getElementById("buttonHolder");
 
    buttonHolder.innerHTML = "";
    var dataHolder = document.getElementById("dataHolder");
    dataHolder.innerHTML = "";
    list.sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) return -1;
        if (a.toLowerCase() > b.toLowerCase()) return 1;
        return 0;
    });

    if (list.length > 0) {
        SetButtonsAndDivs(list, "buttonHolder", "searchUnit", undefined, undefined, undefined);
    }
    if (listspells.length > 0) {
        SetCollapsibleButtonsAndDivs("Spells", listspells, "searchSpell");
    }
    if (listSiegeProj.length > 0) {
        SetCollapsibleButtonsAndDivs("Siege Projects", listSiegeProj, "searchSiege");
    }
    if (listStructures.length > 0) {
        SetCollapsibleButtonsAndDivs("Structures", listStructures, "searchStruct");
    }
    if (listWorldStructures.length > 0) {
        SetCollapsibleButtonsAndDivs("World Structures", listWorldStructures, "searchWorldStruct");
    }
    if (listskills.length > 0) {
        SetCollapsibleButtonsAndDivs("Hero Skills", listskills, "searchSkill");
    }
    if (listEquip.length > 0) {
        SetCollapsibleButtonsAndDivs("Hero Equipment", listEquip, "searchItem");
    }
    if (listEmpireTree.length > 0) {
        SetCollapsibleButtonsAndDivs("Empire Tree", listEmpireTree, "searchEmpire");
    }
   
    if (listTraits.length > 0) {
        
        SetCollapsibleButtonsAndDivs("Faction Traits", listTraits, "searchTraits");
    }
    if (listAmbtions.length > 0) {
        SetCollapsibleButtonsAndDivs("Hero Ambitions", listAmbtions, "searchAmbition");
    }

    SetLevelUpStuff();
}

function returnAbilitiesUnits(fieldToSearch, unitSetToCheckTo) {
    let abilitiesList = new Set();
    const search = fieldToSearch.replaceAll("_", " ").toUpperCase();

    for (const ability of jsonUnitAbilitiesLocalized) {
        const matches = (text) => text && text.toUpperCase().includes(search);

        if (abilityNamesChecked.checked && matches(ability.name)) {
            abilitiesList.add(ability.slug);
        }
        if (abilityDescriptionChecked.checked && matches(ability.description)) {
            abilitiesList.add(ability.slug);
        }

        if (abilityDescriptionChecked.checked && Array.isArray(ability.modifiers)) {
            for (const mod of ability.modifiers) {
                if (matches(mod.description) || matches(mod.name)) {
                    abilitiesList.add(ability.slug);
                    break; // stop early if already matched
                }
            }
        }
    }

    let returnList = new Set();
    for (const slug of abilitiesList) {
        findUnitWithAbility(slug, returnList);
    }

    for (const unit of returnList) {
        unitSetToCheckTo.add(unit);
    }

    return unitSetToCheckTo;
}

function searchArray(keyword, arraytosearch, listToPushTo, index) {
    var j = 0;
    for (j in arraytosearch) {
        if ("slug" in arraytosearch[j]) {
            textvalue = arraytosearch[j].slug;
            if (textvalue.toUpperCase().indexOf(keyword) > -1) {
                // if (listToPushTo.length >= 1) {

                if ("sub_culture_name" in jsonUnitsLocalized[index]) {
                    // not architects
                    if (jsonUnitsLocalized[index].culture_name == "Architect") {
                        // skip
                        newEntry = jsonUnitsLocalized[index].id;
                    } else {
                        newEntry = jsonUnitsLocalized[index].id + "," + jsonUnitsLocalized[index].sub_culture_name;
                    }
                } else {
                    newEntry = jsonUnitsLocalized[index].id;
                }
                listToPushTo.push(newEntry);
            }
        }
    }
}

function findUnitWithAbility(ability, results) {
    for (const unit of jsonUnitsLocalized) {
        const enUnit = findBy(jsonUnits, "resid", unit.resid);
        const checkSources = [
            ...(unit.abilities || []),
            ...(passivesChecked.checked ? unit.primary_passives || [] : []),
            ...(passivesChecked.checked ? unit.secondary_passives || [] : [])
        ];

        if (checkSources.some((source) => source.slug === ability) && !depCheckResID(unit.resid)) {
            const entry =
                unit.sub_culture_name && !architectCultureUnits.includes(enUnit.id)
                    ? `${enUnit.id},${enUnit.sub_culture_name}`
                    : enUnit.id;

            results.add(entry);
        }
    }
}
