const { contextBridge, ipcRenderer, desktopCapturer } = require('electron')

/*
##########################################################################################

Globals

##########################################################################################
*/
const mobilenet = require('@tensorflow-models/mobilenet')
const knnClassifier = require('@tensorflow-models/knn-classifier')
const backend = require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs-core')
const cocoSsd = require('@tensorflow-models/coco-ssd')
const tfConverter = require('@tensorflow/tfjs-converter');
let loadGraphModel = tfConverter.loadGraphModel
// const tfData = require('@tensorflow/tfjs-data')

var knnClassifierModel;
var mobilenetModel;
var ODModel;
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
                const createODModel = async () => {
                    console.log("Loading OD Model!");
                    return await cocoSsd.load()
                };

                ODModel = await createODModel()
                knnClassifierModel = await createKNNClassifier()
                mobilenetModel = await createMobileNetModel();
                webcamInput = await createWebcamInput();
            }

            let detectFrame = function (img, model) {
                // tf.engine().startScope();
                console.log("OD model,", model)
                // console.log(process_input(img))

                // let zz = model.executeAsync(process_input(img))
                // console.log(zz)
                // model.executeAsync(process_input(img)).then(predictions => {
                //     console.log(predictions)
                //     const boxes = predictions[4].arraySync();
                //     const scores = predictions[5].arraySync();
                //     const classes = predictions[6].dataSync();
                //     const detections = buildDetectedObjects(scores, .3,
                //         boxes, classes, classesDir);

                //     console.log('detections', detections)
                //     tf.engine().endScope();
                // });
                model.detect(img).then(predictions => {
                    let model_predictions = []
                    console.log(predictions)
                    predictions.forEach((p) =>{
                        if (p.score > .3){
                            model_predictions.push(p)
                        }

                    })
                    // document.getElementById("debug2").innerText = JSON.stringify(model_predictions)


                    document.getElementById("data").innerText = JSON.stringify({preds:model_predictions});
                });
            };

            let process_input = function (img) {
                const tfimg = img.toInt();
                const expandedimg = tfimg.transpose([0, 1, 2]).expandDims();
                return expandedimg;
            };


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
                    // console.log(img)

                    /*
                    OD
                    */

                    // detectFrame(img, ODModel)

                    /*
                    OD
                    */


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
                        console.log("Prediction knn result,", result)
                        // Printing results to screen
                        document.getElementById("debug").innerText = `
                            prediction: ${result.label}
                            probability: ${result.confidences[result.label]}`;
                        document.getElementById("debug").style = "color:black"
                        document.getElementById("debug").style = "background:white"

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

            await initialize()
            await imageClassificationWithTransferLearningOnWebcam(source)

        }


        // // Get the available video sources
        // async function selectSource(source) {
        //     const constraints = {
        //         audio: false,
        //         video: {
        //             mandatory: {
        //                 chromeMediaSource: 'desktop',
        //                 chromeMediaSourceId: source.id
        //             },
        //         }
        //     };

        //     //To Check devices
        //     // navigator.mediaDevices.enumerateDevices().then((d) => {
        //     //     console.log(d)
        //     // })
        //     const videoElement = document.getElementById('video');
        //     const stream = await navigator.mediaDevices.getUserMedia(constraints)
        //     videoElement.srcObject = stream;
        //     videoElement.play();
        // }



    }
})




