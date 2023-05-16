var excludeListStructures = ["shadow_bolstering_matrix", "nature_bolstering_matrix", "materium_bolstering_matrix", "chaos_bolstering_matrix", "order_bolstering_matrix", "astral_bolstering_matrix", "shadow_amplifier_lens", "nature_amplifier_lens", "materium_amplifier_lens", "chaos_amplifier_lens", "order_amplifier_lens", "astral_amplifier_lens", "shadow_focus_crystal", "nature_focus_crystal", "materium_focus_crystal", "chaos_focus_crystal", "order_focus_crystal", "astral_focus_crystal"];



function isInArray(array, search) {
    return array.indexOf(search) >= 0;
}

function rememberSearch() {

    const searchKeyword = searchParams.get('search');
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


    var test = filter.replaceAll(' ', "_");
    searchUnits(test);
    var currenturl = window.location.href.split('?')[0];

    window.history.replaceState({}, 'foo', currenturl + "?search=" + keywords);

}

function returnUnitList(fieldToSearch) {
    var i = "";
    var list = new Array();
    for (i = 0; i < jsonUnits.units.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonUnits.units[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) > -1) {
                if (list.length >= 1) {
                    if (!isInArray(list, jsonUnits.units[i].id)) {
                        list.push(jsonUnits.units[i].id);
                    }
                } else {
                    list.push(jsonUnits.units[i].id);
                }
            }
        }
        if (document.getElementById("abilitiesCheck").checked) {
            searchArray(fieldToSearch, jsonUnits.units[i].abilities, list, i);
        }
        if (document.getElementById("passivesCheck").checked) {
            searchArray(fieldToSearch, jsonUnits.units[i].primary_passives, list, i);
            searchArray(fieldToSearch, jsonUnits.units[i].secondary_passives, list, i);
        }
        if (document.getElementById("resistancesCheck").checked) {
            searchArray(fieldToSearch, jsonUnits.units[i].resistances, list, i);
        }



    }
    if (document.getElementById("descriptionCheck").checked) {
        for (j = 0; j < jsonUnitAbilities.abilities.length; j++) {

            if ('modifiers' in jsonUnitAbilities.abilities[j]) {
                searchArrayDescrip(fieldToSearch, jsonUnitAbilities.abilities[j].modifiers, list, j);
            }
            searchArrayDescription(fieldToSearch, jsonUnitAbilities.abilities[j], list, j);
        }
    }
    return list;
}


function returnEmpireTreeList(fieldToSearch) {
    var list = new Array();
    for (i = 0; i < jsonEmpire.empirenodes.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonEmpire.empirenodes[i].name;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonEmpire.empirenodes[i].id)) {
                    list.push(jsonEmpire.empirenodes[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            textvalue = Sanitize(jsonEmpire.empirenodes[i].description);
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonEmpire.empirenodes[i].id)) {
                    list.push(jsonEmpire.empirenodes[i].id);
                }
            }
        }
    }

    return list;
}

function returnSpellList(fieldToSearch) {
    var list = new Array();
    for (i = 0; i < jsonSpells.spells.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonSpells.spells[i].name;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSpells.spells[i].id)) {
                    list.push(jsonSpells.spells[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            textvalue = Sanitize(jsonSpells.spells[i].description);
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSpells.spells[i].id)) {
                    list.push(jsonSpells.spells[i].id);
                }
            }
        }
    }

    return list;
}

function returnSkillList(fieldToSearch) {
    var resultslist = new Array();
    var hero = new Array();

    for (i in jsonUnitAbilities.abilities) {


        if (jsonUnitAbilities.abilities[i].description.toUpperCase().indexOf(fieldToSearch) != -1) {


            hero.push(jsonUnitAbilities.abilities[i]);




        }
    }



    for (j in jsonHeroSkills.skills) {
        if (hero.length > 0) {
            if ('abilities' in jsonHeroSkills.skills[j]) {
                for (k in jsonHeroSkills.skills[j].abilities) {
                    for (l in hero) {
                        if (jsonHeroSkills.skills[j].abilities[k].slug === hero[l].slug) {


                            if (!isInArray(resultslist, jsonHeroSkills.skills[j])) {
                                resultslist.push(jsonHeroSkills.skills[j]);
                            }



                        }
                    }

                }
            }


        }
        for (k in jsonHeroSkills.skills[j].description) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (Sanitize(jsonHeroSkills.skills[j].description).toUpperCase().indexOf(fieldToSearch) != -1) {

                if (!isInArray(resultslist, jsonHeroSkills.skills[j])) {
                    resultslist.push(jsonHeroSkills.skills[j]);
                }



            }
        }

        for (k in jsonHeroSkills.skills[j].name) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (jsonHeroSkills.skills[j].name.toUpperCase().indexOf(fieldToSearch) != -1) {

                if (!isInArray(resultslist, jsonHeroSkills.skills[j])) {
                    resultslist.push(jsonHeroSkills.skills[j]);
                }



            }
        }

    }





    return resultslist;
}


