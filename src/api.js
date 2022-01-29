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
    stream: () => {
        /*
        Start streaming
        */
        //Start Capture
        desktopCapturer.getSources({
            types: ['window', 'screen']
        }).then((source_id_list) => {
            //Print the source name/id
            console.log(source_id_list)
            //Select the Source and begin stream
            selectSource(source_id_list[2])
        })
        
        // Get the available video sources
        async function selectSource(source) {
            const constraints = {
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: source.id
                    },
                }
            };

            //To Check devices
            // navigator.mediaDevices.enumerateDevices().then((d) => {
            //     console.log(d)
            // })
            const videoElement = document.getElementById('video');
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            videoElement.srcObject = stream;
            videoElement.play();
        }



    }
})


