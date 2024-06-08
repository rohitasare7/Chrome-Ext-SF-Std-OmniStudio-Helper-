<template>
  
  <div class="p-5 dark:bg-gray-900 antialiased">
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
