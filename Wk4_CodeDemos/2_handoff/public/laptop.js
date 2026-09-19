let socket;
let input = { dx: 0, dy: 0 };
let player = { x: 50, y: 0, vy: 0, w: 30, h: 30 };
let gravity = 0.6;
let ground = 350;
let speed = 4;
let connected = false;
let goal = { x: 400, y: 100, w: 140, h: 16 };
let deepColour = {r:10, g:10, b:40};
let highColour = {r:200, g: 150, b:90};


function setup() {
  createCanvas(600, 400);
  socket = io();

  socket.on('connect', () => {
    connected = true;
    document.getElementById('status').textContent = 'phone connected — waiting for input';
  });

  socket.on('control', (data) => {
    document.getElementById('status').textContent = 'receiving input from phone';
    if (typeof data.dx === 'number') input.dx = data.dx;
    if (typeof data.dy === 'number') input.dy = data.dy;
    if (data.jump) doJump();
  });
}

function draw() {
  let platform = { x: player.x, y: 220, w: 140, h: 16 };

  background(20);
  let t = constrain(map(player.y, 0, ground, 0, 1), 0, 1);
  let bg = lerpColor(
    color(highColour.r, highColour.g, highColour.b),
    color(deepColour.r, deepColour.g, deepColour.b),
    t
);
background(bg);

  player.x += input.dx * speed;
  player.x = constrain(player.x, 0, width - player.w);

  player.vy += gravity;
  player.y += player.vy;

  if (player.y + player.h > ground) {
    player.y = ground - player.h;
    player.vy = 0;
  }

  let landing =
    player.x + player.w > platform.x &&
    player.x < platform.x + platform.w &&
    player.y + player.h > platform.y &&
    player.y + player.h < platform.y + platform.h + 10 &&
    player.vy >= 0;

  if (landing) {
    player.y = platform.y - player.h;
    player.vy = 0;
  }



  fill(60);
  rect(0, ground, width, height - ground);
  fill(90);
  rect(platform.x, platform.y, platform.w, platform.h);

  
  let goalLand =
    player.x + player.w > goal.x &&
    player.x < goal.x + goal.w &&
    player.y + player.h > goal.y &&
    player.y + player.h < goal.y + goal.h + 10 &&
    player.vy >= 0;

  if (goalLand) {
    player.y = goal.y - player.h;
    player.vy = 0;
  }
  
  fill(90);
  rect(goal.x, goal.y, goal.w, goal.h);

  //Player
  fill(240, 90, 60);
  rect(player.x, player.y, player.w, 60);


  //let player = { x: 50, y: 0, vy: 0, w: 30, h: 30 };

  rect(player.x, player.y-10, player.w-20, player.h-20);



  // also allow keyboard for testing without a phone
  if (keyIsDown(LEFT_ARROW)) player.x -= speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += speed;
}

function keyPressed() {
  if (key === ' ') doJump();
}

function doJump() {
  if (player.y + player.h >= ground || player.vy === 0) {
    player.vy = -12;
  }
}
