import { defineStore } from 'pinia';
import browser from 'webextension-polyfill';

interface Project {
  id: string;
  name: string;
  color: string;
  domains: string[];
  timeGoal: number;
}

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    projectTimes: {} as Record<string, number>,
  }),
  actions: {
    async fetchProjects() {
      const result = await browser.storage.local.get('projects');
      this.projects = result.projects || [];
    },
    async addProject(project: Project) {
      this.projects.push(project);
      await browser.storage.local.set({ projects: this.projects });
    },
    async updateProject(updatedProject: Project) {
      const index = this.projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        this.projects[index] = updatedProject;
        await browser.storage.local.set({ projects: this.projects });
      }
    },
    async deleteProject(projectId: string) {
      this.projects = this.projects.filter(p => p.id !== projectId);
      await browser.storage.local.set({ projects: this.projects });
    },
    async fetchProjectTimes() {
      const result = await browser.storage.local.get('projectTimes');
      this.projectTimes = result.projectTimes || {};
    },
  },
});