<template>
  <div class="dashboard">
    <h1>URL Tracker Dashboard</h1>
    <router-link to="/add-project" class="btn">Add New Project</router-link>
    <div v-for="project in projects" :key="project.id" class="project-card" :style="{ borderColor: project.color }">
      <h2>{{ project.name }}</h2>
      <p>Time spent: {{ formatTime(projectTimes[project.id] || 0) }}</p>
      <p>Progress: {{ calculateProgress(project) }}%</p>
      <div class="progress-bar" :style="{ width: `${calculateProgress(project)}%`, backgroundColor: project.color }"></div>
      <router-link :to="`/edit-project/${project.id}`" class="btn">Edit</router-link>
      <button @click="deleteProject(project.id)" class="btn delete">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProjectStore } from '../store';

const store = useProjectStore();

const projects = computed(() => store.projects);
const projectTimes = computed(() => store.projectTimes);

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function calculateProgress(project: any): number {
  const timeSpent = projectTimes.value[project.id] || 0;
  return Math.min(Math.round((timeSpent / project.timeGoal) * 100), 100);
}

async function deleteProject(projectId: string) {
  if (confirm('Are you sure you want to delete this project?')) {
    await store.deleteProject(projectId);
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 0 auto;
}

.project-card {
  border: 2px solid;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.progress-bar {
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin-top: 10px;
}

.btn {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.btn.delete {
  background-color: #f44336;
}
</style>