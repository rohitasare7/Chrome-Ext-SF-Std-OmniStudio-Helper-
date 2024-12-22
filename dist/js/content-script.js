/*global chrome*/
let sfHostStr;
let objectsFound = [];

// Listen for button events
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Handle the "Find" button
  if (request.msg == "findObjects") {
    console.log('inside findObjects');
    const respData = getOSCompList();
    sendResponse({ status: 'success', data: respData });
    return true;
  }
});


window.addEventListener('load', function () {
  // Send a message to the background script
  chrome.runtime.sendMessage({ message: "getSfHost", url: location.href }, sfHost => {
    if (sfHost) {
      sfHostStr = sfHost;
    }
  });

  // Fix Integration Procedure Execute Button
  if (window.location.href.includes('integrationproceduredesigner')) {
    const targetDiv = document.querySelector('.vloc-body.Theme3');

    if (targetDiv) {
      targetDiv.classList.add('slds-grid--frame');
    }
  }

  injectStyles();
  // Create the button and attach it to the DOM
  const button = createButton();
  attachButton(button);
});

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .slds-grid--frame {
      min-width: auto !important;
      max-width: 100% !important;
      overflow: auto !important;
      min-height: 100vh !important;
    }
    @keyframes gradientRotate {
      0% { background-position: 0% 0%; }
      100% { background-position: 100% 100%; }
    }
  `;
  document.head.appendChild(style);
}

function createButton() {
  const button = document.createElement('button');
  button.id = 'sfHelperBtn';
  button.innerText = 'OS Helper';
  Object.assign(button.style, {
    position: 'relative',
    color: '#fff',
    borderRadius: '1rem',
    backgroundImage: 'linear-gradient(90deg, #0065ff, #6942ef, #6554c0, #008cff, #0065ff, #6942ef)',
    backgroundSize: '400%',
    backgroundPosition: '0% 0%',
    border: 'none',
    padding: '4px 10px'
  });

  button.addEventListener('mouseenter', () => {
    button.style.animation = 'gradientRotate 2s infinite';
  });

  button.addEventListener('mouseleave', () => {
    button.style.animation = 'none';
  });

  const svgIcon = createSVGIcon();
  button.appendChild(svgIcon);
  button.addEventListener('click', sendMessageOpenTab);

  return button;
}

function createSVGIcon() {
  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('class', 'slds-m-left_xx-small');
  svgIcon.setAttribute('aria-hidden', 'true');
  svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgIcon.setAttribute('viewBox', '0 0 24 24');
  svgIcon.setAttribute('width', '20');
  svgIcon.setAttribute('height', '20');

  const pathIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathIcon.setAttribute('d', 'M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z');
  pathIcon.setAttribute('fill', '#fff');

  svgIcon.appendChild(pathIcon);

  return svgIcon;
}

function attachButton(button) {
  const globalActionUL = document.querySelector(".slds-global-actions");
  if (globalActionUL) {
    initButton(globalActionUL, button);
  } else {
    setTimeout(() => {
      const delayedGlobalActionUL = document.querySelector(".slds-global-actions");
      initButton(delayedGlobalActionUL, button);
    }, 3000);
  }
}

function initButton(globalActionUL, button) {
  if (!globalActionUL) {
    const navLinks = document.querySelector('.navLinks .linkElements');
    if (navLinks) {
      navLinks.appendChild(button);
    }
  } else {
    const newLi = document.createElement('li');
    newLi.className = 'slds-global-actions__item slds-grid';
    newLi.appendChild(button);
    globalActionUL.insertAdjacentElement('afterbegin', newLi);
  }
}

function sendMessageOpenTab() {
  chrome.runtime.sendMessage({ message: "openAppTab", url: location.href, options: { host: sfHostStr } }, item => {
    if (item) {
      //console.log('Tab opened successfully');
    }
  });
}

/*
OmniStudio Comp Finder Section Starts
*/

function isVisible(element) {
  if (!element) return true;
  const style = window.getComputedStyle(element);
  const visible = style.width !== "0" && style.height !== "0" && style.opacity !== "0" && style.display !== "none" && style.visibility !== "hidden";
  return visible ? isVisible(element.parentElement) : false;
}

function isLwc(element) {
  return element && element.tagName.includes("-");
}

// function isStandardLwc(element) {
//   return element && isLwc(element) && element.tagName.startsWith("LIGHTNING-");
// }

//Ignore some common items and vlocity package lwc
const exclusionList = ["C-ICON", "C-NAVIGATE-ACTION"];
function isCustomLwc(element) {
  if (!isLwc(element)) return false;

  const hasVlocityAttribute = Array.from(element.attributes).some(attr =>
    attr.name.startsWith('vlocity_cmt-') ||
    attr.name.startsWith('vlocity_ins-') ||
    attr.name.startsWith('vlocity_ps-')
  );

  return !hasVlocityAttribute && element.tagName.startsWith("C-") && !exclusionList.includes(element.tagName);
}

function getCustomLwcName(element) {
  const tagName = element.tagName.toLowerCase().replace(/^c-/, '');
  const componentName = tagName.replace(/-./g, x => x[1].toUpperCase());
  return componentName;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// function isManagedLwc(element) {
//   if (isLwc(element) && element.tagName.match("^(VLOCITY_CMT-|VLOCITY_INS-|VLOCITY_PS-)")) {
//     console.log('element.tagName --> ' + element.tagName);
//   }

//   return element && isLwc(element) && element.tagName.match("^(VLOCITY_CMT-|VLOCITY_INS-|VLOCITY_PS-)");
// }

// function getManagedLwcName(element) {
//   if (!isManagedLwc(element)) return;
//   let name = element.localName.replace(/^(vlocity_cmt-|vlocity_ins-|vlocity_ps-)/gi, "");
//   name = name.replace(/-./g, x => x[1].toUpperCase());
//   return name;
// }

function isLwcOmniScript(element) {
  // Check for both LWC OmniScript article and standard runtime OmniScript
  return (
    (element && element.tagName == "ARTICLE" && element.classList && Array.from(element.classList).includes("omniscript-article")) ||
    (element && element.tagName && element.tagName.toLowerCase().includes("forcegenerated-omni-script"))
  );
}


function isOmniScript(element) {
  if (element && element.tagName == "IFRAME") {
    return !!getOmniScriptName(element);
  }
  return false;
}

function getOmniScriptName(element) {
  if (isLwcOmniScript(element)) {
    // Handle standard runtime OmniScript
    if (element.tagName.toLowerCase().includes("forcegenerated-omni-script")) {
      const tagName = element.tagName.toLowerCase();
      // Extract components from the tag name using regex
      const regex = /forcegenerated-omni-script_-(.*?)___(.*?)___(.*?)___/;
      const matches = tagName.match(regex);

      if (matches && matches.length >= 4) {
        const type = capitalizeFirstLetter(matches[1]);
        const subType = matches[2].split('-').map(capitalizeFirstLetter).join('');
        return `${type}_${subType}`;
      }
      return undefined;
    }

    // Existing LWC OmniScript handling
    const lwc = getParentLwc(element);
    let name = lwc.localName.replace(/^c-/gi, "");
    name = name.replace(/-([^-]*)$/, "");
    name = name.replace(/-./g, x => x[1].toUpperCase());
    return name;
  } else if (element && element.tagName == "IFRAME") {
    let urlString = element.src;
    if (urlString.endsWith('#/')) urlString = urlString.substring(0, urlString.length - 2);
    const osType = getQueryParameter(urlString, 'OmniScriptType');
    const osSubType = getQueryParameter(urlString, 'OmniScriptSubType');
    if (osType && osSubType) return osType + "_" + osSubType;
  }
}

function isFlexCard(element) {
  // Check for both LWC FlexCard and standard runtime FlexCard
  return (
    (element && element.tagName.startsWith("C-CF-")) ||
    (element && element.tagName && element.tagName.toLowerCase().includes("forcegenerated-flex-card"))
  );
}

function isCard(element) {
  return element && element.tagName === "DIV" && element.getAttribute("layout-name");
}

function getCardName(element) {
  if (isFlexCard(element)) {
    // Handle standard runtime FlexCard
    if (element.tagName.toLowerCase().includes("forcegenerated-flex-card")) {
      const tagName = element.tagName.toLowerCase();
      // Extract components from the tag name using regex
      const regex = /forcegenerated-flex-card_-(.*?)___/;
      const matches = tagName.match(regex);

      if (matches && matches.length >= 2) {
        // Convert kebab-case to PascalCase
        return matches[1].split('-').map(capitalizeFirstLetter).join('');
      }
      return undefined;
    }
    // Existing LWC FlexCard handling
    let name = element.localName.replace(/^c-cf-/gi, "");
    name = name.replace(/-./g, x => x[1].toUpperCase());
    return name;
  }
  // Existing Card handling
  if (isCard(element)) return element.getAttribute("layout-name");
}

function getParentLwc(element) {
  const parent = element.parentNode;
  if (parent) {
    return isLwc(parent) ? parent : getParentLwc(parent);
  }
}

function getQueryParameter(urlString, attributeName) {
  let u = urlString.replace('+', ' ');
  try {
    if (u.indexOf('%3D') != -1) u = unescape(u);
    const pos = u.indexOf(attributeName);
    if (pos == -1) return undefined;
    let afterAttribute = u.substring(pos + attributeName.length + 1);
    const afterAttribute2 = afterAttribute;
    let pos2 = afterAttribute.indexOf('&');
    if (pos2 != -1) afterAttribute = afterAttribute.substring(0, pos2);
    else pos2 = u.length + 1;
    const pos3 = afterAttribute2.indexOf('/');
    if (pos3 != -1 && pos3 < pos2) afterAttribute = afterAttribute2.substring(0, pos3);
    return decodeURIComponent(afterAttribute);
  } catch (e) {
    console.log(`Error extracting query parameter '${attributeName}' from URL '${urlString}' -> ${e}`);
  }
}

function isStandardRuntimeComponent(element) {
  return element && element.tagName && (
    element.tagName.toLowerCase().includes("forcegenerated-omni-script") ||
    element.tagName.toLowerCase().includes("forcegenerated-flex-card")
  );
}

function findOmniStudioComponents(doc) {
  const all = doc.getElementsByTagName("*");
  const objectsMap = new Map();
  const componentTracker = new Set(); // Track components by name to avoid duplicates

  for (let i = 0; i < all.length; i++) {
    const element = all[i];
    if (!isVisible(element)) continue;

    let obj = null;
    let key = null;
    let componentKey = null;
    const tagName = element.tagName.toLowerCase();

    if (isCard(element) && isVisible(element)) {
      obj = {
        "type": "FlexCard",
        "subtype": "AngularJS",
        "name": getCardName(element),
        "elementName": element.localName + "@" + element.getAttribute("layout-name"),
      };
      key = `${obj.type}-${obj.subtype}-${obj.name}-${obj.elementName}`;
    }
    else if (isOmniScript(element) && isVisible(element)) {
      obj = {
        "type": "OmniScript",
        "subtype": "AngularJS",
        "name": getOmniScriptName(element),
        "elementName": element.localName + "@" + getOmniScriptName(element),
      };
      key = `${obj.type}-${obj.subtype}-${obj.name}-${obj.elementName}`;
    }
    else if (isLwcOmniScript(element) && isVisible(element)) {
      obj = {
        "type": "OmniScript",
        "subtype": "LWC",
        "name": getOmniScriptName(element),
        "elementName": getParentLwc(element).localName,
      };
      key = `${obj.type}-${obj.subtype}-${obj.name}-${obj.elementName}`;
    }
    else if (isFlexCard(element) && isVisible(element)) {
      obj = {
        "type": "FlexCard",
        "subtype": "LWC",
        "name": getCardName(element),
        "elementName": element.localName,
      };
      key = `${obj.type}-${obj.subtype}-${obj.name}-${obj.elementName}`;
    }
    /*
    else if (isCustomLwc(element) && isVisible(element)) {
      obj = {
        "type": "Custom",
        "subtype": "LWC",
        "name": getCustomLwcName(element),
        "elementName": element.localName,
      };
      key = `${obj.type}-${obj.subtype}-${obj.name}-${obj.elementName}`;
    } */

    if (obj) {
      key = `${obj.type}-${obj.subtype}-${obj.name}-${obj.elementName}`.toLowerCase();
      if (!objectsMap.has(key)) {
        objectsMap.set(key, obj);
        componentTracker.add(componentKey);
      }
    }
  }

  return Array.from(objectsMap.values());
}

const removeDuplicatesByName = (data) => {
  const seenNames = new Map();

  // Iterate through the data and prioritize "StandardRuntime" subtype
  data.forEach((item) => {
    const lowerCaseName = item.name.toLowerCase();
    if (!seenNames.has(lowerCaseName) || item.subtype === "StandardRuntime") {
      seenNames.set(lowerCaseName, item);
    }
  });

  // Return the unique items as an array
  return Array.from(seenNames.values());
};

function getOSCompList() {
  try {
    console.log('inside getOSCompList');
    // Get components directly from findOmniStudioComponents
    const components = findOmniStudioComponents(window.document);
    console.log('Found components --> ' + JSON.stringify(components));
    const finalCompList = removeDuplicatesByName(components);
    console.log('finalCompList --> ' + JSON.stringify(finalCompList));
    return finalCompList;
  } catch (e) {
    console.log("Error occurred: " + e);
    objectsFound.push({
      'type': 'Error',
      'msg': 'Error occurred: ' + e
    });
  }
  console.log('objectsFound --> ' + JSON.stringify(objectsFound));
  // Return the list of OmniStudio components
  return objectsFound;
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('inside event --> ' + JSON.stringify(message));
  if (message.msg === 'HIGHLIGHT_ELEMENT') {
    console.log('inside HIGHLIGHT_ELEMENT');
    const response = highlightElement(message.elementName, message.popupText);
    sendResponse(response);
  }
  else if (message.msg === 'REMOVE_HIGHLIGHT') {
    const response = removeHighlight(message.elementName);
    sendResponse(response);
  }
  return false; // Not doing any async work
});

// Method to highlight the child element
function highlightElement(selector, elementName) {
  const parentElement = document.querySelector(selector); // Parent element
  if (parentElement) {
    // Select the first child div
    const childDiv = parentElement.querySelector('div');
    if (childDiv) {
      const originalPosition = childDiv.style.position || null;
      childDiv.setAttribute('osh-data-original-position', originalPosition);

      childDiv.style.border = '3px solid #007bff'; // Apply border instead of outline
      childDiv.style.padding = '2px'; // Optionally add padding to make it stand out more
      childDiv.style.borderRadius = '5px'; // Optional: rounded corners for a softer look
      childDiv.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.5)'; // Subtle glow effect

      // Create a tooltip element
      const tooltip = document.createElement('div');
      tooltip.classList.add('highlight-tooltip');
      tooltip.innerText = elementName;

      // Apply tooltip styles
      tooltip.style.position = 'absolute';
      tooltip.style.backgroundColor = '#007bff';
      tooltip.style.color = 'white';
      tooltip.style.padding = '5px 10px';
      tooltip.style.borderRadius = '.5rem';
      tooltip.style.fontSize = '12px';
      tooltip.style.zIndex = '9999';
      tooltip.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.5)';

      // Position the tooltip relative to the childDiv without modifying its position
      const rect = childDiv.getBoundingClientRect();
      tooltip.style.top = `${rect.top - 30}px`; // Position above the element
      tooltip.style.left = `${rect.left}px`;

      // Append the tooltip to the document body
      document.body.appendChild(tooltip);

      // Store the tooltip reference for removal later
      childDiv._tooltipElement = tooltip;

      return { success: true, message: 'Child element highlighted.' };
    } else {
      return { success: false, message: 'Child div not found.' };
    }
  } else {
    return { success: false, message: 'Parent element not found.' };
  }
}

// Method to remove the highlight from the child element
function removeHighlight(selector) {
  const parentElement = document.querySelector(selector); // Parent element
  if (parentElement) {
    const childDiv = parentElement.querySelector('div');
    if (childDiv) {
      childDiv.style.border = ''; // Remove border
      childDiv.style.padding = ''; // Remove padding if added
      childDiv.style.borderRadius = ''; // Remove border radius if added
      childDiv.style.boxShadow = ''; // Remove box shadow if added
      // Remove the tooltip if it exists
      if (childDiv._tooltipElement) {
        const tooltip = childDiv._tooltipElement; // Retrieve the stored tooltip reference
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip); // Remove tooltip from the DOM
        }
        delete childDiv._tooltipElement; // Clean up reference to avoid memory leaks
      }
      return { success: true, message: 'Highlight removed.' };
    } else {
      return { success: false, message: 'Child div not found.' };
    }
  } else {
    return { success: false, message: 'Parent element not found.' };
  }
}