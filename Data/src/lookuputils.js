function findBy(array, key, value, { all = false } = {}) {
  return all
    ? array.filter(item => item[key] === value)  // all matches
    : array.find(item => item[key] === value);   // first match
}

function maybeHighlight(text) {
  return getUserSettings().isolateNumber ? highlightNumbersInDiv(text) : text;
}

function tagReplace(text, keyword, tagHTML) {
  const pattern = new RegExp(`\\b${keyword}\\b`, "g");
  return text.replace(pattern, tagHTML);
}

/**
 * Find an object in an array where any nested array matches a condition.
 *
 * @param {Array} array - top-level array to search (e.g., jsonTomesLocalized)
 * @param {string} nestedKey - the property that holds the nested array (e.g., "skills")
 * @param {string} matchKey - property to check inside the nested array (e.g., "spell_slug")
 * @param {any} matchValue - value to match against
 * @returns {Object|null} - the found parent object or null
 */
function findParentByNested(array, nestedKey, matchKey, matchValue) {
  for (const parent of array) {
    if (!Array.isArray(parent[nestedKey])) continue;
    if (parent[nestedKey].some(child => child[matchKey] === matchValue)) {
      return parent;
    }
  }
  return null;
}

let ascendingOrder = false;

function sortDivs(sortType, savedOrder) {
    let i = "";

    // 2 - Detemine the selector
    if (savedOrder != null) {
        ascendingOrder = savedOrder;
    } else {
        ascendingOrder = !ascendingOrder;
    }

    let buttontargets = document.getElementsByClassName("sortingButton");

    for (i in buttontargets) {
        buttontargets[i].className = "sortingButton";
    }
    let currentbutton = document.getElementById(sortType + "-button");

    if (ascendingOrder) {
        currentbutton.className += " activeDown";
    } else {
        currentbutton.className += " activeUp";
    }

    // 3 - Choose the wanted order
    //  ascendingOrder = !ascendingOrder;
    const isNumeric = true;

    // 4 - Select all elements
    let container;
    if (currentView === "") {
        container = document.getElementById("dataHolder");
    } else {
        container = document.getElementById(currentView);
    }

    let element = [...container.querySelectorAll(".mod_card")];

    let selector = (element) => element.querySelector(".mod_name").innerHTML;
    if (sortType === "tier") {
        selector = (element) => element.querySelector(".spell_tier").innerHTML;
    } else if (sortType === "cost") {
        selector = (element) => element.querySelector(".spell_cost").innerHTML;
    }

    // 5 - Find their parent
    const parentElement = container;

    // 6 - Sort the elements
    const collator = new Intl.Collator(undefined, {
        numeric: isNumeric,
        sensitivity: "base"
    });

    element
        .sort((elementA, elementB) => {
            const [firstElement, secondElement] = ascendingOrder ? [elementA, elementB] : [elementB, elementA];

            let textOfFirstElement = selector(firstElement);

            let textOfSecondElement = selector(secondElement);

            if (sortType === "tier") {
                let fields = textOfFirstElement.split("Tier ");

                textOfFirstElement = deromanize(fields[1]);
                let fields2 = textOfSecondElement.split("Tier ");
                textOfSecondElement = deromanize(fields2[1]);
                //console.log("first: " + fields2[1]);
            }

            return collator.compare(textOfFirstElement, textOfSecondElement);
        })
        .forEach((element) => parentElement.appendChild(element));

    let currenturl = window.location.href.split("&")[0];

    window.history.replaceState({}, "foo", currenturl + "&sort=" + sortType + ":" + ascendingOrder);
    sorting = sortType + ":" + ascendingOrder;
}

async function SetCollapsibleStuff() {
    let coll = document.getElementsByClassName("collapsibleUnits");

    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            let contents = document.getElementsByClassName("contentUnits");
            let content = this.nextElementSibling;

            for (j = 0; j < contents.length; j++) {
                if (contents[j].style != null) {
                    if (contents[j].style.display === "grid") {
                        if (contents[j].id === content.id) {
                        } else {
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

            let buttonHolder = document.getElementById("buttonHolder");
            let holderHeight = buttonHolder.offsetHeight;
            let dataHolder = document.getElementById("dataHolder");
            dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px; margin-left:200px");
        });
    }

    let buttonHolder = document.getElementById("buttonHolder");
    let holderHeight = buttonHolder.offsetHeight;
    let dataHolder = document.getElementById("dataHolder");
    dataHolder.setAttribute("style", "margin-top:-" + holderHeight + "px;; margin-left:200px");
}


function expandTags(input) {
    // Regular expression to match patterns like "2<empirearcana></empirearcana>"
    const tagPattern = /(\d+)(<.*?>.*?<\/.*?>)/g;

    // Function to replace each match with the expanded form
    const expanded = input.replace(tagPattern, (match, count, tag) => {
        // Repeat the tag the specified number of times
        return tag.repeat(Number(count));
    });

    return expanded;
}


function HideAll(cardClassName) {
    let divs = document.getElementsByClassName(cardClassName);

    for (let i = 0; i < divs.length; i++) {
        let div = divs[i];
        div.style.display = "none";
    }
    return divs;
}

function transformString(inputString) {
    // Remove the word "Property"
    let transformedString = inputString.replace("Property", "");
    transformedString = transformedString.replace("/", ",");
    // Replace the specified words with the corresponding tags
    const replacements = {
        Astral: "<empirearcana></empirearcana>",
        Chaos: "<empirechaos></empirechaos>",
        Order: "<empireorder></empireorder>",
        Shadow: "<empireshadow></empireshadow>",
        Materium: "<empirematter></empirematter>",
        Elementum: "<empirematter></empirematter>",
        Nature: "<empirenature></empirenature>"
    };

    // Use a regular expression to replace all occurrences of the keys with the corresponding values
    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        transformedString = transformedString.replace(regex, value);
    }

    // Remove any extra spaces (especially around the removed "Property" word)
    transformedString = transformedString.trim();

    return transformedString;
}

