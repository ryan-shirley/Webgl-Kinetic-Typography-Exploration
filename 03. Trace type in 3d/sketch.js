// Inital camera positioning
var easycam,
    state = {
        distance: 500,
        center: [300, -75, 0],
        rotation: [-1, 0, 0, 0]
    },
    x = 0,
    y = 20

// Ball params
let ballSize = 4

// Type
let font
let textTyped = "type"

/**
 * preload() Run before setup
 * Load Font
 */
function preload() {
    f = loadFont("../fonts/Roboto-Regular.ttf")

    opentype.load("../fonts/FreeSans.otf", (err, f) => {
        if (err) {
            console.log(err)
        } else {
            font = f
            console.log(font)
        }
    })
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
    rect(x, y, 20, 120)
    fill(50, 50, 52, 20) // a bit of transparency
    rect(x + 20, y, 450, 120)

    // Render the labels
    fill(69, 161, 255)
    text("Distance:", x + 35, y + 25)
    text("Center:  ", x + 35, y + 25 + 20)
    text("Rotation:", x + 35, y + 25 + 40)
    text("Framerate:", x + 35, y + 25 + 60)
    text("GPU Renderer:", x + 35, y + 25 + 80)

    // Render the state numbers
    fill(0, 200, 0)
    text(nfs(state.distance, 1, 2), x + 160, y + 25)
    text(nfs(state.center, 1, 2), x + 160, y + 25 + 20)
    text(nfs(state.rotation, 1, 3), x + 160, y + 25 + 40)
    text(nfs(frameRate(), 1, 2), x + 160, y + 25 + 60)
    text(nfs(getGLInfo().gpu_renderer, 1, 2), x + 160, y + 25 + 80)
    easycam.endHUD()
}

/**
 * setup() Initial method run to setup project
 */
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL)
    setupHud()
    noStroke()
}

/**
 * draw() Continuously Executing
 */
function draw() {
    if (!font) return

    // Background Colour
    background(32)
    lights()

    // Create Line of balls
    fill("yellow")

    // Draw Type if present
    if (textTyped.length > 0) {
        let fontPath = font.getPath(textTyped, 0, 0, 300)
        // console.log(fontPath);

        let path = new g.Path(fontPath.commands)
        path = g.resampleByLength(path, 10)

        // Loop text Path
        for (let i = 0; i < path.commands.length; i++) {
            let pnt = path.commands[i]

            // Lerp Colour
            let from = color(218, 165, 32)
            let to = color(72, 61, 139)
            let percent = map(pnt.x, 0, 600, 0, 1)

            let interA = lerpColor(from, to, percent)
            let interB = lerpColor(to, from, percent)
            fill(interA)

            // Draw element
            push()
            translate(pnt.x, pnt.y, sin(pnt.y + frameCount / 10) * 2)

            // Rotate
            // rotateX(frameCount * 0.01)
            // rotate(frameCount * 0.03)

            // sphere(ballSize)
            box(ballSize)

            fill(interB)
            for (z = 1; z < 2; z++) {
                translate(0, 0, z * 12)
                sphere(ballSize * 1.2)
            }

            pop()
        }
    }

    // sphere(ballSize)

    // Display HUD
    displayHud()
}
