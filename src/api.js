const { contextBridge, ipcRenderer, desktopCapturer } = require('electron')

/*
##########################################################################################



##########################################################################################
*/
const mobilenet = require('@tensorflow-models/mobilenet')
const knnClassifier = require('@tensorflow-models/knn-classifier')
const backend = require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs-core')
const tfData = require('@tensorflow/tfjs-data')

var knnClassifierModel;
var mobilenetModel;
var webcamInput;
var classes = []
var runs = 0

/*
##########################################################################################

Accessible in mainProcess

##########################################################################################
*/
contextBridge.exposeInMainWorld("api", {
    close: () => {
        ipcRenderer.send('close-app')
    },
    passthru: () => {
        ipcRenderer.send('passthru')
    },
    block: () => {
        ipcRenderer.send('block')
    },
    blockHold: () => {
        ipcRenderer.send('blockHold')
    },
    addCustomClass: (class_label) => {
        let img;
        img = tf.browser.fromPixels(webcamInput);
        const activation = mobilenetModel.infer(img, "conv_preds");
        knnClassifierModel.addExample(activation, class_label);
    },
    stream: () => {
        /*
        Wrapper async
        */
        //Start Capture
        desktopCapturer.getSources({
            types: ['window', 'screen']
        }).then((source_id_list) => {
            console.log('API.js desktopCapturer', source_id_list)

            // selectSource(source_id_list[2])
            console.log("Passing to start predicting", source_id_list[0])
            start_predicting(source_id_list[0])
        })

        async function start_predicting(source) {
            console.log('Begin stream() in api.js')


            //Async to setup machine learning 
            async function initialize() {
                const createKNNClassifier = async () => {
                    console.log("Loading KNN Classifier!");
                    return await knnClassifier.create();
                };
                const createMobileNetModel = async () => {
                    console.log("Loading Mobilenet Model!");
                    return await mobilenet.load();
                };
                const createWebcamInput = async () => {
                    console.log("Loading Webcam Input!");
                    return await sourceScreen(source)
                };
                knnClassifierModel = await createKNNClassifier()
                mobilenetModel = await createMobileNetModel();
                webcamInput = await createWebcamInput();
            }

            //Async to acively "record" screen
            async function imageClassificationWithTransferLearningOnWebcam(source) {
                console.log("Machine Learning on the web is ready, and starting");
                //While webcam is running
                while (true) {
                    //Delay predictions to every one second
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    //Image from stream
                    let img;
                    img = tf.browser.fromPixels(webcamInput);

                    //Get model weights
                    const activation = mobilenetModel.infer(img, "conv_preds");

                    //On the first run, add a base class example
                    if (runs == 0) {
                        knnClassifierModel.addExample(activation, 'initial commit');
                    }
                    runs++;
                    console.log("Total number of classes in the classifier", knnClassifierModel.getNumClasses())

                    //Perform predictions
                    if (knnClassifierModel.getNumClasses() > 0) {
                        // Get the most likely class and confidences from the classifier module.
                        const result = await knnClassifierModel.predictClass(activation);
                        console.log("Prediction result", result)
                        //Printing results to screen
                        document.getElementById("debug").innerText = `
                            prediction: ${result.label}
                            probability: ${result.confidences[result.label]}`;
                        document.getElementById("debug").style = "color:black"
                        // Dispose the tensor to release the memory.
                        img.dispose();
                    }

                    //Not sure if this is needed
                    await tf.nextFrame();
                }
            };

            // Get the available video sources and return video element
            async function sourceScreen(source) {
                const constraints = {
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: source.id
                        },
                    }
                };
                //Claim the html element
                const videoElement = document.getElementById('video');

                //Point the chromium/hardware connection
                const stream = await navigator.mediaDevices.getUserMedia(constraints)
                videoElement.srcObject = stream;
                videoElement.play();
                return videoElement
            }

            //Add a custom dataset class with an image and a name for it
            const addDatasetClass = async (img, classLabel) => {
                console.log("Added class: ", classLabel);
                classes.push(classLabel);

                // Get the intermediate activation of MobileNet 'conv_preds' and pass that
                // to the KNN classifier.
                const activation = mobilenetModel.infer(img, "conv_preds");

                // Pass the intermediate activation to the classifier.
                knnClassifierModel.addExample(activation, classLabel);

                // Dispose the tensor to release the memory.
                img.dispose();
            };

            await initialize()
            await imageClassificationWithTransferLearningOnWebcam(source)

        }


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




