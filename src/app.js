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
let mousePosition = new THREE.Vector2();
let mouseWorldPosition = new THREE.Vector2();
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
let rectState = {};
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

let setBbox = function(mesh){

}

window.addEventListener('mousedown', () => {

    rect = MeshFactory.createRect(0, 0, 0)
    rect.rotation.x += Math.PI /2
    rectState.startx = getMouseWorldPosition(mousePosition).x
    rectState.starty = getMouseWorldPosition(mousePosition).y 
    scene.add(rect)
    isDragging = true;

    if (blockHold && isDragging) {

        cube = MeshFactory.createCube(mousePosition.x, mousePosition.y , 0)
        scene.add(cube)
        smallCube =  MeshFactory.createSmallCube(mousePosition.x, mousePosition.y , 0)
        scene.add(smallCube)

        // DEBUG.innerText = JSON.stringify(window.innerWidth)
        cube.position.x = mousePosition.x
        cube.position.y = mousePosition.y

        smallCube.position.x = mousePosition.x
        smallCube.position.y = mousePosition.y

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


let getMouseWorldPosition = function(mousePosition){
    let wmx = mousePosition.x * ((window.innerWidth) * 2 - 1) / (360)
    let wmy = -mousePosition.y * -1 * ((window.innerHeight) * 2 - 1) / (360)
    return {x: wmx, y: wmy}
}

window.addEventListener('mousemove', (event) => {
    // Update the mouse variable
    event.preventDefault();
    //Set Screen Mouse Coordinates
    mousePosition.x = ((event.clientX) / window.innerWidth) * 2 - 1
    mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;

    //For visibility, set mouseMesh to World Mouse Coordinates
    mouseMesh.position.x = getMouseWorldPosition(mousePosition).x
    mouseMesh.position.y = getMouseWorldPosition(mousePosition).y

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



    mouseMesh = MeshFactory.createMouse(0, 0, 0)
    scene.add(mouseMesh)

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

    if ((document.getElementById('data').innerText != "")){
        // console.log(document.getElementById('data').innerText)
        let data = JSON.parse((document.getElementById('data').innerText))
        console.log("DATA", data)
        
        data.preds.forEach((pred) =>{
            let {x,y,w,h} = pred.bbox
            x = ((pred.bbox[0] /window.innerWidth)*2-1) * ((window.innerWidth) * 2 - 1) / (360)
            y = ((pred.bbox[1] /window.innerHeight)*2-1) * (-1 * ((window.innerHeight) * 2 - 1) / (360))
        

            let rm = MeshFactory.createRect(x,y,0)
            rm.rotation.x += Math.PI /2
            rm.geometry.parameters.width = w /1000
            rm.geometry.parameters.height = h /1000
            scene.add(rm)
        })
    }

    if (isDragging) {

        //Requires render side updating, RATHER than in MOUSEDOWN
        // rect.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / (360*2)
        // rect.position.y = -mouse.y * -1 * ((window.innerHeight) * 2 - 1) / (360*2) 
        // rect.scale.set(mouse.x * ((window.innerWidth) * 2 - 1) / (360), 1,  -mouse.y * -1 * ((window.innerHeight) * 2 - 1) / (360) )
        // console.log('MOUSE POS',  mouse.x * ((window.innerWidth) * 2 - 1) / (360),-mouse.y * -1 * ((window.innerHeight) * 2 - 1) / (360) )
        let deltax = getMouseWorldPosition(mousePosition).x - rectState.startx
        let deltay = getMouseWorldPosition(mousePosition).y - rectState.starty

        rect.position.x = getMouseWorldPosition(mousePosition).x - deltax/2
        rect.position.y = getMouseWorldPosition(mousePosition).y - deltay/2
        rect.scale.set(deltax*2, 1, deltay*2)
        rectState.deltax = deltax
        rectState.deltay = deltay
        console.log("state", rectState)
       

        // //Requires render side updating
        // smallCube.position.x = mousePosition.x 
        // smallCube.position.y = mousePosition.y 

        // //Requires render side updating
        // cube.position.x = mousePosition.x 
        // cube.position.y = mousePosition.y 

       
    }
    // controls.update()
    //Frame Shut Down
    prevTime = time;
    frameIndex++;
}