function ShowAllDivsWithFilters(cardClassName) {
    let listOfDivs = HideAll(cardClassName);
    //   var list = new Array();
    let filter = document.getElementById("filterInput");

    let filterText = filter.value.toUpperCase();

    for (let j = 0; j < listOfDivs.length; j++) {
        if (listOfDivs[j].innerText.toUpperCase().indexOf(filterText) != -1) {
            listOfDivs[j].style.display = "table";
        }
    }
}

async function SetLevelUpStuff() {
    let coll = document.getElementsByClassName("collapsibleLevelup");
    let content = document.getElementsByClassName("contentLevelup");

    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            //this.classList.toggle("active");

            let content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

   searchParams = new URLSearchParams(window.location.search);
    const product = searchParams.get("type");

    if (product != undefined) {
        let splits = product.split("&");
        closeTabLinks(product);
        document.getElementById(splits[0] + "-button").className += " w3-red";
        // grab the subculture if available

        let subCulture = splits[0].split(/(?=[A-Z])/);
        if (subCulture.length > 1) {
            let test = subCulture.slice(1).join("");
            await showSubDiv(null, test);
        }
        // open div with type
        await openDiv(event, splits[0]);
    }
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}



function romanize(num) {
    if (isNaN(num)) return NaN;
    let digits = String(+num).split(""),
        key = [
            "",
            "C",
            "CC",
            "CCC",
            "CD",
            "D",
            "DC",
            "DCC",
            "DCCC",
            "CM",
            "",
            "X",
            "XX",
            "XXX",
            "XL",
            "L",
            "LX",
            "LXX",
            "LXXX",
            "XC",
            "",
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX"
        ],
        roman = "",
        i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function deromanize(str) {
    str = str.toUpperCase();
    let validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/;
    let token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g;
    let key = {
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
    let num = -1;
    let m;

    if (!(str && validator.test(str))) return false;

    while ((m = token.exec(str)) !== null) {
        num += key[m[0]];
    }

    return num;
}

function doubleNumbers(inputString) {
    // Regular expression to match numbers
    let regex = /\b\d+\b/g;

    // Replace each matched number with its double
    let result = inputString.replace(regex, function (match) {
        // Convert the matched number to an integer and double it
        let doubledNumber = parseInt(match) * 2;
        // Return the doubled number as a string
        return doubledNumber.toString();
    });

    return result;
}


function ConvertSpawnTable(input) {
    const entries = input.split(",");

    const bulletListName = entries.shift(); // Get the first entry as the bullet list name

    // Calculate the percentages for each entry
    const entryCounts = {};
    for (const entry of entries) {
        entryCounts[entry] = (entryCounts[entry] || 0) + 1;
    }

    const percentages = entries.map((entry) => {
        const percentage = (entryCounts[entry] / entries.length) * 100;
        return {
            entry,
            percentage
        };
    });

    // Sort the percentages in descending order
    percentages.sort((a, b) => b.percentage - a.percentage);

    // Create a bullet list for the unique entries
    const uniqueEntries = [];
    const bulletList = document.createElement("DIV");

    bulletList.innerHTML = '<bulletList><span class="Test">' + bulletListName + "</span>";

    for (const { entry, percentage } of percentages) {
        const itemText = entry.replace(/_/g, " "); // Replace underscores with spaces

        if (!uniqueEntries.includes(itemText)) {
            uniqueEntries.push(itemText);
            bulletList.innerHTML += "<bullet>" + `${percentage.toFixed(0)}% - ${itemText}` + "</bullet>";
        }
    }
    bulletList.innerHTML += "</bulletList>";
    return bulletList;
}

  function CreateParts(subcultures, icons, names) {
                const presetPoint = document.getElementById("presetPoint");

                // Create the main holder div for buttons
                const holder = document.createElement("div");
                holder.className = "subcultureHolder";

                // Generate the subculture buttons
                subcultures.forEach((sub) => {
                    const button = document.createElement("button");
                    button.className = "subscultureButton";
                    button.setAttribute("onclick", `showSubDiv(event,'${sub}')`);

                    const img = document.createElement("img");
                    img.src = `/aow4db/Icons/FactionCreation/${icons}${sub.toLowerCase()}.png`;
                    img.width = 50;

                    const span = document.createElement("span");
                    span.className = "subCultureName";
                    span.id = `subCultureName${sub}`;
                    span.textContent = `${names}${sub}`;

                    button.appendChild(img);
                    button.appendChild(span);
                    holder.appendChild(button);
                });

                // Append the button holder to the body
                presetPoint.append(holder);

                // Generate subDiv sections
                subcultures.forEach((sub, i) => {
                    const div = document.createElement("div");
                    div.className = "subDiv";
                    div.id = sub;

                    div.innerHTML = `
    <div class="w3-container">
      <div id="buttonHolder${i}" class="w3-bar w3-black"></div>
      <div id="dataHolder${i}" class="dataholder" style="margin-top:-250px"></div>
    </div>
  `;

                    presetPoint.append(div);
                });
            }


function addSpoiler(text) {
    const span = document.createElement("span");
    span.className = "spoiler";
    span.innerHTML = text;
    span.addEventListener("click", () => span.classList.toggle("revealed"));
    return span;
}
