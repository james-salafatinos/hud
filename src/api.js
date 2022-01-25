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
        // Get the available video sources
        async function selectSource(source) {
            const constraints = {
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: source.id
                    },
                    // width: {
                    //     "min": 640,
                    //     "max": 1024
                    // },
                    // height: {
                    //     "min": 480,
                    //     "max": 768
                    // }
                }
            };


            // console.log(navigator.mediaDevices.getDisplayMedia())
            navigator.mediaDevices.enumerateDevices().then((d) => {
                console.log(d)
            })


            const videoElement = document.querySelector('video');
            const stream = await navigator.mediaDevices.getUserMedia(constraints)

            videoElement.srcObject = stream;
            videoElement.play();


        }
        desktopCapturer.getSources({
            types: ['window', 'screen']
        }).then((d) => {
            console.log(d)
            selectSource(d[2])
        })

    }
})


