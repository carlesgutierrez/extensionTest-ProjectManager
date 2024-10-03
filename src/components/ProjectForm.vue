<template>
  <div class="project-form">
    <h2>{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h2>
    <form @submit.prevent="saveProject">
      <div>
        <label for="name">Project Name:</label>
        <input v-model="project.name" id="name" required>
      </div>
      <div>
        <label for="color">Project Color:</label>
        <input v-model="project.color" id="color" type="color" required>
      </div>
      <div>
        <label for="domains">Domains (comma-separated):</label>
        <input v-model="domainsInput" id="domains" required>
      </div>
      <div>
        <label for="timeGoal">Time Goal (hours):</label>
        <input v-model.number="project.timeGoal" id="timeGoal" type="number" required>
      </div>
      <button type="submit">{{ isEditing ? 'Update' : 'Add' }} Project</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '../store';

const route = useRoute();
const router = useRouter();
const store = useProjectStore();

const isEditing = computed(() => route.params.id !== undefined);

interface Project {
  id: string;
  name: string;
  color: string;
  domains: string[];
  timeGoal: number;
}

const project = ref<Project>({
  id: '',
  name: '',
  color: '#000000',
  domains: [],
  timeGoal: 0
});

const domainsInput = ref('');

onMounted(async () => {
  if (isEditing.value) {
    const projectId = route.params.id as string;
    const existingProject = store.projects.find(p => p.id === projectId);
    if (existingProject) {
      project.value = { ...existingProject };
      domainsInput.value = existingProject.domains.join(', ');
    }
  }
});

async function saveProject() {
  project.value.domains = domainsInput.value.split(',').map(domain => domain.trim());
  
  if (isEditing.value) {
    await store.updateProject(project.value);
  } else {
    project.value.id = Date.now().toString();
    await store.addProject(project.value);
  }
  
  router.push('/');
}
</script>

<style scoped>
.project-form {
  max-width: 400px;
  margin: 0 auto;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 5px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>