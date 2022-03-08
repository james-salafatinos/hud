let getMouseWorldPosition = function(mousePosition){
    //Takes in THREE.Vector2()
    //Returns {x, y}
    let wmx = mousePosition.x * ((window.innerWidth) * 2 - 1) / (360)
    let wmy = -mousePosition.y * -1 * ((window.innerHeight) * 2 - 1) / (360)
    return {x: wmx, y: wmy}
}

export {getMouseWorldPosition}