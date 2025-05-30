let blenderImg;
let liquidLevel = 0.7; // 70% full
let gameTimer = 10; // 10 seconds
let lastPressTime = 0;
let pressSpeed = 0;
let optimalSpeed = 2; // Optimal presses per second (increased for more frequent pressing)
let spilled = false;
let blended = false;
let startTime;
let isGameActive = false;
let blendProgress = 0; // Track how well it's being blended
let spillParticles = []; // Array to hold spill particles

class SpillParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = random(-2, 2);
    this.speedY = random(2, 5);
    this.size = random(3, 8);
    this.alpha = 255;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.2; // Gravity
    this.alpha -= 5;
    return this.alpha > 0;
  }

  draw() {
    fill(100, 200, 255, this.alpha);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}

function preload() {
  blenderImg = loadImage('Assets/licuadora.png');
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  startTime = millis();
}

function draw() {
  background(220);
  
  // Draw blender
  let blenderX = width/2 - 100;
  let blenderY = height/2 - 150;
  image(blenderImg, blenderX, blenderY, 200, 300);
  
  if (!isGameActive) {
    textSize(24);
    text('Press ENTER to start', width/2, height/2);
    return;
  }
  
  // Update timer
  let elapsedTime = (millis() - startTime) / 1000;
  let remainingTime = max(0, gameTimer - elapsedTime);
  
  // Rapidly decrease speed when not pressing
  let timeSinceLastPress = (millis() - lastPressTime) / 1000;
  if (timeSinceLastPress > 0.1) { // Decrease speed more quickly
    pressSpeed = max(0, pressSpeed - 0.05);
  }
  
  // Check if liquid spills and create spill particles
  if (pressSpeed > optimalSpeed * 1.15 && !spilled) {
    // Add new spill particles
    for (let i = 0; i < 5; i++) {
      spillParticles.push(new SpillParticle(
        blenderX + 100 + random(-20, 20),
        blenderY + 100 + random(-10, 10)
      ));
    }
    if (spillParticles.length > 100) { // If too many particles, trigger spill
      spilled = true;
    }
  }
  
  // Update and draw spill particles
  for (let i = spillParticles.length - 1; i >= 0; i--) {
    if (!spillParticles[i].update()) {
      spillParticles.splice(i, 1);
    } else {
      spillParticles[i].draw();
    }
  }
  
  // Draw liquid with animation based on speed
  if (!spilled) {
    fill(100, 200, 255, 150);
    let liquidHeight = 300 * liquidLevel;
    let wobble = sin(millis() / 100) * (pressSpeed * 5);
    rect(blenderX + 30, blenderY + 300 - liquidHeight + wobble, 140, liquidHeight);
  }
  
  // Draw speed bar
  drawSpeedBar();
  
  // Draw blend progress bar
  drawBlendProgress();
  
  // Draw timer
  fill(0);
  textSize(32);
  text('Time: ' + remainingTime.toFixed(1), width/2, 50);
  
  // Update blend progress
  if (pressSpeed >= optimalSpeed * 0.85 && pressSpeed <= optimalSpeed * 1.15) {
    blendProgress = min(1, blendProgress + 0.02);
    if (blendProgress >= 1) {
      blended = true;
    }
  } else {
    blendProgress = max(0, blendProgress - 0.01); // Lose progress if not maintaining speed
  }
  
  // Game over conditions
  if (remainingTime <= 0 || spilled) {
    gameOver();
  }
}

function drawSpeedBar() {
  let barWidth = 300;
  let barHeight = 20;
  let barX = width/2 - barWidth/2;
  let barY = height - 150; // Moved up to make room for progress bar
  
  // Draw background bar
  fill(200);
  rect(barX, barY, barWidth, barHeight);
  
  // Draw optimal range
  fill(0, 255, 0, 100);
  let optimalMin = barX + (barWidth * (optimalSpeed * 0.85) / (optimalSpeed * 1.5));
  let optimalMax = barX + (barWidth * (optimalSpeed * 1.15) / (optimalSpeed * 1.5));
  rect(optimalMin, barY, optimalMax - optimalMin, barHeight);
  
  // Draw current speed indicator
  fill(255, 0, 0);
  let speedX = barX + (barWidth * pressSpeed / (optimalSpeed * 1.5));
  speedX = constrain(speedX, barX, barX + barWidth);
  circle(speedX, barY + barHeight/2, 15);
  
  // Draw label
  fill(0);
  textSize(14);
  text('Blend Speed', width/2, barY - 10);
}

function drawBlendProgress() {
  let barWidth = 200;
  let barHeight = 15;
  let barX = width/2 - barWidth/2;
  let barY = height - 100; // Adjusted position
  
  // Draw background
  fill(200);
  rect(barX, barY, barWidth, barHeight);
  
  // Draw progress
  fill(0, 255, 100);
  let progressWidth = min(barWidth, barWidth * constrain(blendProgress, 0, 1));
  rect(barX, barY, progressWidth, barHeight);
  
  // Draw label
  fill(0);
  textSize(14);
  text('Blend Progress', width/2, barY - 10);
}

function gameOver() {
  isGameActive = false;
  textSize(32);
  if (spilled) {
    text('Game Over - Liquid Spilled!', width/2, height/2);
  } else if (blended) {
    text('Success - Well Blended!', width/2, height/2);
  } else {
    text('Time\'s up - Not blended enough', width/2, height/2);
  }
  text('Press ENTER to restart', width/2, height/2 + 50);
}

function keyPressed() {
  if (keyCode === ENTER) {
    // Reset game
    startTime = millis();
    spilled = false;
    blended = false;
    pressSpeed = 0;
    blendProgress = 0;
    isGameActive = true;
    lastPressTime = millis();
    spillParticles = []; // Clear spill particles
  }
  
  if (keyCode === 32 && isGameActive) { // Spacebar
    let currentTime = millis();
    let timeDiff = (currentTime - lastPressTime) / 1000;
    if (timeDiff > 0) {
      pressSpeed = min(1 / timeDiff, optimalSpeed * 1.5);
    }
    lastPressTime = currentTime;
  }
}
