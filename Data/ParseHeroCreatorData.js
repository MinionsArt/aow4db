const fs = require("fs");

const filePath = "GEN/BuilderLookupHero.json";

// Read the existing JSON file
let existingData;
try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    existingData = JSON.parse(fileContent);

    console.log(existingData);
    // Ensure existingData is an array
    if (!Array.isArray(existingData)) {
        existingData = [];
    }
} catch (error) {
    // Handle the case when the file doesn't exist or is not valid JSON
    console.log("error");
    existingData = [];
}


// get the traits, tomes, etc
const testFilePathTraits4 = "EN/HeroSkills.json";
// read the source data list to check if theres anything new to add
let dataToCheck4;
try {
    const fileContent = fs.readFileSync(testFilePathTraits4, "utf-8");
    dataToCheck4 = JSON.parse(fileContent);
} catch (error) {
    // Handle the case when the file doesn't exist or is not valid JSON
    console.log("error");
    existingData = [];
}

// go through all entries in the source data
var newList = [];

for (let index = 0; index < dataToCheck4.length; index++) {

    var newEntry = {
        resid: dataToCheck4[index].resid
    };
    newList.push(newEntry);

}

console.log(newList);

/// Loop through entries in newList
newList.forEach((newEntry) => {
    // Check if the name already exists in the existing data
    const nameExists = existingData.some((entry) => entry.resid === newEntry.resid);

    if (!nameExists) {
        // Add the new entry to the existing array
        existingData.push(newEntry);
        console.log(`New entry '${newEntry.resid}' added to the JSON file.`);
    } else {
        console.log(`Entry with name '${newEntry.resid}' already exists. No need to add a new entry.`);
    }
});

// Save the updated data to the file
const jsonString = JSON.stringify(existingData, null, 2);
fs.writeFileSync(filePath, jsonString, "utf-8");
