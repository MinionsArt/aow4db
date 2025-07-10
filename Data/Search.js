var excludeListStructures = [
    "shadow_focus_crystal",
    "nature_focus_crystal",
    "materium_focus_crystal",
    "chaos_focus_crystal",
    "order_focus_crystal",
    "astral_focus_crystal"
];

var deprecatedCheckList= ["000003e300005fe2", "000003e300005fe5", "000003e300005fe7", "000003e300005fe6"];

function isInArray(array, search) {
    return array.indexOf(search) >= 0;
}

async function rememberSearch() {
    const searchKeyword = searchParams.get("search");
    input = document.getElementById("searchInput");
    input.value = searchKeyword;
    if (searchKeyword != undefined) {
        searchData(searchKeyword);
    }
}

function searchData(keywords) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    output = document.getElementById("searchOutput");
    output.innerHTML = "";
    if (keywords != undefined) {
        filter = keywords.toUpperCase();
    } else {
        filter = input.value.toUpperCase();
        keywords = input.value;
    }

    //var test = filter.replaceAll(' ', "_");
    var test = filter;
    searchUnits(test);
    var currenturl = window.location.href.split("?")[0];

    window.history.replaceState({}, "foo", currenturl + "?search=" + keywords);
    setTimeout(function () {
        HandleExtraTooltips();
    }, 2000);
}

function returnUnitList(fieldToSearch) {
    var i = "";
    var list = [];
    for (i = 0; i < jsonUnitsLocalized.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonUnitsLocalized[i].name;
            if (textvalue.toLowerCase().indexOf(fieldToSearch.toLowerCase()) > -1) {
                // if (list.length >= 1) {

                var newEntry = "";
                if ("sub_culture_name" in jsonUnitsLocalized[i]) {
                    newEntry = jsonUnitsLocalized[i].id + "," + jsonUnitsLocalized[i].sub_culture_name;
                } else {
                    newEntry = jsonUnitsLocalized[i].id;
                }
                if (!isInArray(list, newEntry)) {
                    list.push(newEntry);
                }
                //}
                // } else {
                //     list.push(jsonUnitsLocalized[i].id);

                // }
            }
        }
        if (document.getElementById("abilitiesCheck").checked) {
            //  searchArray(fieldToSearch, jsonUnitsLocalized[i].abilities, list, i);
        }
        if (document.getElementById("passivesCheck").checked) {
            //  searchArray(fieldToSearch.replaceAll(" ", "_"), jsonUnitsLocalized[i].primary_passives, list, i);
            //  searchArray(fieldToSearch.replaceAll(" ", "_"), jsonUnitsLocalized[i].secondary_passives, list, i);
        }
        if (document.getElementById("resistancesCheck").checked) {
            searchArray(fieldToSearch, jsonUnitsLocalized[i].resistances, list, i);
        }
    }
    if (document.getElementById("descriptionCheck").checked) {
        for (j = 0; j < jsonUnitAbilitiesLocalized.length; j++) {
            if ("modifiers" in jsonUnitAbilitiesLocalized[j]) {
                searchArrayDescrip(fieldToSearch, jsonUnitAbilitiesLocalized[j].modifiers, list, j);
            }
            searchArrayDescription(fieldToSearch, jsonUnitAbilitiesLocalized[j], list, j);
        }
    }
    return list;
}

function returnEmpireTreeList(fieldToSearch) {
    var list = [];
    for (i = 0; i < jsonEmpireLocalized.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonEmpireLocalized[i].name;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonEmpireLocalized[i].id)) {
                    list.push(jsonEmpireLocalized[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            textvalue = Sanitize(jsonEmpireLocalized[i].description);
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonEmpireLocalized[i].id)) {
                    list.push(jsonEmpireLocalized[i].id);
                }
            }
        }
    }

    return list;
}

