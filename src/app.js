import * as THREE from './modules/three.module.js';
import * as MeshFactory from './helpers/MeshFactory.js';
import { OrbitControls } from './modules/OrbitControls.js'
// /*
// VIDEO STREAM
// */

//This directly calls the API Stream from api.js
api.stream()
api.passthru()

const CLOSE_BTN = document.getElementById('close')
const START_BTN = document.getElementById('start')
const DEBUG = document.getElementById('debug')
const INPUT = document.getElementById('input-label')
const SCREENSHOT_BTN = document.getElementById('screenshot')
let offset_width = document.getElementById("options").offsetWidth
let mouseMesh;
let mouse = new THREE.Vector2();
let blockHold = false;
let startButtonClicked = false
let TOP_RIGHT = new THREE.Vector2(5, 4)
let TOP_LEFT = new THREE.Vector2(-5, 4)
let isDragging = false;
let camera, scene, renderer
let prevTime = performance.now();
let cube;
let smallCube;
let rect;
let frameIndex = 0;
let createCube
let createSmallCube
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
let sizes = {}


init();
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


window.addEventListener('mouseup', () => {
    isDragging = false
})


window.addEventListener('mousedown', () => {
    let mx = mouse.x * ((window.innerWidth) * 2 - 1) / 500
    let my = mouse.y * -1 * ((window.innerHeight) * 2 - 1) / 500
    isDragging = true;

    if (blockHold && isDragging) {

        cube = MeshFactory.createCube(mx, my, 0)
        scene.add(cube)
        smallCube =  MeshFactory.createSmallCube(mx, my, 0)
        scene.add(smallCube)

        // DEBUG.innerText = JSON.stringify(window.innerWidth)
        cube.position.x = mx
        cube.position.y = my

        smallCube.position.x = mx
        smallCube.position.y = my

    }

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
    // Update the mouse variable
    event.preventDefault();
    mouse.x = ((event.clientX) / window.innerWidth) * 2 - 1
    // DEBUG.innerText = JSON.stringify(offset_width)
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouseMesh.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / (360)
    mouseMesh.position.y = -mouse.y * -1 * ((window.innerHeight) * 2 - 1) / (360)

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
    const light = new THREE.PointLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    let sideLight = new THREE.PointLight(0xeeeeff, .5)
    sideLight.position.x = 10
    sideLight.lookAt(0, 0, 0)
    scene.add(new THREE.PointLight(0xd3fe30, .5))

    //Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 10
    camera.lookAt(0, 0, 0)


    
    //Object Creation
    // let raycasterPlane = MeshFactory.createRaycasterPlane(0, 0, -10)
    // raycasterPlane.lookAt(0, 0, 0)
    // scene.add(raycasterPlane)
    // console.log('Raycaster mesh', raycasterPlane)

    rect = MeshFactory.createRect(0, 0, 0)
    rect.rotation.x += Math.PI /2
    scene.add(rect)

    mouseMesh = MeshFactory.createMouse(0, 0, 0)
    scene.add(mouseMesh)

}

let setSize = function ( myMesh, xSize, ySize, zSize){
    let scaleFactorX = xSize / myMesh.geometry.parameters.width;
    let scaleFactorY = ySize / myMesh.geometry.parameters.height;
    let scaleFactorZ = zSize / myMesh.geometry.parameters.depth;
    myMesh.scale.set( scaleFactorX, scaleFactorY, scaleFactorZ );
  }

function animate() {
    //Frame Start up
    requestAnimationFrame(animate);

    //Required for NOCLIPCONTROLS
    const time = performance.now();

    renderer.render(scene, camera);

    mouseMesh.rotation.x += .0005
    mouseMesh.rotation.y += .0001
    mouseMesh.rotation.z += .0001


    if (isDragging) {

        //Requires render side updating, RATHER than in MOUSEDOWN
        rect.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / (360*2)
        rect.position.y = -mouse.y * -1 * ((window.innerHeight) * 2 - 1) / (360*2) 
        rect.scale.set(mouse.x * ((window.innerWidth) * 2 - 1) / (360), 1,  -mouse.y * -1 * ((window.innerHeight) * 2 - 1) / (360) )
        console.log('MOUSE POS',  mouse.x * ((window.innerWidth) * 2 - 1) / (360),-mouse.y * -1 * ((window.innerHeight) * 2 - 1) / (360) )
        // setSize(rect, mouse.x /10000, -mouse.y /10000, .1)
        //Requires render side updating
        smallCube.position.x = mouse.x * 1
        smallCube.position.y = mouse.y * 1

        //Requires render side updating
        cube.position.x = mouse.x * 2
        cube.position.y = mouse.y * 2

       
    }
    // controls.update()
    //Frame Shut Down
    prevTime = time;
    frameIndex++;
}