/******************** BACKGROUND ANIMATIONS  ************************/
/********************************************************************/
/********************************************************************/
// Author: Paul Mangat. 2022

/********* Globals Variables ***********/

// Get the canvas element form the page
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
// ctx.globalCompositeOperation='destination-over';

let particlesArray =[];


/******************** Particle  *************************/
/******************** OBJECT *************************/

// Particle Object - all data and methods for a single partice

function Particle(onScreen,x,y,xSpeed,ySpeed,radius)  {
  this.onScreen=onScreen;
  this.x=x;
  this.y=y;
  this.xSpeed=xSpeed;
  this.ySpeed=ySpeed;
  this.radius=radius;
  this.init =function(maxX,maxY) {
    this.x=getRndInteger(0, maxX);
    this.y=getRndInteger(0, maxY);
    this.xSpeed=0;
    this.ySpeed=0;
    while(this.ySpeed===0 && this.xSpeed===0) {  //no stationary particles permitted
      this.xSpeed=(Math.random()*6)-3;
      this.ySpeed=(Math.random()*6)-3;
    }
    this.radius=1+5*Math.round((Math.abs(this.xSpeed)+Math.abs(this.ySpeed))/2); //FIX
    onScreen=true;
  };
  this.move = function(maxX,maxY)  {
     //offscreen
    if(this.x < 0 || this.x>maxX || this.y<0 || this.y>maxY) { 
      this.onScreen=false;
      this.init(maxX,maxY);
    } else {
      //move items
      this.x+=this.xSpeed/5;
      this.y+=this.ySpeed/5;
    }
  };
};


/**************** generateParticles  **********************/
//Creates/Initializes all particles and stores into array of particle objects

 function generateParticles(amount) {
   for (let i = 0; i < amount; i++) {
     particlesArray[i] = new Particle();
     particlesArray[i].init(canvasWidth,canvasHeight);
   }
  }


/**************** Iniitialize the Canvas **********************/
//Bakground Animation init
function initBG() {

  /* intialize width/height */
  setSize();

  /* Create Particles  */
  generateParticles(30);
 
  /* start animation */
  requestAnimationFrame(animateBG);
}

/**************** Animation Function **********************/
function animateBG() {

  /* Clear the Canvas */
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // clear canvas

  /* Update positions */
  particlesArray.forEach((item)=> {
    item.move(canvasWidth,canvasHeight);
  });

  particlesArray.forEach((item)=> {
  /* Draw the items */
  ctx.beginPath();
  ctx.fillStyle = 'rgba(62, 92, 131, 0.05)';

  // Shadow
  ctx.shadowColor = 'white';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.arc(Math.round( item.x),Math.round( item.y),  item.radius, 0, 2 * Math.PI,false);
  ctx.fill();
  ctx.closePath();
});

  /* Restart Animation */
  requestAnimationFrame(animateBG);
}

/******************** utility - generate random Int **********************/
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}