// Classes
class Letter {
    constructor(character, points) {
        this.character = character
        this.points = points
        this.createdAt = millis()
    }

    /**
     * draw() Draw points on screen
     */
    draw() {
        this.points.forEach((pnt) => {
            push()

            translate(pnt.x, pnt.y, -(pnt.z * controller.ballZDepth))
            sphere(controller.ballSize)

            pop()
        })
    }

    /**
     * disappear() Draw disappearing points on screen
     */
    disappear() {
        // Move Points
        this.points.forEach((pnt, index) => (this.points[index].y += 10))

        // Draw Points
        this.draw()
    }

    /**
     * create() Draw creating annimation points on screen
     */
    create() {
        if (agents.points.length) {
            randomSeed(99)

            let timeTaken = (millis() - this.createdAt) / 1000,
                percent = map(timeTaken, 0, controller.createDuration, 0, 1)

            this.points.forEach((pnt) => {
                let from =
                    agents.points[Math.floor(random(0, agents.points.length))]
                let to = createVector(
                    pnt.x,
                    pnt.y,
                    -(pnt.z * controller.ballZDepth)
                )

                let lerpedPoint = p5.Vector.lerp(from, to, percent)

                push()

                translate(lerpedPoint.x, lerpedPoint.y, lerpedPoint.z)
                sphere(controller.ballSize)

                pop()
            })
        }
    }

    /**
     * isRedundant() Check if word is redundant
     */
    isRedundant() {
        return (
            (millis() - this.createdAt) / 1000 >=
            controller.createDuration +
                controller.displayDuration +
                controller.disappearDuration
        )
    }

    /**
     * isReadyToRemove() Check if word is ready to disappear
     */
    isReadyToRemove() {
        return (
            (millis() - this.createdAt) / 1000 >=
            controller.createDuration + controller.displayDuration
        )
    }

    /**
     * isCreated() Check if letter is created and in place
     */
    isCreated() {
        return (millis() - this.createdAt) / 1000 >= controller.createDuration
    }
}
class Controller {
    constructor() {
        this.words = "design, type"
        this.ballSize = 5
        this.ballSpacing = 10
        this.ballZDepth = this.ballSpacing
        this.displayGizmos = false
        this.createDuration = 1.5 // Seconds
        this.disappearDuration = 0.5 // Seconds
        this.displayDuration = 3 // Secodns
    }
}

class Agent {
    constructor() {
        this.points = []
        this.floatingPoints = 30 // number of points
        this.angle = 360 / this.floatingPoints // angle between points
        this.radius = 300
        this.startAngle = 0
        this.endAngle = 360
    }

    /**
     * draw() Draw points on screen
     */
    draw() {
        let points = []

        for (
            let angle = this.startAngle;
            angle < this.endAngle;
            angle = angle + this.angle
        ) {
            let x = cos(radians(angle)) * this.radius // convert angle to radians for x and y coordinates
            let y = sin(radians(angle)) * this.radius

            push()

            translate(x, 150, y)
            sphere(controller.ballSize)

            pop()

            points.push(new p5.Vector(x, 150, y))
        }

        this.points = points
        this.startAngle = this.startAngle + 0.25
        this.endAngle = this.endAngle + 0.25
    }
}

// Inital camera positioning
var easycam,
    state = {
        distance: 800,
        center: [0, 0, 0],
        rotation: [-1, 0, 0, 0],
    },
    x = 0,
    y = 20

// Type
let font, letters, drawingLetters, disappearingLetters

// GUI
let controller = new Controller()
let agents = new Agent()
let gui

/**
 * preload() Run before setup
 * Load Font
 */
function preload() {
    // HUD Font
    f = loadFont("../fonts/Roboto-Regular.ttf")

    // Interactive Font
    font = loadFont("../fonts/Chalif Rough.ttf")
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
    easycam.setState(state)
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

    // Get number of points
    let numPoints = 0

    if (letters) {
        numPoints = letters.points.length
    }

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
    text("Total Points:", x + 35, y + 25 + 100)

    // Render the state numbers
    fill(0, 200, 0)
    text(nfs(state.distance, 1, 2), x + 160, y + 25)
    text(nfs(state.center, 1, 2), x + 160, y + 25 + 20)
    text(nfs(state.rotation, 1, 3), x + 160, y + 25 + 40)
    text(nfs(frameRate(), 1, 2), x + 160, y + 25 + 60)
    text(nfs(getGLInfo().gpu_renderer, 1, 2), x + 163, y + 25 + 80)
    text(nfs(numPoints, 1, 0), x + 160, y + 25 + 100)
    easycam.endHUD()
}

/**
 * setupGUI() Setup GUI to control elements
 */
