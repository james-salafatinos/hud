import * as THREE from './modules/three.module.js';
import { PointerLockControls } from "./modules/PointerLockControls.js";
import { GUI } from "./modules/dat.gui.module.js";
import Stats from './modules/stats.module.js';
import { NoClipControls } from './modules/NoClipControls.js'
import { PhysicsObject } from './modules/PhysicsObject.js'

// /*
// VIDEO STREAM
// */

//This directly calls the API Stream from api.js
api.stream()

// /*
// MACHINE LEARNING
// */
const createKNNClassifier = async () => {
    console.log("Loading KNN Classifier");
    return await knnClassifier.create();
};
const createMobileNetModel = async () => {
    console.log("Loading Mobilenet Model");
    return await mobilenet.load();
};
const createWebcamInput = async () => {
    console.log("Loading Webcam Input");
    const webcamElement = await document.getElementById("video");
    return await tf.data.webcam(webcamElement);
};

const mobilenetModel = await createMobileNetModel();
const knnClassifierModel = await createKNNClassifier();
const webcamInput = await createWebcamInput();


const CLOSE_BTN = document.getElementById('close')
const START_BTN = document.getElementById('start')
const DEBUG = document.getElementById('debug')
let mouseMesh;
var mouse = new THREE.Vector2();

// STart and close Button (Top Left)
START_BTN.addEventListener('click', () => {
    api.start()
    START_BTN.style.color = '#7aff69'
})
START_BTN.addEventListener('mouseenter', () => {
    api.ignore()
})
START_BTN.addEventListener('mouseleave', () => {
    api.allow()
})
CLOSE_BTN.addEventListener('click', () => {
    api.close()
})
CLOSE_BTN.addEventListener('mouseenter', () => {
    api.ignore()
})
CLOSE_BTN.addEventListener('mouseleave', () => {
    api.allow()
})


//Internal Libraries

//THREE JS
let camera, scene, renderer, composer, controls
let stats;
//Required for NOCLIPCONTROLS
let prevTime = performance.now();
let cube;
let frameIndex = 0;

init();
animate();

function init() {

    scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const gridHelper = new THREE.GridHelper(6, 2);
    scene.add(gridHelper);



    //Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    let domCanvas = document.getElementById('canvas')
    domCanvas.appendChild(renderer.domElement);

    // LIGHTS
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    //Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 5
    camera.lookAt(0, 0, 0)

    //NO CLIP CONTROLS
    controls = new NoClipControls(window, camera, document);


    let createCube = function (_x, _y, _z) {
        let mat = new THREE.MeshBasicMaterial({
            wireframe: true,
            transparent: false,
            depthTest: false,
            side: THREE.DoubleSide,
            color: new THREE.Color(0x00fe00)
        });
        let geo = new THREE.BoxGeometry(.5, .5, .5)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }

    cube = createCube(0, 0, 1)
    scene.add(cube)

    let createMouse = function (_x, _y, _z) {
        let mat = new THREE.MeshBasicMaterial({
            wireframe: true,
            transparent: false,
            depthTest: false,
            side: THREE.DoubleSide,
            color: new THREE.Color(0x000e0)
        });
        let geo = new THREE.IcosahedronBufferGeometry(.2, 1)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }

    mouseMesh = createMouse(0, 0, 0)
    scene.add(mouseMesh)



    window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });


    let offset_width = document.getElementById("options").offsetWidth
    window.addEventListener('mousemove', (event) => {
        // Update the mouse variable
        event.preventDefault();
        mouse.x = ((event.clientX - offset_width) / window.innerWidth) * 2 - 1
        DEBUG.innerText = JSON.stringify(offset_width)
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // DEBUG.innerText = JSON.stringify(window.innerWidth)
        mouseMesh.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / 750
        mouseMesh.position.z = mouse.y * -1 * ((window.innerHeight) * 2 - 1) / 750
        //mouseMesh.position.copy(pos);

    });

}



function animate() {
    //Frame Start up
    requestAnimationFrame(animate);

    //Required for NOCLIPCONTROLS
    const time = performance.now();

    controls.update(time, prevTime)


    renderer.render(scene, camera);

    mouseMesh.rotation.x += .0005
    mouseMesh.rotation.y += .0001
    mouseMesh.rotation.z += .0001


    //Frame Shut Down
    prevTime = time;
    frameIndex++;
}