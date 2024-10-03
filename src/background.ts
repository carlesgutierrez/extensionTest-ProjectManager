import browser from 'webextension-polyfill';

browser.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    const domain = url.hostname;

    browser.storage.local.get('projects').then((result) => {
      const projects = result.projects || [];
      const matchingProject = projects.find((project: { domains: string[] }) => 
        project.domains.includes(domain)
      );

      if (matchingProject) {
        browser.storage.local.get('projectTimes').then((timeResult) => {
          const projectTimes = timeResult.projectTimes || {};
          projectTimes[matchingProject.id] = (projectTimes[matchingProject.id] || 0) + 1;
          browser.storage.local.set({ projectTimes });
        });
      }
    });
  }
});

// WebSocket connection for LED strip communication
let ws: WebSocket | null = null;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:8080'); // Replace with your microcontroller's WebSocket address

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected. Reconnecting...');
    setTimeout(connectWebSocket, 5000);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

connectWebSocket();

// Function to update LED strip
function updateLEDStrip(projectId: string, progress: number) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ projectId, progress }));
  }
}

// Listen for changes in project times and update LED strip
browser.storage.onChanged.addListener((changes) => {
  if (changes.projectTimes) {
    const projectTimes = changes.projectTimes.newValue;
    browser.storage.local.get('projects').then((result) => {
      const projects = result.projects || [];
      const activeProject = projects.find((project: { id: string }) => projectTimes[project.id] > 0);
      if (activeProject) {
        const progress = (projectTimes[activeProject.id] / activeProject.timeGoal) * 100;
        updateLEDStrip(activeProject.id, progress);
      }
    });
  }
});