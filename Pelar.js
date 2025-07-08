let topImage;
let bottomImage;
let knifeImage;
let maskCanvas;
let eraserSize = 30; // Size of the "peeling" area

function preload() {
    topImage = loadImage('Assets/araza.png');
    bottomImage = loadImage('Assets/mitad.png');
    knifeImage = loadImage('Assets/cuchillo.png');
}

function setup() {
    createCanvas(800, 600);
  
    // Resize images to fit canvas
    let scale = min(width / topImage.width, height / topImage.height) * 0.8;
    topImage.resize(topImage.width * scale, topImage.height * scale);
    bottomImage.resize(bottomImage.width * scale, bottomImage.height * scale);
  
    // Resize knife cursor
    knifeImage.resize(knifeImage.width * 0.8, knifeImage.height * 0.8);
  
    // Create mask (black = transparent, white = visible)
    maskCanvas = createGraphics(topImage.width, topImage.height);
    maskCanvas.background(255); // Start fully visible (white)
}

function draw() {
    background(220);
  
    // Center images
    let x = (width - topImage.width) / 2;
    let y = (height - topImage.height) / 2;
  
    // Draw bottom image (revealed when peeled)
    image(bottomImage, x, y);
  
    // Apply mask to top image
    let maskedTop = topImage.get();
    maskedTop.mask(maskCanvas);
    image(maskedTop, x, y);
  
    // Draw knife cursor (rotated)
    push();
    translate(mouseX, mouseY);
    rotate(-PI / 4); // -45 degrees
    image(knifeImage, -knifeImage.width / 2, -knifeImage.height / 2);
    pop();
  
    noCursor(); // Hide default cursor
}

function mouseDragged() {
    peelAtMouse();
}

function mousePressed() {
    peelAtMouse(); // Also peel on click (optional)
}

function peelAtMouse() {
    // Calculate mouse position relative to the top image
    let x = (width - topImage.width) / 2;
    let y = (height - topImage.height) / 2;
    let mx = mouseX - x;
    let my = mouseY - y;
  
    // Only peel if inside the image bounds
    if (mx >= 0 && mx < topImage.width && my >= 0 && my < topImage.height) {
        maskCanvas.erase(); // Use erase() instead of fill(0) for cleaner effect
        maskCanvas.noStroke();
        maskCanvas.ellipse(mx, my, eraserSize, eraserSize / 2); // Oval shape for knife peel
        maskCanvas.noErase(); // Stop erasing
    }
}