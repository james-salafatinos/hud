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
        this.window = window
        this.testState = {}

        window.addEventListener('mousedown', (event) => {
            this.mouseDown = true
            this.isDragging = true

            this.testState.mouseStartX = this.mousePosition.x
            this.testState.mouseStartY = this.mousePosition.y

            this.rect = MeshFactory.createRect(0, 0, 0)
            this.rect.rotation.x += Math.PI / 2
            this.rectState.mouseStartX = ((this.mousePosition.x + 1)/2)
            this.rectState.mouseStartY = ((this.mousePosition.y + 1)/2)
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

          
           

            let p_mat = new THREE.MeshPhongMaterial({
                wireframe: false,
                transparent: false,
                depthTest: false,
                side: THREE.DoubleSide,
                color: new THREE.Color(0xFF0000)
            });
            let p_geo = new THREE.BoxGeometry(this.rectState.deltax, 1, this.rectState.deltay)
            let p_mesh = new THREE.Mesh(p_geo, p_mat)
            p_mesh.position.x = this.rectState.startx
            p_mesh.position.y = this.rectState.starty
            p_mesh.position.z = 0
            this.p_mesh = p_mesh
            this.scene.add(this.p_mesh)

            /*
            Configuration is very specific to ScreenShot() in API
            */
            let x1 = Math.round(this.rectState.mouseStartX*window.innerWidth)
            let y1 = Math.round((1-this.rectState.mouseStartY)*window.innerHeight)
            let w = Math.round(Math.abs(this.rectState.deltax*96))
            let h = Math.round(Math.abs(this.rectState.deltay*100))
            console.log('.........', x1,y1,w,h)
            this.api.ScreenShot(x1+10,y1, w, h)
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
        } else{
            try{
                this.rect.material.color = new THREE.Color(0xff3ff)
                this.rect.material.wireframe = false;
                this.rect.material.transparent = true;
                this.rect.material.opacity -= .01
                this.rect.position.y -= .001

                this.p_mesh.material.transparent = true;
                this.p_mesh.material.opacity -= .01
                this.p_mesh.position.z -= .01
                this.p_mesh.rotation.y += .05
            }
            catch{

            }
    

     
        }

    }
    screenshot(){

    }

}


export default SnippingTool