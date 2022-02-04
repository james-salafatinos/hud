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
let createRect;
let createRaycasterPlane
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();


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
    isDragging = true;
    console.log(event)
    if (blockHold && isDragging) {
        cube = createCube(0, 0, 0)
        scene.add(cube)
        smallCube = createSmallCube(0, 0, 0)
        scene.add(smallCube)
        // Update the mouse variable
        event.preventDefault();
        mouse.x = ((event.clientX - offsetWidth) / window.innerWidth) * 2 - 1
        // DEBUG.innerText = JSON.stringify(offset_width)
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        event.preventDefault();
        mouse.x = ((event.clientX - offset_width) / window.innerWidth) * 2 - 1
        // DEBUG.innerText = JSON.stringify(offset_width)
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // DEBUG.innerText = JSON.stringify(window.innerWidth)
        cube.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / 500
        cube.position.y = mouse.y * -1 * ((window.innerHeight) * 2 - 1) / 500

        smallCube.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / 500
        smallCube.position.y = mouse.y * -1 * ((window.innerHeight) * 2 - 1) / 500

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
    mouse.x = ((event.clientX - offset_width) / window.innerWidth) * 2 - 1
    // DEBUG.innerText = JSON.stringify(offset_width)
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // DEBUG.innerText = JSON.stringify(window.innerWidth)
    console.log(window.innerWidth, window.innerHeight)
    mouseMesh.position.x = mouse.x * ((window.innerWidth) * 2 - 1) / (360)
    mouseMesh.position.y = -mouse.y * -1 * ((window.innerHeight) * 2 - 1) / (360)
    console.log("MouseMesh.position", mouseMesh.position)
    //mouseMesh.position.copy(pos);

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1 / 360
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1 / 360

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


    createCube = function (_x, _y, _z) {
        let mat = new THREE.MeshLambertMaterial({
            wireframe: false,
            transparent: false,
            depthTest: true,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xd3fe30)
        });
        let geo = new THREE.BoxGeometry(.1, .1, .1)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }

    createSmallCube = function (_x, _y, _z) {
        let mat = new THREE.MeshLambertMaterial({
            wireframe: true,
            transparent: false,
            depthTest: true,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xd3dd21)
        });
        let geo = new THREE.BoxGeometry(.2, .2, .2)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }


    createRaycasterPlane = function (_x, _y, _z) {
        let mat = new THREE.MeshLambertMaterial({
            wireframe: true,

            depthTest: true,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xd3fe30)
        });
        let geo = new THREE.BoxGeometry(10, 10)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }

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



    //Object Creation
    let raycasterPlane = createRaycasterPlane(0, 0, -10)
    raycasterPlane.lookAt(0, 0, 0)
    scene.add(raycasterPlane)
    console.log('Raycaster mesh', raycasterPlane)

    rect = createRect(0, 0, 0)
    scene.add(rect)

    mouseMesh = createMouse(0, 0, 0)
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


    if (isDragging) {

        //Requires render side updating, RATHER than in MOUSEDOWN
        rect.position.x += .05

        //Requires render side updating
        smallCube.position.x = TOP_RIGHT.x + mouse.x * 1
        smallCube.position.y = TOP_RIGHT.y + mouse.y * 1

        //Requires render side updating
        cube.position.x = mouse.x * 2
        cube.position.y = mouse.y * 2

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children, false);
        console.log(mouse.x, mouse.y, raycaster, intersects)

        var vec = new THREE.Vector3(); // create once and reuse
        var pos = new THREE.Vector3(); // create once and reuse

        vec.set(
            (mouse.x / window.innerWidth) * 2 - 1,
            - (mouse.y / window.innerHeight) * 2 + 1,
            0.5);

        vec.unproject(camera);

        vec.sub(camera.position).normalize();

        var distance = - camera.position.z / vec.z;

        pos.copy(camera.position).add(vec.multiplyScalar(distance));
        console.log("distance", distance, pos, vec)

    }
    // controls.update()
    //Frame Shut Down
    prevTime = time;
    frameIndex++;
}