let shapes = [];
let bgColor = '#A3E9F1';
let yellowClickCount = 0;

// Image placeholders
let yellowImg, greenImg, brownImg, blueTriangleImg;

function preload() {
  yellowImg = loadImage("Assets/araza.png");
  greenImg = loadImage("Assets/inmaduro.png");
  brownImg = loadImage("Assets/Picho.png");
  blueTriangleImg = loadImage("Assets/semilla.png");
}

function setup() {
  createCanvas(834, 1194);
  noStroke();
  imageMode(CENTER);
}

function draw() {
  background(bgColor);

  if (yellowClickCount >= 3) {
    return;
  }

  if (frameCount % 20 === 0) {
    let type = random() < 0.1 ? 'blueTriangle' : 'randomShape';
    if (type === 'blueTriangle') {
      shapes.push(new Shape(random(width), 0, random(20, 50), 'triangle', 'blue'));
    } else {
      shapes.push(new Shape(random(width), 0, random(20, 50)));
    }
  }

  for (let i = shapes.length - 1; i >= 0; i--) {
    shapes[i].update();
    shapes[i].display();

    if (shapes[i].y > height) {
      shapes.splice(i, 1);
    }
  }
}

function mousePressed() {
  for (let i = shapes.length - 1; i >= 0; i--) {
    let shape = shapes[i];
    if (shape.isMouseOver()) {
      if (shape.isYellow()) {
        yellowClickCount++;
        shape.shine();
        shape.startBlinking();
      } else if (shape.isBlueTriangle()) {
        for (let j = 0; j < shapes.length; j++) {
          if (shapes[j].isYellow() && shapes[j].type === 'circle') {
            shapes[j].size += 20;
            shapes[j].addRedStroke();
          }
        }
      }

      if (yellowClickCount >= 3) {
        break;
      }
    }
  }
}

class Shape {
  constructor(x, y, size, type = 'circle', color = null) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.speed = random(2, 5);
    this.color = color || random(['brown', 'green', 'yellow']);
    this.isShining = false;
    this.shineTimer = 0;
    this.hasRedStroke = false;
    this.isBlinking = false;
    this.blinkTimer = 0;
  }

  update() {
    this.y += this.speed;

    if (this.isShining) {
      this.shineTimer--;
      if (this.shineTimer <= 0) {
        this.isShining = false;
      }
    }

    if (this.isBlinking) {
      this.blinkTimer--;
      if (this.blinkTimer <= 0) {
        this.isBlinking = false;
      }
    }
  }

  display() {
    if (this.isBlinking && frameCount % 10 < 5) {
      return;
    }

    if (this.isShining) {
      stroke(255, 255, 0);
      strokeWeight(20);
    } else if (this.hasRedStroke) {
      stroke(255, 0, 0);
      strokeWeight(5);
    } else {
      noStroke();
    }

    let img = null;
    if (this.type === 'circle') {
      if (this.color === 'yellow') img = yellowImg;
      else if (this.color === 'green') img = greenImg;
      else if (this.color === 'brown') img = brownImg;
    } else if (this.isBlueTriangle()) {
      img = blueTriangleImg;
    }

    if (img) {
      image(img, this.x, this.y, this.size, this.size);
    } else {
      // fallback rendering
      fill(this.color);
      if (this.type === 'circle') {
        ellipse(this.x, this.y, this.size);
      } else if (this.type === 'square') {
        rect(this.x, this.y, this.size, this.size);
      } else if (this.type === 'triangle') {
        triangle(
          this.x, this.y - this.size / 2,
          this.x - this.size / 2, this.y + this.size / 2,
          this.x + this.size / 2, this.y + this.size / 2
        );
      }
    }
  }

  isMouseOver() {
    if (this.type === 'circle') {
      return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
    } else if (this.type === 'square') {
      return mouseX > this.x && mouseX < this.x + this.size &&
             mouseY > this.y && mouseY < this.y + this.size;
    } else if (this.type === 'triangle') {
      return dist(mouseX, mouseY, this.x, this.y) < this.size;
    }
    return false;
  }

  isYellow() {
    return this.color === 'yellow';
  }

  isBlueTriangle() {
    return this.color === 'blue' && this.type === 'triangle';
  }

  shine() {
    this.isShining = true;
    this.shineTimer = 100;
  }

  addRedStroke() {
    this.hasRedStroke = true;
  }

  startBlinking() {
    this.isBlinking = true;
    this.blinkTimer = 60;
  }
}