function returnSpellList(fieldToSearch) {
    var list = [];
    for (i = 0; i < jsonSpellsLocalized.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonSpellsLocalized[i].name;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSpellsLocalized[i].id)) {
                    list.push(jsonSpellsLocalized[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            textvalue = Sanitize(jsonSpellsLocalized[i].description);
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSpellsLocalized[i].id)) {
                    list.push(jsonSpellsLocalized[i].id);
                }
            }
        }
        if ("enchantment_requisites" in jsonSpellsLocalized[i]) {
            for (b = 0; b < jsonSpellsLocalized[i].enchantment_requisites.length; b++) {
                textvalue = Sanitize(jsonSpellsLocalized[i].enchantment_requisites[b].requisite);

                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonSpellsLocalized[i].id)) {
                        list.push(jsonSpellsLocalized[i].id);
                    }
                }
            }
        }
    }

    return list;
}

function returnTraitsList(fieldToSearch) {
    var list = [];
    var i = "";
    for (i = 0; i < jsonFactionCreation2.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonFactionCreation2[i].name;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonFactionCreation2[i].id)) {
                    list.push(jsonFactionCreation2[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ("description" in jsonFactionCreation2[i]) {
                textvalue = Sanitize(jsonFactionCreation2[i].description);
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonFactionCreation2[i].id)) {
                        list.push(jsonFactionCreation2[i].id);
                    }
                }
            }
        }
    }

    return list;
}

function returnSkillList(fieldToSearch) {
    var resultslist = [];
    var hero = [];
    var i = "";
    var j,
        m,
        k,
        l = "";

    for (i in jsonUnitAbilitiesLocalized) {
        if (jsonUnitAbilitiesLocalized[i].description.toUpperCase().indexOf(fieldToSearch) != -1) {
            hero.push(jsonUnitAbilitiesLocalized[i]);
        }
        if (jsonUnitAbilitiesLocalized[i].name.toUpperCase().indexOf(fieldToSearch) != -1) {
            hero.push(jsonUnitAbilitiesLocalized[i]);
        }

        if ("modifiers" in jsonUnitAbilitiesLocalized[i]) {
            for (m in jsonUnitAbilitiesLocalized[i].modifiers) {
                if (jsonUnitAbilitiesLocalized[i].modifiers[m].description.toUpperCase().indexOf(fieldToSearch) != -1) {
                    hero.push(jsonUnitAbilitiesLocalized[i]);
                }
                if (jsonUnitAbilitiesLocalized[i].modifiers[m].name.toUpperCase().indexOf(fieldToSearch) != -1) {
                    hero.push(jsonUnitAbilitiesLocalized[i]);
                }
            }
        }
    }

    for (j in jsonHeroSkillsLocalized) {
        if (hero.length > 0) {
            if ("abilities" in jsonHeroSkillsLocalized[j]) {
                for (k in jsonHeroSkillsLocalized[j].abilities) {
                    for (l in hero) {
                        if (jsonHeroSkillsLocalized[j].abilities[k].slug === hero[l].slug) {
                            if (!isInArray(resultslist, jsonHeroSkillsLocalized[j])) {
                                resultslist.push(jsonHeroSkillsLocalized[j]);
                            }
                        }
                    }
                }
            }
        }
        for (k in jsonHeroSkillsLocalized[j].description) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (Sanitize(jsonHeroSkillsLocalized[j].description).toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(resultslist, jsonHeroSkillsLocalized[j])) {
                    resultslist.push(jsonHeroSkillsLocalized[j]);
                }
            }
        }

        for (k in jsonHeroSkillsLocalized[j].name) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (jsonHeroSkillsLocalized[j].name.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(resultslist, jsonHeroSkillsLocalized[j])) {
                    resultslist.push(jsonHeroSkillsLocalized[j]);
                }
            }
        }
    }

    // Remove duplicate objects from the array
    const uniqueArray = resultslist.filter((item, index) => {
        return index === resultslist.findIndex((obj) => obj.resid === item.resid && obj.name === item.name);
    });

    return uniqueArray;
}

