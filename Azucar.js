let drops = [];
let dropCount = 0;
let targetCount = 30;
let isPaused = false;
let recipient;
let minSpeed = 5;
let maxSpeed = 8;
let droppedCount = 0; // Add counter for dropped sugar

function setup() {
  createCanvas(834, 600);
  
  // Initialize recipient in bottom center
  recipient = {
    x: width/2,
    y: height - 100,
    w: 200,
    h: 160
  };
}

function draw() {
  background('#FFF5E6'); // Light cream background
  
  // Draw recipient
  fill(200);
  rectMode(CENTER);
  rect(recipient.x, recipient.y, recipient.w, recipient.h);
  
  // Create new drops when not paused
  if (!isPaused && drops.length < 50) { // Limit max drops on screen
    drops.push({
      x: random(width),
      y: 0,
      speed: random(minSpeed, maxSpeed),
      size: random(8, 12)
    });
  }
  
  // Update and draw drops
  for (let i = drops.length - 1; i >= 0; i--) {
    let drop = drops[i];
    
    if (!isPaused) {
      drop.y += drop.speed;
    }
    
    // Draw sugar drop
    fill(255);
    stroke(200);
    circle(drop.x, drop.y, drop.size);
    
    // Check if drop hits recipient
    if (drop.y > recipient.y - recipient.h/2 && 
        drop.y < recipient.y + recipient.h/2 &&
        drop.x > recipient.x - recipient.w/2 &&
        drop.x < recipient.x + recipient.w/2) {
      drops.splice(i, 1);
      dropCount++;
    }
    
    // Remove drops that fall off screen and count them
    if (drop.y > height) {
      drops.splice(i, 1);
      droppedCount++;
    }
  }
  
  // Display counters
  textSize(32);
  textAlign(CENTER);
  fill(0);
  text(`Sugar drops: ${dropCount}/${targetCount}`, width/2, 50);
  text(`Missed drops: ${droppedCount}/${targetCount}`, width/2, 90);
  
  // Game over conditions
  if (dropCount >= targetCount) {
    textSize(48);
    text('Perfect amount!', width/2, height/2);
    noLoop();
  } else if (droppedCount > targetCount) { // Game over if too many drops missed
    textSize(48);
    fill(255, 0, 0);
    text('Game Over!', width/2, height/2);
    text('Too many drops missed!', width/2, height/2 + 60);
    noLoop();
  }
}

function keyPressed() {
  if (key === ' ') {
    isPaused = !isPaused;
  }
}
function mouseMoved() {
  // Update recipient x position to follow mouse
  recipient.x = constrain(mouseX, recipient.w/2, width - recipient.w/2);
}
