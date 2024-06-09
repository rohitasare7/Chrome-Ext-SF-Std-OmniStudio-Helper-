/*global chrome*/
let sfHostStr;
// Wait for the page to fully load
window.addEventListener('load', function () {
  // Send a message to the background script
  chrome.runtime.sendMessage({ message: "getSfHost", url: location.href }, sfHost => {
    if (sfHost) {
      console.log('sf host --> ' + sfHost);
      //alert('sf host active');
      sfHostStr = sfHost;
    }
  });
  // Find the existing <ul> element in Salesforce
  // Create a new button element inside the <li>
  var button = document.createElement('button');
  button.id = 'sfHelperBtn';
  button.innerText = 'SF Helper';
  button.style.padding = '6px 13px';
  button.style.background = '#1949CF';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '6px';
  button.style.cursor = 'pointer';
  // Add an event listener to the button
  button.addEventListener('click', function () {
    sendMessageOpenTab();
  });
  //Assing Button 
  //Check Top Right Side Global Icons
  var globalActionUL = document.getElementsByClassName("slds-global-actions")[0];
  if (globalActionUL) {
    initButton(globalActionUL, button);
  }
  // if class not found then wait for 3 seconds, let dom load and then init
  else {
    getGlobalActionUL(button);
  }
});

function getGlobalActionUL(button) {
  setTimeout(() => {
    var globalActionUL = document.getElementsByClassName("slds-global-actions")[0];
    // console.log('setTimeout globalActionUL --> ' + globalActionUL);
    initButton(globalActionUL, button);
  }, 3000); // Add delay for DOM loading
}

const initButton = (globalActionUL, button) => {
  // if its classic
  if (!globalActionUL) {
    const navLinks = document.querySelector('.navLinks .linkElements');
    if (navLinks) {
      navLinks.appendChild(button);
    }
  }
  //if its lightning
  else {
    var newLi = document.createElement('li');
    newLi.className = 'slds-global-actions__item slds-grid';
    newLi.appendChild(button);
    globalActionUL.insertAdjacentElement('afterbegin', newLi);
  }

}

const sendMessageOpenTab = () => {
  let msgOptions = {
    host: sfHostStr
  }
  chrome.runtime.sendMessage({ message: "openAppTab", url: location.href, options: msgOptions }, item => {
    if (item) {
      console.log('success');
    }
  });
}