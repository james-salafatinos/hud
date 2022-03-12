import * as THREE from '../modules/three.module.js';
import * as helpers from './helpers.js';
import * as MeshFactory from './MeshFactory.js';


class SnippingTool {
    constructor(window, scene, api) {
        this.isDragging = false
        this.mouseDown = false
        this.rect
        this.rectState = {}
        this.mousePosition = new THREE.Vector2();
        this.scene = scene
        this.api = api

        window.addEventListener('mousedown', (event) => {
            this.mouseDown = true
            this.isDragging = true

            this.rect = MeshFactory.createRect(0, 0, 0)
            this.rect.rotation.x += Math.PI / 2
            this.rectState.startx = helpers.getMouseWorldPosition(this.mousePosition).x
            this.rectState.starty = helpers.getMouseWorldPosition(this.mousePosition).y
            this.scene.add(this.rect)
        });

        window.addEventListener('mousemove', (event) => {
            // Update the mouse variable
            event.preventDefault();
            //Set Screen Mouse Coordinates
            this.mousePosition.x = ((event.clientX) / window.innerWidth) * 2 - 1
            this.mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;

        });
        window.addEventListener('mouseup', (event) => {
            this.isDragging = false
            console.log("**MOUSE UP **")
            this.api.ScreenShot()
            this.api.UserPrompt()

      
        })

    }


    update() {
        if (this.isDragging) {
            let deltax = helpers.getMouseWorldPosition(this.mousePosition).x - this.rectState.startx
            let deltay = helpers.getMouseWorldPosition(this.mousePosition).y - this.rectState.starty
            this.rect.position.x = helpers.getMouseWorldPosition(this.mousePosition).x - deltax / 2
            this.rect.position.y = helpers.getMouseWorldPosition(this.mousePosition).y - deltay / 2
            this.rect.scale.set(deltax * 2, 1, deltay * 2)
            this.rectState.deltax = deltax
            this.rectState.deltay = deltay
            console.log("state", this.rectState)
        }

    }
    screenshot(){

    }

}


export default SnippingTool