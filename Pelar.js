let topImage;
let bottomImage;
let knifeImage;
let maskCanvas;
let isMousePressed = false;

function preload() {
    // Load all required images
    topImage = loadImage('Assets/araza.png');
    bottomImage = loadImage('Assets/mitad.png');
    knifeImage = loadImage('Assets/cuchillo.png');
}

function setup() {
    // Set up the canvas and images
    createCanvas(800, 600);
    
    // Resize images to fit canvas while maintaining aspect ratio
    let scale = Math.min(width / topImage.width, height / topImage.height) * 0.8;
    topImage.resize(topImage.width * scale, topImage.height * scale);
    bottomImage.resize(bottomImage.width * scale, bottomImage.height * scale);
    
    // Resize knife cursor to reasonable size
    knifeImage.resize(knifeImage.width * 3, knifeImage.height * 3);
    
    // Create mask canvas with white background (fully visible)
    maskCanvas = createGraphics(width, height);
    maskCanvas.background(255);
}

function draw() {
    background(220);
    if (frameCount % 5 === 0) {
        maskCanvas.filter(BLUR, 1);
    }
    // Calculate center position for images
    let x = (width - topImage.width) / 2;
    let y = (height - topImage.height) / 2;
    
    // Draw bottom image
    image(bottomImage, x, y);
    
    // Create a copy of the top image and apply mask
    push();
    let maskedTop = createImage(topImage.width, topImage.height);
    maskedTop.copy(topImage, 0, 0, topImage.width, topImage.height, 0, 0, topImage.width, topImage.height);

    // Get the mask for the specific region as a p5.Image
    let currentMask = createImage(topImage.width, topImage.height);
    currentMask.copy(maskCanvas, x, y, topImage.width, topImage.height, 0, 0, topImage.width, topImage.height);

    // Apply the mask
    maskedTop.mask(currentMask);

    // Draw the masked top image
    image(maskedTop, x, y);
    pop();
    
    // Draw knife cursor
    push();
    translate(mouseX, mouseY);
    rotate(-PI / 4); // Rotate -45 degrees
    image(knifeImage, -knifeImage.width/2, -knifeImage.height/2);
    pop();
    
    // Hide default cursor
    noCursor();
}

function mousePressed() {
    isMousePressed = true;
}

function mouseReleased() {
    isMousePressed = false;
}

function mouseDragged() {
    let x = (width - topImage.width) / 2;
    let y = (height - topImage.height) / 2;
    let mx = mouseX - x;
    let my = mouseY - y;
    
    if (mx >= 0 && mx < topImage.width && my >= 0 && my < topImage.height) {
        maskCanvas.noStroke();
        maskCanvas.fill(0, 20); // Lower alpha = slower fade (more smooth)
        maskCanvas.ellipse(mouseX, mouseY, 60, 60); // Soft fade shape
    }
}
