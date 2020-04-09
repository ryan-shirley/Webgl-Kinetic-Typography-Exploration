// Classes
class Agent {
    constructor(x, y, z, size) {
        this.x = x
        this.y = y
        this.z = z
        this.size = size
    }

    /**
     * draw() Draw agent on screen
     */
    draw() {
        push()

        translate(this.x, this.y, this.z * this.size)
        sphere(this.size - this.size / 2)

        pop()
    }
}

// Inital camera positioning
var easycam,
    state = {
        distance: 500,
        center: [300, 150, 0],
        rotation: [-1, 0, 0, 0],
    },
    x = 0,
    y = 20

// Type
let font,
    textImg,
    textTyped = "type",
    pointDensity = 10,
    agents = []

/**
 * preload() Run before setup
 * Load Font
 */
function preload() {
    // HUD Font
    f = loadFont("../fonts/Roboto-Regular.ttf")

    // Interactive Font
    font = loadFont("../fonts/FreeSans.otf")
}

// utility function to get some GL/GLSL/WEBGL information
function getGLInfo() {
    var gl = this._renderer.GL

    var info = {}
    info.gl = gl

    var debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
    if (debugInfo) {
        info.gpu_renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        info.gpu_vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    }
    info.wgl_renderer = gl.getParameter(gl.RENDERER)
    info.wgl_version = gl.getParameter(gl.VERSION)
    info.wgl_glsl = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    info.wgl_vendor = gl.getParameter(gl.VENDOR)

    return info
}

/**
 * setupHud() Setup the HUD
 */
function setupHud() {
    setAttributes("antialias", true)
    easycam = createEasyCam()
    document.oncontextmenu = function () {
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
    rect(x, y, 20, 140)
    fill(50, 50, 52, 20) // a bit of transparency
    rect(x + 20, y, 450, 140)

    // Render the labels
    fill(69, 161, 255)
    text("Distance:", x + 35, y + 25)
    text("Center:  ", x + 35, y + 25 + 20)
    text("Rotation:", x + 35, y + 25 + 40)
    text("Framerate:", x + 35, y + 25 + 60)
    text("GPU Renderer:", x + 35, y + 25 + 80)
    text("Total Agents:", x + 35, y + 25 + 100)

    // Render the state numbers
    fill(0, 200, 0)
    text(nfs(state.distance, 1, 2), x + 160, y + 25)
    text(nfs(state.center, 1, 2), x + 160, y + 25 + 20)
    text(nfs(state.rotation, 1, 3), x + 160, y + 25 + 40)
    text(nfs(frameRate(), 1, 2), x + 160, y + 25 + 60)
    text(nfs(getGLInfo().gpu_renderer, 1, 2), x + 160, y + 25 + 80)
    text(nfs(agents.length, 1, 0), x + 160, y + 25 + 100)
    easycam.endHUD()
}

/**
 * setup() Initial method run to setup project
 */
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL)
    setupHud()
    setupText()
    noStroke()
}

/**
 * setupText() Setup text to be drawn
 */
function setupText() {
    textImg = createGraphics(width, height)
    textImg.pixelDensity(1)
    textImg.background(255)
    textImg.textFont(font)
    textImg.textSize(250)
    textImg.text(textTyped, 50, 200)
    textImg.loadPixels()

    // Create Agents
    agents = []

    for (let x = 0; x < textImg.width; x += pointDensity) {
        for (let y = 0; y < textImg.height; y += pointDensity) {
            let index = (x + y * textImg.width) * 4
            let r = textImg.pixels[index]

            if (r < 128) {
                fill(247, 174, 248)
                noStroke()

                for (z = 0; z < 5; z++) {
                    agents.push(new Agent(x, y, z, pointDensity))
                }
            }
        }
    }
}

/**
 * keyTyped() Add letter to text
 */
function keyTyped() {
    textTyped += key
    setupText()
}

/**
 * keyPressed() Handle the removal of letters
 */
function keyPressed() {
    if (keyCode === BACKSPACE) {
        textTyped = textTyped.slice(0, -1)
        setupText()
    }
}

/**
 * draw() Continuously Executing
 */
function draw() {
    // Background Colour
    background(32)
    lights()

    // Draw agents
    agents.forEach((ag) => ag.draw())

    // Display HUD
    displayHud()
}
