<template>
  <MainComponent />

</template>
<script setup lang="ts">
import MainComponent from "./components/MainComponent.vue"
</script>

<style>
body {
  background: radial-gradient(
    circle,
    #ec8f5e,
    #f3b664,
    #f1eb8b,
    #cee6a9,
    #a0bd73,
    #83b58b,
    #8cc0bc,
    #8cc0de,
    #2c4d94,
    #1c315e
  );
  background-size: 400% 400%;
  animation: gradient 40s ease infinite;
  overflow-y: hidden;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
