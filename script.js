// ----------------------------
// Mini platformer game (beginner-friendly)
// ----------------------------

window.onload = function() {

  const game = document.getElementById("game");
  let player = document.getElementById("player");

  let x = 100;
  let y = 300;

  let speed = 5;

  let velocityY = 0;
  let gravity = 0.5;
  let jumpForce = -10;
  let isOnGround = false;
  const playerSize = 32;
  const groundY = game.clientHeight - 50 - playerSize;
  const keys = { left: false, right: false };
  const platforms = [
    { x: 220, y: 350, width: 170, height: 18 },
    { x: 520, y: 285, width: 170, height: 18 }
  ];

  // Create platform elements once, based on the platform data above
  platforms.forEach(function(platformData) {
    const platformEl = document.createElement("div");
    platformEl.className = "platform";
    platformEl.style.left = platformData.x + "px";
    platformEl.style.top = platformData.y + "px";
    platformEl.style.width = platformData.width + "px";
    platformEl.style.height = platformData.height + "px";
    game.appendChild(platformEl);
  });

  document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
      keys.right = true;
      event.preventDefault();
    }
    if (event.key === "ArrowLeft") {
      keys.left = true;
      event.preventDefault();
    }

    if (event.code === "Space" && isOnGround) {
      event.preventDefault();
      velocityY = jumpForce;
      isOnGround = false;
    }
  });

  document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowRight") keys.right = false;
    if (event.key === "ArrowLeft") keys.left = false;
  });

  function update() {
    if (keys.right) x += speed;
    if (keys.left) x -= speed;

    const previousBottom = y + playerSize;

    velocityY += gravity;
    y += velocityY;
    isOnGround = false;

    // Land on floating platforms if the player is falling onto them
    platforms.forEach(function(platform) {
      const playerBottom = y + playerSize;
      const landingTolerance = 8;
      const wasAbovePlatform = previousBottom <= platform.y + landingTolerance;
      const crossedPlatformTop = playerBottom >= platform.y;
      const overlappingX =
        x + playerSize > platform.x && x < platform.x + platform.width;

      if (velocityY >= 0 && wasAbovePlatform && crossedPlatformTop && overlappingX) {
        y = platform.y - playerSize;
        velocityY = 0;
        isOnGround = true;
      }
    });

    if (y >= groundY) {
      y = groundY;
      velocityY = 0;
      isOnGround = true;
    }

    const maxX = game.clientWidth - playerSize;
    if (x < 0) x = 0;
    if (x > maxX) x = maxX;

    player.style.left = x + "px";
    player.style.top = y + "px";
  }

  function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();

  console.log(player);
};