import * as THREE from '../modules/three.module.js';

let createCube = function (_x, _y, _z) {
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

let createSmallCube = function (_x, _y, _z) {
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


let createRaycasterPlane = function (_x, _y, _z) {
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

let createRect = function (_x, _y, _z) {
    let mat = new THREE.MeshBasicMaterial({
        wireframe: true,
        transparent: false,
        depthTest: false,
        side: THREE.DoubleSide,
        color: new THREE.Color(0xFF0000)
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

export {createCube, createSmallCube, createMouse, createRect, createRaycasterPlane}
