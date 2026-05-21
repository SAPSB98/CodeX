const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  generateCode: (params) => ipcRenderer.invoke('generate-code', params),
  saveFiles:    (files)  => ipcRenderer.invoke('save-files', { files }),
  saveApiKey:   (key)    => ipcRenderer.invoke('save-api-key', key),
  getApiKey:    ()       => ipcRenderer.invoke('get-api-key')
})