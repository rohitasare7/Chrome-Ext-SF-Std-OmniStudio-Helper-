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

const sendMessageOpenTab = () => {
  isLoading.value = true;
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
        console.error('Error sending message:', chrome.runtime.lastError);
        isLoading.value = false;
      } else {
        // Add your logic to handle the response here
        if (response && response.status === 'success') {
          
          formattedData.value = [];
          formattedData.value = groupData(response.data);
          isLoading.value = false;
        } else {
          console.error('Failed to find objects');
          isLoading.value = false;
        }
      }
    });
  });
  isLoading.value = false;
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

// Item Highlight JS, better UI for Popup
//Add How to Debug OS Article & Extension Link
</script>

<template>

  <TextDesc class="font-semibold">Salesforce OmniStudio Helper</TextDesc>

  <div v-if="!showHelp">
    <PrimaryButton :isBlue="true" @click="sendMessageOpenTab" class="mt-2">
      <LoadingCircle v-if="isLoading" :cssStyle="'h-4 w-4 mr-2'">Loading components...
      </LoadingCircle>
      <p v-else>Find OmniStudio Components</p>
    </PrimaryButton>

    <div v-if="formattedData" class="mt-4">
      <div v-for="(subtypes, type) in formattedData" :key="type" class="mb-4">
        <div v-for="(items, subtype) in subtypes" :key="subtype" class="mb-4">
          <h2 class="text-lg font-semibold mb-2">{{ type }} - {{ subtype }}</h2>
          <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 border">
              <tbody>
                <tr v-for="item in items" :key="item.name" class="bg-white border-b">
                  <td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{{ item.name }}</td>
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
    <img src="../assets/howToScreen.png" class="mt-2 pt-2 pb-4 border rounded-md">

    <TextDesc class="font-semibold text-sm mt-4 !text-blue-700 my-2">To Find OmniStudio Components</TextDesc>
    <TextDesc>Open your Salesforce Org Page on which you want to find components, Open Extension through Chrome Toolbar
      and click "Find OmniStudio Components"
    </TextDesc>

    <div class="flex items-center justify-start mt-6 py-6 border-t">
      <a class="text-blue-700 font-semibold mr-4" :href="webStoreURL" target="_blank">
        <PrimaryButton isBlue="true">
          Web Store Link
        </PrimaryButton>
      </a>
      <PrimaryButton isBlue="true" @click="triggerEmail">
        Share Extension
      </PrimaryButton>
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