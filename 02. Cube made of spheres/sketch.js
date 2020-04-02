// Inital camera positioning
var easycam,
    state = {
        distance: 1000,
        center: [5, 3, -13],
        rotation: [0, 0, 0, 1]
    },
    x = 0,
    y = 20

let ballSize = 25
ballSpacing = ballSize + 10

/**
 * preload() Run before setup
 * Load Font
 */
function preload() {
    f = loadFont("../fonts/Roboto-Regular.ttf")
}

/**
 * setupHud() Setup the HUD
 */
function setupHud() {
    setAttributes("antialias", true)
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
}

/**
 * displayHud() Display hud details
 */
function displayHud() {
    // 2D screen-aligned rendering section
    easycam.beginHUD()
    // this._renderer._enableLighting = false // fix for issue #1
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

/**
 * setup() Initial method run to setup project
 */
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL)
    setupHud()
    // noLoop()
}

/**
 * draw() Continuously Executing
 */
function draw() {
    // Background Colour
    background(32)
    lights()

    // Create Line of balls
    fill("yellow")

    let amount = 5
    for (x = 0; x < amount; x++) {
        let translationX = ballSize * x + ballSpacing * x

        // X
        push()
        translate(translationX, 0, 0)
        sphere(ballSize)
        pop()

        // Z
        for (z = 1; z < amount; z++) {
            let translationZ = ballSize * z + ballSpacing * z
            push()
            translate(translationX, 0, translationZ)
            sphere(ballSize)
            pop()
        }

        // Y
        for (y = 1; y < amount; y++) {
            let translationY = ballSize * y + ballSpacing * y
            push()
            translate(translationX, translationY, 0)
            sphere(ballSize)
            pop()

            // Z
            for (z = 1; z < amount; z++) {
                let translationZ = ballSize * z + ballSpacing * z
                push()
                translate(translationX, translationY, translationZ)
                sphere(ballSize)
                pop()
            }
        }
    }

    // Display HUD
    displayHud()
}
