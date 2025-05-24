function setup() {
    createCanvas(834, 1194);
    noStroke();
}

let shapes = [];
let bgColor = 220; // Default background color
let yellowClickCount = 0; // Counter for yellow shapes clicked

function draw() {
    background(bgColor);

    // Stop adding and updating shapes if three yellow shapes have been clicked
    if (yellowClickCount >= 3) {
        return;
    }

    // Add new shapes randomly
    if (frameCount % 20 === 0) {
        let type = random() < 0.1 ? 'blueTriangle' : 'randomShape'; // 10% chance for blue triangle
        if (type === 'blueTriangle') {
            shapes.push(new Shape(random(width), 0, random(20, 50), 'triangle', 'blue'));
        } else {
            shapes.push(new Shape(random(width), 0, random(20, 50)));
        }
    }

    // Update and display shapes
    for (let i = shapes.length - 1; i >= 0; i--) {
        shapes[i].update();
        shapes[i].display();

        // Remove shapes that fall off the canvas
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
                yellowClickCount++; // Increment the counter for yellow shapes clicked
                shape.shine(); // Make the yellow shape shine
                shape.startBlinking(); // Make the yellow circle blink
            } else if (shape.isBlueTriangle()) {
                // Make all yellow circles bigger and add a red stroke
                for (let j = 0; j < shapes.length; j++) {
                    if (shapes[j].isYellow() && shapes[j].type === 'circle') {
                        shapes[j].size += 20; // Increase the size of the yellow circle
                        shapes[j].addRedStroke(); // Add a red stroke to the yellow circle
                    }
                }
            }

            // Stop checking further shapes if the limit is reached
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
        this.isShining = false; // Flag to track if the shape is shining
        this.shineTimer = 0; // Timer for the shine effect
        this.hasRedStroke = false; // Flag to track if the shape has a red stroke
        this.isBlinking = false; // Flag to track if the shape is blinking
        this.blinkTimer = 0; // Timer for the blinking effect
    }

    update() {
        this.y += this.speed;

        // Handle the shine effect
        if (this.isShining) {
            this.shineTimer--;
            if (this.shineTimer <= 0) {
                this.isShining = false; // Stop shining after the timer ends
            }
        }

        // Handle the blinking effect
        if (this.isBlinking) {
            this.blinkTimer--;
            if (this.blinkTimer <= 0) {
                this.isBlinking = false; // Stop blinking after the timer ends
            }
        }
    }

    display() {
        if (this.isBlinking && frameCount % 10 < 5) {
            // Skip drawing the shape to create a blinking effect
            return;
        }

        if (this.isShining) {
            stroke(255, 255, 0); // Add a glowing yellow outline
            strokeWeight(20);
        } else if (this.hasRedStroke) {
            stroke(255, 0, 0); // Add a red stroke
            strokeWeight(5);
        } else {
            noStroke();
        }

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

    isMouseOver() {
        if (this.type === 'circle') {
            return dist(mouseX, mouseY, this.x, this.y) < this.size / 2;
        } else if (this.type === 'square') {
            return mouseX > this.x && mouseX < this.x + this.size &&
                   mouseY > this.y && mouseY < this.y + this.size;
        } else if (this.type === 'triangle') {
            // Approximation for triangle hit detection
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
        this.isShining = true; // Activate the shine effect
        this.shineTimer = 100; // Shine for 30 frames
    }

    addRedStroke() {
        this.hasRedStroke = true; // Activate the red stroke effect
    }

    startBlinking() {
        this.isBlinking = true; // Activate the blinking effect
        this.blinkTimer = 60; // Blink for 60 frames (1 second at 60 FPS)
    }
}