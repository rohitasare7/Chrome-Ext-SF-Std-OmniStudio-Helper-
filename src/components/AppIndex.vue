<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';

const sidValue = ref('');
const orgUrl = ref('');
/*global chrome*/

const getSID = async () => {
    // Get cookie from active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentTab = tabs[0];
        let currentUrl = currentTab.url;
        // console.log("Current URL 0 : " + currentUrl);
        let formattedOrgUrl = getOrgUrl(currentUrl);
        chrome.cookies.get({ url: formattedOrgUrl, name: 'sid' }, function (cookie) {
            if (cookie) {
                console.log("SID Value --> " + cookie.value);
                sidValue.value = cookie.value;
                orgUrl.value = formattedOrgUrl;
            } else {
                console.log("SID not found.");
            }
        });
    });
}


const getSFHost = async () => {

  chrome.runtime.sendMessage({message: "callSFHost", url: location.href}, sfHost => {
    if (sfHost) {
      console.log('sfHost --> '+sfHost);
      // initButton(sfHost, false);
    }
  });

}

// Function to extract the org URL from the full URL
const getOrgUrl = (fullUrl) => {
    const urlParts = fullUrl.split('/');
    return urlParts.slice(0, 3).join('/');
};

const openTab = () => {
    chrome.tabs.create({
        url: `${chrome.runtime.getURL('app.html')}`,
    });

}

const setSID = async () => {
    await getSID();
    console.log('setSID sid value --> ' + sidValue.value);
    let authData = {
      sid : sidValue.value,
      url : orgUrl.value
    }
    chrome.storage.sync.set({ authData }).then(() => {
        console.log("Value is set --> "+sidValue.value);
    });
}

onMounted(async () => {
    await getSID();
    await setSID();
});
</script>

<template>
    <!-- Init Main Page -->
    <p class="text-white my- dark:text-gray-200 bg-gray-700">Main Index</p>
    <button @click="openTab" class="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md mr-2 my-2">Open
        Tab</button>
    <button @click="setSID" class="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md mr-2 my-2">Set SID</button>
    <button @click="getSFHost" class="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md mr-2 my-2">Get SF Host</button>
</template>

<script>
export default {
    name: 'mainPage',
}
</script>