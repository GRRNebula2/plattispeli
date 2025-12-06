// Select the canvas element and set its dimensions
var canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

// Get the 2D drawing context for the canvas
var c = canvas.getContext("2d");

// Define the gravity constant
const gravity = 1;

// Define image objects with their URLs and alternative texts
var platformImg = {
  imageUrl: "./platform.png", // URL of the platform image
  altText: "Description of the image", // Alt text for accessibility
};

var bgImg = {
  imageUrl: "./background.png", // URL of the background image
  altText: "Description of the image", // Alt text for accessibility
};

var smallPlatImg = {
  imageUrl: "./platformSmallTall.png", // URL of the small platform image
  altText: "Description of the image", // Alt text for accessibility
};

var leveliLapiImg = {
  imageUrl: "/level2/level1passed.png",
  altText: "level yks passed",
};

var starImg = {
  imageUrl: "./Images/star.png",
  altText: "Level goal star",
};

var runRight = {
  imageUrl: "./spriteRunRight.png", // URL of the running right sprite
  altText: "Description of the image", // Alt text for accessibility
};

var runLeft = {
  imageUrl: "./spriteRunLeft.png", // URL of the running left sprite
  altText: "Description of the image", // Alt text for accessibility
};

var standRight = {
  imageUrl: "./spriteStandRight.png", // URL of the standing right sprite
  altText: "Description of the image", // Alt text for accessibility
};

var standLeft = {
  imageUrl: "./spriteStandleft.png", // URL of the standing left sprite
  altText: "Description of the image", // Alt text for accessibility
};

var hillImg = {
  imageUrl: "./hills.png", // URL of the hills image
  altText: "Description of the image", // Alt text for accessibility
};

// Get the start button and audio elements from the DOM
var start = document.getElementById("start");
var footAudio = document.getElementById("footAudio");
var jumpAudio = document.getElementById("jumpAudio");

// Player class definition
class Player {
  constructor() {
    // Initialize player position and velocity
    this.position = { x: 100, y: 100 };
    this.velocity = { x: 0, y: 40 };
    this.hypyt = { hyppyjenMaara: 0 };

    // Define player dimensions
    this.width = 65;
    this.height = 150;

    // Define player sprites for standing and running
    this.sprites = {
      stand: {
        right: createImage(standRight.imageUrl),
        left: createImage(standLeft.imageUrl),
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: createImage(runRight.imageUrl),
        left: createImage(runLeft.imageUrl),
        cropWidth: 341,
        width: 127.875,
      },
    };

    // Set the initial image and frame for the player
    this.image = this.sprites.stand.right;
    this.frame = 0;
    this.currentCropWidth = this.sprites.stand.cropWidth;
  }

