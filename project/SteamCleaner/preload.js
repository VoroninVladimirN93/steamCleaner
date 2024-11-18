const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    startCleaning: async () => await ipcRenderer.invoke('start-cleaning'),
});
