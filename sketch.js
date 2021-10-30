var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombiesGroup, zombieImg
var bulletImg, bullet, bulletGroup
var bullets = 75
var score = 0
var life = 3
var gameState = "fight"
var heart1img, heart2img, heart3img
var heart1, heart2, heart3
var powerup, powerupImg, powerupGroup
var win, powerupnoise, lose, gunshot

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")
  zombieImg = loadImage("assets/zombie.png")
  bulletImg = loadImage("assets/bullet.png")

  heart1img = loadImage("assets/heart_1.png")  
  heart2img = loadImage("assets/heart_2.png")
  heart3img = loadImage("assets/heart_3.png")

  powerupImg = loadImage("assets/bulletgroup.png")

  win = loadSound("assets/win.ogg")
  powerupnoise = loadSound("assets/powerup.ogg")
  lose = loadSound("assets/lose.ogg")
  gunshot = loadSound("assets/gun.ogg")


}

function setup() {

  
createCanvas(windowWidth,windowHeight);

//adding the background image
bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
player.addImage(shooterImg)
player.scale = 0.3
player.setCollider("rectangle",0,0,300,300)

//displaying the lives the player has
heart1 = createSprite(displayWidth - 200, 40, 20, 20)
heart1.addImage(heart1img)
heart1.scale = 0.3
heart1.visible = false

heart2 = createSprite(displayWidth - 140, 40, 20, 20)
heart2.addImage(heart2img)
heart2.scale = 0.3
heart2.visible = false

heart3 = createSprite(displayWidth - 200, 40, 20, 20)
heart3.addImage(heart3img)
heart3.scale = 0.3


zombiesGroup = new Group()
bulletGroup = new Group()
powerupGroup = new Group()
}

function draw() {
  background(0); 




  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}



if(gameState === "fight"){

  //displaying the amount of lives the player has 
  if(life === 3){
    heart1.visible = false
    heart2.visible = false
    heart3.visible = true
  }
  if(life === 2){
    heart1.visible = false
    heart2.visible = true
    heart3.visible = false
  }
  if(life === 1){
    heart1.visible = true
    heart2.visible = false
    heart3.visible = false
  } 
  if(life === 0){
    heart1.visible = false
    heart2.visible = false
    heart3.visible = false
    gameState = "lose"
    lose.play()
  }


//release bullets and change the image of shooter to shooting position when space is pressed
  if(keyWentDown("space")){
    bullet= createSprite(displayWidth-1150, displayHeight-250, 60, 10);
    bullet.addImage(bulletImg);
    bullet.y=player.y - 25;
    bullet.velocityX = 7;
    //bullet.lifetime = 100;
    bullet.scale = 0.04;

  bulletGroup.add(bullet)

  //showing the bullet in front of the player 
  bullet.depth = player.depth 
  player.depth = player.depth + 2

  bullets = bullets - 1 
  gunshot.play()

    player.addImage(shooter_shooting)
    
  }

//player goes back to original standing image once we stop pressing the space bar
  else if(keyWentUp("space")){
    player.addImage(shooterImg)
    
  }
//if there are no more bullets, the player loses
  if(bullets === 0){
    gameState = "bullets"
    lose.play()
  }

  //killing the zombies
  if (zombiesGroup.isTouching(bulletGroup)) {
    for (var i = 0; i < zombiesGroup.length; i++) {
      if (zombiesGroup[i].isTouching(bulletGroup)) {
        zombiesGroup[i].destroy();
        bulletGroup.destroyEach()
        score = score + 5
      }
    }
  }

  // if the player has a hundred points, tbey win 
  if(score === 100){
    gameState = "win"
    win.play()
  }
// if a zombie touches a player, they lose a life
      if (zombiesGroup.isTouching(player)) {
        for (var i = 0; i < zombiesGroup.length; i++) {
          if (zombiesGroup[i].isTouching(player)) {
            zombiesGroup[i].destroy();
            life = life - 1 
            console.log(life)
          }
        }
      }
      // if the player collects a powerup, they get 7 more bullets 
      if (powerupGroup.isTouching(player)) {
        for (var i = 0; i < powerupGroup.length; i++) {
          if (powerupGroup[i].isTouching(player)) {
            powerupGroup[i].destroy();
            bullets = bullets + 7
            powerupnoise.play()
            
          }
        }
      }
      
zombieMove()
powerupDisplay()
}

drawSprites();

//displaying the score and amount of bullets
textSize(20)
fill("white")
text("Score: "+score, displayWidth - 600, 40)

if(gameState === "fight"){
textSize(20)
fill("white")
text("Bullets: "+bullets, displayWidth - 440, 40)
}
//what to do if the player wins(getting rid of the zombies, winning message, etc)
else if(gameState === "win"){
  player.destroy()
  zombiesGroup.destroyEach()
  bulletGroup.destroyEach()
  powerupGroup.destroyEach()
  heart1.destroy()
  heart2.destroy()
  heart3.destroy()
  textSize(150)
  fill("yellow")
  text("You Won",400,400)
}
//what to do if the player loses (destroying zombies, removing text, etc) 
 else if(gameState === "lose"){
  player.destroy()
  zombiesGroup.destroyEach()
  bulletGroup.destroyEach()
  powerupGroup.destroyEach()
  heart1.destroy()
  heart2.destroy()
  heart3.destroy()
  textSize(150)
  fill("red")
  text("Game Over!",400,400)
}
else if(gameState === "bullets"){
  player.destroy()
  zombiesGroup.destroyEach()
  bulletGroup.destroyEach()
  powerupGroup.destroyEach()
  heart1.destroy()
  heart2.destroy()
  heart3.destroy()
  textSize(50)
  fill("red")
  text("You ran out of bullets!",400,400)
}
}

//creating zombies and having them move towards the player 
function zombieMove(){
  if(frameCount % 70 === 0){
    zombie = createSprite(displayWidth - 50, random(100,500), 50, 50)
    zombie.addImage(zombieImg)
    zombie.scale = 0.17
    zombie.velocityX = -2
    zombie.setCollider("rectangle",0,0,400,800)
    zombie.lifetime = 600

    zombiesGroup.add(zombie)
}
}
//displaying powerups and having them move to the player
function powerupDisplay(){
  if(frameCount % 150 === 0){
    powerup = createSprite(displayWidth - 50, random(100,500), 20, 20)
    powerup.addImage(powerupImg)
    powerup.scale = 0.1
    powerup.velocityX = -2
    // zombie.setCollider("rectangle",0,0,400,800)
    powerup.lifetime = 600
  
    powerupGroup.add(powerup)
  }
  }


