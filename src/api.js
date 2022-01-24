const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld("api", {
    close: () => {
        ipcRenderer.send('close-app')
    },
    ignore: () => {
        ipcRenderer.send('ignore')
    },
    allow: () => {
        ipcRenderer.send('allow')
    },
    start: () =>{
        ipcRenderer.send('start')
    }
})