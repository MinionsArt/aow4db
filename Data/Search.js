var excludeListStructures = ["shadow_focus_crystal", "nature_focus_crystal", "materium_focus_crystal", "chaos_focus_crystal", "order_focus_crystal", "astral_focus_crystal"];



function isInArray(array, search) {
    return array.indexOf(search) >= 0;
}

async function rememberSearch() {

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
    for (i = 0; i < jsonUnits.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonUnits[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) > -1) {
                if (list.length >= 1) {
                    if (!isInArray(list, jsonUnits[i].id)) {
                        list.push(jsonUnits[i].id);
                    }
                } else {
                    list.push(jsonUnits[i].id);
                }
            }
        }
        if (document.getElementById("abilitiesCheck").checked) {
            searchArray(fieldToSearch, jsonUnits[i].abilities, list, i);
        }
        if (document.getElementById("passivesCheck").checked) {
            searchArray(fieldToSearch, jsonUnits[i].primary_passives, list, i);
            searchArray(fieldToSearch, jsonUnits[i].secondary_passives, list, i);
        }
        if (document.getElementById("resistancesCheck").checked) {
            searchArray(fieldToSearch, jsonUnits[i].resistances, list, i);
        }



    }
    if (document.getElementById("descriptionCheck").checked) {
        for (j = 0; j < jsonUnitAbilities.length; j++) {

            if ('modifiers' in jsonUnitAbilities[j]) {
                searchArrayDescrip(fieldToSearch, jsonUnitAbilities[j].modifiers, list, j);
            }
            searchArrayDescription(fieldToSearch, jsonUnitAbilities[j], list, j);
        }
    }
    return list;
}


function returnEmpireTreeList(fieldToSearch) {
    var list = new Array();
    for (i = 0; i < jsonEmpire.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonEmpire[i].name;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonEmpire[i].id)) {
                    list.push(jsonEmpire[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            textvalue = Sanitize(jsonEmpire[i].description);
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonEmpire[i].id)) {
                    list.push(jsonEmpire[i].id);
                }
            }
        }
    }

    return list;
}

function returnSpellList(fieldToSearch) {
    var list = new Array();
    for (i = 0; i < jsonSpells.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonSpells[i].name;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSpells[i].id)) {
                    list.push(jsonSpells[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            textvalue = Sanitize(jsonSpells[i].description);
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSpells[i].id)) {
                    list.push(jsonSpells[i].id);
                }
            }
        }
        if ('enchantment_requisites' in jsonSpells[i]) {
            for (b = 0; b < jsonSpells[i].enchantment_requisites.length; b++) {
                textvalue = Sanitize(jsonSpells[i].enchantment_requisites[b].requisite);

                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonSpells[i].id)) {
                        list.push(jsonSpells[i].id);
                    }

                }
            }

        }

    }

    return list;
}