  // Draw the player on the canvas
  draw() {
    c.drawImage(
      this.image,
      this.currentCropWidth * this.frame,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  // Update the player position and animation frame
  update() {
    this.frame++;

    // Reset frame for standing animation
    if (
      this.frame > 59 &&
      (this.image === this.sprites.stand.right ||
        this.image === this.sprites.stand.left)
    ) {
      this.frame = 0;
    }

    // Reset frame for running animation
    if (
      this.frame > 29 &&
      (this.image === this.sprites.run.right ||
        this.image === this.sprites.run.left)
    ) {
      this.frame = 0;
    }

    this.draw();

    // Update player position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Apply gravity if the player is above the bottom of the canvas
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

// Function to create an image object
function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

// Start the game by playing the start audio
start.play();

// Create image objects for platforms and background
var platImage = createImage(platformImg.imageUrl);
var backImage = createImage(bgImg.imageUrl);
var smallImage = createImage(smallPlatImg.imageUrl);
var leveliLapiImg = createImage(leveliLapiImg.imageUrl);
var starImage = createImage(starImg.imageUrl);

// Platform class definition
class Platform {
  constructor(x, y, image) {
    this.position = { x: x, y: y };
    this.width = image.width;
    this.height = image.height;
    this.image = image;
  }

  // Draw the platform on the canvas
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// Class for small platforms
class smallPlat {
  constructor(x, y, image) {
    this.position = { x: x, y: y };
    this.width = image.width;
    this.height = image.height;
    this.image = image;
  }

  // Draw the small platform on the canvas
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// GenericObject class for background and other static images
class GenericObject {
  constructor(x, y, image) {
    this.position = { x: x, y: y };
    this.image = image;
  }

  // Draw the generic object on the canvas
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class leveliLapi {
  constructor(x, y, image) {
    this.position = { x: x, y: y };
    this.width = image.width || 100; // Default width if image not loaded
    this.height = image.height || 150; // Default height if image not loaded
    this.image = image;
  }

  // Draw the goal object on the canvas
  draw() {
    // Draw a bright yellow/gold rectangle as fallback (always visible)
    c.fillStyle = "gold";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Draw a flag pole (black)
    c.fillStyle = "black";
    c.fillRect(
      this.position.x + this.width / 2 - 5,
      this.position.y,
      10,
      this.height
    );

    // Draw a flag (red)
    c.fillStyle = "red";
    c.beginPath();
    c.moveTo(this.position.x + this.width / 2 + 5, this.position.y + 10);
    c.lineTo(this.position.x + this.width / 2 + 60, this.position.y + 30);
    c.lineTo(this.position.x + this.width / 2 + 5, this.position.y + 50);
    c.fill();

    // Try to draw the image on top if it loaded
    if (this.image && this.image.complete && this.image.naturalWidth > 0) {
      c.drawImage(this.image, this.position.x, this.position.y);
    }
  }
}

// Star class for level goal
class Star {
  constructor(x, y, image) {
    this.position = { x: x, y: y };
    this.width = 100; // Larger star
    this.height = 100; // Larger star
    this.image = image;
    this.time = 0; // For animation
  }

  // Draw the star on the canvas
  draw() {
    this.time += 0.05;

    // Floating animation (up and down)
    const floatOffset = Math.sin(this.time) * 10;

    // Scaling animation (pulse effect)
    const scale = 1 + Math.sin(this.time * 2) * 0.1;

    // Calculate scaled dimensions
    const scaledWidth = this.width * scale;
    const scaledHeight = this.height * scale;

    // Center the scaled image
    const offsetX = (this.width - scaledWidth) / 2;
    const offsetY = (this.height - scaledHeight) / 2;

    // Draw the star image with animation
    if (this.image && this.image.complete && this.image.naturalWidth > 0) {
      c.drawImage(
        this.image,
        this.position.x + offsetX,
        this.position.y + offsetY + floatOffset,
        scaledWidth,
        scaledHeight
      );
    } else {
      // Fallback: draw a simple yellow star shape if image hasn't loaded
      c.save();
      c.translate(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2 + floatOffset
      );
      c.scale(scale, scale);

      c.fillStyle = "gold";
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * 40;
        const y = Math.sin(angle) * 40;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);

        const angle2 = (Math.PI * 2 * (i + 0.5)) / 5 - Math.PI / 2;
        const x2 = Math.cos(angle2) * 20;
        const y2 = Math.sin(angle2) * 20;
        c.lineTo(x2, y2);
      }
      c.closePath();
      c.fill();

      c.restore();
    }
  }
}

// Initialize the player and platforms
let player = new Player();
let platforms = [];
let levelGoal = null; // Goal object to reach for level completion
let currentLevel = 1; // Track current level
let levelEndX = 0; // X position of the level goal (for progress bar)
let gamePaused = false; // Track if game is paused for congratulation screen
let nextLevel = 1; // Store which level to load next

// Get congratulation overlay elements
const congratsOverlay = document.getElementById("congratsOverlay");
const congratsMessage = document.getElementById("congratsMessage");

// Add platforms to the platforms array
const xp = platImage.width - 2;
const yp = canvas.height - platImage.height;
platforms.push(new Platform(xp, yp, platImage));
platforms.push(new Platform(xp * 2, yp, platImage));
platforms.push(new Platform(xp * 4, yp, platImage));

// Add small platforms to the platforms array
const xs = 0;
const ys = 0;
platforms.push(new Platform(xs, ys, smallImage));
platforms.push(new Platform(xs * 2, ys, smallImage));
platforms.push(new Platform(xs * 4, ys, smallImage));

// Define keys for user input
let keys = {
  up: { pressed: false },
  right: { pressed: false },
  left: { pressed: false },
  down: { pressed: false },
};

// Track if jump key has been released (prevents holding jump)
let jumpKeyReleased = true;

// Initialize screen offset and generic objects
let ScreenOffSet = 0;
let generic0bjects = [
  new GenericObject(-1, -1, backImage),
  new GenericObject(-1, -1, createImage(hillImg.imageUrl)),
];

// Wall objects for marking level start and end
let walls = [];

// Wall class for visual markers
class Wall {
  constructor(x, y, width, height) {
    this.position = { x: x, y: y };
    this.width = width;
    this.height = height;
  }

  draw() {
    c.fillStyle = "rgba(100, 100, 100, 0.8)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Add border for definition
    c.strokeStyle = "white";
    c.lineWidth = 3;
    c.strokeRect(this.position.x, this.position.y, this.width, this.height);

    // Add text to indicate start/end
    c.fillStyle = "white";
    c.font = "bold 20px Arial";
    c.textAlign = "center";
    const textY = this.position.y + this.height / 2 + 7;
    const textX = this.position.x + this.width / 2;
    if (this.position.x < 100) {
      c.fillText("START", textX, textY);
    } else {
      c.fillText("END", textX, textY);
    }
  }
}

// Function to show congratulation screen
function showCongratulationScreen(levelCompleted, nextLevelNumber) {
  gamePaused = true;
  nextLevel = nextLevelNumber;

  // Update the message based on which level was completed
  if (nextLevelNumber > 2) {
    congratsMessage.textContent = `You beat the game! 🏆`;
  } else {
    congratsMessage.textContent = `Level ${levelCompleted} Complete!`;
  }

  // Show the overlay
  congratsOverlay.classList.add("show");
}

// Function to hide congratulation screen and continue
function hideCongratulationScreen() {
  congratsOverlay.classList.remove("show");
  gamePaused = false;

  // Load the next level
  if (nextLevel > 2) {
    // Beat the game, restart from level 1
    init(1);
  } else {
    init(nextLevel);
  }
}

// Initialize function to set up the game state
function init(level = 1) {
  start.play();
  currentLevel = level;

  platImage = createImage(platformImg.imageUrl);
  backImage = createImage(bgImg.imageUrl);
  starImage = createImage(starImg.imageUrl);

  player = new Player();
  platforms = [];
  walls = []; // Reset walls
  levelGoal = null;

  if (level === 1) {
    // Level 1 setup
    // Add ground platforms with gaps (pits) to jump over
    const platformWidth = 580;
    const pitPositions = [3, 5, 8, 11]; // Indices where pits will be created

    for (let i = 0; i < 15; i++) {
      // Skip platforms at pit positions to create gaps
      if (!pitPositions.includes(i)) {
        const xp = i * platformWidth;
        const yp = canvas.height - platImage.height;
        platforms.push(new Platform(xp, yp, platImage));
      }
    }
    // Place player after all platforms are created

    // Add some floating platforms for variety
    for (let i = 2; i < 3; i++) {
      const xp = (platImage.width + 20) * i;
      const yp = canvas.height - 2 * platImage.height;
      platforms.push(new Platform(xp, yp, platImage));
    }

    for (let i = 10; i < 11; i++) {
      const xp = (platImage.width - 30) * i;
      const yp = canvas.height - 2 * platImage.height;
      platforms.push(new Platform(xp, yp, platImage));
    }

    // Add final platform for the goal
    const finalPlatformX = 14 * 580; // Align with the last ground platform
    const finalPlatformY = canvas.height - platImage.height;
    platforms.push(new Platform(finalPlatformX, finalPlatformY, platImage));

    // Add level goal (star) at the end of the level - positioned high and visible
    const goalX = finalPlatformX + platImage.width / 2 - 40;
    const goalY = finalPlatformY - 150;
    levelGoal = new Star(goalX, goalY, starImage);
    console.log("Level 1 star created at:", goalX, goalY);
    levelEndX = goalX; // Store goal position for progress bar

    // ...existing code...
  } else if (level === 2) {
    // Level 2 setup - Create your own level design here!
    console.log("Level 2!");
    // Add ground platforms with more challenging pits
    const platformWidth = platImage.width - 2;
    const pitPositions = [2, 4, 6, 8]; // Indices where pits will be created

    for (let i = 0; i < 10; i++) {
      // Skip platforms at pit positions to create gaps
      if (!pitPositions.includes(i)) {
        const xp = platformWidth * i;
        const yp = canvas.height - platImage.height;
        platforms.push(new Platform(xp, yp, platImage));
      }
    }
    // Place player after all platforms are created
    // Set player position after platforms are created (for both levels)
    if (platforms.length > 0) {
      player.position.x = platforms[0].position.x + 50;
      player.position.y = platforms[0].position.y - player.height;
      player.velocity.x = 0;
      player.velocity.y = 0;
    }

    // Add some floating platforms to help cross the pits
    for (let i = 3; i < 7; i++) {
      const xp = (platImage.width + 50) * i;
      const yp = canvas.height - platImage.height - 200;
      platforms.push(new Platform(xp, yp, platImage));
    }

    // Add level goal (star) at the end of level 2 - positioned high and visible
    const goalX = (platImage.width + 50) * 6 + 150;
    const goalY = canvas.height - platImage.height - 300;
    levelGoal = new Star(goalX, goalY, starImage);
    console.log("Level 2 star created at:", goalX, goalY);
    levelEndX = goalX; // Store goal position for progress bar

    // ...existing code...
  }

  ScreenOffSet = 0;
  generic0bjects = [
    new GenericObject(-1, -1, backImage),
    new GenericObject(-1, -1, createImage(hillImg.imageUrl)),
  ];
}

// Define the speed of the player
let speed = 10;

// Update the animate function with better camera logic
function animate() {
  requestAnimationFrame(animate);

  // If game is paused (congratulation screen), only draw but don't update
  if (gamePaused) {
    // Still draw everything so it's frozen on screen
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    generic0bjects.forEach((generic0bject) => {
      generic0bject.draw();
    });

    platforms.forEach((platform) => {
      platform.draw();
    });

    walls.forEach((wall) => {
      wall.draw();
    });

    player.draw();

    if (levelGoal) {
      levelGoal.draw();
    }

    return; // Skip all game logic updates
  }

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Draw generic objects (background, etc.) FIRST
  generic0bjects.forEach((generic0bject) => {
    generic0bject.draw();
  });

  // Draw platforms SECOND
  platforms.forEach((platform) => {
    platform.draw();
  });

  // Draw walls to mark start and end
  walls.forEach((wall) => {
    wall.draw();
  });

  // Draw and update dog (before player so player is on top)

  // Draw player (on top)
  player.update();

  // Draw progress bar (always on top)
  if (levelGoal && levelEndX > 0) {
    // Calculate progress (0 to 1)
    const playerProgress = Math.min(
      Math.max((player.position.x + ScreenOffSet) / levelEndX, 0),
      1
    );

    // Progress bar dimensions
    const barWidth = 300;
    const barHeight = 20;
    const barX = canvas.width - barWidth - 20; // Top right corner
    const barY = 20;

    // Draw background (gray)
    c.fillStyle = "rgba(50, 50, 50, 0.7)";
    c.fillRect(barX, barY, barWidth, barHeight);

    // Draw progress (green)
    c.fillStyle = "rgba(0, 255, 0, 0.8)";
    c.fillRect(barX, barY, barWidth * playerProgress, barHeight);

    // Draw border
    c.strokeStyle = "white";
    c.lineWidth = 2;
    c.strokeRect(barX, barY, barWidth, barHeight);

    // Draw text
    c.fillStyle = "white";
    c.font = "14px Arial";
    c.fillText(
      `Level ${currentLevel} - ${Math.round(playerProgress * 100)}%`,
      barX,
      barY - 5
    );
  }

  // Draw level goal LAST so it's always visible on top of everything
  if (levelGoal) {
    levelGoal.draw();
  }

  let horizontalMove = false;

  // Handle JUMP first (independent of horizontal movement)
  if (keys.up.pressed && jumpKeyReleased && player.hyppyjenMaara < 2) {
    // Check if player is on ground or can double jump
    let canJump = false;

    // Check if player is on a platform
    platforms.forEach((platform) => {
      if (
        player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >=
          platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
      ) {
        canJump = true;
      }
    });

    // Allow jump if on ground OR for double jump
    if (canJump || player.hyppyjenMaara === 1) {
      jumpAudio.play();
      player.velocity.y = -20;
      player.hyppyjenMaara++;
      jumpKeyReleased = false; // Mark that jump key needs to be released
    }
  }

  // Store the intended movement direction first
  let moveRight = false;
  let moveLeft = false;

  // RIGHT movement - determine intention first
  if (keys.right.pressed) {
    moveRight = true;
    horizontalMove = true;
  }

  // LEFT movement - determine intention first
  if (keys.left.pressed) {
    moveLeft = true;
    horizontalMove = true;
  }

  // Calculate screen position - character positioned at 1/3 from left (like classic platformers)
  const screenCenter = canvas.width / 3;

  // Apply movement based on conditions
  if (moveRight && !moveLeft) {
    // Moving RIGHT only
    if (
      player.position.x + player.width < screenCenter ||
      ScreenOffSet >= 146000
    ) {
      // Player hasn't reached center+offset OR camera at limit
      player.velocity.x = speed;
      player.image = player.sprites.run.right;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;
    } else if (ScreenOffSet < 146000) {
      // Player at center+offset, move camera
      player.velocity.x = 0; // Player stays in place
      ScreenOffSet += speed;
      platforms.forEach((p) => (p.position.x -= speed));
      walls.forEach((wall) => (wall.position.x -= speed)); // Move walls with camera
      generic0bjects.forEach((generic0bject) => {
        generic0bject.position.x -= 0.8;
      });
      // Move dog with the world
      // Move level goal with the world
      if (levelGoal) {
        levelGoal.position.x -= speed;
      }
      player.image = player.sprites.run.right;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;
    }
  } else if (moveLeft && !moveRight) {
    // Moving LEFT only
    if (player.position.x > screenCenter || ScreenOffSet <= 0) {
      // Player hasn't reached center+offset OR camera at limit
      player.velocity.x = -speed;
      player.image = player.sprites.run.left;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;
    } else if (ScreenOffSet > 0) {
      // Player at center+offset, move camera
      player.velocity.x = 0; // Player stays in place
      ScreenOffSet -= speed;
      platforms.forEach((p) => (p.position.x += speed));
      walls.forEach((wall) => (wall.position.x += speed)); // Move walls with camera
      generic0bjects.forEach((generic0bject) => {
        generic0bject.position.x += 0.8;
      });
      // Move dog with the world
      // Move level goal with the world
      if (levelGoal) {
        levelGoal.position.x += speed;
      }
      player.image = player.sprites.run.left;
      player.currentCropWidth = player.sprites.run.cropWidth;
      player.width = player.sprites.run.width;
    }
  } else {
    // No horizontal movement keys pressed
    player.velocity.x = 0;
  }

  // Check for collisions with platforms (for landing)
  let onGround = false;
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      // Landing on platform
      if (player.velocity.y > 0) {
        // Only reset when falling down
        player.velocity.y = 0;
        player.position.y = platform.position.y - player.height; // Snap to platform
        player.hyppyjenMaara = 0; // Reset jump counter when on ground
        onGround = true;
      }
    }
  });

  // If no horizontal movement, set standing sprite
  if (!horizontalMove && player.velocity.x === 0) {
    // Only switch to standing if we're actually not moving
    if (Math.abs(player.velocity.x) < 0.1) {
      if (
        player.image === player.sprites.run.right ||
        (player.image === player.sprites.stand.right && !onGround)
      ) {
        player.image = player.sprites.stand.right;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
      } else if (
        player.image === player.sprites.run.left ||
        (player.image === player.sprites.stand.left && !onGround)
      ) {
        player.image = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
      }
    }
  }

  // Check for collisions with walls (block player from passing through)
  walls.forEach((wall) => {
    // Wall collision detection
    if (
      player.position.y + player.height >= wall.position.y &&
      player.position.y <= wall.position.y + wall.height &&
      player.position.x + player.width > wall.position.x &&
      player.position.x < wall.position.x + wall.width
    ) {
      // Push player out of wall
      if (player.position.x < wall.position.x + wall.width / 2) {
        // Push left
        player.position.x = wall.position.x - player.width;
      } else {
        // Push right
        player.position.x = wall.position.x + wall.width;
      }
    }
  });

  // Check if player reached the level goal
  if (levelGoal) {
    if (
      player.position.x + player.width >= levelGoal.position.x &&
      player.position.x <= levelGoal.position.x + levelGoal.width &&
      player.position.y + player.height >= levelGoal.position.y &&
      player.position.y <= levelGoal.position.y + levelGoal.height
    ) {
      // Player reached the goal!
      console.log("Level completed!");
      if (currentLevel === 1) {
        // Show congratulation screen before going to level 2
        showCongratulationScreen(1, 2);
      } else {
        // Beat the game! Show congratulation screen
        console.log("You beat the game!");
        showCongratulationScreen(2, 3); // 3 means "game complete"
      }
    }
  }

  // Restart the game if the player falls off the screen
  if (player.position.y > canvas.height) {
    console.log("lose");
    init(currentLevel); // Restart current level
  }
}

animate();

// Event listener for keydown events
addEventListener("keydown", (event) => {
  // If congratulation screen is showing, any key press continues
  if (gamePaused && congratsOverlay.classList.contains("show")) {
    hideCongratulationScreen();
    return;
  }

  switch (event.code) {
    case "KeyW":
    case "ArrowUp":
      keys.up.pressed = true;

      break;
    case "KeyA":
    case "ArrowLeft":
      footAudio.play();
      keys.left.pressed = true;
      break;
    case "KeyS":
    case "ArrowDown":
      break;
    case "KeyD":
    case "ArrowRight":
      footAudio.play();
      keys.right.pressed = true;

      break;
    default:
      break;
  }
});

addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
    case "ArrowUp":
      keys.up.pressed = false;
      jumpKeyReleased = true; // Allow next jump
      break;
    case "KeyA":
    case "ArrowLeft":
      footAudio.play();
      keys.left.pressed = false;
      if (!keys.right.pressed) {
        player.image = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
      }
      break;
    case "KeyD":
    case "ArrowRight":
      footAudio.play();
      keys.right.pressed = false;
      if (!keys.left.pressed) {
        player.image = player.sprites.stand.right;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
      }
      break;
    default:
      break;
  }
});

init();
