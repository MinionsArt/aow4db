function GetAllStartingTomes() {
    var listOfAllTier1Tomes = new Array();

    for (i = 0; i < jsonTomes.tomes.length; i++) {
        if (jsonTomes.tomes[i].tier == 1) {
            listOfAllTier1Tomes.push(jsonTomes.tomes[i]);
        }
    }
    // alert(listOfAllTier1Tomes);
    return listOfAllTier1Tomes;
}

function GetAllOrigins() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Ruler Origin") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }

    return listOfAllOrigins;
}

function GetAllCultures() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Culture") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }

    return listOfAllOrigins;
}

function GetAllForms() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Form") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }

    return listOfAllOrigins;
}

function GetAllMindTraits() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Mind Trait") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }

    return listOfAllOrigins;
}

function GetAllSocietyTraits() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Society Trait") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }

    return listOfAllOrigins;
}

function GetAllBodyTraits() {
    var listOfAllOrigins = new Array();

    for (i = 0; i < jsonFactionCreation.traits.length; i++) {
        if (jsonFactionCreation.traits[i].type == "Body Trait") {
            listOfAllOrigins.push(jsonFactionCreation.traits[i]);
        }
    }

    return listOfAllOrigins;
}

function GetRandomEntry(type) {
    const originButton = document.getElementById("originButton" + type);
    const originWrapper = document.getElementById("originWrapper" + type);

    var randomOrigin;
    switch (type) {
        case "Tome":
            var list = GetAllStartingTomes();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;

        case "Origin":
            var list = GetAllOrigins();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;
        case "Form":
            var list = GetAllForms();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;
        case "Body":
            var list = GetAllBodyTraits();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;
        case "Mind":
            var list = GetAllMindTraits();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            break;
        case "Culture":
            var list = GetAllCultures();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            while (incompatibleCheck("Culture", randomOrigin)) {
                randomOrigin = list[Math.floor(Math.random() * list.length)];
            }
            break;
        case "Society1":
            var list = GetAllSocietyTraits();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            while (incompatibleCheck("Society1", randomOrigin)) {
                randomOrigin = list[Math.floor(Math.random() * list.length)];
            }
            break;
        case "Society2":
            var list = GetAllSocietyTraits();
            randomOrigin = list[Math.floor(Math.random() * list.length)];
            while (incompatibleCheck("Society2", randomOrigin)) {
                randomOrigin = list[Math.floor(Math.random() * list.length)];
            }
            break;

    }
    // console.log(randomOrigin);
    return randomOrigin;


}

function incompatibleCheck(type, origin) {
    var incompatible = false;
    if ('incompatible' in origin) {

        if (type == "Culture") {

            var i = "";
            for (i in origin.incompatible) {

                if (origin.incompatible[i].name == currentSociety1.name || origin.incompatible[i].name == currentSociety2.name) {
                    incompatible = true;
                }
            }

        }
        if (type == "Society1") {

            var i = "";
            for (i in origin.incompatible) {
                if (currentSociety2 != "") {
                    if (currentSociety2.name.indexOf(origin.incompatible[i].name) != -1) {
                        incompatible = true;
                    }
                }
            }

        }
        if (type == "Society2") {
            var i = "";
            for (i in origin.incompatible) {
                if (currentSociety1 != "") {
                    if (currentSociety1.name.indexOf(origin.incompatible[i].name) != -1) {
                        incompatible = true;
                    }
                }

            }

        }
    }
    if (incompatible == true) {
        console.log("found");
    }

    return incompatible;
}
