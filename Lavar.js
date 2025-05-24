let droplets = [];
let dropletCount = 100;
let dropletSpeed = 5;
let flowX = 200;
let flowWidth = 80;
let flowTargetX = 200;

let circleX;
let circleY;
let circleRadius = 40;
let dragging = false;

let contactTime = 0;
let gameOver = false;

let playerImg;

function preload() {
  playerImg = loadImage("Assets/araza.png"); // Replace with the correct path or filename
}

function setup() {
  createCanvas(834, 1194);
  circleX = width / 2;
  circleY = height / 2;

  for (let i = 0; i < dropletCount; i++) {
    droplets.push({
      xOffset: random(flowWidth),
      y: random(-height, 0)
    });
  }

  flowTargetX = random(0, width - flowWidth);
}

function draw() {
  if (gameOver) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Game Over", width / 2, height / 2);
    return;
  }

  background(255);

  // Faster easing for more dynamic horizontal motion
  let easing = 0.15;
  flowX += (flowTargetX - flowX) * easing;

  if (abs(flowTargetX - flowX) < 1) {
    flowTargetX = random(0, width - flowWidth);
  }

  let contactThisFrame = false;

  for (let d of droplets) {
    d.y += dropletSpeed;
    let x = flowX + d.xOffset;

    if (d.y > height) {
      d.y = random(-200, 0);
      d.xOffset = random(flowWidth);
    }

    fill(0, 0, 255);
    noStroke();
    ellipse(x, d.y, 8, 8);

    if (dist(x, d.y, circleX, circleY) < circleRadius) {
      contactThisFrame = true;
    }
  }

  if (contactThisFrame) {
    contactTime += deltaTime / 1000;
  }

  let blueRatio = constrain(contactTime / 3, 0, 1);
  let yellow = color(255, 255, 0);
  let blue = color(0, 0, 255);
  let blended = lerpColor(yellow, blue, blueRatio);

  // Draw the image with tint
  tint(blended);
  imageMode(CENTER);
  image(playerImg, circleX, circleY, circleRadius * 2, circleRadius * 2);
  noTint(); // reset tint for other drawings

  if (contactTime >= 3) {
    gameOver = true;
  }
}

function mousePressed() {
  if (dist(mouseX, mouseY, circleX, circleY) < circleRadius) {
    dragging = true;
  }
}

function mouseDragged() {
  if (dragging) {
    circleX = constrain(mouseX, circleRadius, width - circleRadius);
  }
}

function mouseReleased() {
  dragging = false;
}
