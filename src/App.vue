<template>
  <header>
    <AppMenu />
    <AppMessages />
  </header>

  <main>
    <RouterView />
    <AppAbout />
  </main>
</template>

<script setup>
import AppMenu from './components/AppMenu.vue'
import AppMessages from './components/AppMessages.vue'
import AppAbout from './components/AppAbout.vue'
</script>

<style scoped>
</style>
