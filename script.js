// ----------------------------
// Mini platformer game (beginner-friendly)
// ----------------------------

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const GRAVITY = 0.7;
const MOVE_SPEED = 4;
const JUMP_STRENGTH = -13;

// Keep track of pressed keys
const keys = {
  left: false,
  right: false
};

// Platforms in the world
const platforms = [
  // Ground platform
  { x: 0, y: 450, width: 900, height: 50, color: "#ff4fcf" },
  // Floating platform 1
  { x: 210, y: 340, width: 180, height: 20, color: "#ff74df" },
  // Floating platform 2
  { x: 540, y: 280, width: 180, height: 20, color: "#ff97ea" }
];

// Player object (simple square)
const player = {
  x: 70,
  y: 380,
  width: 32,
  height: 32,
  vx: 0,
  vy: 0,
  onGround: false,
  color: "#ffffff"
};

// Input: key down
window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    keys.left = true;
  }
  if (event.code === "ArrowRight") {
    keys.right = true;
  }

  // Jump with spacebar only if on ground/platform
  if (event.code === "Space" && player.onGround) {
    player.vy = JUMP_STRENGTH;
    player.onGround = false;
  }
});

// Input: key up
window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    keys.left = false;
  }
  if (event.code === "ArrowRight") {
    keys.right = false;
  }
});

// Update game logic each frame
function update() {
  // Horizontal movement from input
  player.vx = 0;
  if (keys.left) {
    player.vx = -MOVE_SPEED;
  }
  if (keys.right) {
    player.vx = MOVE_SPEED;
  }

  // Apply movement
  player.x += player.vx;

  // Bonus: prevent leaving game area horizontally
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // Apply gravity and vertical movement
  player.vy += GRAVITY;
  player.y += player.vy;

  // Assume in air until collision says otherwise
  player.onGround = false;

  // Check collision with each platform (only landing from above)
  for (const platform of platforms) {
    const playerBottom = player.y + player.height;
    const prevPlayerBottom = playerBottom - player.vy;

    const isOverlappingX =
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x;

    const landedOnTop =
      prevPlayerBottom <= platform.y &&
      playerBottom >= platform.y;

    if (isOverlappingX && landedOnTop && player.vy >= 0) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.onGround = true;
    }
  }

  // Safety: keep player inside bottom of game area
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.vy = 0;
    player.onGround = true;
  }
}

// Draw everything each frame
function draw() {
  // Clear previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw platforms
  for (const platform of platforms) {
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
