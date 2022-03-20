import * as THREE from './modules/three.module.js';
import * as MeshFactory from './helpers/MeshFactory.js';
import * as helpers from './helpers/helpers.js';
import SnippingTool from './helpers/SnippingTool.js';

//This directly calls the API Stream from api.js
api.stream()
api.passthru()

const CLOSE_BTN = document.getElementById('close')
const START_BTN = document.getElementById('start')
const DEBUG = document.getElementById('debug')
const INPUT = document.getElementById('input-label')
const SCREENSHOT_BTN = document.getElementById('screenshot')
let blockHold = false;
let startButtonClicked = false
let camera, scene, renderer
let prevTime = performance.now();
let frameIndex = 0;
let sizes = {}


init();
let Snipper = new SnippingTool(window, scene, api)

animate();



START_BTN.addEventListener('click', () => {
    console.log(blockHold, startButtonClicked)
    if (startButtonClicked) {
        console.log('yooo')
        START_BTN.style.color = '#affff9'
        blockHold = false;
        startButtonClicked = false;
        api.passthru()
    } else {
        api.addCustomClass('test-label-2')
        START_BTN.style.color = '#7aff69'
        blockHold = true;
        startButtonClicked = true;
    }
})

START_BTN.addEventListener('mouseenter', () => {
    api.block()
})

START_BTN.addEventListener('mouseleave', () => {
    if (blockHold) {
        api.block()
    } else {
        api.passthru()
    }
})

CLOSE_BTN.addEventListener('mouseenter', () => {
    api.block()
})

CLOSE_BTN.addEventListener('mouseleave', () => {
    api.passthru()
})

CLOSE_BTN.addEventListener('click', () => {
    api.close()
})

INPUT.addEventListener('mouseenter', () => {
    document.getElementById("input-label").focus()
})

SCREENSHOT_BTN.addEventListener('click', (event) => {
    let class_label = document.getElementById("input-label").value;
    api.addCustomClass(`Test: ${class_label}`)
});

window.addEventListener('keydown', (event) => {
    if (event.altKey && event.key === 'd') {
        console.log(event)
        DEBUG.innerText = JSON.stringify(Math.random())
    }
});

window.addEventListener('mousedown', () => {
})

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




window.addEventListener('mousemove', (event) => {

});




function init() {

    scene = new THREE.Scene();

    //Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    let domCanvas = document.getElementById('canvas')
    domCanvas.appendChild(renderer.domElement);

    // LIGHTS
    const light = new THREE.PointLight(0xeeeeff, 0x777788, 1);
    light.position.set(0.5, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    let sideLight = new THREE.PointLight(0xeeeeff, 1)
    sideLight.position.x = 10
    sideLight.lookAt(0, 0, 0)
    scene.add(sideLight)

    //Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 10
    camera.lookAt(0, 0, 0)

}


function animate() {
    //Frame Start up
    requestAnimationFrame(animate);

    //Required for NOCLIPCONTROLS
    const time = performance.now();

    renderer.render(scene, camera);

    Snipper.update()


    if ((document.getElementById('data').innerText != "")) {
        // console.log(document.getElementById('data').innerText)
        let data = JSON.parse((document.getElementById('data').innerText))
        console.log("DATA", data)

        data.preds.forEach((pred) => {
            let { x, y, w, h } = pred.bbox
            x = ((pred.bbox[0] / window.innerWidth) * 2 - 1) * ((window.innerWidth) * 2 - 1) / (360)
            y = ((pred.bbox[1] / window.innerHeight) * 2 - 1) * (-1 * ((window.innerHeight) * 2 - 1) / (360))


            let rm = MeshFactory.createRect(x, y, 0)
            rm.rotation.x += Math.PI / 2
            rm.geometry.parameters.width = w / 1000
            rm.geometry.parameters.height = h / 1000
            scene.add(rm)
        })
    }


    //Frame Shut Down
    prevTime = time;
    frameIndex++;
}