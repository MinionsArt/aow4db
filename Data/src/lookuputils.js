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
