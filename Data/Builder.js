 // we store the status in this object
 //const queryString = window.location.search;
 //const urlParams = new URLSearchParams(queryString);
 // get parameters stuff
 let searchParams = new URLSearchParams(window.location.search);
 var sorting = searchParams.get('sort');
 var currentView = "";

 function GetTierAndName(id) {
     for (i in jsonUnits.units) {
         if (id == jsonUnits.units[i].id) {
             return romanize(jsonUnits.units[i].tier) + " - " + getUnitTypeTag(jsonUnits.units[i].secondary_passives) + " " + jsonUnits.units[i].name;
         }
     }

 }

 function ShowUnitFromLink() {
     var unitID = searchParams.get('unit');
     showUnitFromString(unitID, "dataHolder");
 }

 function getUnitTypeTag(passivesList) {
     var i = "";
     for (i in passivesList) {
         if (passivesList[i].slug == "fighter_unit") {
             return "<unitFighter></unitFighter>";
         }
         if (passivesList[i].slug == "shock_unit") {
             return "<unitShock></unitShock>";
         }
         if (passivesList[i].slug == "mythic_unit") {
             return "<unitMythic></unitMythic>";
         }
         if (passivesList[i].slug == "skirmisher_unit") {
             return "<unitSkirmisher></unitSkirmisher>";
         }
         if (passivesList[i].slug == "support_unit") {
             return "<unitSupport></unitSupport>";
         }
         if (passivesList[i].slug == "scout_unit") {
             return "<unitScout></unitScout>";
         }
         if (passivesList[i].slug == "ranged_unit") {
             return "<unitRanged></unitRanged>";
         }
         if (passivesList[i].slug == "battle_mage_unit") {
             return "<unitBattlemage></unitBattlemage>";
         }
         if (passivesList[i].slug == "polearm_unit") {
             return "<unitPolearm></unitPolearm>";
         }
         if (passivesList[i].slug == "shield_unit") {
             return "<unitShield></unitShield>";
         }
         if (passivesList[i].slug == "tower") {
             return "<unitTower></unitTower>";
         }
         if (passivesList[i].slug == "siegecraft") {
             return "<unitSiegecraft></unitSiegecraft>";
         }
     }
 }

 function SetButtonsAndDivs(list, parent, cardType) {
     var modName, description, cost, type, tier, i, nameString = "";
     for (i in list) {
         var found = false;

         if (parent === undefined) {
             var buttonHolder = document.getElementById("buttonHolder");
         } else {
             var buttonHolder = document.getElementById(parent);
         }

         var dataHolder = document.getElementById("dataHolder");
         var holderHeight = buttonHolder.offsetHeight + 50;
         dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
         var div = document.createElement("DIV");

         div.className = "w3-container w3-border city";
         div.setAttribute("id", list[i]);


         dataHolder.appendChild(div);

         var divChild = document.createElement("DIV");
         divChild.setAttribute("id", list[i] + "_card");


         div.appendChild(divChild);

         if (cardType == "unit") {
             showUnitFromString(list[i], list[i]);
         }

         if (cardType == "search") {
             showUnitFromString(list[i], list[i]);
         }




         var btn = document.createElement("BUTTON");
         /// tooltipName.style.fontSize = "20px";

         btn.className = "w3-bar-item w3-button tablink";
         btn.type = "button";
         btn.setAttribute("id", list[i] + "-button");



         btn.innerHTML = GetTierAndName(list[i]);
         buttonHolder.appendChild(btn);

         btn.setAttribute("onclick", 'openCity(event,\'' + list[i] + '\')');






     }

 }

 function SetCollapsibleButtonsAndDivs(overwrite, list, cardType) {
     var modName, description, cost, type, tier, i, nameString = "";

     var buttonHolder = document.getElementById("buttonHolder");


     var btn = document.createElement("BUTTON");
     /// tooltipName.style.fontSize = "20px";


     btn.type = "button";



     btn.innerHTML = overwrite + " (" + list.length + ")";
     if (cardType != "unit") {
         btn.setAttribute("onclick", 'openCity(event,\'' + overwrite + '\')');
     }

     buttonHolder.appendChild(btn);


     if (cardType == "spell") {
         btn.className = "w3-bar-item w3-button tablink";
         var dataHolder = document.getElementById("dataHolder");
         var holderHeight = buttonHolder.offsetHeight + 50;
         dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
         var div = document.createElement("DIV");

         div.className = "w3-container w3-border city";
         div.setAttribute("id", overwrite);


         dataHolder.appendChild(div);
         // for (i in list) {
         showSpellFromList(list, overwrite);

         // }





     } else {
         btn.className = "collapsibleUnits";
         var content = document.createElement("DIV");
         content.setAttribute("id", overwrite + "-button");
         content.className = "contentUnits";
         buttonHolder.append(content);

     }

 }




 async function openCity(evt, cityName) {

     currentView = cityName;

     var i, x, tablinks;
     x = document.getElementsByClassName("city");
     for (i = 0; i < x.length; i++) {
         x[i].style.display = "none";
     }

     closeTabLinks(cityName);

     var currentEl = document.getElementById(cityName);
     if (currentEl != null) {
         currentEl.style.display = "block";
     }
     if (evt != null) {
         evt.currentTarget.className += " w3-red";
     }
     var currenturl = window.location.href.split('?')[0];
     var currentadditive = currenturl.split('&')[1];
     if (currentadditive === undefined) {
         currentadditive = "";
     }
     window.history.replaceState({}, 'foo', currenturl + "?type=" + cityName + "&" + currentadditive);

     if (sorting != undefined) {
         var splits = sorting.split(":");
         setTimeout(function () {
             sortDivs(splits[0], splits[1]);
         }, 50);
         // console.log(cityName);
     }

 }

 function closeTabLinks(cityName) {
     tablinks = document.getElementsByClassName("tablink");
     for (i = 0; i < tablinks.length; i++) {
         if (tablinks[i].id != cityName + "-button") {
             tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
         }

     }
 }

 var divState = ["amazon", "assembly", "vanguard", "kirko", "dvar", "syndicate", "shakarn", "oathbound"];
 var divStateweapon1 = ["biochemical", "laser", "firearms", "arc", "psionics", "explosives", "sonic", "entropy"];
 var currentRace = "amazon";

 function showhide(id, weapon, weapon2) {
     if (document.getElementById) {
         if (document.getElementById) {
             var divid = document.getElementById(id);
             //close others
             for (var i = 0; i < divState.length; i++) {

                 var e = document.getElementById(divState[i])
                 e.style.display = 'none'; // hide
                 //  divStateweapon1[div] = false; // reset status
             }


             divid.style.display = 'inline-block';
         }
         currentRace = id;
     }

     if (document.getElementById) {
         var divid = document.getElementById(weapon);
         var divid2 = document.getElementById(weapon2);
         //  if (divStateweapon1[weapon] == true && divStateweapon1[weapon2] == true) {
         //     return;
         // }
         // divStateweapon1[weapon] = (divStateweapon1[weapon]) ? false : true; // initialize / invert status (true is visible and false is closed)
         // divStateweapon1[weapon2] = (divStateweapon1[weapon2]) ? false : true;
         //  divStateweapon1[weapon] = true;
         // divStateweapon1[weapon2] = true;
         //close others
         for (var i = 0; i < divStateweapon1.length; i++) {

             var e = document.getElementById(divStateweapon1[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }


         divid.style.display = 'inline-block';
         divid2.style.display = 'inline-block';
     }

 }
 var divState2 = ["promethean", "synthesis", "voidtech", "psynumbra", "celestian", "xenoplague", "heritor"];

 function showhide2(id) {
     if (document.getElementById) {
         var divid = document.getElementById(id);
         //close others
         for (var i = 0; i < divState2.length; i++) {

             var e = document.getElementById(divState2[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }


         divid.style.display = 'inline-block';
     }
 }
 var divTrees = ["military", "society"];

 function showhideTree(id) {
     if (document.getElementById) {
         var divid = document.getElementById(id);
         //close others
         for (var i = 0; i < divTrees.length; i++) {

             var e = document.getElementById(divTrees[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }


         divid.style.display = 'contents';
     }
 }

 var divTreesEndless = ["endlessMil", "endlessSoc"];

 function showhideEndless(id) {
     if (document.getElementById) {
         var divid = document.getElementById(id);
         //close others
         for (var i = 0; i < divTreesEndless.length; i++) {

             var e = document.getElementById(divTreesEndless[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }


         divid.style.display = 'contents';
     }
 }

 var divsearch = ["unitS", "modS"];

 function showhide3(id) {
     if (document.getElementById) {
         var divid = document.getElementById(id);
         //close others
         for (var i = 0; i < divsearch.length; i++) {

             var e = document.getElementById(divsearch[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }


         divid.style.display = 'contents';
     }
 }

 var divTreesSoc = ["amazond", "assemblyd", "dvard", "kirkod", "syndicated", "vanguardd", "shakarnd", "oathboundd"];
 var divTreesSoc2 = ["amazond5", "assemblyd5", "dvard5", "kirkod5", "syndicated5", "vanguardd5", "shakarnd5", "oathboundd5"];

 var divTreesSoc3 = ["amazond9", "assemblyd9", "dvard9", "kirkod9", "syndicated9", "vanguardd9", "shakarnd9", "oathboundd9"];

 function showhideSoc(id, id2, id3) {
     if (document.getElementById) {
         var divid = document.getElementById(id);
         var divid2 = document.getElementById(id2);
         var divid3 = document.getElementById(id3);
         //close others
         for (var i = 0; i < divTreesSoc.length; i++) {

             var e = document.getElementById(divTreesSoc[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }

         for (var i = 0; i < divTreesSoc2.length; i++) {

             var e = document.getElementById(divTreesSoc2[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }

         for (var i = 0; i < divTreesSoc3.length; i++) {

             var e = document.getElementById(divTreesSoc3[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }

         var end = id.lastIndexOf("d"); //this finds the first occurrence of "." 
         //in string thus giving you the index of where it is in the string

         // Now iend can be -1, if lets say the string had no "." at all in it i.e. no "." is found. 
         //So check and account for it.

         var subString;
         if (end != -1) {
             subString = id.substring(0, end); //this will give abc
         }

         currentRace = subString;
         divid.style.display = 'contents';
         divid2.style.display = 'contents';
         divid3.style.display = 'contents';


     }
 }

 var divTreesSocST = ["celestiand", "heritord", "prometheand", "psynumbrad", "synthesisd", "voidtechd", "xenoplagued"];
 var divTreesSocST2 = ["celestiand7", "heritord7", "prometheand7", "psynumbrad7", "synthesisd7", "voidtechd7", "xenoplagued7"];

 function showhideSocST(id, id2) {
     if (document.getElementById) {
         var divid = document.getElementById(id);
         var divid2 = document.getElementById(id2);
         //close others
         for (var i = 0; i < divTreesSocST.length; i++) {

             var e = document.getElementById(divTreesSocST[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }

         for (var i = 0; i < divTreesSocST2.length; i++) {

             var e = document.getElementById(divTreesSocST2[i])
             e.style.display = 'none'; // hide
             //  divStateweapon1[div] = false; // reset status
         }



         divid.style.display = 'contents';
         divid2.style.display = 'contents';
     }
 }

 function addUnitTypeIcon(a, b) {
     var icontext, iconsrc, iconName, j, btn, imag, spa = "";
     for (j in jsonUnitAbilities.abilities) {
         if (a === jsonUnitAbilities.abilities[j].slug) {
             icontext = jsonUnitAbilities.abilities[j].description;
             iconsrc = a;
             iconName = jsonUnitAbilities.abilities[j].name;


             iconName = iconName.toUpperCase();
             btn = document.createElement("DIV");
             btn.className = "unittype_icon";
             imag = document.createElement("IMG");
             spa = document.createElement("SPAN");
             spa.className = "tooltiptext";
             imag.setAttribute("src", "/aow4db/Icons/Abilities/" + iconsrc + ".png");
             imag.setAttribute('onerror', "this.setAttribute('src','/aow4db/Icons/Text/mp.png')");
             imag.setAttribute("width", "40");
             imag.setAttribute("height", "40");


             spa.innerHTML = "<img style=\"float:left; height:30px; width:30px\" src=\"/aow4db/Icons/Abilities/" + iconsrc + ".png\"><p style=\"color: #d7c297;>" + "<span style=\"font-size=20px;\">" + iconName + "</p>" +
                 "</br>" + icontext;
             iconName = jsonUnitAbilities.abilities[j].name;
             if (iconName === "Shock Unit" || iconName === "Shield Unit" ||
                 iconName === "Fighter Unit" || iconName === "Support Unit" ||
                 iconName === "Battle Mage Unit" || iconName === "Skirmisher Unit" || iconName === "Scout Unit" || iconName === "Polearm Unit" || iconName === "Ranged Unit" || iconName === "Mythic Unit" || iconName === "Tower" || iconName === "Siegecraft") {
                 unitRole = document.getElementById("unit_role");

                 unitRole.setAttribute("src", "/aow4db/Icons/Text/" + iconsrc + ".png");
             }
             document.getElementById("unitstat").appendChild(btn);

             btn.appendChild(imag);
             btn.append(spa);
         }
     }
 }

 function addAbilityslot(a, b) {
     var abilityName, abilityIcon, abilityDescr, abilityDam, abilityAcc, abilityRange, abilityType, abilityNote, j, splitDamageString, abilityDamType, abilityReq, abilityMod = "";

     for (j in jsonUnitAbilities.abilities) {
         if (a == jsonUnitAbilities.abilities[j].slug) {
             if (jsonUnitAbilities.abilities[j].damage === undefined) {
                 abilityDam = "";
             } else {
                 abilityDam = jsonUnitAbilities.abilities[j].damage;
             }






             abilityType = jsonUnitAbilities.abilities[j].actionPoints;



             abilityName = jsonUnitAbilities.abilities[j].name;
             abilityIcon = jsonUnitAbilities.abilities[j].icon;


             if (jsonUnitAbilities.abilities[j].requisites === undefined) {
                 abilityReq = "";
             } else {
                 abilityReq = "";
                 for (k in jsonUnitAbilities.abilities[j].requisites) {
                     if (k == 0) {
                         abilityReq = "(";
                     }
                     abilityReq += jsonUnitAbilities.abilities[j].requisites[k].requisite;
                     if (k != jsonUnitAbilities.abilities[j].requisites.length - 1) {
                         abilityReq += ",";
                     } else {
                         abilityReq += ")";
                     }
                 }

             }

             if (jsonUnitAbilities.abilities[j].modifiers === undefined) {
                 abilityMod = "";
             } else {


                 for (l in jsonUnitAbilities.abilities[j].modifiers) {
                     abilityName += "&#11049";
                     abilityMod += "<bullet>" + jsonUnitAbilities.abilities[j].modifiers[l].name + "<br>";
                     abilityMod += jsonUnitAbilities.abilities[j].modifiers[l].description + "</bullet><br>";
                 }

             }

             // add notes


             abilityNote = "";
             for (l in jsonUnitAbilities.abilities[j].notes) {
                 if (jsonUnitAbilities.abilities[j].notes[l] === undefined) {

                 } else {
                     abilityNote += "<bullet>" + jsonUnitAbilities.abilities[j].notes[l].note + "</bullet>";

                 }

             }

             //   var n = abilityDescr.includes("Unique");


             abilityDam = jsonUnitAbilities.abilities[j].damage;
             abilityRange = jsonUnitAbilities.abilities[j].range + "<range></range>";
             abilityAcc = jsonUnitAbilities.abilities[j].accuracy + "<accuracy></accuracy>";

             var tooltipName = document.createElement("SPAN");
             var btn = document.createElement("DIV");
             /// tooltipName.style.fontSize = "20px";
             tooltipName.innerHTML = "test";
             btn.className = "unit_abilityslot";
             // if (n === true) {
             //   btn.style.backgroundColor = "rgb(73, 0, 80)";
             //} 
             var imag = document.createElement("IMG");
             imag.className = "unit_ability_icon";
             var spa = document.createElement("SPAN");
             var tex = document.createElement("DIV");
             tex.className = "tooltip";
             tex.innerHTML = abilityName;
             tex.setAttribute('onclick', '');
             var dam = document.createElement("DIV");
             dam.className = "ability_damage";
             dam.innerHTML = abilityDam;
             spa.className = "tooltiptext";
             abilityDescr = jsonUnitAbilities.abilities[j].description;

             var abilityIconType = "";
             imag.setAttribute("src", "/aow4db/Icons/Abilities/" + abilityIcon + ".png");
             if (abilityDam != undefined) {
                 splitDamageString = abilityDam.split(">");
                 if (splitDamageString[0].indexOf("phys") != -1) {
                     var abilityIconType = "ability_icon_phys";
                 } else if (splitDamageString[0].indexOf("frost") != -1) {
                     var abilityIconType = "ability_icon_frost";
                 } else if (splitDamageString[0].indexOf("blight") != -1) {
                     var abilityIconType = "ability_icon_blight";
                 } else if (splitDamageString[0].indexOf("spirit") != -1) {
                     var abilityIconType = "ability_icon_spirit";
                 } else if (splitDamageString[0].indexOf("fire") != -1) {
                     var abilityIconType = "ability_icon_fire";
                 } else {
                     var abilityIconType = "ability_icon";
                 }

             } else {
                 var abilityIconType = "ability_icon"
             }

             imag.setAttribute("style", "background-image: url(\"/aow4db/Icons/Interface/" + abilityIconType + ".png\");background-repeat: no-repeat;background-size: 40px 40px");

             imag.setAttribute('onerror', "this.setAttribute('src','/aow4db/Icons/Text/mp.png')");
             imag.setAttribute("width", "40");
             imag.setAttribute("height", "40");

             // block one, header
             spa.innerHTML = "<div style\"display:block\"><img style=\"float:left; height:50px; width:50px; background-image:url(\'/aow4db/Icons/Interface/" + abilityIconType + ".png');background-repeat: no-repeat;background-size: 50px\" src=\"/aow4db/Icons/Abilities/" + abilityIcon + ".png\">";

             spa.innerHTML += "<div class=\"leftAbility\" style=\"color:#d7c297;\">" + abilityName.toUpperCase() + "</div>" + "<div class=\"rightAbility\">" + abilityDam + "</div><br>";

             spa.innerHTML += "<div style=\"clear:right\"> </div>";
             spa.innerHTML += "<div class=\"leftAbility\">" + abilityAcc + abilityRange + "</div>" + "<div class=\"rightAbility\">" + abilityType + "</div></div>";
             spa.innerHTML += "<div style=\"clear:both\"> </div>";


             // block 2, descrp
             spa.innerHTML += "<br>" + abilityDescr;

             // modifiers
             if (abilityMod != "") {
                 spa.innerHTML += "<p style=\"color:#addd9e;font-size: 13px\">" + abilityMod + "</p>";
             }


             // block 3, req
             //notes

             spa.innerHTML += "<p style=\"color:#a4a4a6; font-size: 12px\">" + abilityNote + "</p>";



             spa.innerHTML += abilityReq;

             if (abilityName.indexOf("Defense Mode") > -1) {
                 spa.innerHTML = "<div class=\"leftAbility\" style=\"color:#d7c297;\">" + abilityName.toUpperCase();
                 spa.innerHTML += "<div style=\"clear:both\"> </div>" + "<br>";
                 spa.innerHTML += jsonUnitAbilities.abilities[j].description;
                 dam.innerHTML = "";
             }





             document.getElementById("unitabholder").append(btn);
             tex.appendChild(spa);

             btn.appendChild(imag);
             btn.append(tex);
             btn.append(dam);

         }
     }

 }

 function addPassiveslot(a) {
     var abilityName, abilityIcon, abilityDescr, j = "";
     for (j in jsonUnitAbilities.abilities) {
         if (a == jsonUnitAbilities.abilities[j].slug) {
             abilityName = jsonUnitAbilities.abilities[j].name;
             abilityIcon = jsonUnitAbilities.abilities[j].slug;
             abilityDescr = jsonUnitAbilities.abilities[j].description;

             var btn = document.createElement("DIV");
             btn.className = "unit_passiveslot";
             var imag = document.createElement("IMG");
             imag.className = "unit_ability_icon";
             var spa = document.createElement("SPAN");
             var tex = document.createElement("DIV");
             tex.className = "tooltip";
             tex.setAttribute('onclick', '');
             tex.innerHTML = abilityName;



             spa.className = "tooltiptext";

             imag.setAttribute("src", "/aow4db/Icons/Abilities/" + abilityIcon + ".png");
             imag.setAttribute('onerror', "this.setAttribute('src','/aow4db/Icons/Text/mp.png')");
             imag.setAttribute("width", "40");
             imag.setAttribute("height", "40");


             spa.innerHTML = "<img style=\"float:left; height:30px; width:30px\" src=\"/aow4db/Icons/Abilities/" + abilityIcon + ".png\"><p style=\"color: #d7c297;>" + "<span style=\"font-size=20px;\">" + abilityName.toUpperCase() + "</p>" +
                 "</br>" + abilityDescr;


             document.getElementById("unitabholder").appendChild(btn);

             btn.appendChild(imag);




             tex.appendChild(spa);


             btn.append(tex);

         }
     }

 }

 function addResistanceSlot(a) {
     var abilityName, abilityIcon, abilityDescr, abilityDam = "";
     for (j in jsonUnitAbilities.abilities) {
         if (a == jsonUnitAbilities.abilities[j].slug) {
             abilityName = jsonUnitAbilities.abilities[j].name;
             abilityIcon = jsonUnitAbilities.abilities[j].icon;
             abilityDescr = jsonUnitAbilities.abilities[j].description;
             abilityDam = jsonUnitAbilities.abilities[j].damage;
             var btn = document.createElement("DIV");
             btn.className = "resistance_icon";
             var imag = document.createElement("IMG");
             imag.className = "unit_ability_icon";


             spa = document.createElement("SPAN");
             spa.className = "tooltiptext";

             spa.innerHTML = "<p>" + "<span style=\"font-size=20px\">" + abilityName + "</p>" + "<hr>" + abilityDescr;

             imag.setAttribute("width", "25");
             imag.setAttribute("height", "25");

             if (a.indexOf("frost") !== -1) {
                 imag.setAttribute("src", "/aow4db/Icons/Text/frost_resistance.png");
             }
             if (a.indexOf("blight") !== -1) {
                 imag.setAttribute("src", "/aow4db/Icons/Text/blight_resistance.png");
             }
             if (a.indexOf("fire") !== -1) {
                 imag.setAttribute("src", "/aow4db/Icons/Text/fire_resistance.png");
             }
             if (a.indexOf("spirit") !== -1) {
                 imag.setAttribute("src", "/aow4db/Icons/Text/spirit_resistance.png");
             }
             if (a.indexOf("lightning") !== -1) {
                 imag.setAttribute("src", "/aow4db/Icons/Text/lightning_resistance.png");
             }

             if (a.indexOf("weakness") !== -1) {
                 var split = a.split("weakness_");
                 abilityDam = "<p class=\"resistanceNumber\" style=\"color:red;\">-" + split[1];
             }
             if (a.indexOf("resistance") !== -1) {
                 var split = a.split("resistance_");
                 abilityDam = "<p class=\"resistanceNumber\" style=\"color:green;\">" + split[1];
             }



             document.getElementById("resistanceholder").appendChild(btn);
             btn.innerHTML = abilityDam;

             btn.appendChild(imag);

             btn.append(spa);




         }
     }

 }

 function addstatusResistanceSlot(a) {
     var abilityName, abilityIcon, abilityDescr, abilityDam = "";



     var btn = document.createElement("DIV");
     btn.className = "resistance_icon";
     var imag = document.createElement("IMG");
     imag.className = "unit_ability_icon";


     spa = document.createElement("SPAN");
     spa.className = "tooltiptext";

     // spa.innerHTML = "<p>" + "<span style=\"font-size=20px\">" + abilityName + "</p>" + "<hr>" + abilityDescr;

     imag.setAttribute("width", "25");
     imag.setAttribute("height", "25");


     imag.setAttribute("src", "/aow4db/Icons/Text/status_resistance.png");

     abilityDam = a;

     document.getElementById("resistanceholder").appendChild(btn);
     btn.innerHTML = "<p class=\"resistanceNumber\">" + abilityDam;

     btn.appendChild(imag);

     btn.append(spa);






 }

 function EliteSkill(a) {
     var nam = "";
     for (j in jsonUnitAbilities.abilities) {
         if (a == jsonUnitAbilities.abilities[j].slug) {
             nam = jsonUnitAbilities.abilities[j].name;
         }

     }
     return nam;
 }

 function addEliteSkill(a) {
     var abilityName, abilityIcon, abilityDescr = "";
     for (j in jsonUnitAbilities.abilities) {
         if (a == jsonUnitAbilities.abilities[j].slug) {
             abilityName = jsonUnitAbilities.abilities[j].name;
             abilityIcon = jsonUnitAbilities.abilities[j].slug;
             abilityDescr = jsonUnitAbilities.abilities[j].description;

             var btn = document.createElement("DIV");
             btn.className = "unit_elite_skill";
             var imag = document.createElement("IMG");
             imag.className = "unit_ability_icon";
             var spa = document.createElement("SPAN");
             var tex = document.createElement("DIV");
             tex.className = "tooltip";
             tex.setAttribute('onclick', '');
             tex.innerHTML = abilityName;
             spa.className = "tooltiptext";
             spa.innerHTML = "<p>" + "<span style=\"font-size=20px\">" + abilityName + "</p>" + "<hr>" + abilityDescr;
             imag.setAttribute("src", "/aowp/UI/elite_rank.png");
             imag.setAttribute("width", "40");
             imag.setAttribute("height", "40");

             document.getElementById("unitabholder").appendChild(btn);
             // document.getElementById("unitabholder").setAttribute("id", "unitabholder" + b);

             tex.appendChild(spa);

             btn.appendChild(imag);
             btn.append(tex);

         }
     }

 }
 async function spawnCards(list, divID) {
     if (divID === undefined) {
         divID = "units";
     }
     var doc = document.getElementById(divID);
     for (var i = 0; i < list.length; i++) {

         var iDiv = unit_card_template.content.cloneNode(true);
         doc.appendChild(iDiv);
     }

 }





 async function showUnitsFromList(list, overwritetext) {

     SetCollapsibleButtonsAndDivs(overwritetext, list, "unit");
     SetButtonsAndDivs(list, overwritetext + "-button", "unit");


 }

 async function spawnCard(string, divID) {
     if (divID === undefined) {
         divID = "units";
     }
     var doc = document.getElementById(divID);

     var iDiv = unit_card_template.content.cloneNode(true);
     doc.appendChild(iDiv);


 }

 async function showUnitFromString(string, divID) {
     await spawnCard(string, divID);
     showUnit(string, divID);
 }


 var ascendingOrder = false;

 function sortDivs(sortType, savedOrder) {
     var i = "";

     // 2 - Detemine the selector
     if (savedOrder != null) {
         ascendingOrder = savedOrder;
     } else {
         ascendingOrder = !ascendingOrder;
     }

     var buttontargets = document.getElementsByClassName("sortingButton");

     for (i in buttontargets) {
         buttontargets[i].className = "sortingButton";
     }
     var currentbutton = document.getElementById(sortType + "-button");
     console.log(sortType);
     if (ascendingOrder) {
         currentbutton.className += " activeDown";
     } else {
         currentbutton.className += " activeUp";
     }




     // 3 - Choose the wanted order
     //  ascendingOrder = !ascendingOrder;
     const isNumeric = true;

     // 4 - Select all elements
     var container = document.getElementById(currentView);
     var element = elements = [...container.querySelectorAll('.mod_card')]



     var selector = element => element.querySelector('.mod_name').innerHTML;
     if (sortType == "tier") {
         selector = element => element.querySelector('.spell_tier').innerHTML;

     }
     if (sortType == "cost") {
         selector = element => element.querySelector('.spell_cost').innerHTML;
     }


     // 5 - Find their parent
     const parentElement = container;

     // 6 - Sort the elements
     const collator = new Intl.Collator(undefined, {
         numeric: isNumeric,
         sensitivity: 'base'
     });


     elements
         .sort((elementA, elementB) => {
             const [firstElement, secondElement] = ascendingOrder ? [elementA, elementB] : [elementB, elementA];

             var textOfFirstElement = selector(firstElement);

             var textOfSecondElement = selector(secondElement);
             if (sortType == "tier") {
                 var fields = textOfFirstElement.split('Tier ', 3);
                 textOfFirstElement = deromanize(fields[1]);
                 var fields2 = textOfSecondElement.split('Tier ', 3);
                 textOfSecondElement = deromanize(fields2[1]);

             }

             return collator.compare(textOfFirstElement, textOfSecondElement)
         })
         .forEach(element => parentElement.appendChild(element));


     var currenturl = window.location.href.split('&')[0];

     window.history.replaceState({}, 'foo', currenturl + "&sort=" + sortType + ":" + ascendingOrder);
     sorting = sortType + ":" + ascendingOrder;
 }

 async function SetCollapsibleStuff() {
     var coll = document.getElementsByClassName("collapsibleUnits");

     var i = "";

     for (i = 0; i < coll.length; i++) {
         coll[i].addEventListener("click", function () {
             var contents = document.getElementsByClassName("contentUnits");
             var content = this.nextElementSibling;

             for (j = 0; j < contents.length; j++) {


                 if (contents[j].style != null) {
                     if (contents[j].style.display === "grid") {
                         if (contents[j].id === content.id) {

                         } else {
                             console.log(contents[j].id, content.id);
                             coll[j].classList.toggle("active");
                             contents[j].style.display = "none";
                         }

                     }
                 }

             }
             this.classList.toggle("active");

             if (content.style.display === "grid") {
                 content.style.display = "none";
             } else {
                 content.style.display = "grid";
             }




             var buttonHolder = document.getElementById("buttonHolder");
             var holderHeight = buttonHolder.offsetHeight;
             var dataHolder = document.getElementById("dataHolder");
             dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
         });


     }

     var buttonHolder = document.getElementById("buttonHolder");
     var holderHeight = buttonHolder.offsetHeight;
     var dataHolder = document.getElementById("dataHolder");
     dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;");
 }

 async function SetLevelUpStuff() {
     var coll = document.getElementsByClassName("collapsibleLevelup");
     var content = document.getElementsByClassName("contentLevelup");
     var i;

     for (i = 0; i < coll.length; i++) {
         coll[i].addEventListener("click", function () {
             //this.classList.toggle("active");
             for (j in content) {
                 coll[j].classList.toggle("active");
                 //  var content = this.nextElementSibling;
                 if (content[j].style.display === "block") {
                     content[j].style.display = "none";
                 } else {
                     content[j].style.display = "block";

                 }
             }

         });
     }




     // console.log(product, sorting);

     const urlParams = new URLSearchParams(window.location.search);
     const product = searchParams.get('type');


     if (product != undefined) {
         var splits = product.split("&");
         closeTabLinks(product);
         document.getElementById(product + "-button").className += " w3-red";


         await openCity(event, product);


     }



     //if (sorting != undefined) {


     // setTimeout(function () {
     //      sortDivs(sorting);
     //   }, 50);

     //  }


 }



 async function spawnEquipCards(list, divID) {
     if (divID === undefined) {
         divID = "equip";
     }
     var doc = document.getElementById(divID);
     for (var i = 0; i < list.length; i++) {
         var iDiv = item_card_template.content.cloneNode(true);
         doc.appendChild(iDiv);
     }

 }


 async function showEquipmentFromList(list, divID) {


     await spawnEquipCards(list, divID);

     /* for (var i = 0; i < list.length; i++) {

          showEquipment(list[i], divID);

      };*/




 }

 async function spawnTomeCards(list, divID) {
     if (divID === undefined) {
         divID = "tome";
     }
     var doc = document.getElementById(divID);
     for (var i = 0; i < list.length; i++) {
         var iDiv = tome_card_template.content.cloneNode(true);
         doc.appendChild(iDiv);
     }

 }


 async function showTomeFromList(list, divID) {


     await spawnTomeCards(list, divID);

     for (var i = 0; i < list.length; i++) {

         showTome(list[i], divID);

     };




 }

 async function spawnSpellCards(list, divID) {
     if (divID === undefined) {
         divID = "spell";
     }
     var doc = document.getElementById(divID);
     for (var i = 0; i < list.length; i++) {
         var iDiv = spell_card_template.content.cloneNode(true);
         doc.appendChild(iDiv);
     }

 }

 async function spawnStructureCards(list, divID) {
     if (divID === undefined) {
         divID = "spell";
     }
     var doc = document.getElementById(divID);
     for (var i = 0; i < list.length; i++) {
         var iDiv = structure_card_template.content.cloneNode(true);
         doc.appendChild(iDiv);
     }

 }

 async function showSpellFromList(list, divID) {


     await spawnSpellCards(list, divID);

     for (var i = 0; i < list.length; i++) {

         showSpell(list[i], true);

     };




 }
 async function showStructuresWithArgument(argument, divID, argumentType, includeProvince) {

     var list = new Array();
     list = findStructuresWithArgument(argument, argumentType, includeProvince);

     await spawnStructureCards(list, divID);

     for (var i = 0; i < list.length; i++) {

         showStructure(list[i], true);

     };




 }

 async function showSpellsWithArgument(argument, argumentType, overwritetext) {

     var list = new Array();
     list = findSpellsWithArgument(argument, argumentType);

     SetCollapsibleButtonsAndDivs(overwritetext, list, "spell");




 }

 async function showSpellFromString(string, divID) {
     await spawnSpellCards(string, divID);
     showSpell(string, true);

 }

 function findSpellsWithArgument(argumentaffinity, argumentType) {
     var i, output, affinity, textvalue, j, l, k, x, result = "";

     var finalCheckedList = new Array();
     if (argumentaffinity == "") {
         for (j in jsonSpells.spells) {

             if (jsonSpells.spells[j].spellType.indexOf(argumentType) !== -1) {

                 finalCheckedList.push(jsonSpells.spells[j].id);
             }



         }
     } else {
         var listMod = new Array();
         for (i in jsonTomes.tomes) {
             affinity = jsonTomes.tomes[i].affinities;

             if (affinity != undefined) {
                 if (affinity.toUpperCase().indexOf(argumentaffinity.toUpperCase()) !== -1) {
                     for (k in jsonTomes.tomes[i].skills) {
                         listMod.push(jsonTomes.tomes[i].skills[k].spell_slug);

                     }

                 }
             } else {
                 if (argumentaffinity == "General Research") {
                     if (jsonTomes.tomes[i].name.toUpperCase().indexOf("General Research".toUpperCase()) !== -1) {
                         for (k in jsonTomes.tomes[i].skills) {
                             listMod.push(jsonTomes.tomes[i].skills[k].spell_slug);

                         }

                     }
                 }

                 if (argumentaffinity == "Culture") {
                     if (jsonTomes.tomes[i].name.toUpperCase().indexOf("Mystic".toUpperCase()) !== -1 || jsonTomes.tomes[i].name.toUpperCase().indexOf("Feudal".toUpperCase()) !== -1 || jsonTomes.tomes[i].name.toUpperCase().indexOf("Barbarian".toUpperCase()) !== -1 || jsonTomes.tomes[i].name.toUpperCase().indexOf("Dark".toUpperCase()) !== -1 || jsonTomes.tomes[i].name.toUpperCase().indexOf("High".toUpperCase()) !== -1 || jsonTomes.tomes[i].name.toUpperCase().indexOf("Industrious".toUpperCase()) !== -1) {
                         for (k in jsonTomes.tomes[i].skills) {
                             listMod.push(jsonTomes.tomes[i].skills[k].spell_slug);

                         }

                     }
                 }
             }




         }


         for (j in jsonSpells.spells) {
             for (x in listMod) {
                 if (listMod[x] == jsonSpells.spells[j].id) {
                     if (jsonSpells.spells[j].spellType.toUpperCase().indexOf(argumentType.toUpperCase()) !== -1) {

                         finalCheckedList.push(jsonSpells.spells[j].id);
                     }
                 }
             }

         }
     }

     return finalCheckedList;
 }

 function findStructuresWithArgument(income, argumentType, includeprovince) {
     var i, output, affinity, textvalue, j, l, k, x, result = "";

     var finalCheckedList = new Array();
     if (argumentType != "") {
         for (j in jsonStructureUpgrades.structures) {

             if (jsonStructureUpgrades.structures[j].name.toUpperCase().indexOf(argumentType.toUpperCase()) !== -1) {
                 if (jsonStructureUpgrades.structures[j].is_sector_upgrade.toString() == includeprovince) {
                     finalCheckedList.push(jsonStructureUpgrades.structures[j].id);
                 }



             }
         }
     }
     if (income != "") {
         for (j in jsonStructureUpgrades.structures) {

             if (jsonStructureUpgrades.structures[j].prediction_description.toUpperCase().indexOf(income.toUpperCase()) !== -1) {
                 if (jsonStructureUpgrades.structures[j].is_sector_upgrade.toString() == includeprovince) {
                     finalCheckedList.push(jsonStructureUpgrades.structures[j].id);
                 }

             }



         }
     }




     return finalCheckedList;
 }





 function checkModRequirements(unit) {
     var j, check, checksplit, checknot, checknotsplit = "";
     for (j in jsonSpells.spells) {
         checksplit = jsonSpells.spells[j].check.split(" ");
         checknotsplit = jsonSpells.spells[j].checknot.split(" ");
         for (k in checksplit) {
             if (divs[i].innerHTML.indexOf(checksplit[k]) !== -1) {
                 // something
             }
         }
     }
 }






 function showModsFromList(list, divId) {
     for (let i = 0; i < list.length; i++) {
         var iDiv = mod_card_template.content.cloneNode(true);
         if (divId === undefined) {
             document.getElementById("mods").appendChild(iDiv);
         } else {
             document.getElementById(divId).appendChild(iDiv);
         }
         showMod(list[i]);

     };
 }

 function showUnit(a, divID) {
     var hp, mp, shield, armor, descr, j, k, x, y, z, unitName, unitRole, icon, imagelink, prodcost, tier, research, building, reward, evolveTarget = "";
     var found = false;
     for (i in jsonUnits.units) {
         if (a == jsonUnits.units[i].id) {
             // icon = document.getElementById("uniticon");
             // icon.setAttribute("src", "/aowp/Icons/UnitIcons/" + a + "_icon.png");
             //icon.setAttribute("id", "uniticon" + a);
             // if (icon.getAttribute('src') === "/aowp/Icons/UnitIcons/undefined") {
             //   icon.setAttribute('src', "/aowp/Icons/placeholder.png");
             // }
             unitName = document.getElementById("unitstring");
             unitName.setAttribute("id", "unitstring" + a);

             unitName.innerHTML += jsonUnits.units[i].name.toUpperCase();



             // descr = document.getElementById("description");
             //descr.setAttribute("id", "description" + a);
             //descr.innerHTML = jsonUnits.units[i].description;
             imagelink = document.getElementById("vid");
             imagelink.setAttribute("id", "vid" + a);
             imagelink.setAttribute('src', "/aow4db/Previews/" + jsonUnits.units[i].id + ".mp4");
             if (imagelink.getAttribute('src') === "/aow4db/Previews/undefined") {
                 imagelink.setAttribute('src', "/aow4db/Previews/placeholder.mp4");
             }
             // research = document.getElementById("researchorigin");
             // research.setAttribute("id", "researchorigin" + a);
             // if (jsonUnits.units[i].origin_research != "") {
             // research.setAttribute("src", "/Icons/Research/" + jsonUnits.units[i].origin_research + ".jpg");
             // research.setAttribute("src", "/Icons/Research/" + jsonUnits.units[i].origin_research + ".jpg");
             //     research.innerHTML = jsonUnits.units[i].origin_research;
             // } else {
             //    research.setAttribute("src", "/aowp/UI/empty.png");
             //    research.setAttribute("style", "width: 0px");

             // }

             // building = document.getElementById("buildingorigin");
             // building.setAttribute("id", "buildingorigin" + a);
             // if (jsonUnits.units[i].origin_research != "") {
             // building.setAttribute("src", "/Icons/Buildings/" + jsonUnits.units[i].origin_building + ".jpg");
             //      building.innerHTML = jsonUnits.units[i].origin_building;
             //  } else {
             //     building.setAttribute("src", "/aowp/UI/empty.png");

             //     building.setAttribute("style", "width: 0px");
             // }
             hp = document.getElementById("hp")
             hp.setAttribute("id", "hp" + a);
             hp.innerHTML = jsonUnits.units[i].hp;
             armor = document.getElementById("armor")
             armor.setAttribute("id", "armor" + a);
             armor.innerHTML = jsonUnits.units[i].armor;
             shield = document.getElementById("resistence");
             shield.setAttribute("id", "shield" + a);
             shield.innerHTML = jsonUnits.units[i].resistance;
             mp = document.getElementById("mp");
             mp.setAttribute("id", "mp" + a);
             mp.innerHTML = jsonUnits.units[i].mp;
             tier = document.getElementById("tier");
             tier.setAttribute("id", "tier" + a);



             tier.innerHTML = "Tier " + romanize(jsonUnits.units[i].tier) + ": " + jsonUnits.units[i].upkeep;


             prodcost = document.getElementById("productioncost");
             prodcost.setAttribute("id", "productioncost" + a);
             prodcost.innerHTML = "Cost: " + jsonUnits.units[i].cost;

             for (j in jsonUnits.units[i].secondary_passives) {
                 addUnitTypeIcon(jsonUnits.units[i].secondary_passives[j].slug, a);

             }

             for (k in jsonUnits.units[i].abilities) {
                 addAbilityslot(jsonUnits.units[i].abilities[k].slug);

             }
             for (z in jsonUnits.units[i].resistances) {
                 addResistanceSlot(jsonUnits.units[i].resistances[z].slug);

             }
             if (jsonUnits.units[i].status_resistance != "0") {
                 addstatusResistanceSlot(jsonUnits.units[i].status_resistance);
             }


             for (x in jsonUnits.units[i].primary_passives) {
                 addPassiveslot(jsonUnits.units[i].primary_passives[x].slug);

             }


             document.getElementById("unitabholder").setAttribute("id", "unitabholder" + a);

             document.getElementById("unitstat").setAttribute("id", "unitstat" + a);

             document.getElementById("resistanceholder").setAttribute("id", "resistanceholder" + a);
             document.getElementById("unit_role").setAttribute("id", "unit_role" + a);


             addLevelUpInfo(jsonUnits.units[i], a);
             found = true;
             // break;
         }


     }
     if (found == false) {
         console.log("Couldn't find unit: " + a + i);
     }

 }

 function addLevelUpInfo(units, a) {
     var levelup = document.getElementById("levelup");
     levelup.setAttribute("id", "levelup" + a);
     evolveTarget = units.evolve_target;

     var levelText = "";
     levelText += "<p style=\"  color: #aadb9c;\"> <img src=\"/aow4db/Icons/Text/medal_soldier.png\" width='20'\"> Soldier</p>";
     for (i in units.medal_rewards_2) {
         levelText += "<bullet>" + lookupSlug(units.medal_rewards_2[i].slug) + "</bullet>";

     }
     levelText += "<p style=\"  color: #aadb9c;\"> <img src=\"/aow4db/Icons/Text/medal_veteran.png\" width='20'\"> Veteran</p>";
     for (i in units.medal_rewards_3) {
         levelText += "<bullet>" + lookupSlug(units.medal_rewards_3[i].slug) + "</bullet>";

     }
     levelText += "<p style=\"  color: #aadb9c;\"> <img src=\"/aow4db/Icons/Text/medal_elite.png\" width='20'\"> Elite</p>";

     for (i in units.medal_rewards_4) {

         if (units.medal_rewards_4[i].slug.indexOf("medal") != -1) {
             levelText += "<p class=\"levelup_medal\">" + "<bullet>" + lookupSlug(units.medal_rewards_4[i].slug);
             levelText += "<span class=\"tooltiptext\" style=\"font-size=20px\">" + lookupSlugDescription(units.medal_rewards_4[i].slug) + "</span>  </p> </bullet> ";
         } else {
             levelText += "<bullet>" + lookupSlug(units.medal_rewards_4[i].slug) + "</bullet>";
         }

     }
     if (evolveTarget != undefined) {
         levelText += "<bullet> Evolves into <hyperlink> <a href=\"/aow4db/HTML/Units.html?unit=" + evolveTarget + "\" target=\"_blank\">" + lookupUnit(evolveTarget) + "</a></hyperlink></bullet>";
     }

     if (evolveTarget === undefined) {


         levelText += "<p style=\"  color: #aadb9c;\"> <img src=\"/aow4db/Icons/Text/medal_champion.png\" width='20'\"> Champion</p>";

         for (i in units.medal_rewards_5) {
             levelText += "<bullet>" + lookupSlug(units.medal_rewards_5[i].slug) + "</bullet>";

         }

         levelText += "<p style=\"  color: #aadb9c;\"> <img src=\"/aow4db/Icons/Text/medal_legend.png\" width='20'\"> Legend</p>";
         for (i in units.medal_rewards_6) {
             if (units.medal_rewards_6[i].slug.indexOf("medal") != -1) {
                 levelText += "<p class=\"levelup_medal\">" + "<bullet>" + lookupSlug(units.medal_rewards_6[i].slug);
                 levelText += "<span class=\"tooltiptext\" style=\"font-size=20px\">" + lookupSlugDescription(units.medal_rewards_6[i].slug) + "</span>  </p> </bullet> ";
             } else {
                 levelText += "<bullet>" + lookupSlug(units.medal_rewards_6[i].slug) + "</bullet>";
             }


         }
     }

     levelup.innerHTML = levelText;


 }

 function lookupUnit(id) {
     for (j in jsonUnits.units) {
         if (id == jsonUnits.units[j].id) {
             return jsonUnits.units[j].name;
         }

     }
     return "Couldn't find this";
 }

 function lookupSlugDescription(slug) {
     for (j in jsonUnitAbilities.abilities) {
         if (slug == jsonUnitAbilities.abilities[j].slug) {
             return jsonUnitAbilities.abilities[j].description;
         }

     }
     return "Couldn't find this";
 }

 function lookupSlug(slug) {
     for (j in jsonUnitAbilities.abilities) {
         if (slug == jsonUnitAbilities.abilities[j].slug) {
             return jsonUnitAbilities.abilities[j].name;
         }

     }
     return "Couldn't find this";
 }

 function romanize(num) {
     if (isNaN(num))
         return NaN;
     var digits = String(+num).split(""),
         key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
               "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
               "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
         roman = "",
         i = 3;
     while (i--)
         roman = (key[+digits.pop() + (i * 10)] || "") + roman;
     return Array(+digits.join("") + 1).join("M") + roman;
 }

 function deromanize(str) {
     var str = str.toUpperCase();
     var validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
     var token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
     var key = {
         M: 1000,
         CM: 900,
         D: 500,
         CD: 400,
         C: 100,
         XC: 90,
         L: 50,
         XL: 40,
         X: 10,
         IX: 9,
         V: 5,
         IV: 4,
         I: 1
     };
     var num = 0,
         m;
     if (!(str && validator.test(str))) return false;
     while (m = token.exec(str)) num += key[m[0]];
     return num;
 }


 function showSiegeProject(a) {

     var modName, description, cost, type, tier, j = "";
     var found = false;



     modName = document.getElementById("modname");
     modName.innerHTML = a.name.toUpperCase();
     modName.setAttribute("id", "modname" + a.name);
     descriptionDiv = document.getElementById("moddescription");
     description = a.description;



     imagelink = document.getElementById("modicon");

     unitTypesDiv = document.getElementById("affectUnitTypes");
     unitTypesDiv.setAttribute("id", "affectUnitTypes" + a.name);


     imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + a + ".png");
     imagelink.setAttribute("id", "modicon" + a.name);
     descriptionDiv.innerHTML = description;
     descriptionDiv.setAttribute("id", "modicon" + a.name);

     tier = document.getElementById("modtier");

     tier.innerHTML = "Siege Project";

     tier.setAttribute("id", "modtier" + a.name);

     cost = document.getElementById("modcost");

     cost.setAttribute("id", "modcost" + a.name);


     found = true;


 }


 function showTome(a, div) {
     var modName, description, cost, type, tier, k, j, descriptionDiv = "";
     var found = false;
     for (j in jsonTomes.tomes) {
         if (a == jsonTomes.tomes[j].id) {

             modName = document.getElementById("tomename");
             modName.innerHTML = jsonTomes.tomes[j].name;
             modName.setAttribute("id", "tomename" + a);
             descriptionDiv = document.getElementById("tomedescription");
             description = jsonTomes.tomes[j].gameplay_description;

             descriptionDiv.innerHTML = description;

             descriptionDiv.setAttribute("id", "tomedescription" + a);
             loreDescription = jsonTomes.tomes[j].lore_description;
             loreDescription += "<br>" + jsonTomes.tomes[j].lore_author;
             descriptionLoreDiv = document.getElementById("tomeloredescription");
             descriptionLoreDiv.innerHTML = loreDescription;

             descriptionLoreDiv.setAttribute("id", "tomeloredescription" + a);
             skillHolder = document.getElementById("tome_unlocks");

             for (k in jsonTomes.tomes[j].skills) {
                 if ('spell_slug' in jsonTomes.tomes[j].skills[k]) {
                     var iDiv = spell_card_template.content.cloneNode(true);
                     skillHolder.appendChild(iDiv);
                     showSpell(jsonTomes.tomes[j].skills[k].spell_slug, false);
                 }
                 if ('unit_slug' in jsonTomes.tomes[j].skills[k]) {
                     var iDiv = spell_card_template.content.cloneNode(true);
                     skillHolder.appendChild(iDiv);
                     showUnitUnlock(jsonTomes.tomes[j].skills[k]);
                 }

                 if ('upgrade_slug' in jsonTomes.tomes[j].skills[k]) {
                     var iDiv = spell_card_template.content.cloneNode(true);
                     skillHolder.appendChild(iDiv);
                     showStructure(jsonTomes.tomes[j].skills[k].upgrade_slug, false);
                 }
                 if (jsonTomes.tomes[j].skills[k].type.indexOf("Siege") != -1) {
                     var iDiv = spell_card_template.content.cloneNode(true);
                     skillHolder.appendChild(iDiv);
                     showSiegeProject(jsonTomes.tomes[j].skills[k], false);
                 }

             }
             skillHolder.setAttribute("id", "tome_unlocks" + a);

             //type = document.getElementById("modtype");
             //type.innerHTML = "Mod Type: " + jsonSpells.spells[j].type;
             //type.setAttribute("id", "modtype" + a);
             /* tier = document.getElementById("modtier");
               tier.innerHTML = jsonSpells.spells[j].spellType;
               tier.setAttribute("id", "modtier" + a);
               cost = document.getElementById("modcost");
               cost.innerHTML = "Casting Cost : " + jsonSpells.spells[j].casting_cost;
               cost.setAttribute("id", "modcost" + a);
             

             */
             imagelink = document.getElementById("tomeicon");
             imagelink.setAttribute("src", "/aow4db/Icons/TomeIcons/" + a + ".png");
             imagelink.setAttribute("id", "tomeicon" + a);

             // backtraceTomeOriginAndTier(jsonSpells.spells[j].id);


             found = true;
         }
     }
     if (found == false) {
         console.log("Couldn't find tome: " + a);
     }
 }

 function showStructure(a) {
     var modName, description, cost, type, tier, j, nameString = "";
     var found = false;
     for (j in jsonStructureUpgrades.structures) {
         if (a == jsonStructureUpgrades.structures[j].id) {

             modName = document.getElementById("modname");
             nameString = "";
             nameString = jsonStructureUpgrades.structures[j].name.toUpperCase();

             if (nameString.indexOf("<br>")) {
                 nameString = nameString.replace("<br>", "");
                 nameString = nameString.replace("<br>", "");
             }
             modName.innerHTML = nameString;
             modName.setAttribute("id", "modname" + a);
             modName.className = "mod_name";
             descriptionDiv = document.getElementById("moddescription");
             description = "";
             if (jsonStructureUpgrades.structures[j].requirement_description != "") {
                 description = jsonStructureUpgrades.structures[j].requirement_description + "<br>";
             }
             description += jsonStructureUpgrades.structures[j].description;


             if (jsonStructureUpgrades.structures[j].prediction_description != "") {
                 description += "<br>" + jsonStructureUpgrades.structures[j].prediction_description;
             }


             imagelink = document.getElementById("modicon");



             imagelink.setAttribute("src", "/aow4db/Icons/UpgradeIcons/" + a + ".png");
             imagelink.setAttribute("id", "modicon" + a);
             descriptionDiv.innerHTML = description;
             descriptionDiv.setAttribute("id", "modicon" + a);

             unitTypesDiv = document.getElementById("affectUnitTypes");
             unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);

             tier = document.getElementById("modtier");
             if (jsonStructureUpgrades.structures[j].is_sector_upgrade) {
                 tier.innerHTML = "Province Improvement";
             } else {
                 tier.innerHTML = "Building";
             }
             tier.setAttribute("id", "modtier" + a);

             cost = document.getElementById("modcost");
             cost.className = "spell_cost";
             cost.innerHTML = "Cost : " + jsonStructureUpgrades.structures[j].cost;
             cost.setAttribute("id", "modcost" + a);


             found = true;
         }
     }
     if (found == false) {
         console.log("Couldn't find mod: " + a);
     }
 }

 function showUnitUnlock(a) {
     var modName, description, cost, type, tier, j = "";
     var found = false;



     modName = document.getElementById("modname");
     modName.innerHTML = a.name.toUpperCase();
     modName.setAttribute("id", "modname" + a);
     descriptionDiv = document.getElementById("moddescription");
     description = a.description;



     imagelink = document.getElementById("modicon");

     unitTypesDiv = document.getElementById("affectUnitTypes");
     unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);


     imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + a.unit_slug + ".png");
     imagelink.setAttribute("id", "modicon" + a);
     descriptionDiv.innerHTML = description;
     descriptionDiv.setAttribute("id", "modicon" + a);

     tier = document.getElementById("modtier");

     tier.innerHTML = "Unit Unlock";

     tier.setAttribute("id", "modtier" + a);

     cost = document.getElementById("modcost");

     cost.setAttribute("id", "modcost" + a);


     found = true;


 }



 function showSpell(a, showOrigin) {
     var modName, description, cost, type, tier = "";
     var found = false;
     for (j in jsonSpells.spells) {
         if (a == jsonSpells.spells[j].id) {

             modName = document.getElementById("modname");
             modName.innerHTML = jsonSpells.spells[j].name.toUpperCase();
             modName.setAttribute("id", "modname" + a);
             descriptionDiv = document.getElementById("moddescription");
             description = jsonSpells.spells[j].description;

             unitTypesDiv = document.getElementById("affectUnitTypes");
             if (jsonSpells.spells[j].enchantment_requisites != undefined) {
                 description += "<br>Affected Unit Types: <br>";
             }
             for (l in jsonSpells.spells[j].enchantment_requisites) {
                 var div = document.createElement("DIV");
                 div.innerHTML = "<bullet>" + jsonSpells.spells[j].enchantment_requisites[l].requisite + "</bullet>"
                 unitTypesDiv.appendChild(div);
             }

             if ('summoned_units' in jsonSpells.spells[j]) {
                 description += "<br>Summoned Units:<br>";
                 for (x in jsonSpells.spells[j].summoned_units) {
                     var div = document.createElement("DIV");
                     div.innerHTML = "<bullet>" + "<a href=\"/aow4db/HTML/Units.html?unit=" + jsonSpells.spells[j].summoned_units[x].slug + "\" target=\"_blank\">" + GetTierAndName(jsonSpells.spells[j].summoned_units[x].slug) + "</a>" + "</bullet>"
                     unitTypesDiv.appendChild(div);
                 }
             }

             unitTypesDiv.setAttribute("id", "affectUnitTypes" + a);
             descriptionDiv.innerHTML = description;

             descriptionDiv.setAttribute("id", "moddescription" + a);
             //type = document.getElementById("modtype");
             //type.innerHTML = "Mod Type: " + jsonSpells.spells[j].type;
             //type.setAttribute("id", "modtype" + a);
             tier = document.getElementById("modtier");
             tier.innerHTML = jsonSpells.spells[j].spellType;
             tier.setAttribute("id", "modtier" + a);

             cost = document.getElementById("modcost");
             cost.innerHTML = "Casting Cost : " + jsonSpells.spells[j].casting_cost;
             cost.setAttribute("id", "modcost" + a);

             imagelink = document.getElementById("modicon");



             imagelink.setAttribute("src", "/aow4db/Icons/SpellIcons/" + a + ".png");
             imagelink.setAttribute("id", "modicon" + a);
             if (showOrigin === true) {
                 tier.innerHTML += " Tier " + romanize(backtraceTomeOriginAndTier(jsonSpells.spells[j].id));
                 var tomeOrigin = document.getElementById("originTome");
                 tomeOrigin.setAttribute("id", "originTome" + jsonSpells.spells[j].id);
                 var tomeOriginIcon = document.getElementById("originTomeIcon");
                 tomeOriginIcon.setAttribute("id", "originTomeIcon" + jsonSpells.spells[j].id);

             }



             found = true;
         }
     }
     if (found == false) {
         console.log("Couldn't find mod: " + a);
     }
 }

 function backtraceTomeOriginAndTier(spell) {
     for (j in jsonTomes.tomes) {
         {
             for (k in jsonTomes.tomes[j].skills) {
                 if (jsonTomes.tomes[j].skills[k].spell_slug == spell) {
                     var tomeOrigin = document.getElementById("originTome");
                     if (jsonTomes.tomes[j].affinities != undefined) {
                         tomeOrigin.innerHTML = jsonTomes.tomes[j].affinities + "<br>";
                     }
                     tomeOrigin.innerHTML += jsonTomes.tomes[j].name;

                     var tomeOriginIcon = document.getElementById("originTomeIcon");
                     tomeOriginIcon.setAttribute("src", "/aow4db/Icons/TomeIcons/" + jsonTomes.tomes[j].id + ".png");
                     return jsonTomes.tomes[j].skills[k].tier;
                 }
             }
         }
     }
 }

 function showTech(a, b) {
     var modName, description, cost, type, tier, secret, card = "";
     var found = false;
     card = document.getElementById("techcard");
     for (j in jsonTech.tech) {
         if (a == jsonTech.tech[j].slug) {

             modName = document.getElementById("techname");
             modName.innerHTML = jsonTech.tech[j].name;
             modName.setAttribute("id", "techname" + a);


             cost = document.getElementById("techcost");
             cost.innerHTML = jsonTech.tech[j].cost + "<research></research>";
             cost.setAttribute("id", "modcost" + a);
             imagelink = document.getElementById("techicon");
             if (b == "em") {

                 imagelink.setAttribute("src", "/aowp/Icons/Tech/" + "military_future_military_tech" + ".png");
                 imagelink.setAttribute("id", "techicon" + a);
             } else if (b == "es") {

                 imagelink.setAttribute("src", "/aowp/Icons/Tech/" + "society_future_society_tech" + ".png");
                 imagelink.setAttribute("id", "techicon" + a);
             } else {
                 imagelink.setAttribute("src", "/aowp/Icons/Tech/" + a + ".png");
                 imagelink.setAttribute("id", "techicon" + a);
             }



             for (k in jsonTech.tech[j].mod_unlock) {
                 if (jsonTech.tech[j].mod_unlock[k].slug != undefined) {
                     addModUnlock(jsonTech.tech[j].mod_unlock[k].slug, b);
                 }

             }

             for (k in jsonTech.tech[j].op_unlock) {
                 if (jsonTech.tech[j].op_unlock[k].slug != undefined) {
                     if (jsonTech.tech[j].op_unlock[k].slug == "colony_district_buildings") {
                         if (currentRace == "kirko") {
                             addOpUnlock("breeding_grounds", b);
                         }
                         if (currentRace == "dvar") {
                             addOpUnlock("urban_mining_shafts", b);
                         }
                         if (currentRace == "amazon") {
                             addOpUnlock("wildlife_reserve", b);
                         }
                         if (currentRace == "syndicate") {
                             addOpUnlock("ambassadors'_quarters", b);
                         }
                         if (currentRace == "vanguard") {
                             addOpUnlock("cryopod_bunkers", b);
                         }
                         if (currentRace == "shakarn") {
                             addOpUnlock("holo-simulation_camp", b);
                         }
                         if (currentRace == "oathbound") {
                             addOpUnlock("archive_of_deeds", b);
                         }
                         if (currentRace == "assembly") {
                             addOpUnlock("overdrive_reactor", b);
                         }
                     } else {
                         addOpUnlock(jsonTech.tech[j].op_unlock[k].slug, b);
                     }

                 }

             }

             for (k in jsonTech.tech[j].unit_unlock) {
                 if (jsonTech.tech[j].unit_unlock[k].slug != undefined) {
                     secret = jsonTech.tech[j].unit_unlock[k].slug;
                     if (jsonTech.tech[j].unit_unlock[k].slug.indexOf("secret") > -1) {
                         if (currentRace == "syndicate" && jsonTech.tech[j].unit_unlock[k].slug == "secret_purifier") {
                             secret = jsonTech.tech[j].unit_unlock[k].slug.replace("secret", currentRace + "_indentured");
                         } else if (currentRace == "oathbound" && (jsonTech.tech[j].unit_unlock[k].slug == "secret_light_bringer" || jsonTech.tech[j].unit_unlock[k].slug == "secret_echo_walker")) {
                             secret = jsonTech.tech[j].unit_unlock[k].slug.replace("secret", currentRace + "_paladin");
                         } else {
                             secret = jsonTech.tech[j].unit_unlock[k].slug.replace("secret", currentRace);
                         }

                     }
                     if (secret == "phoenix_walker") {
                         if (currentRace == "dvar" || currentRace == "kirko") {
                             secret = currentRace + "_phoenix_walker";

                         }

                     }


                     addUnitUnlock(secret, b);
                 }


             }
             document.getElementById("unlockholder").setAttribute("id", "unlockholder" + a);
             found = true;
         }
         card.setAttribute("id", "techcard" + a);
         card.style.display = 'inline-block';

     }
     if (found == false) {
         console.log("Couldn't find tech: " + a);
     }
 }


 function addModUnlock(a, b) {
     var modUnlockName, modUnlockIcon, modUnlockAbility, j = "";
     var found = false;
     for (j in jsonSpells.spells) {
         if (a == jsonSpells.spells[j].slug) {
             if (jsonSpells.spells[j].type.includes("Weapon")) {
                 modUnlockName = "Equipment: " + jsonSpells.spells[j].name;
             } else {
                 modUnlockName = jsonSpells.spells[j].name;
             }
             modUnlockName = "<titlebrown>" + modUnlockName + "</titlebrown>";
             modUnlockIcon = jsonSpells.spells[j].slug;

             if (jsonSpells.spells[j].name.includes("Vehicle")) {
                 modUnlockIcon = modUnlockIcon.replace("vehicle:_", "");
             }
             if (jsonSpells.spells[j].type.includes("Weapon")) {
                 modUnlockIcon = modUnlockIcon.replace("equipment:_", "");
             }
             modUnlockAbility = jsonSpells.spells[j].description;


             var tier = "<silver>" + "Tier " + jsonSpells.spells[j].tier + ", " + jsonSpells.spells[j].type + "</silver>";


             var btn = document.createElement("DIV");
             btn.className = "researchResultBackgroundImage";
             var imag = document.createElement("IMG");
             imag.className = "modunlock_icon2";
             var spa = document.createElement("SPAN");


             spa.innerHTML = "<p>" + modUnlockName + "</p>" + tier + "<hr>"
             imag.setAttribute("src", "/aowp/Icons/Mods/" + modUnlockIcon + ".png");

             spa.innerHTML += "<img src=\"/aowp/Icons/Mods/" + modUnlockIcon + ".png\" width='200'\">";
             spa.innerHTML += "<br>" + modUnlockAbility;

             if (jsonSpells.spells[j].type.includes("Weapon") || jsonSpells.spells[j].name.includes("Vehicle")) {
                 spa.innerHTML += "<hr> Base Cost: " + jsonSpells.spells[j].cost;
             } else {
                 spa.innerHTML += "<hr>" + "Base Production Cost: 10 <production></production>" + "<br>" + "Base Cosmite Cost: " + jsonSpells.spells[j].cost;
             }

             imag.setAttribute("height", "30");

             if (jsonSpells.spells[j].name.includes("Vehicle") || jsonSpells.spells[j].type.includes("Weapon")) {
                 var imag2 = document.createElement("IMG");
                 imag2.setAttribute("src", "/aowp/Icons/Text/arsenal.png");
                 imag2.className = "corner_icon";
                 btn.appendChild(imag2);
             }


             var newID = document.getElementById("unlockholder");
             newID.appendChild(btn);
             btn.appendChild(imag);


             btn.appendChild(spa);


             if (b == "s" || b == "em" || b == "es") {
                 spa.className = "tooltiptext2";
             } else {
                 spa.className = "tooltiptext";
             }

             found = true;

             // btn.appendChild(tex);

         }
     }
     if (found == false) {
         console.log("Couldn't find mod: " + a);
     }

 }


 function addOpUnlock(a, b) {
     var opUnlockName, opUnlockIcon, opUnlockAbility, j = "";
     var found = false;
     for (j in jsonOperations.operations) {
         if (a == jsonOperations.operations[j].slug) {

             opUnlockName = "<titlebrown>" + jsonOperations.operations[j].name + "</titlebrown>";
             opUnlockIcon = jsonOperations.operations[j].slug;
             opUnlockAbility = jsonOperations.operations[j].description;


             var tier = "<silver>" + "Tier " + jsonOperations.operations[j].tier + ", " + jsonOperations.operations[j].type + "</silver>";


             var btn = document.createElement("DIV");
             btn.className = "researchResultBackgroundImage";
             var imag = document.createElement("IMG");
             imag.className = "modunlock_icon";
             var spa = document.createElement("SPAN");
             var tex = document.createElement("DIV");
             tex.className = "tooltip";
             tex.setAttribute('onclick', '');
             //tex.innerHTML = modUnlockName;

             spa.innerHTML = "<p>" + opUnlockName + "</p>" + tier + "<hr>"
             if (b == "em" || b == "es") {
                 imag.setAttribute("src", "/aowp/Icons/Operations/" + "unknown" + ".png");
             } else {
                 imag.setAttribute("src", "/aowp/Icons/Operations/" + opUnlockIcon + ".png");
             }



             spa.innerHTML += "<br>" + opUnlockAbility;

             if (jsonOperations.operations[j].casting != undefined) {
                 spa.innerHTML += "<hr>" + "Priming Cost: " + jsonOperations.operations[j].energy_cost + "<energy></energy>" + jsonOperations.operations[j].casting;
             }

             if (jsonOperations.operations[j].production_cost != undefined) {
                 spa.innerHTML += "<hr>" + "Cost: " + jsonOperations.operations[j].production_cost;
             }

             if (jsonOperations.operations[j].influence_cost != undefined) {
                 spa.innerHTML += "<hr>" + "Cost: " + jsonOperations.operations[j].influence_cost + "<influence></influence>";
             }

             imag.setAttribute("height", "35");
             if (jsonOperations.operations[j].type.includes("Tactical")) {
                 var imag2 = document.createElement("IMG");
                 imag2.setAttribute("src", "/aowp/Icons/Text/tac_ops.png");
                 imag2.className = "corner_icon";
                 btn.appendChild(imag2);
             }

             if (jsonOperations.operations[j].type.includes("Doctrine")) {
                 var imag2 = document.createElement("IMG");
                 imag2.setAttribute("src", "/aowp/Icons/Text/doctrine.png");
                 imag2.className = "corner_icon";
                 btn.appendChild(imag2);
             }
             if (jsonOperations.operations[j].type.includes("Strategic")) {
                 var imag2 = document.createElement("IMG");
                 imag2.setAttribute("src", "/aowp/Icons/Text/strat_ops.png");
                 imag2.className = "corner_icon";
                 btn.appendChild(imag2);
             }
             if (jsonOperations.operations[j].type.includes("Covert")) {
                 var imag2 = document.createElement("IMG");
                 imag2.setAttribute("src", "/aowp/Icons/Text/covert.png");
                 imag2.className = "corner_icon";
                 btn.appendChild(imag2);
             }


             document.getElementById("unlockholder").appendChild(btn);
             btn.appendChild(imag);


             btn.appendChild(spa);


             if (b == "s" || b == "em" || b == "es") {
                 spa.className = "tooltiptext2";
             } else {
                 spa.className = "tooltiptext";
             }
             found = true;
             // btn.appendChild(tex);

         }
     }
     if (found == false) {
         console.log("Couldn't find operation: " + a);
     }
 }







 function addAbilityList(a) {
     var dam = "";
     for (j in jsonUnitAbilities.abilities) {
         if (a == jsonUnitAbilities.abilities[j].slug) {
             if (jsonUnitAbilities.abilities[j].damage) {
                 dam = jsonUnitAbilities.abilities[j].damage;
             }
             return jsonUnitAbilities.abilities[j].name + dam + "<br>"
         }
     }
 }

 function addTypesList(a) {
     var dam = "";
     for (j in jsonUnitAbilities.abilities) {
         if (a == jsonUnitAbilities.abilities[j].slug) {

             return jsonUnitAbilities.abilities[j].name + "<br>"
         }
     }
 }







 (function (root, factory) {
     "use strict";
     if (typeof define === "function" && define.amd) {
         define([], factory)
     } else if (typeof exports === "object") {
         module.exports = factory()
     } else {
         root.textFit = factory()
     }
 })(typeof global === "object" ? global : this, function () {
     "use strict";
     var defaultSettings = {
         alignVert: false,
         alignHoriz: false,
         multiLine: false,
         detectMultiLine: true,
         minFontSize: 6,
         maxFontSize: 80,
         reProcess: true,
         widthOnly: false,
         alignVertWithFlexbox: false
     };
     return function textFit(els, options) {
         if (!options) options = {};
         var settings = {};
         for (var key in defaultSettings) {
             if (options.hasOwnProperty(key)) {
                 settings[key] = options[key]
             } else {
                 settings[key] = defaultSettings[key]
             }
         }
         if (typeof els.toArray === "function") {
             els = els.toArray()
         }
         var elType = Object.prototype.toString.call(els);
         if (elType !== "[object Array]" && elType !== "[object NodeList]" && elType !== "[object HTMLCollection]") {
             els = [els]
         }
         for (var i = 0; i < els.length; i++) {
             processItem(els[i], settings)
         }
     };

     function processItem(el, settings) {
         if (!isElement(el) || !settings.reProcess && el.getAttribute("textFitted")) {
             return false
         }
         if (!settings.reProcess) {
             el.setAttribute("textFitted", 1)
         }
         var innerSpan, originalHeight, originalHTML, originalWidth;
         var low, mid, high;
         originalHTML = el.innerHTML;
         originalWidth = innerWidth(el);
         originalHeight = innerHeight(el);
         if (!originalWidth || !settings.widthOnly && !originalHeight) {
             if (!settings.widthOnly) throw new Error("Set a static height and width on the target element " + el.outerHTML + " before using textFit!");
             else throw new Error("Set a static width on the target element " + el.outerHTML + " before using textFit!")
         }
         if (originalHTML.indexOf("textFitted") === -1) {
             innerSpan = document.createElement("span");
             innerSpan.className = "textFitted";
             innerSpan.style["display"] = "inline-block";
             innerSpan.innerHTML = originalHTML;
             el.innerHTML = "";
             el.appendChild(innerSpan)
         } else {
             innerSpan = el.querySelector("span.textFitted");
             if (hasClass(innerSpan, "textFitAlignVert")) {
                 innerSpan.className = innerSpan.className.replace("textFitAlignVert", "");
                 innerSpan.style["height"] = "";
                 el.className.replace("textFitAlignVertFlex", "")
             }
         }
         if (settings.alignHoriz) {
             el.style["text-align"] = "center";
             innerSpan.style["text-align"] = "center"
         }
         var multiLine = settings.multiLine;
         if (settings.detectMultiLine && !multiLine && innerSpan.scrollHeight >= parseInt(window.getComputedStyle(innerSpan)["font-size"], 10) * 2) {
             multiLine = true
         }
         if (!multiLine) {
             el.style["white-space"] = "nowrap"
         }
         low = settings.minFontSize;
         high = settings.maxFontSize;
         var size = low;
         while (low <= high) {
             mid = high + low >> 1;
             innerSpan.style.fontSize = mid + "px";
             if (innerSpan.scrollWidth <= originalWidth && (settings.widthOnly || innerSpan.scrollHeight <= originalHeight)) {
                 size = mid;
                 low = mid + 1
             } else {
                 high = mid - 1
             }
         }
         if (innerSpan.style.fontSize != size + "px") innerSpan.style.fontSize = size + "px";
         if (settings.alignVert) {
             addStyleSheet();
             var height = innerSpan.scrollHeight;
             if (window.getComputedStyle(el)["position"] === "static") {
                 el.style["position"] = "relative"
             }
             if (!hasClass(innerSpan, "textFitAlignVert")) {
                 innerSpan.className = innerSpan.className + " textFitAlignVert"
             }
             innerSpan.style["height"] = height + "px";
             if (settings.alignVertWithFlexbox && !hasClass(el, "textFitAlignVertFlex")) {
                 el.className = el.className + " textFitAlignVertFlex"
             }
         }
     }

     function innerHeight(el) {
         var style = window.getComputedStyle(el, null);
         return el.clientHeight - parseInt(style.getPropertyValue("padding-top"), 10) - parseInt(style.getPropertyValue("padding-bottom"), 10)
     }

     function innerWidth(el) {
         var style = window.getComputedStyle(el, null);
         return el.clientWidth - parseInt(style.getPropertyValue("padding-left"), 10) - parseInt(style.getPropertyValue("padding-right"), 10)
     }

     function isElement(o) {
         return typeof HTMLElement === "object" ? o instanceof HTMLElement : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
     }

     function hasClass(element, cls) {
         return (" " + element.className + " ").indexOf(" " + cls + " ") > -1
     }

     function addStyleSheet() {
         if (document.getElementById("textFitStyleSheet")) return;
         var style = [".textFitAlignVert{", "position: absolute;", "top: 0; right: 0; bottom: 0; left: 0;", "margin: auto;", "display: flex;", "justify-content: center;", "flex-direction: column;", "}", ".textFitAlignVertFlex{", "display: flex;", "}", ".textFitAlignVertFlex .textFitAlignVert{", "position: static;", "}"].join("");
         var css = document.createElement("style");
         css.type = "text/css";
         css.id = "textFitStyleSheet";
         css.innerHTML = style;
         document.body.appendChild(css)
     }
 });
