<script setup>
/* global chrome */
import { ref } from "vue";
import TextDesc from './elements/TextDesc.vue';
import PrimaryButton from "../components/elements/PrimaryButton.vue";
import SVGIconButton from "./elements/SVGIconButton.vue";
import Icon_Help from "@/assets/icons/Icon_Help.vue";
import LoadingCircle from "./elements/LoadingCircle.vue";

const isLoading = ref(false);
const formattedData = ref([]);
const showHelp = ref(false);
const webStoreURL = ref('https://chromewebstore.google.com/detail/salesforce-omnistudio-hel/gaogdijndgigjopjiidpemfglhokcmpe');

const fetchCompList = () => {
  isLoading.value = true;
  sendMessageOpenTab();
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
}

const sendMessageOpenTab = () => {
  // Send the message to the content script(s)
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // console.log('inside 1' + JSON.stringify(tabs));
    // Query all the OmniStudio objects
    chrome.tabs.sendMessage(tabs[0].id, {
      msg: "findObjects"
    }, function (response) {
      if (chrome.runtime.lastError) {
        console.log('Error sending message:', chrome.runtime.lastError);
      } else {
        // Add your logic to handle the response here
        if (response && response.status === 'success') {
          formattedData.value = [];
          formattedData.value = groupData(response.data);
          // isLoading.value = false;
        } else {
          console.log('Failed to find objects');
        }
      }
    });
  });
  // isLoading.value = false;
}

const groupData = (data) => {
  try {
    const grouped = {};
    data.forEach(item => {
      const { type, subtype } = item;
      if (!grouped[type]) {
        grouped[type] = {};
      }
      if (!grouped[type][subtype]) {
        grouped[type][subtype] = [];
      }
      grouped[type][subtype].push(item);
    });
    return grouped;
  }
  catch (err) {
    console.warn('groupData error --> ' + err);
    isLoading.value = false;
  }
}

const toggleShowHelp = () => {
  showHelp.value = !showHelp.value;
};

const triggerEmail = () => {
  const shareMessage = "Hey! checkout the Salesforce OmniStudio Helper Chrome extension at Official Chrome Web Store : " + webStoreURL.value;
  window.open('mailto:?subject=SF OmniStudio Helper Chrome Extension&body=' + shareMessage);
}

const sendHighlightMessage = (elementName, msg, popupText) => {
  // Send the message to the content script(s)
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { msg, elementName, popupText }, function (response) {
      if (chrome.runtime.lastError) {
        console.log('Error sending message:', chrome.runtime.lastError);
      } else {
        if (response && response.status === 'success') {
          console.log('sucess');
        }
      }
    });
  });
}

</script>

<template>

  <TextDesc class="font-semibold text-center !text-base mb-2">Salesforce OmniStudio Helper</TextDesc>

  <div v-if="!showHelp">
    <PrimaryButton :isBlue="true" @click="fetchCompList" class="mt-2">
      <LoadingCircle v-if="isLoading" :cssStyle="'h-4 w-4 mr-2'">Loading components...
      </LoadingCircle>
      <p v-else>Find OmniStudio Components</p>
    </PrimaryButton>

    <div v-if="formattedData" class="mt-4">
      <div v-for="(subtypes, type) in formattedData" :key="type" class="mb-4">
        <div v-for="(items, subtype) in subtypes" :key="subtype" class="mb-4">
          <h2 class="text-lg font-semibold mb-2">{{ type }} - {{ subtype }}</h2>
          <div class="relative overflow-x-auto rounded-lg overflow-hidden">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 border">
              <tbody>
                <tr v-for="item in items" :key="item.name">
                  <td
                    class="px-4 py-2 bg-white text-gray-700 border-b hover:bg-blue-700 hover:text-white font-medium whitespace-nowrap cursor-pointer hover:shadow-2xl transition ease-in-out duration-300"
                    @mouseover="sendHighlightMessage(item.elementName, 'HIGHLIGHT_ELEMENT', item.name)"
                    @mouseleave="sendHighlightMessage(item.elementName, 'REMOVE_HIGHLIGHT', item.name)">
                    {{ item.name }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="bg-white p-4 rounded-xl mt-4">
    <TextDesc class="font-semibold text-sm !text-blue-700 mb-2">To Access OmniStudio Components</TextDesc>
    <TextDesc>Open your Salesforce Org (Lightning Recommended) & click OS Helper button at right top corner.
      You can refer below image.
    </TextDesc>
    <img src="../assets/howToScreen.png" class="mt-2 py-2 border rounded-md">

    <TextDesc class="font-semibold text-sm mt-4 !text-blue-700 my-2">To Find OmniStudio Components</TextDesc>
    <TextDesc>Open your Salesforce Org Page on which you want to find components, Open Extension through Chrome Toolbar
      and click "Find OmniStudio Components"
    </TextDesc>

    <div class="mt-2 py-4 border-t">
      <TextDesc class="font-semibold text-sm my-2">Support Us by leaving a review or sharing this extension :
      </TextDesc>
      <div class="mt-4 flex items-center justify-start">
        <a class="text-blue-700 font-semibold mr-4" :href="webStoreURL" target="_blank">
          <PrimaryButton isBlue="true">
            Web Store Link
          </PrimaryButton>
        </a>
        <PrimaryButton isBlue="true" @click="triggerEmail">
          Share Extension
        </PrimaryButton>
      </div>
    </div>

    <div class="py-4 border-t">
      <TextDesc class="font-semibold text-sm my-2">Want to Debug OmniScript &amp; FlexCard?</TextDesc>
      <TextDesc class="text-sm">Try <a href="https://bit.ly/41BI2KG" target="_blank"
          class="text-blue-700 font-semibold mr-4">Salesforce OmniStudio Network Logger</a></TextDesc>
      <a href="https://bit.ly/41BI2KG" target="_blank"><img src="../assets/availableOnChrome.png"
          class="mt-2 border rounded-md"></a>
    </div>

    <div class="mt-6 flex items-center justify-end">
      <PrimaryButton @click="toggleShowHelp">
        Go Back
      </PrimaryButton>
    </div>


  </div>

  <SVGIconButton @click="toggleShowHelp" :icon="Icon_Help" :isSquare="false" color="green"
    class="!p-0.5 absolute top-3 right-3" title="Show Help" />

</template>

<script>
export default {
  name: 'mainPage',
}
</script>