function returnSiegeProj(fieldToSearch) {
    var list = new Array();
    for (i = 0; i < jsonSiegeProjects.projects.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonSiegeProjects.projects[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSiegeProjects.projects[i].id)) {
                    list.push(jsonSiegeProjects.projects[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ('description' in jsonSiegeProjects.projects[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonSiegeProjects.projects[i].description);

                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonSiegeProjects.projects[i].id)) {
                        list.push(jsonSiegeProjects.projects[i].id);
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
    var list = new Array();
    for (i = 0; i < jsonWorldStructures.structures.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonWorldStructures.structures[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonWorldStructures.structures[i].id)) {
                    list.push(jsonWorldStructures.structures[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ('description' in jsonWorldStructures.structures[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonWorldStructures.structures[i].description);
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonWorldStructures.structures[i].id)) {
                        list.push(jsonWorldStructures.structures[i].id);
                    }
                }
            }



        }
    }

    return list;
}

function returnStructure(fieldToSearch) {
    var list = new Array();
    for (i = 0; i < jsonStructureUpgrades.structures.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonStructureUpgrades.structures[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonStructureUpgrades.structures[i].id) && !isInArray(excludeListStructures, jsonStructureUpgrades.structures[i].id)) {
                    list.push(jsonStructureUpgrades.structures[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ('description' in jsonStructureUpgrades.structures[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonStructureUpgrades.structures[i].description);
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonStructureUpgrades.structures[i].id) && !isInArray(excludeListStructures, jsonStructureUpgrades.structures[i].id)) {
                        list.push(jsonStructureUpgrades.structures[i].id);
                    }
                }
            }
            if ('prediction_description' in jsonStructureUpgrades.structures[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonStructureUpgrades.structures[i].prediction_description);
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonStructureUpgrades.structures[i].id) && !isInArray(excludeListStructures, jsonStructureUpgrades.structures[i].id)) {
                        list.push(jsonStructureUpgrades.structures[i].id);
                    }
                }
            }


        }
    }

    return list;
}




function searchUnits(keyword) {
    var i, output, textvalue, j, l, result = "";

    var fields = keyword.split('+', 3);
    var list = returnUnitList(fields[0]);
    var depricatedCheckList = CheckDepricated(list);

    output = document.getElementById("searchOutput");
    result = document.getElementById("searchResult");

    var listspells = returnSpellList(fields[0]);
    var listSiegeProj = returnSiegeProj(fields[0]);
    var listskills = returnSkillList(fields[0]);
    var listStructures = returnStructure(fields[0]);
    var listWorldStructures = returnWorldStructure(fields[0]);
    var listEmpireTree = returnEmpireTreeList(fields[0]);



    var buttonHolder = document.getElementById("buttonHolder");

    buttonHolder.innerHTML = "";
    var dataHolder = document.getElementById("dataHolder");
    dataHolder.innerHTML = "";
    SetButtonsAndDivs(depricatedCheckList, "buttonHolder", "searchUnit");

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

    if (listEmpireTree.length > 0) {
        SetCollapsibleButtonsAndDivs("Empire Tree", listEmpireTree, "searchEmpire");
    }

    SetLevelUpStuff();


}

function CheckDepricated(listChecking) {
    var newList = new Array();
    var i = "";
    for (i in listChecking) {
        if (depCheck(listChecking[i]) === false) {
            newList.push(listChecking[i]);
        }
    }
    return newList;
}

function depCheck(id) {
    var p = "";
    for (p in jsonUnits.units) {
        if (jsonUnits.units[p].id === id) {
            for (l in jsonUnits.units[p].primary_passives) {
                if (jsonUnits.units[p].primary_passives[l].slug.indexOf("deprecated") != -1) {
                    console.log("true");
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
        if (arraytosearch[j].slug != null) {
            textvalue = arraytosearch[j].slug;
            if (textvalue.toUpperCase().indexOf(keyword) > -1) {
                if (listToPushTo.length >= 1) {
                    if (!isInArray(listToPushTo, jsonUnits.units[index].id)) {
                        listToPushTo.push(jsonUnits.units[index].id);
                    }
                } else {
                    listToPushTo.push(jsonUnits.units[index].id);
                }



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

                findUnitWithAbility(jsonUnitAbilities.abilities[index].slug, listToPushTo);


            }
            textvalue = arraytosearch[j].name;
            if (textvalue.toUpperCase().indexOf(keyword) != -1) {

                findUnitWithAbility(jsonUnitAbilities.abilities[index].slug, listToPushTo);


            }
        }

    }
}

function searchArrayDescription(keyword, arraytosearch, listToPushTo, index) {

    textvalue = Sanitize(arraytosearch.description);
    keyword = keyword.replaceAll("_", " ");
    if (textvalue.toUpperCase().indexOf(keyword) != -1) {

        findUnitWithAbility(jsonUnitAbilities.abilities[index].slug, listToPushTo);


    }



}


function findUnitWithAbility(ability, listToPushTo) {
    var i = "";
    var j = "";
    for (i = 0; i < jsonUnits.units.length; i++) {
        if ('abilities' in jsonUnits.units[i]) {
            for (j in jsonUnits.units[i].abilities) {

                if (ability === jsonUnits.units[i].abilities[j].slug) {
                    if (!isInArray(listToPushTo, jsonUnits.units[i].id)) {
                        listToPushTo.push(jsonUnits.units[i].id);
                    }
                }
            }
        }
    }


}








function addUnitCard(unit) {

    var iDiv = unit_card_template.content.cloneNode(true);
    document.getElementById("searchOutput").appendChild(iDiv);
    // setUnitIds(unit);
    showUnit(unit);




}

function addModCard(mod) {

    var iDiv = mod_card_template.content.cloneNode(true);
    document.getElementById("searchOutputMod").appendChild(iDiv);

    showMod(mod);




}
