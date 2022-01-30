import * as THREE from './modules/three.module.js';
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
let mouseMesh;
var mouse = new THREE.Vector2();

// STart and close Button (Top Left)



window.addEventListener('keydown', (event) => {

    if (event.altKey && event.key === 'd') {
        console.log(event)
        DEBUG.innerText = JSON.stringify(Math.random())

    }
    // switch (event.code) {
    //     case 'Space':
    //         // api.addCustomClass()               
    //         console.log(event )                 
    //         api.ignore()
    //         break;  
    // }

});

let blockHold = false;
let startButtonClicked = false
let isDrawing = false;
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

let isDragging = false;
window.addEventListener('mousedown', () => {
    isDragging = true;
    console.log(event)
    if (blockHold && isDragging) {


        cube = createCube(0, 0, 0)
        scene.add(cube)



        // Update the mouse variable
        event.preventDefault();
        mouse.x = ((event.clientX) / window.innerWidth) * 2 - 1
        // DEBUG.innerText = JSON.stringify(offset_width)
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // DEBUG.innerText = JSON.stringify(window.innerWidth)
        cube.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / 750
        cube.position.z = mouse.y * -1 * ((window.innerHeight) * 2 - 1) / 750

        
        raycaster = new THREE.Raycaster();

        // console.log("pointer" ,pointer, "intersects",intersects, mouseMesh)
    }

})

window.addEventListener('mouseup', () => {
    isDragging = false
})

//Internal Libraries

//THREE JS
let camera, scene, renderer, composer, controls
let stats;
//Required for NOCLIPCONTROLS
let prevTime = performance.now();
let cube;
let rect;
let frameIndex = 0;
let createCube
let createRect;
let createRaycasterPlane
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();

init();
animate();

function init() {

    scene = new THREE.Scene();

    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
    // const gridHelper = new THREE.GridHelper(6, 2);
    // scene.add(gridHelper);



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
    camera.position.y = 5
    camera.lookAt(0, 0, 0)


    // // Controls
    // const controls = new OrbitControls(camera, canvas);
    // controls.enableDamping = true;

    createCube = function (_x, _y, _z) {
        let mat = new THREE.MeshLambertMaterial({
            wireframe: false,
            transparent: false,
            depthTest: true,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xd3fe30)
        });
        let geo = new THREE.BoxGeometry(.5, .5, .5)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }


    createRaycasterPlane = function (_x, _y, _z) {
        let mat = new THREE.MeshLambertMaterial({
            wireframe: false,
            transparent: false,
            depthTest: true,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xd3fe30)
        });
        let geo = new THREE.BoxGeometry(10,  10)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }

    // cube = createCube(0, 0, 1)
    // scene.add(cube)

    // createRaycasterPlane = function(){
    //     let mat = new THREE.MeshBasicMaterial({
    //         wireframe: false,
    //         transparent: false,
    //         depthTest: true,
    //         side: THREE.DoubleSide,
    //         color: new THREE.Color(25,220,12)
    //     });
    //     let geo = new THREE.PlaneBufferGeometry(5, 4)
    //     let mesh = new THREE.Mesh(geo, mat)

    //     // mesh.lookAt(0,-1,0)
    //     // mesh.name = "rayCasterPlane"
    //     return mesh

    // }
    let raycasterPlane = createRaycasterPlane(0, -10, 0)
    raycasterPlane.lookAt(0,0,0)
    scene.add(raycasterPlane)
    console.log('Raycaster mesh', raycasterPlane)


    createRect = function (_x, _y, _z) {
        let mat = new THREE.MeshBasicMaterial({
            wireframe: true,
            transparent: false,
            depthTest: false,
            side: THREE.DoubleSide,
            color: new THREE.Color(0x4f0e40)
        });
        let geo = new THREE.BoxGeometry(.5, 0, .5)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }
    rect = createRect(0, 0, 0)
    scene.add(rect)


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
        // DEBUG.innerText = JSON.stringify(offset_width)
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // DEBUG.innerText = JSON.stringify(window.innerWidth)
        mouseMesh.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / 750
        mouseMesh.position.z = mouse.y * -1 * ((window.innerHeight) * 2 - 1) / 750
        //mouseMesh.position.copy(pos);

        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1/ 750
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1/ 750

       

        // calculate objects intersecting the picking ray



    });

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
        rect.position.x += .05
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children, false);
        console.log(mouse.x, mouse.y,raycaster, intersects)
 
    }
    // controls.update()
    //Frame Shut Down
    prevTime = time;
    frameIndex++;
}