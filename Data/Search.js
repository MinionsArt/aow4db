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

    window.history.replaceState({}, 'foo', currenturl + "?search=" + keywords);

}


function searchDataMod() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInputMod");
    output = document.getElementById("searchOutputMod");
    output.innerHTML = "";


    filter = input.value.toUpperCase();
    //var test = filter.replace(' ', "_");
    searchMods(filter);

}

function searchMods(keyword) {
    var i, output, textvalue, j, l, result = "";

    var fields = keyword.split('+', 3);
    var listMod = new Array();
    output = document.getElementById("searchOutputMod");
    result = document.getElementById("searchResultMod");

    for (i = 0; i < jsonMods.mods.length; i++) {
        textvalue = jsonMods.mods[i].id;
        if (textvalue.toUpperCase().indexOf(fields[0]) > -1) {
            if (listMod.length >= 1) {
                if (!isInArray(listMod, jsonMods.mods[i].slug)) {
                    listMod.push(jsonMods.mods[i].slug);
                }
            } else {
                listMod.push(jsonMods.mods[i].slug);
            }



        }
        textvalue = jsonMods.mods[i].description;
        if (textvalue.toUpperCase().indexOf(fields[0]) > -1) {
            if (listMod.length >= 1) {
                if (!isInArray(listMod, jsonMods.mods[i].slug)) {
                    listMod.push(jsonMods.mods[i].slug);
                }
            } else {
                listMod.push(jsonMods.mods[i].slug);
            }



        }

        textvalue = jsonMods.mods[i].type;
        if (textvalue.toUpperCase().indexOf(fields[0]) > -1) {
            if (listMod.length >= 1) {
                if (!isInArray(listMod, jsonMods.mods[i].slug)) {
                    listMod.push(jsonMods.mods[i].slug);
                }
            } else {
                listMod.push(jsonMods.mods[i].slug);
            }



        }


    }
    // result.innerHTML = listMod.length.toString() + " results found";
    for (j = 0; j < listMod.length; j++) {

        addModCard(listMod[j]);
    }

}

function searchUnits(keyword) {
    var i, output, textvalue, j, l, result = "";

    var fields = keyword.split('+', 3);
    var list = new Array();
    output = document.getElementById("searchOutput");
    result = document.getElementById("searchResult");

    for (i = 0; i < jsonUnits.units.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonUnits.units[i].id;
            if (textvalue.toUpperCase().indexOf(fields[0]) > -1) {
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
            searchArray(fields[0], jsonUnits.units[i].abilities, list, i);
        }
        if (document.getElementById("passivesCheck").checked) {
            searchArray(fields[0], jsonUnits.units[i].primary_passives, list, i);
            searchArray(fields[0], jsonUnits.units[i].secondary_passives, list, i);
        }
        if (document.getElementById("resistancesCheck").checked) {
            searchArray(fields[0], jsonUnits.units[i].resistances, list, i);
        }



    }
    if (document.getElementById("modifiersCheck").checked || document.getElementById("descriptionCheck").checked) {
        for (j = 0; j < jsonUnitAbilities.abilities.length; j++) {
            {
                if (document.getElementById("modifiersCheck").checked) {
                    if (jsonUnitAbilities.abilities[j].modifiers === undefined) {

                    } else {
                        searchArrayDescrip(fields[0], jsonUnitAbilities.abilities[j].modifiers, list, j);
                    }
                }
                if (document.getElementById("descriptionCheck").checked) {

                    searchArrayDescription(fields[0], jsonUnitAbilities.abilities[j], list, j);

                }

            }




        }
    }

    // searchArray(fields[0], jsonUnits.units[i].unit_types, list, i);

    if (fields.length > 1) {
        var workinglist = structuredClone(list);;
        var newWorkingList = new Array();

        newWorkingList = searchUnitsMultiple(workinglist, fields[1]);
        list = structuredClone(newWorkingList);

    }
    if (fields.length >= 3) {
        var workinglist2 = structuredClone(list);;
        finalworkingList = new Array();

        finalworkingList = searchUnitsMultiple(workinglist2, fields[2]);
        list = structuredClone(finalworkingList);
    }

    //result.innerHTML = list.length.toString() + " results found";
    var buttonHolder = document.getElementById("buttonHolder");
    buttonHolder.innerHTML = "";
    var dataHolder = document.getElementById("dataHolder");
    dataHolder.innerHTML = "";
    SetButtonsAndDivs(list, "buttonHolder", "search");
    /*for (j = 0; j < list.length; j++) {

        addUnitCard(list[j]);
    }*/
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
    if (textvalue.toUpperCase().indexOf(keyword) > -1) {

        findUnitWithAbility(jsonUnitAbilities.abilities[index].slug, listToPushTo);


    }



}

