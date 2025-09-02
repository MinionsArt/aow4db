
// Get user settings
 function getUserSettings() {
    const storedSettings = localStorage.getItem("userSettings");

    return storedSettings ? JSON.parse(storedSettings) : null;
}


// Set user settings
 function setUserSettings(settings) {
    localStorage.setItem("userSettings", JSON.stringify(settings));
}


// Update user settings
 function updateUserSettings(updatedSettings) {
    const currentSettings = getUserSettings();
    if (currentSettings) {
        const newSettings = {
            ...currentSettings,
            ...updatedSettings
        };
        setUserSettings(newSettings);
    }
}



 function getOrCreateUserEditKey() {
    let editKey = localStorage.getItem("editKey");
    if (!editKey) {
        editKey = crypto.randomUUID(); // Or custom hash if you want
        localStorage.setItem("editKey", editKey);
    }
    return editKey;
}
