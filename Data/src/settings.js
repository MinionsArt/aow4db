// Get user settings
function getUserSettings() {
  const storedSettings = localStorage.getItem("userSettings");

  return storedSettings ? JSON.parse(storedSettings) : null;
}

// Set user settings
function setUserSettings(settings) {
  localStorage.setItem("userSettings", JSON.stringify(settings));
}

function OverwriteEditKey() {
  localStorage.setItem("editKey", document.getElementById("overwriteKey").value);
}

function CheckBoxTooltips() {
  let hoverDiv = document.getElementById("hoverDiv");
  let hoverDiv2 = document.getElementById("hoverDiv2");
  if (checkboxTooltip.checked === true) {
    addTooltipListeners(hoverDiv, null);
    addTooltipListeners(hoverDiv2, null, "something");
  } else {
    removeToolTipListeners(hoverDiv);
    removeToolTipListeners(hoverDiv2);
  }
  updateUserSettings({
    tooltipselectable: checkboxTooltip.checked,
    isolateNumber: checkboxNumbers.checked,
    showBeta: showBetaTooltip.checked,
    language: languageSelect.value
  });
}

function SwitchToBeta() {
    updateUserSettings({
        tooltipselectable: checkboxTooltip.checked,
        showBeta: showBetaTooltip.checked,
        language: languageSelect.value
    });
    location.reload();
}

function CopyField() {
    var copyText = document.getElementById("YourKey");

    // Select the text field
    // For mobile devices
    console.log("Key  " + copyText);

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.innerText);
}

function ShowLoad() {
    var loadButtons = document.getElementById("loadkey");
    loadButtons.style.display = "block";
}

function HideKey() {
    document.getElementById("YourKey").style.display = "none";
}
function RevealKey() {
    document.getElementById("YourKey").style.display = "block";
}

function downloadEditKeyFile() {
  const text =
    "Age of Wonders 4 Database (minionsart.github.io/aow4db)\nYour Build Edit Key : " + getOrCreateUserEditKey(); // Replace with your dynamic content
  const filename = "Aow4db_EditKey.txt";

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
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
