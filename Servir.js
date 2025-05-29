let blenderImg;
let glassImg;
let waterDrops = [];
let glass = {
    x: 300,
    y: 400,
    width: 100,
    height: 150,
    direction: 1,
    speed: 2,
    fillLevel: 0,
    maxFill: 100
};

function preload() {
    blenderImg = loadImage('Assets/licuadora.png');
    glassImg = loadImage('Assets/vaso.png');
}

function setup() {
    createCanvas(600, 600);
    imageMode(CENTER);
}

class WaterDrop {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.size = 10;
        this.active = true;
    }

    update() {
        if (!this.active) return;
        this.y += this.speed;
        
        // Check collision with glass
        if (this.y > glass.y - glass.height/2 && 
            this.y < glass.y + glass.height/2 && 
            this.x > glass.x - glass.width/2 && 
            this.x < glass.x + glass.width/2) {
            this.active = false;
            glass.fillLevel += 1;
        }
        
        // Remove if out of screen
        if (this.y > height) {
            this.active = false;
        }
    }

    draw() {
        if (!this.active) return;
        fill(0, 150, 255);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }
}

function draw() {
    background(220);
    
    // Move glass
    glass.x += glass.speed * glass.direction;
    if (glass.x > width - glass.width/2 || glass.x < glass.width/2) {
        glass.direction *= -1;
    }
    
    // Draw glass and fill level
    push();
    translate(glass.x, glass.y);
    // Draw water fill
    fill(0, 150, 255, 100);
    let fillHeight = (glass.fillLevel / glass.maxFill) * glass.height;
    rect(-glass.width/2, glass.height/2 - fillHeight, glass.width, fillHeight);
    // Draw glass image
    image(glassImg, 0, 0, glass.width, glass.height);
    pop();
    
    // Draw blender at mouse position with tilt
    push();
    translate(mouseX, 50);
    // Tilt the blender when pouring (mouse pressed)
    let tiltAngle = mouseIsPressed ? PI/6 : 0; // 30 degrees when pouring, 0 when not
    rotate(tiltAngle);
    image(blenderImg, 0, 40, 80, 120);
    pop();
    
    // Create water drops when mouse is pressed
    if (mouseIsPressed) {
        // Adjust water drop starting position based on tilt
        let dropStartX = mouseX + cos(PI/6) * 40; // Offset from the tilted blender spout
        let dropStartY = 50 + sin(PI/6) * 40;
        waterDrops.push(new WaterDrop(dropStartX, dropStartY));
    }
    
    // Update and draw water drops
    for (let drop of waterDrops) {
        drop.update();
        drop.draw();
    }
    
    // Remove inactive drops
    waterDrops = waterDrops.filter(drop => drop.active);
    
    // Display fill level
    fill(0);
    textSize(20);
    textAlign(CENTER);
    text(`Fill Level: ${floor((glass.fillLevel / glass.maxFill) * 100)}%`, width/2, 30);
    
    // Check win condition
    if (glass.fillLevel >= glass.maxFill) {
        background(220);
        fill(0, 255, 0);
        textSize(40);
        text('¡Bien hecho!', width/2, height/2);
        noLoop();
    }
}
