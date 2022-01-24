//Internal Libraries
import * as THREE from './modules/three.module.js';
//THREE JS
let camera, scene, renderer, composer, controls
let stats;
//Required for NOCLIPCONTROLS
let prevTime = performance.now();
let p0

init();
animate();

function init() {

    scene = new THREE.Scene();

    

    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // LIGHTS
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    //Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    let createCube = function (_x, _y, _z) {
        let mat = new THREE.MeshBasicMaterial({
            wireframe: true,
            transparent: false,
            depthTest: false,
            side: THREE.DoubleSide,
            color: new THREE.Color(0xffffff)
        });
        let geo = new THREE.BoxGeometry(2, 2, 2)
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = _x
        mesh.position.y = _y
        mesh.position.z = _z
        return mesh
    }

    let cube = createCube(10, -10, 10)
    scene.add(cube)

}

function animate() {
    //Frame Start up
    requestAnimationFrame(animate);

    //Required for NOCLIPCONTROLS
    const time = performance.now();

    renderer.render(scene, camera);

    //Frame Shut Down
    prevTime = time;
}