function returnTraitsList(fieldToSearch) {
    var list = new Array();
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
            if ('description' in jsonFactionCreation2[i]) {
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
    var resultslist = new Array();
    var hero = new Array();
    var i = "";
    var j, m, k, l = "";

    for (i in jsonUnitAbilities) {


        if (jsonUnitAbilities[i].description.toUpperCase().indexOf(fieldToSearch) != -1) {


            hero.push(jsonUnitAbilities[i]);




        }
        if (jsonUnitAbilities[i].name.toUpperCase().indexOf(fieldToSearch) != -1) {


            hero.push(jsonUnitAbilities[i]);




        }

        if ('modifiers' in jsonUnitAbilities[i]) {
            for (m in jsonUnitAbilities[i].modifiers) {
                if (jsonUnitAbilities[i].modifiers[m].description.toUpperCase().indexOf(fieldToSearch) != -1) {


                    hero.push(jsonUnitAbilities[i]);




                }
                if (jsonUnitAbilities[i].modifiers[m].name.toUpperCase().indexOf(fieldToSearch) != -1) {


                    hero.push(jsonUnitAbilities[i]);




                }
            }
        }
    }



    for (j in jsonHeroSkills) {
        if (hero.length > 0) {
            if ('abilities' in jsonHeroSkills[j]) {
                for (k in jsonHeroSkills[j].abilities) {
                    for (l in hero) {
                        if (jsonHeroSkills[j].abilities[k].slug === hero[l].slug) {


                            if (!isInArray(resultslist, jsonHeroSkills[j])) {
                                resultslist.push(jsonHeroSkills[j]);
                            }



                        }
                    }

                }
            }


        }
        for (k in jsonHeroSkills[j].description) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (Sanitize(jsonHeroSkills[j].description).toUpperCase().indexOf(fieldToSearch) != -1) {

                if (!isInArray(resultslist, jsonHeroSkills[j])) {
                    resultslist.push(jsonHeroSkills[j]);
                }



            }
        }

        for (k in jsonHeroSkills[j].name) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (jsonHeroSkills[j].name.toUpperCase().indexOf(fieldToSearch) != -1) {

                if (!isInArray(resultslist, jsonHeroSkills[j])) {
                    resultslist.push(jsonHeroSkills[j]);
                }



            }
        }

    }


    // Remove duplicate objects from the array
    const uniqueArray = resultslist.filter((item, index) => {
        return index === resultslist.findIndex(obj => obj.id === item.id && obj.name === item.name);
    });



    return uniqueArray;
}


function returnEquipList(fieldToSearch) {
    var resultslist = new Array();
    var equip = new Array();
    var i = "";
    var j, m, k, l = "";

    for (i in jsonUnitAbilities) {


        if (jsonUnitAbilities[i].description.toUpperCase().indexOf(fieldToSearch) != -1) {


            equip.push(jsonUnitAbilities[i]);




        }

        if (jsonUnitAbilities[i].name.toUpperCase().indexOf(fieldToSearch) != -1) {


            equip.push(jsonUnitAbilities[i]);




        }

        if ('modifiers' in jsonUnitAbilities[i]) {
            for (m in jsonUnitAbilities[i].modifiers) {
                if (jsonUnitAbilities[i].modifiers[m].description.toUpperCase().indexOf(fieldToSearch) != -1) {


                    equip.push(jsonUnitAbilities[i]);




                }
                if (jsonUnitAbilities[i].modifiers[m].name.toUpperCase().indexOf(fieldToSearch) != -1) {


                    equip.push(jsonUnitAbilities[i]);




                }
            }
        }
    }



    for (j in jsonHeroItems) {
        if (equip.length > 0) {

            for (k in jsonHeroItems[j].ability_slugs) {
                for (l in equip) {
                    if (jsonHeroItems[j].ability_slugs[k].slug === equip[l].slug) {


                        if (!isInArray(resultslist, jsonHeroItems[j])) {
                            resultslist.push(jsonHeroItems[j]);
                        }



                    }
                }

            }



        }
        for (k in jsonHeroItems[j].description) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (Sanitize(jsonHeroItems[j].description).toUpperCase().indexOf(fieldToSearch) != -1) {

                if (!isInArray(resultslist, jsonHeroItems[j])) {
                    resultslist.push(jsonHeroItems[j]);
                }



            }
        }

        for (k in jsonHeroItems[j].name) {
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (jsonHeroItems[j].name.toUpperCase().indexOf(fieldToSearch) != -1) {

                if (!isInArray(resultslist, jsonHeroItems[j])) {
                    resultslist.push(jsonHeroItems[j]);
                }



            }
        }

    }





    return resultslist;
}


