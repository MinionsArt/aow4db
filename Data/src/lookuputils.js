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

function wrapStatusTooltip(el, label, handlerType = "something") {
  const span = document.createElement("span");
  span.className = "statusEffectHandler";
  span.innerText = label;
  addTooltipListeners(el, span, handlerType);
}