function searchArrayDescripMultiple(keyword, workingarray, arraytosearch, listToPush, index) {
    var j = 0;
    for (j in arraytosearch) {
        if (arraytosearch[j].name != null) {

            textvalue = arraytosearch[j].name;
            if (textvalue.toUpperCase().indexOf(keyword) > -1) {

                findUnitWithAbilityMultiple(jsonUnitAbilities.abilities[index].slug, listToPush, workingarray);


            }
        }

    }
}

function findUnitWithAbilityMultiple(ability, listToPushTo, workingarray) {
    for (i = 0; i < jsonUnits.units.length; i++) {
        for (m = 0; m < jsonUnits.units[i].abilities.length; m++) {
            if (ability == jsonUnits.units[i].abilities[m].slug) {

                if (listToPushTo.length >= 1 && isInArray(workingarray, jsonUnits.units[i].id)) {

                    if (!isInArray(listToPushTo, jsonUnits.units[i].id)) {


                        console.log("Found unit" + ability + jsonUnits.units[i].id);
                        listToPushTo.push(jsonUnits.units[i].id);


                    }
                } else {

                    listToPushTo.push(jsonUnits.units[i].id);

                }
            }

        }
    }
}

function findUnitWithAbility(ability, listToPushTo) {
    for (i = 0; i < jsonUnits.units.length; i++) {
        for (j = 0; j < jsonUnits.units[i].abilities.length; j++) {
            if (ability == jsonUnits.units[i].abilities[j].slug) {

                if (listToPushTo.length >= 1) {

                    if (!isInArray(listToPushTo, jsonUnits.units[i].id)) {


                        console.log("Found unit" + ability + jsonUnits.units[i].id);
                        listToPushTo.push(jsonUnits.units[i].id);


                    }
                } else {

                    listToPushTo.push(jsonUnits.units[i].id);

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
            if (textvalue.toUpperCase().indexOf(keyword) > -1 && isInArray(workingarray, jsonUnits.units[index].id)) {
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



function searchArrayMultipleWhole(keyword, workingarray, arraytosearch, listToPush, index) {
    var j = 0;
    for (j in arraytosearch) {
        if (arraytosearch[j].slug != null) {
            textvalue = arraytosearch[j].slug;
            if (textvalue.toUpperCase() == keyword && isInArray(workingarray, jsonUnits.units[index].id)) {
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

function searchUnitsMultiple(workinglist, fieldToSearch) {

    var newlist = new Array();
    for (i = 0; i < jsonUnits.units.length; i++) {
        if (document.getElementById("namesCheck").checked) {
            textvalue = jsonUnits.units[i].id;
            if (textvalue.toUpperCase().indexOf(fieldToSearch) > -1 && isInArray(workinglist, jsonUnits.units[i].id)) {
                if (newlist.length >= 1) {
                    if (!isInArray(newlist, jsonUnits.units[i].id)) {
                        if (!depricatedCheck(jsonUnits.units[i].id)) {
                            newlist.push(jsonUnits.units[i].id);
                        }
                    }
                } else {
                    if (!depricatedCheck(jsonUnits.units[i].id)) {
                        newlist.push(jsonUnits.units[i].id);
                    }
                }

            }
        }
        if (document.getElementById("abilitiesCheck").checked) {
            searchArrayMultiple(fieldToSearch, workinglist, jsonUnits.units[i].abilities, newlist, i);
        }
        if (document.getElementById("passivesCheck").checked) {
            searchArrayMultiple(fieldToSearch, workinglist, jsonUnits.units[i].primary_passives, newlist, i);
            searchArrayMultiple(fieldToSearch, workinglist, jsonUnits.units[i].secondary_passives, newlist, i);
        }
        if (document.getElementById("resistancesCheck").checked) {
            // searchArrayMultiple(fieldToSearch, workinglist, jsonUnits.units[i].unit_types, newlist, i);
            searchArrayMultipleWhole(fieldToSearch, workinglist, jsonUnits.units[i].resistances, newlist, i);
        }

    }

    if (document.getElementById("modifiersCheck").checked) {

        for (j = 0; j < jsonUnitAbilities.abilities.length; j++) {
            {
                if (jsonUnitAbilities.abilities[j].modifiers === undefined) {

                } else {
                    searchArrayDescripMultiple(fieldToSearch, workinglist, jsonUnitAbilities.abilities[j].modifiers, newlist, j);
                }

            }
        }
    }
    return newlist;
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
