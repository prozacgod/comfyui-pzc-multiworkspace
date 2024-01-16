import { app } from "../../scripts/app.js";

const LOCALSTORAGE_KEY = "PZC_MultiWorkspace";

app.registerExtension({
  name: "Comfy.MultiWorkspace",

  init() {},

  readStorage() {
    const data = localStorage.getItem(LOCALSTORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {}
    }

    return { workspaces: [] };
  },

  writeStorage(data) {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  },

  readWorkspace(id) {
    const data = this.readStorage();
    return data.workspaces[id];
  },

  writeWorkspace(id, workspaceData) {
    const currentData = this.readStorage();
    currentData.workspaces[id] = workspaceData;
    this.writeStorage(currentData);
  },

  createWorkspaceMenu(id) {
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.onclick = () => {
      app.graphToPrompt().then((p) => {
        this.writeWorkspace(id, p.workflow);
      });
    };
    const loadButton = document.createElement("button");
    loadButton.textContent = "Load";
    loadButton.onclick = () => {
      app.loadGraphData(this.readWorkspace(id));
    };

    const sessionMenu = document.createElement("div");
    sessionMenu.style.display = 'flex';
    sessionMenu.style.margin = '0px';
    
    sessionMenu.textContent = `${id} `;
    sessionMenu.className ='comfy-menu-btns';
    sessionMenu.appendChild(saveButton);
    sessionMenu.appendChild(loadButton);
    
    return sessionMenu;
  },

  async setup() {
    const menu = document.querySelector('.comfy-menu');
    const separator = document.createElement('hr');
    separator.style.margin = "20px 0";
    separator.style.width = "100%";

    menu.append(separator);
    menu.append(this.createWorkspaceMenu(0));
    menu.append(this.createWorkspaceMenu(1));
    menu.append(this.createWorkspaceMenu(2));
    menu.append(this.createWorkspaceMenu(3));
    menu.append(this.createWorkspaceMenu(4));
  }
});
