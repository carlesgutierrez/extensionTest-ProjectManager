<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjectStore } from './store';

const projectStore = useProjectStore();

onMounted(async () => {
  await projectStore.fetchProjects();
  await projectStore.fetchProjectTimes();
});
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  width: 400px;
  padding: 20px;
}
</style>