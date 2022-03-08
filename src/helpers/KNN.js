
const mobilenet = require('@tensorflow-models/mobilenet')
const knnClassifier = require('@tensorflow-models/knn-classifier')
const backend = require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs-core')
const cocoSsd = require('@tensorflow-models/coco-ssd')
const tfConverter = require('@tensorflow/tfjs-converter');
let loadGraphModel = tfConverter.loadGraphModel

class KNNImageClassifier {
    constructor() {
        console.log('Constructing KNNImageClassifier')
    }

    async initialize() {
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

        this.ODModel = await createODModel()
        this.knnClassifierModel = await createKNNClassifier()
        this.mobilenetModel = await createMobileNetModel();
        this.webcamInput = await createWebcamInput();
    }
  
    //Async to acively "record" screen
    async imageClassificationWithTransferLearningOnWebcam(source) {
        console.log("Machine Learning on the web is ready, and starting");
        console.log("Total number of classes in the classifier", knnClassifierModel.getNumClasses())
        
        while (true) {

            //Delay predictions to every one second
            await new Promise(resolve => setTimeout(resolve, 1000))

            //On the first run, add a base class example
            if (runs == 0) {
                this.knnClassifierModel.addExample(activation, 'initial commit');
            }
            runs++;

            this.predict()

            //Not sure if this is needed
            await tf.nextFrame();
        }
    }
    inferWeights(){
        let img = tf.browser.fromPixels(webcamInput);
        this.activation = this.mobilenetModel.infer(img, "conv_preds");
        img.dispose();
    }
    async predict() {
        if (this.knnClassifierModel.getNumClasses() > 0) {
            const result = await this.knnClassifierModel.predictClass(activation);
            console.log("Prediction knn result,", result)
            document.getElementById("debug").innerText = `
                prediction: ${result.label}
                probability: ${result.confidences[result.label]}`;
        }
    }

    addCustomExample(img, class_label) {
        img = tf.browser.fromPixels(webcamInput);
        const activation = mobilenetModel.infer(img, "conv_preds");
        knnClassifierModel.addExample(activation, class_label);
    }
}

export default KNNImageClassifier