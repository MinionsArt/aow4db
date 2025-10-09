const fs = require("fs");

const filePath = "GEN/BuilderLookup.json";

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
const testFilePathTraits = "EN/Traits.json";
// read the source data list to check if theres anything new to add
let dataToCheck;
try {
    const fileContent = fs.readFileSync(testFilePathTraits, "utf-8");
    dataToCheck = JSON.parse(fileContent);
} catch (error) {
    // Handle the case when the file doesn't exist or is not valid JSON
    console.log("error");
}

// get the traits, tomes, etc
const testFilePathTraits2 = "GEN/FactionCreation.json";
// read the source data list to check if theres anything new to add
let dataToCheck2;
try {
    const fileContent = fs.readFileSync(testFilePathTraits2, "utf-8");
    dataToCheck2 = JSON.parse(fileContent);
} catch (error) {
    // Handle the case when the file doesn't exist or is not valid JSON
    console.log("error");
}

// get the traits, tomes, etc
const testFilePathTraits3 = "EN/Tomes.json";
// read the source data list to check if theres anything new to add
let dataToCheck3;
try {
    const fileContent = fs.readFileSync(testFilePathTraits3, "utf-8");
    dataToCheck3 = JSON.parse(fileContent);
} catch (error) {
    // Handle the case when the file doesn't exist or is not valid JSON
    console.log("error");
    existingData = [];
}

// go through all entries in the source data
var newList = [];
for (let index = 0; index < dataToCheck.length; index++) {
    var newEntry = {
        id: dataToCheck[index].id
    };
    newList.push(newEntry);
}

for (let index = 0; index < dataToCheck2.length; index++) {
    var newEntry = {
        id: dataToCheck2[index].id
    };
    newList.push(newEntry);
}

for (let index = 0; index < dataToCheck3.length; index++) {
    var newEntry = {
        id: dataToCheck3[index].id
    };
    newList.push(newEntry);
}

console.log(newList);

/// Loop through entries in newList
newList.forEach((newEntry) => {
    // Check if the name already exists in the existing data
    const nameExists = existingData.some((entry) => entry.id === newEntry.id);

    if (!nameExists) {
        // Add the new entry to the existing array
        existingData.push(newEntry);
        console.log(`New entry '${newEntry.id}' added to the JSON file.`);
    } else {
        console.log(`Entry with name '${newEntry.id}' already exists. No need to add a new entry.`);
    }
});

// Save the updated data to the file
const jsonString = JSON.stringify(existingData, null, 2);
fs.writeFileSync(filePath, jsonString, "utf-8");
