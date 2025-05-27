let topImage;
let bottomImage;
let cursorImg;
let maskLayer;

function preload() {
  topImage = loadImage('Assets/araza.png');
  bottomImage = loadImage('Assets/mitad.png');
  cursorImg = loadImage('Assets/cuchillo.png');
}

function setup() {
    // Optionally scale images
    let scaleFactor = 8;
    topImage.resize(topImage.width * scaleFactor, topImage.height * scaleFactor);
    bottomImage.resize(bottomImage.width * scaleFactor, bottomImage.height * scaleFactor);
    cursorImg.resize(cursorImg.width * 3, cursorImg.height * 3);
  
    createCanvas(topImage.width, topImage.height);
  
    // Initialize mask layer (white = visible, black = transparent)
    maskLayer = createGraphics(width, height);
    maskLayer.background(255); // Start with top image fully visible
}

function draw() {
    background(220);
  
    // Show bottom image first
    image(bottomImage, 0, 0);
  
    // Apply mask to top image
    let topMasked = topImage.get();
    topMasked.mask(maskLayer);
    image(topMasked, 0, 0);
  
    // Custom cursor
    image(cursorImg, mouseX - cursorImg.width / 2, mouseY - cursorImg.height / 2);
}
  
function mouseDragged() {
    // Draw black on mask where cursor moves to hide top image
    maskLayer.noStroke();
    maskLayer.fill(0);
    maskLayer.ellipse(mouseX, mouseY, cursorImg.width, cursorImg.height);
}
  
function mouseMoved() {
    noCursor();
}