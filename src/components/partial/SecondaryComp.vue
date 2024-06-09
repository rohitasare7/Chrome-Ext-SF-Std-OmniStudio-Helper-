<script setup>
/*global chrome*/
// import DisplayRecords from '@/components/partial/DisplayRecords';
import { ref, onMounted } from "vue";
import { apiVersion, sfConn, formatDate } from "@/assets/helper";
import { saveRecord } from "@/assets/storageUtil";
import { extractValue, getSalesforceURL } from "@/assets/globalUtil";
import PrimaryButton from "../elements/PrimaryButton.vue";
import TextInput from "../elements/TextInput.vue";
import LoadingCircle from "../elements/LoadingCircle.vue";
import TextDesc from "../elements/TextDesc.vue";
import PrimaryHeading from "../elements/PrimaryHeading.vue";
import SVGIconButton from "../elements/SVGIconButton.vue";
import Icon_Favorite from "@/assets/icons/Icon_Favorite.vue";
import FavoriteTable from './FavoriteTable.vue';
// Vue3 Easy DataTable
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
const recordList = ref([]);
const searchField = ref(["Name", "LastModifiedBy.Name", "LastModifiedDate"]);
const searchValue = ref("");
const sortBy = ref("LastModifiedDate");
const sortType = "desc";
const tableHeaders = ref([
  { text: "Id", value: "Id" },
  { text: "Name", value: "Name", sortable: true },
  { text: "Version", value: "vlocity_cmt__Version__c" },
  { text: "LastModified By", value: "LastModifiedBy.Name" },
  { text: "LastModified Date", value: "LastModifiedDateNew", sortable: true },
  { text: "Actions", value: "Actions", width: 200 },
]);

const recordTitle = ref('');
const dataLoading = ref(false);
const sfHostURL = ref('');
const queriedObject = ref('');
const orgIdentifier = ref('');

const omniScriptLoaded = ref('OmniScripts Loaded');
const flexCardsLoaded = ref('FlexCards Loaded');
const IPloaded = ref('Integration Procedures Loaded');
const DRloaded = ref('DataRaptors Loaded');

const performAPIcallout = (url) => {
  return new Promise((resolve, reject) => {
    sfConn
      .getSession(sfHostURL.value)
      .then(() => {
        // console.log("getSession inside");
        let limitsPromise = sfConn.rest(url);
        limitsPromise
          .then((data) => {
            //console.log('limitsPromise data --> ', data);
            resolve(data); // Resolve the promise with the fetched data
          })
          .catch((error) => {
            console.error("Error fetching limits: ", error);
            reject(error); // Reject the promise if there is an error
          });
      })
      .catch((error) => {
        console.error("Error getting session: ", error);
        reject(error); // Reject the promise if there is an error getting the session
      });
  });
};

const ensureVersionHeader = () => {
  const versionHeader = { text: "Version", value: "vlocity_cmt__Version__c" };
  const isVersionHeaderPresent = tableHeaders.value.some(header => header.value === versionHeader.value);

  if (!isVersionHeaderPresent) {
    // Insert versionHeader at the 3rd position (index 2)
    tableHeaders.value.splice(2, 0, versionHeader);
  }
};

//Get OS & IP
const getOmniScriptList = async (isIP) => {
  dataLoading.value = true;
  queriedObject.value = 'OmniScript';
  let processType = 'OmniScript';
  if (isIP) {
    queriedObject.value = 'IntegrationProcedure';
    processType = 'Integration Procedure';
  }
  let url =
    "/services/data/v" +
    apiVersion +
    `/query/?q=SELECT+Id,Name,vlocity_cmt__Version__c,LastModifiedBy.Name,LastModifiedDate+FROM+vlocity_cmt__OmniScript__c+WHERE+vlocity_cmt__IsActive__c=TRUE+AND+vlocity_cmt__OmniProcessType__c='${processType}'+ORDER+BY+LastModifiedDate+DESC`;
  // console.log('url --> '+url);
  try {
    const data = await performAPIcallout(url);
    //console.log('data --> ', JSON.stringify(data));
    data?.records.forEach((record) => {
      record.LastModifiedDateNew = formatDate(record.LastModifiedDate); //format the date time
    });
    recordList.value = data?.records;
    recordTitle.value = isIP ? IPloaded.value : omniScriptLoaded.value;
    ensureVersionHeader();
  } catch (error) {
    console.error("Error fetching OmniScript list: ", error);
  }
  dataLoading.value = false;
  document.title = isIP ? IPloaded.value : omniScriptLoaded.value;
};