function returnEquipList(fieldToSearch) {
    var resultslist = [];
    var equip = [];
    var i = "";
    var j,
        m,
        k,
        l = "";

    for (i in jsonUnitAbilitiesLocalized) {
        if (jsonUnitAbilitiesLocalized[i].description.toUpperCase().indexOf(fieldToSearch) != -1) {
            equip.push(jsonUnitAbilitiesLocalized[i]);
        }

        if (jsonUnitAbilitiesLocalized[i].name.toUpperCase().indexOf(fieldToSearch) != -1) {
            equip.push(jsonUnitAbilitiesLocalized[i]);
        }

        if ("modifiers" in jsonUnitAbilitiesLocalized[i]) {
            for (m in jsonUnitAbilitiesLocalized[i].modifiers) {
                if (jsonUnitAbilitiesLocalized[i].modifiers[m].description.toUpperCase().indexOf(fieldToSearch) != -1) {
                    equip.push(jsonUnitAbilitiesLocalized[i]);
                }
                if (jsonUnitAbilitiesLocalized[i].modifiers[m].name.toUpperCase().indexOf(fieldToSearch) != -1) {
                    equip.push(jsonUnitAbilitiesLocalized[i]);
                }
            }
        }
    }

    for (j in jsonHeroItemsLocalized) {
        if (equip.length > 0) {
            for (k in jsonHeroItemsLocalized[j].ability_slugs) {
                for (l in equip) {
                    if (jsonHeroItemsLocalized[j].ability_slugs[k].slug === equip[l].slug) {
                        if (!isInArray(resultslist, jsonHeroItemsLocalized[j])) {
                            resultslist.push(jsonHeroItemsLocalized[j]);
                        }
                    }
                }
            }
        }
        for (k in jsonHeroItemsLocalized[j].description) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (Sanitize(jsonHeroItemsLocalized[j].description).toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(resultslist, jsonHeroItemsLocalized[j])) {
                    resultslist.push(jsonHeroItemsLocalized[j]);
                }
            }
        }

        for (k in jsonHeroItemsLocalized[j].name) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (jsonHeroItemsLocalized[j].name.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(resultslist, jsonHeroItemsLocalized[j])) {
                    resultslist.push(jsonHeroItemsLocalized[j]);
                }
            }
        }
    }

    return resultslist;
}

function returnSiegeProj(fieldToSearch) {
    var list = [];
    var resIDList = [];
    for (i = 0; i < jsonSiegeProjectsLocalized.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonSiegeProjectsLocalized[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSiegeProjectsLocalized[i].id)) {
                    list.push(jsonSiegeProjectsLocalized[i].id);
                    resIDList.push(jsonSiegeProjectsLocalized[i].resid);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ("description" in jsonSiegeProjectsLocalized[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonSiegeProjectsLocalized[i].description);

                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonSiegeProjectsLocalized[i].id)) {
                        list.push(jsonSiegeProjectsLocalized[i].id);
                    }
                }
            }
        }
    }

    return list;
}

function Sanitize(string) {
    string = string.replaceAll("<hyperlink>", "");
    string = string.replaceAll("</hyperlink>", "");
    return string;
}

function returnWorldStructure(fieldToSearch) {
    var list = [];
    for (i = 0; i < jsonWorldStructures.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonWorldStructures[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonWorldStructures[i].id)) {
                    list.push(jsonWorldStructures[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ("description" in jsonWorldStructures[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonWorldStructures[i].description);
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonWorldStructures[i].id)) {
                        list.push(jsonWorldStructures[i].id);
                    }
                }
            }
        }
    }

    return list;
}

