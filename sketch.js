var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running;
var ground, invisibleGround, groundImage;
var back_ground,back_groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var sun, sunImage;
var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("t3.png","t2.png","t1.png");
  
  back_groundImage = loadImage("bck.jpg");
  groundImage = loadImage("b1.jpg")
  cloudImage = loadImage("c3.png");
  
  obstacle1 = loadImage("o1.png");
  obstacle2 = loadImage("o2.png");
  obstacle3 = loadImage("o3.png");
  obstacle4 = loadImage("o4.png");
  obstacle5 = loadImage("o5.png");
  obstacle6 = loadImage("o6.png");
  
  gameOverImg = loadImage("18-3.png");
  restartImg = loadImage("18-2.jpg");
  
  sunImage = loadImage("s3.png")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  back_ground = createSprite(0,0,400,400);
  back_ground.addImage("ground",back_groundImage);
 // ground.x = ground.width /2;
 // ground.velocityX = -(6 + 3*score/100);
  back_ground.scale=5;
  
  
  ground = createSprite(width-200,height+300,width,0);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale=0.5;
  
  trex = createSprite(30,height-120,0,0);
  trex.addAnimation("trex_running",trex_running);
  trex.scale=0.8;
  
  sun = createSprite(width-50,40,0,0);
  sun.addImage("sun",sunImage);
  sun.scale=0.1;
  
  gameOver = createSprite(width/2,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-60,400,10);
  invisibleGround.x = invisibleGround.width/2
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
 // background(255);
  text("Score: "+ score, width-100,200);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length>0 || keyDown("space")) && trex.y >= height-240) {
      trex.velocityY = -12;
      touches = [];
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (back_ground.x < 0){
      back_ground.x =back_ground.width/2;
    }
  
    if (ground.x < 0){
      ground.x =ground.width/2;
    }
    
    if (invisibleGround.x < 0){
      invisibleGround.x =invisibleGround.width/2;
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
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if( touches.length>0 || mousePressedOver(restart)) {
      reset();
      touches=[];
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width,height-270,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.3;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloud.depth = back_ground.depth;
    cloud.depth = cloud.depth + 1;
    
    cloud.depth = sun.depth;
    cloud.depth = cloud.depth + 1;
    
    cloud.depth = back_ground.depth;
    gameOver.depth = gameOver.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-100,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
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
    obstacle.scale = 0.9;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}