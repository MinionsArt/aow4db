const searchKeyword = searchParams.get('search');
if (searchKeyword != undefined) {
    searchData(searchKeyword);
}



function isInArray(array, search) {
    return array.indexOf(search) >= 0;
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

    //window.history.replaceState({}, 'foo', currenturl + "?search=" + keywords);

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
                        if (!depricatedCheck(jsonUnits.units[i].id)) {
                            list.push(jsonUnits.units[i].id);
                        }

                    }
                } else {
                    if (!depricatedCheck(jsonUnits.units[i].id)) {
                        list.push(jsonUnits.units[i].id);
                    }
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




function returnSpellList(fieldToSearch) {
    var list = new Array();
    for (i = 0; i < jsonSpells.spells.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonSpells.spells[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonSpells.spells[i].id)) {
                    list.push(jsonSpells.spells[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            textvalue = jsonSpells.spells[i].description;
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
    var list = new Array();
    for (i = 0; i < jsonHeroSkills.skills.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonHeroSkills.skills[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                if (!isInArray(list, jsonHeroSkills.skills[i].id)) {
                    list.push(jsonHeroSkills.skills[i].id);
                }
            }
        }
        if (document.getElementById("descriptionCheck").checked) {
            if ('description' in jsonHeroSkills.skills[i]) {
                textvalue = jsonHeroSkills.skills[i].description;
                if (textvalue.toUpperCase().indexOf(fieldToSearch) != -1) {
                    if (!isInArray(list, jsonHeroSkills.skills[i].id)) {
                        list.push(jsonHeroSkills.skills[i].id);
                    }
                }
            }

        }
    }

    return list;
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
                textvalue = jsonSiegeProjects.projects[i].description;
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




function searchUnits(keyword) {
    var i, output, textvalue, j, l, result = "";

    var fields = keyword.split('+', 3);
    var list = returnUnitList(fields[0]);
    output = document.getElementById("searchOutput");
    result = document.getElementById("searchResult");

    var listspells = returnSpellList(fields[0]);
    var listSiegeProj = returnSiegeProj(fields[0]);
    //var listskills = returnSkillList(fields[0]);



    var buttonHolder = document.getElementById("buttonHolder");

    buttonHolder.innerHTML = "";
    var dataHolder = document.getElementById("dataHolder");
    dataHolder.innerHTML = "";
    SetButtonsAndDivs(list, "buttonHolder", "searchUnit");

    SetCollapsibleButtonsAndDivs("Spells", listspells, "searchSpell");
    SetCollapsibleButtonsAndDivs("Siege Projects", listSiegeProj, "searchSiege");
    // SetCollapsibleButtonsAndDivs("Hero Skills", listskills, "searchSkill");
    SetLevelUpStuff();
}

function searchArray(keyword, arraytosearch, listToPushTo, index) {
    var j = 0;
    for (j in arraytosearch) {
        if (arraytosearch[j].slug != null) {
            textvalue = arraytosearch[j].slug;
            if (textvalue.toUpperCase().indexOf(keyword) > -1) {
                if (listToPushTo.length >= 1) {
                    if (!isInArray(listToPushTo, jsonUnits.units[index].id)) {
                        if (!depricatedCheck(jsonUnits.units[index].id)) {
                            listToPushTo.push(jsonUnits.units[index].id);
                        }

                    }
                } else {
                    if (!depricatedCheck(jsonUnits.units[index].id)) {
                        listToPushTo.push(jsonUnits.units[index].id);
                    }
                }



            }
        }

    }
}

function searchArrayDescrip(keyword, arraytosearch, listToPushTo, index) {
    var j = 0;
    for (j in arraytosearch) {
        if (arraytosearch[j].name != null) {

            textvalue = arraytosearch[j].name;
            if (textvalue.toUpperCase().indexOf(keyword) > -1) {

                findUnitWithAbility(jsonUnitAbilities.abilities[index].slug, listToPushTo);


            }
        }

    }
}

function searchArrayDescription(keyword, arraytosearch, listToPushTo, index) {

    textvalue = arraytosearch.description;
    if (textvalue.toUpperCase().indexOf(keyword) != -1) {

        findUnitWithAbility(jsonUnitAbilities.abilities[index].slug, listToPushTo);


    }



}


function findUnitWithAbility(ability, listToPushTo) {
    var j = "";
    for (i = 0; i < jsonUnits.units.length; i++) {
        if ('abilities' in jsonUnits.units[i]) {
            for (j in jsonUnits.units[i].abilities) {
                console.log(ability);
                if (ability == jsonUnits.units[i].abilities[j].slug) {

                    if (listToPushTo.length >= 1) {

                        if (!isInArray(listToPushTo, jsonUnits.units[i].id)) {
                            listToPushTo.push(jsonUnits.units[i].id);
                        }
                    } else {
                        listToPushTo.push(jsonUnits.units[i].id);
                    }
                }

            }
        }

    }
}

function searchArrayWhole(keyword, arraytosearch, listToPushTo, index) {
    var j = 0;
    for (j in arraytosearch) {
        if (arraytosearch[j].slug != null) {
            textvalue = arraytosearch[j].slug;
            if (textvalue.toUpperCase() == keyword) {
                if (listToPushTo.length >= 1) {
                    if (!isInArray(listToPushTo, jsonUnits.units[index].id)) {
                        if (!depricatedCheck(jsonUnits.units[index].id)) {
                            listToPushTo.push(jsonUnits.units[index].id);
                        }
                    }
                } else {
                    if (!depricatedCheck(jsonUnits.units[index].id)) {
                        listToPushTo.push(jsonUnits.units[index].id);
                    }
                }



            }
        }

    }
}

function depricatedCheck(id) {
    for (i = 0; i < jsonUnits.units.length; i++) {
        if (jsonUnits.units[i].id == id) {
            for (j = 0; j < jsonUnits.units[i].primary_passives.length; j++) {
                if (jsonUnits.units[i].primary_passives[j].slug.indexOf("deprecated") != -1) {

                    return true;

                }
            }

        }


    }
    return false;

}

function searchArrayMultiple(keyword, workingarray, arraytosearch, listToPush, index) {
    var j = 0;
    for (j in arraytosearch) {
        if (arraytosearch[j].slug != null) {
            textvalue = arraytosearch[j].slug;
            if (textvalue.toUpperCase().indexOf(keyword) != -1 && isInArray(workingarray, jsonUnits.units[index].id)) {
                if (listToPush.length >= 1) {
                    if (!isInArray(listToPush, jsonUnits.units[index].id)) {
                        if (!depricatedCheck(jsonUnits.units[index].id)) {
                            listToPush.push(jsonUnits.units[index].id);
                        }
                    }
                } else {
                    if (!depricatedCheck(jsonUnits.units[index].id)) {
                        listToPush.push(jsonUnits.units[index].id);
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
