var easycam,
    state = {
        distance: 208,
        center: [5, 3, -13],
        rotation: [0.3, -0.4, -0.1, 0.85]
    },
    x = 0,
    y = 20

function preload() {
    f = loadFont("../fonts/Roboto-Regular.ttf")
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL)
    //setAttributes('antialias', true);
    easycam = createEasyCam()
    document.oncontextmenu = function() {
        return false
    }

    // set initial camera state
    easycam.setState(state, 1000) // animate to state in 1 second
    easycam.state_reset = state // state to use on reset

    // use the loaded font
    textFont(f)
    textSize(16)
    stroke(50, 50, 52)
    strokeWeight(0.5)
}

function draw() {
    // 3D section
    background(32)
    lights()
    box(100)

    // 2D screen-aligned rendering section
    easycam.beginHUD()
    this._renderer._enableLighting = false // fix for issue #1
    let state = easycam.getState()

    // Render the background box for the HUD
    noStroke()
    fill(0)
    rect(x, y, 20, 100)
    fill(50, 50, 52, 200) // a bit of transparency
    rect(x + 20, y, 380, 100)

    // Render the labels
    fill(69, 161, 255)
    text("Distance:", x + 35, y + 25)
    text("Center:  ", x + 35, y + 25 + 20)
    text("Rotation:", x + 35, y + 25 + 40)
    text("Framerate:", x + 35, y + 25 + 60)

    // Render the state numbers
    fill(69, 161, 255)
    text(nfs(state.distance, 1, 2), x + 125, y + 25)
    text(nfs(state.center, 1, 2), x + 125, y + 25 + 20)
    text(nfs(state.rotation, 1, 3), x + 125, y + 25 + 40)
    text(nfs(frameRate(), 1, 2), x + 125, y + 25 + 60)
    easycam.endHUD()
}