function setupGUI() {
    // Create
    gui = new dat.GUI()

    gui.add(controller, "displayGizmos")
    gui.add(controller, "words")

    // Setup Balls
    let ballsGUI = gui.addFolder("Balls")
    let spacing = ballsGUI.add(controller, "ballSpacing", 10, 20).step(1)
    ballsGUI.add(controller, "ballSize", 1, 15).step(1)
    ballsGUI.add(controller, "ballZDepth", controller.ballSize * 2, 50).step(1)
    ballsGUI.open()

    // Update ball spacing balls drawn
    spacing.onFinishChange((val) => recalculateSpacing(val))

    // Setup Floating Agents
    let floatingGUI = gui.addFolder("Floating Points")
    let fPoints = floatingGUI.add(agents, "floatingPoints", 2, 30).step(2)
    let fRadius = floatingGUI.add(agents, "radius", 50, 500).step(10)
    floatingGUI.open()

    fRadius.onChange((val) => {
        agents.radius = val
    })

    fPoints.onChange((val) => {
        agents.angle = 360 / val
    })

    // Setup Animation
    let animationGUI = gui.addFolder("Animation")
    animationGUI.add(controller, "createDuration", 0.5, 5)
    animationGUI.add(controller, "disappearDuration", 0.5, 5)
    animationGUI.add(controller, "displayDuration", 1, 10)
    animationGUI.open()
}

/**
 * setup() Initial method run to setup project
 */
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL)
    setupHud()
    setupGUI()
    noStroke()

    setTimeout(() => {
        addLetter(controller.words.split(", ")[0])
    }, 1000)
}

/**
 * addLetter() Add letter to be displayed
 */
function addLetter(letter) {
    // Create Points
    pnts = createPoints(letter)

    // Calculate offset
    let offset = 0

    // Add Word
    drawingLetters = new Letter(letter, pnts, offset)
}

/**
 * createPoints() Handle creation of points
 */
function createPoints(letter) {
    // Create Graphic
    let textImg = createGraphics(width, height)
    textImg.pixelDensity(1)
    textImg.background(255)
    textImg.textFont(font)
    textImg.textSize(250)
    textImg.text(letter, 0, 200)

    // Load pixels for letter
    textImg.loadPixels()

    points = []

    for (let x = 0; x < textImg.width; x += controller.ballSpacing) {
        for (let y = 0; y < textImg.height; y += controller.ballSpacing) {
            let index = (x + y * textImg.width) * 4
            let r = textImg.pixels[index]

            if (r < 128) {
                // Add multiple for depth
                for (z = 0; z < 3; z++) {
                    points.push(
                        new p5.Vector(
                            x - textImg.textWidth(letter) / 2,
                            y - 200,
                            z
                        )
                    )
                }
            }
        }
    }

    return points
}

/**
 * recalculateSpacing() Recalculate spacing of balls on drawn letters
 */
function recalculateSpacing(value) {
    if(letters) {
        letters.points = createPoints(letters.character)
    }
}

/**
 * displayGizmo() Display axis lines
 */
function displayGizmo(size) {
    var a = size
    var b = size / 20
    var o = a * 0.5
    push()
    translate(o, 0, 0)
    ambientMaterial(255, 0, 0)
    box(a, b, b)
    pop()
    push()
    translate(0, o, 0)
    ambientMaterial(0, 255, 0)
    box(b, a, b)
    pop()
    push()
    translate(0, 0, o)
    ambientMaterial(0, 0, 255)
    box(b, b, a)
    pop()
}

/**
 * draw() Continuously Executing
 */
function draw() {
    // Background Colour
    background(32)

    // Create lighting
    lights() // Flat lighting
    // pointLight(20, 20, 20, -5000, -500, 40000) // Front light (r, g, b, x, y, z)
    pointLight(205, 131, 200, 50, -500, -400) // Back

    // Create Object material/colour
    // ambientMaterial(215, 151, 216)
    fill(247, 174, 248)

    // gizmo
    controller.displayGizmos && displayGizmo(100)

    // Check letters are redundant
    if (drawingLetters) {
        if (drawingLetters.isCreated()) {
            // Add to letters
            letters = drawingLetters

            // Remove
            drawingLetters = null
        } else {
            // Draw
            drawingLetters.create()
        }
    }

    // Draw letters
    if (letters) {
        if (letters.isReadyToRemove()) {
            // Add to letters
            disappearingLetters = letters

            // Remove
            letters = null
        } else {
            // Draw
            letters.draw()
        }
    }

    // Draw disappearing letters
    if (disappearingLetters) {
        // Draw
        disappearingLetters.disappear()

        // Check letters are redundant
        if (disappearingLetters.isRedundant()) {
            disappearingLetters = null
        }
    }

    // Display HUD
    displayHud()

    // Draw Agents
    agents.draw()
}
