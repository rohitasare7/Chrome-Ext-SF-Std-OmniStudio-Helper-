<script setup>
import TextDesc from './elements/TextDesc.vue';

</script>

<template>
    <div class="bg-white p-4 rounded-xl">
        <TextDesc>Please open your Salesforce Org (Lightning Recommended) and click OS Helper button at right top corner. You can refer below image.
    </TextDesc>
    <img src="../assets/howToScreen.png" class="mt-2 pt-2 pb-4 border rounded-md">
    </div>
    
</template>

<script>
export default {
    name: 'mainPage',
}
</script>