function findBy(array, key, value) {
  return array.find(item => item[key] === value);
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


function addSpoiler(text) {
    const span = document.createElement("span");
    span.className = "spoiler";
    span.innerHTML = text;
    span.addEventListener("click", () => span.classList.toggle("revealed"));
    return span;
}
