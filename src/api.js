const { contextBridge, ipcRenderer, desktopCapturer } = require('electron')


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
    start: () => {
        ipcRenderer.send('start')
    },
    getDevices: () => {
        // Get the available video sources

        desktopCapturer.getSources({
            types: ['window', 'screen']
        }).then((d) => {
            console.log(d)
        })

    }
})