function returnSiegeProj(fieldToSearch) {
    var list = new Array();
    for (i = 0; i < jsonSiegeProjects.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonSiegeProjects[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSiegeProjects[i].id)) {
                    list.push(jsonSiegeProjects[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ('description' in jsonSiegeProjects[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonSiegeProjects[i].description);

                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonSiegeProjects[i].id)) {
                        list.push(jsonSiegeProjects[i].id);
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
            if ('description' in jsonWorldStructures[i]) {
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
    var list = new Array();
    for (i = 0; i < jsonStructureUpgrades.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonStructureUpgrades[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonStructureUpgrades[i].id) && !isInArray(excludeListStructures, jsonStructureUpgrades[i].id)) {
                    list.push(jsonStructureUpgrades[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ('description' in jsonStructureUpgrades[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonStructureUpgrades[i].description);
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonStructureUpgrades[i].id) && !isInArray(excludeListStructures, jsonStructureUpgrades[i].id)) {
                        list.push(jsonStructureUpgrades[i].id);
                    }
                }
            }
            if ('prediction_description' in jsonStructureUpgrades[i]) {
                fieldToSearch = fieldToSearch.replaceAll("_", " ");
                textvalue = Sanitize(jsonStructureUpgrades[i].prediction_description);
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonStructureUpgrades[i].id) && !isInArray(excludeListStructures, jsonStructureUpgrades[i].id)) {
                        list.push(jsonStructureUpgrades[i].id);
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
    var abilitiesList = new Array();
    for (j in jsonUnitAbilities) {
        if ('name' in jsonUnitAbilities[j]) {

            textvalue = jsonUnitAbilities[j].name;
            fieldToSearch = fieldToSearch.replaceAll("_", " ");
            if (textvalue.toUpperCase().indexOf(fieldToSearch.toUpperCase()) != -1) {

                if (!isInArray(abilitiesList, jsonUnitAbilities[j].slug)) {
                    abilitiesList.push(jsonUnitAbilities[j].slug);
                }



            }
        }


    }
    var returnList = new Array();
    for (var i = 0; i < abilitiesList.length; i++) {

        findUnitWithAbility(abilitiesList[i], returnList);
    }


    for (var i = 0; i < returnList.length; i++) {

        if (!isInArray(unitListToCheckTo, returnList[i])) {
            console.log(returnList);
            unitListToCheckTo.push(returnList[i]);



        }
    }

    return unitListToCheckTo;






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
    for (p in jsonUnits) {
        if (jsonUnits[p].id === id) {
            for (l in jsonUnits[p].primary_passives) {
                if (jsonUnits[p].primary_passives[l].slug.indexOf("deprecated") != -1) {
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
        if ('slug' in arraytosearch[j]) {
            textvalue = arraytosearch[j].slug;
            if (textvalue.toUpperCase().indexOf(keyword) > -1) {
                if (listToPushTo.length >= 1) {
                    if (!isInArray(listToPushTo, jsonUnits[index].id)) {
                        listToPushTo.push(jsonUnits[index].id);
                    }
                } else {
                    listToPushTo.push(jsonUnits[index].id);
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

                findUnitWithAbility(jsonUnitAbilities[index].slug, listToPushTo);


            }
            textvalue = arraytosearch[j].name;
            if (textvalue.toUpperCase().indexOf(keyword) != -1) {

                findUnitWithAbility(jsonUnitAbilities[index].slug, listToPushTo);


            }
        }

    }
}

function searchArrayDescription(keyword, arraytosearch, listToPushTo, index) {

    textvalue = Sanitize(arraytosearch.description);
    keyword = keyword.replaceAll("_", " ");
    if (textvalue.toUpperCase().indexOf(keyword) != -1) {

        findUnitWithAbility(jsonUnitAbilities[index].slug, listToPushTo);


    }



}


function findUnitWithAbility(ability, listToPushTo) {
    var i = "";
    var j = "";
    for (i = 0; i < jsonUnits.length; i++) {
        if ('abilities' in jsonUnits[i]) {
            for (j in jsonUnits[i].abilities) {

                if (ability === jsonUnits[i].abilities[j].slug) {
                    if (!isInArray(listToPushTo, jsonUnits[i].id)) {
                        listToPushTo.push(jsonUnits[i].id);
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