function returnStructure(fieldToSearch) {
    var list = [];
    for (i = 0; i < jsonStructureUpgradesLocalized.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonStructureUpgradesLocalized[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (
                    !isInArray(list, jsonStructureUpgradesLocalized[i].id) &&
                    !isInArray(excludeListStructures, jsonStructureUpgradesLocalized[i].id)
                ) {
                    list.push(jsonStructureUpgradesLocalized[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ("description" in jsonStructureUpgradesLocalized[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonStructureUpgradesLocalized[i].description);
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (
                        !isInArray(list, jsonStructureUpgradesLocalized[i].id) &&
                        !isInArray(excludeListStructures, jsonStructureUpgradesLocalized[i].id)
                    ) {
                        list.push(jsonStructureUpgradesLocalized[i].id);
                    }
                }
            }
            if ("prediction_description" in jsonStructureUpgradesLocalized[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonStructureUpgradesLocalized[i].prediction_description);
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (
                        !isInArray(list, jsonStructureUpgradesLocalized[i].id) &&
                        !isInArray(excludeListStructures, jsonStructureUpgradesLocalized[i].id)
                    ) {
                        list.push(jsonStructureUpgradesLocalized[i].id);
                    }
                }
            }
        }
    }

    return list;
}

function searchUnits(keyword) {
    var i,
        output,
        textvalue,
        j,
        l,
        result = "";

    var fields = keyword.split("+", 3);
    var list = returnUnitList(fields[0]);
    list = returnAbilitiesUnits(fields[0], list);
    var depricatedCheckList = CheckDepricated(list);

    output = document.getElementById("searchOutput");
    result = document.getElementById("searchResult");

    var listspells = returnSpellList(fields[0]);
    var listSiegeProj = returnSiegeProj(fields[0]);
    var listskills = returnSkillList(fields[0]);
    var listTraits = returnTraitsList(fields[0]);
    var listStructures = returnStructure(fields[0]);
    var listWorldStructures = returnWorldStructure(fields[0]);
    var listEmpireTree = returnEmpireTreeList(fields[0]);
    var listEquip = returnEquipList(fields[0]);

    var buttonHolder = document.getElementById("buttonHolder");

    buttonHolder.innerHTML = "";
    var dataHolder = document.getElementById("dataHolder");
    dataHolder.innerHTML = "";
    depricatedCheckList.sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) return -1;
        if (a.toLowerCase() > b.toLowerCase()) return 1;
        return 0;
    });
    // get list to english
    for (i in depricatedCheckList) {
        var unitNew = jsonUnitsLocalized.find((entry) => entry.id === depricatedCheckList[i]);
        if (unitNew == undefined) {
            console.log("Test unit is undefined: " + depricatedCheckList[i]);
        } else {
            let unit = jsonUnits.find((entry) => entry.resid === unitNew.resid).id;
            depricatedCheckList[i] = unit;
        }
    }
    SetButtonsAndDivs(depricatedCheckList, "buttonHolder", "searchUnit", undefined, undefined, undefined);

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

    SetLevelUpStuff();
}

function returnAbilitiesUnits(fieldToSearch, unitListToCheckTo) {
    var p = "";
    var abilitiesList = [];
    for (var j = 0; j < jsonUnitAbilitiesLocalized.length; j++) {
        if ("name" in jsonUnitAbilitiesLocalized[j]) {
            textvalue = jsonUnitAbilitiesLocalized[j].name;

            if (textvalue.toLowerCase().indexOf(fieldToSearch.toLowerCase()) != -1) {
                //  console.log(textvalue.toLowerCase() + " " + fieldToSearch.toLowerCase());
                if (!isInArray(abilitiesList, jsonUnitAbilitiesLocalized[j].slug)) {
                    abilitiesList.push(jsonUnitAbilitiesLocalized[j].slug);
                }
            }
        }
    }
    var returnList = [];

    for (var i = 0; i < abilitiesList.length; i++) {
        findUnitWithAbility(abilitiesList[i], returnList);
    }

    for (var k = 0; k < returnList.length; k++) {
        if (!isInArray(unitListToCheckTo, returnList[k])) {
            unitListToCheckTo.push(returnList[k]);
        }
    }

    return unitListToCheckTo;
}

function CheckDepricated(listChecking) {
    var newList = [];
    var i = "";
    for (i in listChecking) {
        if (depCheck(listChecking[i]) === false) {
            newList.push(listChecking[i]);
        }
    }
    return newList;
}

