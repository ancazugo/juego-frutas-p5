let pulpaImg;
let seeds = [];
let numSeeds = 8;
let radius = 100;
let centerX, centerY;
let bgColor = '#A3E9F1';
let isDragging = false;
let draggedSeed = null;
let gameWon = false;

function preload() {
  pulpaImg = loadImage('Assets/pulpa.png');
}

function setup() {
  createCanvas(834, 600);
  centerX = width / 2;
  centerY = height / 2;
  
  // Create seeds in a circle formation
  for (let i = 0; i < numSeeds; i++) {
    let angle = (TWO_PI / numSeeds) * i;
    seeds.push({
      x: centerX + cos(angle) * radius,
      y: centerY + sin(angle) * radius,
      size: 30,
      angle: angle,
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      isDragged: false,
      isRemoved: false
    });
  }
}

function draw() {
  background(bgColor);
  
  // Draw pulpa image in center
  imageMode(CENTER);
  image(pulpaImg, centerX, centerY, 300, 300);
  
  // Update and draw seeds
  let remainingSeeds = 0;
  for (let seed of seeds) {
    if (!seed.isRemoved) {
      remainingSeeds++;
      
      if (!seed.isDragged) {
        // Move seed in random direction within circle bounds
        seed.x += seed.speedX;
        seed.y += seed.speedY;
        
        // Keep seeds within circular boundary
        let dx = seed.x - centerX;
        let dy = seed.y - centerY;
        let distance = sqrt(dx * dx + dy * dy);
        
        if (distance > radius) {
          let angle = atan2(dy, dx);
          seed.x = centerX + cos(angle) * radius;
          seed.y = centerY + sin(angle) * radius;
          
          // Bounce off the boundary
          seed.speedX = random(-2, 2);
          seed.speedY = random(-2, 2);
        }
      }
      
      // Draw seed
      fill(139, 69, 19);
      noStroke();
      ellipse(seed.x, seed.y, seed.size, seed.size * 0.6);
    }
  }
  
  // Check if game is won
  if (remainingSeeds === 0 && !gameWon) {
    gameWon = true;
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(0);
    text('¡Juego completado!', width/2, height/2);
  }
}

function mousePressed() {
  // Check if a seed was clicked
  for (let seed of seeds) {
    if (!seed.isRemoved) {
      let d = dist(mouseX, mouseY, seed.x, seed.y);
      if (d < seed.size/2) {
        seed.isDragged = true;
        draggedSeed = seed;
        break;
      }
    }
  }
}

function mouseDragged() {
  // Update position of dragged seed
  if (draggedSeed) {
    draggedSeed.x = mouseX;
    draggedSeed.y = mouseY;
  }
}

function mouseReleased() {
  if (draggedSeed) {
    // Check if seed was dragged outside the circle
    let d = dist(draggedSeed.x, draggedSeed.y, centerX, centerY);
    if (d > radius + 50) {  // Add some margin
      draggedSeed.isRemoved = true;
    }
    draggedSeed.isDragged = false;
    draggedSeed = null;
  }
}
