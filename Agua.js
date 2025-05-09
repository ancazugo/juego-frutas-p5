let platform;
let cylinder;
let droplets = [];
let dropletCount = 100;
let dropletSpeed = 4;
let fillLevel = 0;
let fillMax = 100;

let streamX;
let streamWidth = 60;
let streamTargetX;
let streamEasing = 0.05;

function setup() {
  createCanvas(600, 400);

  platform = {
    x: width / 2 - 50,
    y: height - 40,
    w: 100,
    h: 20,
    speed: 4,
    dir: random([-1, 1]),
    changeTimer: 0
  };

  cylinder = {
    x: platform.x + platform.w / 2,
    y: platform.y - 60,
    w: 30,
    h: 60,
    speed: 5
  };

  streamX = random(width - streamWidth);
  streamTargetX = random(width - streamWidth);

  for (let i = 0; i < dropletCount; i++) {
    droplets.push({
      xOffset: random(streamWidth),
      y: random(-height, 0)
    });
  }
}

function draw() {
  background(255);

  // Move platform
  platform.x += platform.speed * platform.dir;
  if (platform.x <= 0 || platform.x + platform.w >= width) {
    platform.dir *= -1;
  }
  platform.changeTimer++;
  if (platform.changeTimer > 60) {
    if (random(1) < 0.1) {
      platform.dir *= -1;
    }
    platform.changeTimer = 0;
  }

  // Draw platform
  fill(100);
  rect(platform.x, platform.y, platform.w, platform.h);

  // Move cylinder with platform
  cylinder.x += platform.speed * platform.dir;

  // Keyboard control
  if (keyIsDown(LEFT_ARROW)) {
    cylinder.x -= cylinder.speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    cylinder.x += cylinder.speed;
  }

  // Constrain cylinder to platform
  cylinder.x = constrain(cylinder.x, platform.x + cylinder.w / 2, platform.x + platform.w - cylinder.w / 2);

  // Draw cylinder
  fill(lerpColor(color(200), color(0, 0, 255), fillLevel / fillMax));
  rectMode(CENTER);
  rect(cylinder.x, cylinder.y + cylinder.h / 2, cylinder.w, cylinder.h);
  rectMode(CORNER);

  // Draw fill level inside cylinder
  fill(0, 0, 255);
  let fillHeight = map(fillLevel, 0, fillMax, 0, cylinder.h);
  rect(cylinder.x - cylinder.w / 2, cylinder.y + cylinder.h - fillHeight, cylinder.w, fillHeight);

  // Move stream toward target
  streamX += (streamTargetX - streamX) * streamEasing;
  if (abs(streamTargetX - streamX) < 1) {
    streamTargetX = random(width - streamWidth);
  }

  // Update droplets
  for (let d of droplets) {
    d.y += dropletSpeed;

    if (d.y > height) {
      d.y = random(-100, 0);
      d.xOffset = random(streamWidth);
    }

    let dropX = streamX + d.xOffset;

    fill(0, 100, 255);
    noStroke();
    ellipse(dropX, d.y, 6, 6);

    if (
      dropX > cylinder.x - cylinder.w / 2 &&
      dropX < cylinder.x + cylinder.w / 2 &&
      d.y > cylinder.y &&
      d.y < cylinder.y + cylinder.h
    ) {
      d.y = random(-100, 0);
      d.xOffset = random(streamWidth);
      fillLevel = min(fillLevel + 1, fillMax);
    }
  }

  // Game over
  if (fillLevel >= fillMax) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Cylinder Filled!", width / 2, height / 2);
    noLoop();
  }
}