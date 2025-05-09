let circleX, circleY, radius;
let lineStart = null;
let lineEnd = null;
let resultDisplayed = false;

function setup() {
  createCanvas(600, 600);
  circleX = width / 2;
  circleY = height / 2;
  radius = 200;
  noLoop(); // Only draw when needed
}

function draw() {
  background(255);

  // Draw the yellow circle
  fill(255, 255, 0);
  stroke(0);
  ellipse(circleX, circleY, radius * 2, radius * 2);

  // If both line points are defined, draw the line and calculate result
  if (lineStart && lineEnd) {
    stroke(0);
    line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);

    if (!resultDisplayed) {
      calculateAndDisplaySplit();
      resultDisplayed = true;
    }
  }
}

function mousePressed() {
  if (!lineStart) {
    lineStart = createVector(mouseX, mouseY);
  } else if (!lineEnd) {
    lineEnd = createVector(mouseX, mouseY);
    redraw();
  }
}

function calculateAndDisplaySplit() {
  let insidePixels = 0;
  let side1 = 0;
  let side2 = 0;

  for (let x = int(circleX - radius); x <= int(circleX + radius); x++) {
    for (let y = int(circleY - radius); y <= int(circleY + radius); y++) {
      if (dist(x, y, circleX, circleY) <= radius) {
        let d = (lineEnd.x - lineStart.x) * (y - lineStart.y) - (lineEnd.y - lineStart.y) * (x - lineStart.x);
        if (d > 0) {
          side1++;
        } else {
          side2++;
        }
        insidePixels++;
      }
    }
  }

  let p1 = (side1 / insidePixels) * 100;
  let p2 = (side2 / insidePixels) * 100;

  fill(0);
  textSize(18);
  textAlign(CENTER);
  text(`Side 1: ${p1.toFixed(1)}%`, width / 2, height - 60);
  text(`Side 2: ${p2.toFixed(1)}%`, width / 2, height - 30);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    lineStart = null;
    lineEnd = null;
    resultDisplayed = false;
    redraw();
  }
}