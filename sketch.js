//***Titanic game***
//try not to die this time


let stars = [];
let icebergs = [];

//boat-iceberg collisions
let icebergsCollision = false;
let collisionSound; 



//animated waves // reference: Indroduction to Coding class: https://www.openprocessing.org/sketch/1066944
let img_waves;
let waves1X = 0;
let waves2X = 0;
let wavesSpeed = 1.5;
let wavesHeight = 1;

let wavessound;

//images - assets
let img_moon;

// boat --> player
let img_boat;
let boatX = 0;
//find boat center
let boat_moving = false;



function preload(){
  wavessound = loadSound('assets/wavessound.mp3');
  collisionSound = loadSound('assets/Titanic.mp3');
  img_moon = loadImage('assets/pinkmoon.png');
  img_waves = loadImage('assets/waves.png');
  img_boat = loadImage('assets/boat.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  
  button = createButton('let your heart go on and on');
  button.style('background-color', '#d16002')
  button.position(windowWidth / 2, windowHeight/2);
  button.mousePressed(gameRestart);  


  //add waves
  initWaves(); 
 
  //add stars
  for (var i = 0; i < 50; i++) {
    stars.push(new Star()); 
  }
  
  //add icebergs
  icebergs.push(new Iceberg(800, 700, -50, 0, 50, 0, 0, -100, 0.7, 100));
  icebergs.push(new Iceberg(400, 750, -50, 0, 50, 0, 0, -100, 0.5, 80));
  icebergs.push(new Iceberg(600, 650, -50, 0, 50, 0, 0, -100, 0.25, 50));
 
}
  
function gameRestart() {
  reload = location.reload();
 }

  // To get an infinite loop of the moving background
	// we display it two times and shift the second image
	// to the right end of the first.
	// For that we need to initialize its X position
	// as the width of the image:
function initWaves() {
  waves2X = img_waves.width;
  wavessound.play();
  wavessound.loop();
 
}


function animateWaves() {
  //draw background
  image(img_waves, waves1X, img_waves.height /2);
  image(img_waves, waves2X, img_waves.height /2);

  waves1X -= wavesSpeed;
	waves2X -= wavesSpeed;

  
  
  // We need to put back the images to the right side
	// when they left the screen at the left side
	// by setting their X position to the image width
	if (waves1X <= -img_waves.width) {
		waves1X = img_waves.width;
  } else if (waves2X <= -img_waves.width) {
		waves2X = img_waves.width;
	}
}

//setGradient and Star function tutorial and reference: https://codeburst.io/sunsets-and-shooting-stars-in-p5-js-92244d238e2b
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis == "Y") {  // Top to bottom gradient
    for (let i = y; i <= y+h; i++) {
      let inter = map(i, y, y+h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
}

class Star {
  constructor(){
    this.x = random(windowWidth);
    this.y = random(windowHeight-200);
    this.w = 2;
    this.h = 2;
    this.speed = random(0.1, 1);

}

  move() {
    this.x += (random(-this.speed, this.speed));
    this.y += (random(-this.speed, this.speed));
  
  if (this.w == 2) {
    this.w = 3;
    this.h = 3;
  } else {
    this.w = 2;
    this.h = 2;
  }

}

  show() {
    noStroke();
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.w, this.h);
}
}

//class Iceberg woudn't work with help of Stefan Puest
class Iceberg {
  constructor(iceX, iceY, x1, y1, x2, y2, x3, y3, speed, scaleFactor) {
    this.iceX = iceX;
    this.iceY = iceY;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.speed = speed;
    this.scaleFactor = scaleFactor;
    
    this.z = 100; 
    
  }

  move() {
    this.z -= this.speed;
    this.scaleFactor = (1000/this.z) / 100;
    this.iceY = this.iceY + this.speed;
  }
  
show() {

  noStroke;
  fill(137, 207, 240);
  
  triangle(
    (this.x1 * this.scaleFactor) + this.iceX,
    (this.y1 * this.scaleFactor) + this.iceY,
    (this.x2 * this.scaleFactor) + this.iceX,
    (this.y2 * this.scaleFactor) + this.iceY,
    (this.x3 * this.scaleFactor) + this.iceX,
    (this.y3 * this.scaleFactor) + this.iceY,
  );

}


}



function draw() {
  if(icebergsCollision) {
   
  } else {
    let color1 = color(0, 0, 153);
    let color2 = color(0, 96, 255);
    setGradient(0, 0, windowWidth, windowHeight, color1, color2, "Y");

    //draw stars
    for (let i = 0; i < 50; i++) {
      stars[i].move();
      stars[i].show();
    }

  // draw waves
  animateWaves();


  //draw moon
  image(img_moon, width/ 8, height / 8, img_moon.width / 8, img_moon.height / 8);

  // draw random icebergs and make them disapear when outside the screen
  icebergs.forEach((element) => {
  element.move();

  if(element.z <= 1) {
    element.z = 150;
    element.iceX = random(width);
  }

  icebergHitX1 = (element.x1 * element.scaleFactor) + element.iceX;
  icebergHitX2 = (element.x3 * element.scaleFactor) + element.iceX;

  boatHitX1 = boatX + img_boat.width/2 - 75;
  boatHitX2 = (boatX + width /4);

  if(element.iceY > height - 100) {
    //iceberg hitting the boat from right side
    if(icebergHitX2 > boatHitX1 && icebergHitX2 < boatHitX2 && icebergHitX1 < boatHitX1) {
      icebergsCollision = true;
      collisionSound.play();
    } 
    //iceberg hitting the boat from left side
    else if (icebergHitX1 < boatHitX2 && icebergHitX1 > boatHitX1 && icebergHitX2 > boatHitX2) {
      icebergsCollision = true;
      collisionSound.play();
    } 
    //iceberg inside of the boat
    else if (icebergHitX1 < boatHitX1 && icebergHitX2 < boatHitX2) {
      icebergsCollision = true;
      collisionSound.play();

      //iceberg is bigger that the boat, overlapping
    } else if (boatHitX1 > icebergHitX1 && boatHitX2 < icebergHitX2) {
      icebergsCollision = true;
      collisionSound.play();
    } 
    else {
    icebergsCollision = false;
    }
  }

  element.show();

  });



  //boat
  //image(img_boat, (width/ 2) + boatX, height / 1.5, img_boat.width / 2, img_boat.height /2);
  image(img_boat, boatX + width/4, height / 1.5, img_boat.width / 2, img_boat.height /2)

  strokeWeight(5);
  stroke(250,0,0);
  //line((boatX + width /4) + 500, height - 100, boatX + img_boat.width/2 - 75 , height -100);
  }
}


//move player
function keyPressed() {

   if (keyCode == LEFT_ARROW) {
    boat_moving = true;
    boatX = boatX - 150;
   } else if (keyCode == RIGHT_ARROW) {
    boat_moving = true;
    boatX = boatX + 150;  
  }

}



