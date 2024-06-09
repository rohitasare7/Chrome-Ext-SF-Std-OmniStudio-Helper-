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
  var targetUl = document.querySelector('.slds-global-actions');
  console.log('targetUl 1 ' + targetUl);
  if(!targetUl){
     targetUl = document.querySelector('.linkElements');
     console.log('targetUl 2' + targetUl);
  }
  if (targetUl) {
    // Check if the button already exists
    var existingButton = document.querySelector('#sfHelperBtn');
    console.log('existingButton ' + existingButton);
    if (!existingButton) {
      // Create a new <li> element
      var newLi = document.createElement('li');
      newLi.className = 'slds-global-actions__item slds-grid';

      // Create a new button element inside the <li>
      var button = document.createElement('button');
      button.id = 'sfHelperBtn';
      button.innerText = 'SF Helper';
      button.style.padding = '6px 13px';
      button.style.backgroundColor = 'rgb(25 73 207)';
      button.style.color = '#fff';
      button.style.border = 'none';
      button.style.borderRadius = '6px';
      button.style.cursor = 'pointer';

      // Add an event listener to the button
      button.addEventListener('click', function () {
        sendMessageOpenTab();
      });

      // Append the button to the <li>
      newLi.appendChild(button);

      // Append the new <li> to the existing <ul>
      targetUl.appendChild(newLi);
    }
  }
});


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