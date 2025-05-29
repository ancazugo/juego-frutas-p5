let drops = [];
let dropCount = 0;
let targetCount = 30;
let isPaused = false;
let recipient;
let bgColor = '#A3E9F1';
let minSpeed = 5;
let maxSpeed = 8;
let droppedCount = 0;
let balanzaImg;
let caughtDrops = []; // Array to store positions of caught drops

function preload() {
  balanzaImg = loadImage('Assets/Balanza.png');
}

function setup() {
  createCanvas(834, 600);
  
  // Initialize recipient in bottom center
  recipient = {
    x: width/2,
    y: height - 100,
    w: 480/3,
    h: 190/3,
    img: balanzaImg
  };
}

function draw() {
  background(bgColor);
  
  // Draw balanza
  imageMode(CENTER);
  image(recipient.img, recipient.x, recipient.y, recipient.w, recipient.h);
  
  // Draw accumulated drops on balanza
  fill(255);
  stroke(200);
  for (let caughtDrop of caughtDrops) {
    circle(
      recipient.x + caughtDrop.xOffset,
      recipient.y + caughtDrop.yOffset,
      caughtDrop.size
    );
  }
  
  // Create new drops when not paused
  if (!isPaused && drops.length < 30) {
    if (random(1) < 0.03) {
      drops.push({
        x: random(width),
        y: 0,
        speed: random(minSpeed, maxSpeed),
        size: random(8, 12)
      });
    }
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
      // Calculate relative position on the balanza
      let xOffset = drop.x - recipient.x;
      let yOffset = drop.y - recipient.y;
      
      // Add to caught drops with slight random adjustment to prevent perfect stacking
      caughtDrops.push({
        xOffset: xOffset + random(-5, 5),
        yOffset: yOffset + random(-2, 2),
        size: drop.size
      });
      
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
  textSize(15);
  textAlign(CENTER);
  fill(0);
  // Display drop count on the balanza
  text(dropCount, recipient.x, recipient.y + 17);
  textSize(32);
  // Display target and missed drops at the top
  text(`Target: ${targetCount}`, width/4, 50);
  text(`Missed: ${droppedCount}/${targetCount}`, width * 3/4, 50);
  
  // Game over conditions
  if (dropCount >= targetCount) {
    textSize(48);
    text('Perfect amount!', width/2, height/2);
    noLoop();
  } else if (droppedCount > targetCount) {
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