//Get FlexCards
const getFlexCardList = async () => {
  dataLoading.value = true;
  queriedObject.value = 'FlexCard';
  let url =
    "/services/data/v" +
    apiVersion +
    `/query/?q=SELECT+Id,Name,vlocity_cmt__Version__c,LastModifiedBy.Name,LastModifiedDate+FROM+vlocity_cmt__VlocityCard__c+WHERE+vlocity_cmt__Active__c=TRUE+ORDER+BY+LastModifiedDate+DESC`;
  try {
    const data = await performAPIcallout(url);
    //console.log('data --> ', JSON.stringify(data));
    data?.records.forEach((record) => {
      record.LastModifiedDateNew = formatDate(record.LastModifiedDate); //format the date time
    });
    recordList.value = data?.records;
    recordTitle.value = flexCardsLoaded.value;
    ensureVersionHeader();
  } catch (error) {
    console.error("Error fetching getFlexCardList: ", error);
  }
  dataLoading.value = false;
  document.title = flexCardsLoaded.value;
};

//Get DataRaptor
const getDataRaptorList = async () => {
  dataLoading.value = true;
  queriedObject.value = 'DataRaptor';
  let url =
    "/services/data/v" +
    apiVersion +
    `/query/?q=SELECT+Id,Name,vlocity_cmt__Type__c,LastModifiedBy.Name,LastModifiedDate+FROM+vlocity_cmt__DRBundle__c+ORDER+BY+LastModifiedDate`;
  try {
    const data = await performAPIcallout(url);
    //console.log('data --> ', JSON.stringify(data));
    data?.records.forEach((record) => {
      record.LastModifiedDateNew = formatDate(record.LastModifiedDate); //format the date time
    });
    recordList.value = data?.records;
    recordTitle.value = DRloaded.value;
    tableHeaders.value = tableHeaders.value.filter(header => header.value !== "vlocity_cmt__Version__c");
  } catch (error) {
    console.error("Error fetching getDataRaptorList: ", error);
  }
  dataLoading.value = false;
  document.title = DRloaded.value;
};

const childComponentRef = ref(null);
//Save records to Favorite
const addToFavorite = (Id, Name) => {
  // console.log('queriedObject.value --> '+queriedObject.value);
  let obj = {
    type : queriedObject.value,
    id : Id,
    name : Name
  }
  let result = saveRecord(obj, sfHostURL.value);
  if(result){
    console.log('inside result');
    childComponentRef.value.getLatestFavItemList();
  }
  
}

//On page load
onMounted(() => {
  let args = new URLSearchParams(location.search.slice(1));
  let sfHost = args.get("host");
  sfHostURL.value = sfHost;
  orgIdentifier.value = extractValue(`https://${sfHostURL.value}`);
});

</script>

<template>
  <!-- Init Main Page -->

  <TextDesc v-if="sfHostURL" class="my-2">Current Org : {{ sfHostURL }}</TextDesc>

  <button @click="getOmniScriptList(false)"
    class="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md mr-2 my-2">
    Load OmniScript
  </button>
  <button @click="getFlexCardList" class="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md mr-2 my-2">
    Load FlexCard
  </button>
  <button @click="getOmniScriptList(true)"
    class="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md mr-2 my-2">
    Load Integration Procedure
  </button>
  <button @click="getDataRaptorList" class="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md mr-2 my-2">
    Load DataRaptor
  </button>

  <div v-if="dataLoading">
    <PrimaryButton>
      <LoadingCircle :cssStyle="'h-4 w-4 mr-2'">Data is loading...</LoadingCircle>
    </PrimaryButton>
  </div>
  <div v-else>
    <div class="mt-4 mb-2" v-if="recordTitle">
      <PrimaryHeading>Records loaded for <span class="text-blue-600">{{ queriedObject }}</span> </PrimaryHeading>
      <TextDesc>All records are active records</TextDesc>
    </div>
    <div v-if="recordList.length > 0">
      <TextInput v-model="searchValue" type="text" class="!px-2 !py-1 my-2" placeholder="Filter records.." />
      <Vue3EasyDataTable :headers="tableHeaders" :items="recordList" :search-field="searchField" :rows-per-page="10"
        header-text-direction="center" body-text-direction="center" :search-value="searchValue" :sort-by="sortBy"
        :sort-type="sortType" :no-hover="true" :theme-color="'#312e3d'"
        table-class-name="tableCSS mt-4 mb-8 rounded-lg border dark:border-gray-600 shadow-md">
        <template #loading>
          <TextDesc class="font-semibold my-4">Data loading, please wait...</TextDesc>
        </template>
        <template #item-Name="{ Name }">
          <p class="text-left ml-2">{{ Name }}</p>
        </template>
        <template #item-Actions="{ Id, Name}">
          <div class="text-center flex items-center my-1.5">
            <a :href="getSalesforceURL(orgIdentifier, sfHostURL, Id, queriedObject)" target="_blank">
              <PrimaryButton>Open in SF</PrimaryButton>
            </a>
            <SVGIconButton @click="addToFavorite(Id,Name)" :icon="Icon_Favorite" :isSquare="false" :color="'gray'" 
                class="!p-1.5 ml-2 " title="Add to Favorite" />
          </div>
        </template>
      </Vue3EasyDataTable>
    </div>
  </div>


  <FavoriteTable v-if="sfHostURL" :sfHost="sfHostURL" :currenObject="queriedObject" ref="childComponentRef" />

</template>

<script>
export default {
  name: "indexComp",
};
</script>
