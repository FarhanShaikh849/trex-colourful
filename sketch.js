var PLAY = 1;
var END = 0;
var gameState = PLAY;

var background0;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver,gameOver2, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  background0Img = loadImage("backgroundImg.png");
  gameOverImg = loadImage("gameOver.png");
  gameOver2Img = loadImage("gameOver2.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-110,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.7;
  trex.setCollider('circle',0,0,40)
  
  ground = createSprite(width/2,height-53,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/150);
  
  gameOver = createSprite(width/3,height/2-60);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.2;
  gameOver.visible = false;
  
  gameOver2 = createSprite(width/1.55,height/2-60);
  gameOver2.addImage(gameOver2Img);
  gameOver2.scale = 0.2;
  gameOver2.visible = false;
  
  restart = createSprite(width/2.05,height/2+10);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-95,width,125);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
}

function draw() {
  //trex.debug = true;
  background(background0Img);
  
  textSize(20);
  fill("black");
  text("Score: "+ score, width/3,height/12);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    textSize(20);
    text("HighScore: "+ localStorage["HighestScore"],width/3,height/7);
    
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length > 0 || keyDown("space")) && trex.y >= height-195) {
      trex.velocityY = -14;
      touches = [];
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
    
  }
  else if (gameState === END) {
    gameOver.visible = true;
    gameOver2.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if((touches.length > 0 || mousePressedOver(restart))) {
      reset();
      touches = [];
    }
  }
if(localStorage["HighestScore"]<score) {
localStorage["HighestScore"] = score;
}
  
  drawSprites();
}

function spawnClouds() {
  if(gameState === PLAY){
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(50,250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.25;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 250;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(800,height-185,20,30);
    obstacle.setCollider('circle',0,0,45);
    obstacle.velocityX = -(6 + 3*score/150);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  gameOver2.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}