//const magmaSpiritList= [""]

function depCheck(id) {
    var p = "";
      console.log("depUnit " + id);
    for (p in jsonUnitsLocalized) {
        if (jsonUnitsLocalized[p].id === id) {
            for (var l = 0; l < jsonUnitsLocalized[p].primary_passives.length; l++) {
                if (deprecatedCheckList.includes(jsonUnitsLocalized[p].primary_passives[l].slug)) {
                  
                    if (jsonUnitsLocalized[p].id != "magma_spirit") {
                        return true;
                    }
                    
                   // if (jsonUnitsLocalized[p].id != "magma_spirit") {
                      
                        
                   // } else{
                   //       return true;
                   // }
                }
            }
        }
    }
    return false;
}

function depCheckResID(resid) {
    var p = "";
   
    for (p in jsonUnitsLocalized) {
        if (jsonUnitsLocalized[p].resid === resid) {
            for (var l = 0; l < jsonUnitsLocalized[p].primary_passives.length; l++) {
                if (deprecatedCheckList.includes(jsonUnitsLocalized[p].primary_passives[l].slug)) {
                   
                        return true;
                    }
                  
                }
            }
      
    }
    return false;
}

function searchArray(keyword, arraytosearch, listToPushTo, index) {
    var j = 0;
    for (j in arraytosearch) {
        if ("slug" in arraytosearch[j]) {
            textvalue = arraytosearch[j].slug;
            if (textvalue.toUpperCase().indexOf(keyword) > -1) {
                // if (listToPushTo.length >= 1) {

                if ("sub_culture_name" in jsonUnitsLocalized[index]) {
                    newEntry = jsonUnitsLocalized[index].id + "," + jsonUnitsLocalized[index].sub_culture_name;
                } else {
                    newEntry = jsonUnitsLocalized[index].id;
                }
                if (!isInArray(listToPushTo, newEntry)) {
                    listToPushTo.push(newEntry);
                }
                // } else {
                //     listToPushTo.push(arraytosearch[index].id);
                // }
            }
        }
    }
}

function searchArrayDescrip(keyword, arraytosearch, listToPushTo, index) {
    var j = 0;
    for (j in arraytosearch) {
        if (arraytosearch[j].name != null) {
            textvalue = Sanitize(arraytosearch[j].description);
            if (textvalue.toUpperCase().indexOf(keyword) != -1) {
                findUnitWithAbility(jsonUnitAbilitiesLocalized[index].slug, listToPushTo);
            }
            textvalue = arraytosearch[j].name;
            if (textvalue.toUpperCase().indexOf(keyword) != -1) {
                findUnitWithAbility(jsonUnitAbilitiesLocalized[index].slug, listToPushTo);
            }
        }
    }
}

function searchArrayDescription(keyword, arraytosearch, listToPushTo, index) {
    textvalue = Sanitize(arraytosearch.description);
    keyword = keyword.replaceAll("_", " ");
    if (textvalue.toUpperCase().indexOf(keyword) != -1) {
        findUnitWithAbility(jsonUnitAbilitiesLocalized[index].slug, listToPushTo);
    }
}

function findUnitWithAbility(ability, listToPushTo) {
    const includePassives = document.getElementById("passivesCheck").checked;

    for (const unit of jsonUnitsLocalized) {
        const checkSources = [
            ...(unit.abilities || []),
            ...(includePassives ? unit.primary_passives || [] : []),
            ...(includePassives ? unit.secondary_passives || [] : [])
        ];

        for (const source of checkSources) {
            if (source.slug === ability) {
                const newEntry = unit.sub_culture_name ? `${unit.id},${unit.sub_culture_name}` : unit.id;

                if (!isInArray(listToPushTo, newEntry)) {
                    listToPushTo.push(newEntry);
                }

                break; // No need to keep checking if already matched
            }
        }
    }
}
