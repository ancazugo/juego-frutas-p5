let platform;
let droplets = [];
let dropletCount = 100;
let dropletSpeed = 4;
let fillLevel = 0;
let fillMax = 100;
let bgColor = '#A3E9F1';
let streamX;
let streamWidth = 60;
let streamTargetX;
let streamEasing = 0.05;

let recipientImg;
let recipientX, recipientY;
let recipientW = 60;
let recipientH = 120;

function preload() {
  // Asegúrate de que estas imágenes estén en tu carpeta "Assets/"
  recipientImg = loadImage("Assets/licuadora.png");
}

function setup() {
  createCanvas(834, 1194);

  platform = {
    x: width / 2 - 50,
    y: height - 40,
    w: 100,
    h: 20,
    speed: 4,
    dir: random([-1, 1]),
    changeTimer: 0
  };

  // Inicializa la posición del recipiente (centrado sobre la plataforma)
  recipientX = platform.x + platform.w / 2;
  recipientY = platform.y - recipientH;

  streamX = random(width - streamWidth);
  streamTargetX = random(width - streamWidth);

  for (let i = 0; i < dropletCount; i++) {
    droplets.push({
      xOffset: random(streamWidth),
      y: random(-height, 0)
    });
  }

  imageMode(CENTER);
}

function draw() {
  background(bgColor);

  // Plataforma móvil
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

  // Dibuja la plataforma
  fill(100);
  rect(platform.x, platform.y, platform.w, platform.h);

  // Movimiento del recipiente
  recipientX += platform.speed * platform.dir;

  if (keyIsDown(LEFT_ARROW)) {
    recipientX -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    recipientX += 5;
  }

  recipientX = constrain(recipientX, platform.x + recipientW / 2, platform.x + platform.w - recipientW / 2);

  // Dibuja el recipiente como imagen
  if (recipientImg) {
    image(recipientImg, recipientX, recipientY + recipientH / 2, recipientW, recipientH);
  } else {
    fill(200);
    rectMode(CENTER);
    rect(recipientX, recipientY + recipientH / 2, recipientW, recipientH);
    rectMode(CORNER);
  }

  // Dibuja el nivel de llenado dentro del recipiente
  let fillHeight = map(fillLevel, 0, fillMax, 0, recipientH);
  fill(0, 0, 255, 150); // Azul semitransparente
  noStroke();
  rectMode(CENTER);
  rect(recipientX, recipientY + recipientH - fillHeight / 2, recipientW * 0.7, fillHeight);
  rectMode(CORNER);

  // Movimiento del chorro de gotas
  streamX += (streamTargetX - streamX) * streamEasing;
  if (abs(streamTargetX - streamX) < 1) {
    streamTargetX = random(width - streamWidth);
  }

  // Dibuja las gotas
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

    // Verifica si cae dentro del recipiente
    if (
      dropX > recipientX - recipientW / 2 &&
      dropX < recipientX + recipientW / 2 &&
      d.y > recipientY &&
      d.y < recipientY + recipientH
    ) {
      d.y = random(-100, 0);
      d.xOffset = random(streamWidth);
      fillLevel = min(fillLevel + 1, fillMax);
    }
  }

  // Mensaje al llenar
  if (fillLevel >= fillMax) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Recipient Filled!", width / 2, height / 2);
    noLoop();
  }
}
