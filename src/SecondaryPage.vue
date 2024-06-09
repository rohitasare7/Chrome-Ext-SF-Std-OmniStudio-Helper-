<template>
  
  <div class="p-5 w-11/12 dark:bg-gray-900 antialiased mx-auto my-6">
    <ToggleLightDarkMode />
    <SecondaryComp />
  </div>
</template>

<script>
import SecondaryComp from './components/partial/SecondaryComp.vue';
import ToggleLightDarkMode from './components/elements/ToggleLightDarkMode.vue'
import './assets/index.css';

export default {
  name: 'App',
  components: {
    SecondaryComp, 
    ToggleLightDarkMode
  }
}
</script>

<style>
body {
  font-family: "Figtree", sans-serif;
}
</style>
