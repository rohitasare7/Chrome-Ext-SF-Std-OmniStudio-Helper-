<script setup>
/*global chrome*/
// import DisplayRecords from '@/components/partial/DisplayRecords';
import { ref, onMounted } from "vue";
import { apiVersion, sfConn, formatDate } from "@/assets/helper";
import PrimaryButton from "../elements/PrimaryButton.vue";
import TextInput from "../elements/TextInput.vue";
import LoadingCircle from "../elements/LoadingCircle.vue";
import TextDesc from "../elements/TextDesc.vue";
import PrimaryHeading from "../elements/PrimaryHeading.vue";
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

const omniScriptLoaded = ref('OmniScripts Loaded');
const flexCardsLoaded = ref('FlexCards Loaded');
const IPloaded = ref('Integration Procedures Loaded');
const DRloaded = ref('DataRaptors Loaded');

const performAPIcallout = (url) => {
  return new Promise((resolve, reject) => {
    sfConn
      .getSession(sfHostURL.value)
      .then(() => {
        console.log("getSession inside");
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

const getOmniScriptList = async (isIP) => {
  dataLoading.value = true;
  queriedObject.value = 'OmniScript';
  let loadIPCondition = '';
  if (isIP) {
    queriedObject.value = 'IntegrationProcedure';
    loadIPCondition = `+AND+vlocity_cmt__OmniProcessType__c='Integration Procedure'`;
  }
  let url =
    "/services/data/v" +
    apiVersion +
    `/query/?q=SELECT+Id,Name,vlocity_cmt__Version__c,LastModifiedBy.Name,LastModifiedDate+FROM+vlocity_cmt__OmniScript__c+WHERE+vlocity_cmt__IsActive__c=TRUE${loadIPCondition}+ORDER+BY+LastModifiedDate+DESC`;

  try {
    const data = await performAPIcallout(url);
    //console.log('data --> ', JSON.stringify(data));
    data?.records.forEach((record) => {
      record.LastModifiedDateNew = formatDate(record.LastModifiedDate); //format the date time
    });
    recordList.value = data?.records;
    recordTitle.value = isIP ? IPloaded.value : omniScriptLoaded.value;
  } catch (error) {
    console.error("Error fetching OmniScript list: ", error);
  }
  dataLoading.value = false;
  document.title = isIP ? IPloaded.value : omniScriptLoaded.value;
};

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
  } catch (error) {
    console.error("Error fetching getFlexCardList: ", error);
  }
  dataLoading.value = false;
  document.title = flexCardsLoaded.value;
};

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

/*
const getSFURL = (recId, type) => {
  let sfURL = '';
if(type == 'OmniScript'){
 return sfURL = `https://${sfHostURL.value}/lightning/cmp/vlocity_cmt__OmniDesignerAuraWrapper?c__recordId=${recId}`;
}
else if(type == 'FlexCard'){
 return sfURL = `https://${sfHostURL.value}/lightning/r/vlocity_cmt__VlocityCard__c/${recId}/view`;
}
else if(type == 'IntegrationProcedure'){
  return sfURL = `https://${sfHostURL.value}/lightning/r/vlocity_cmt__OmniScript__c/${recId}/view`;
}
else if(type =='DataRaptor'){
  return sfURL = `https://${sfHostURL.value}/lightning/r/vlocity_cmt__DRBundle__c/${recId}/view`;
}
else{
  return null;
}
}*/

const getSalesforceURL = (recId, type) => {
  const baseURL = `https://${sfHostURL.value}/lightning`;

  switch (type) {
    case 'OmniScript':
      return `${baseURL}/cmp/vlocity_cmt__OmniDesignerAuraWrapper?c__recordId=${recId}`;
    case 'FlexCard':
      return `${baseURL}/r/vlocity_cmt__VlocityCard__c/${recId}/view`;
    case 'IntegrationProcedure':
      return `${baseURL}/r/vlocity_cmt__OmniScript__c/${recId}/view`;
    case 'DataRaptor':
      return `${baseURL}/r/vlocity_cmt__DRBundle__c/${recId}/view`;
    default:
      return null;
  }
};

onMounted(() => {
  let args = new URLSearchParams(location.search.slice(1));
  let sfHost = args.get("host");
  sfHostURL.value = sfHost;
})
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
      <PrimaryHeading> {{ recordTitle }}</PrimaryHeading>
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
        <template #item-Actions="{ Id }">
          <div class="text-center my-1.5">
            <a :href="getSalesforceURL(Id,queriedObject)"
              target="_blank">
              <PrimaryButton>Open in SF</PrimaryButton>
            </a>
          </div>
        </template>
      </Vue3EasyDataTable>
    </div>
  </div>
</template>

<script>
export default {
  name: "indexComp",
};
</script>
