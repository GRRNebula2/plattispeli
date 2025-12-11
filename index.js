/*
1. Hypyn korjaus
rajalliset elämät
lisäelämä ylemmältä tasolta
 */

// Define image objects with their URLs and alternative texts
const assets = {
    images: {
        platform: {
             imageUrl: "./platform.png", // URL of the platform image
             altText: "Description of the image" // Alt text for accessibility
        },

        background: {
             imageUrl: "./background.png", // URL of the background image
             altText: "Description of the image" // Alt text for accessibility
        },

        smallPlat: {
             imageUrl: "./platformSmallTall.png", // URL of the small platform image
             altText: "Description of the image" // Alt text for accessibility
        },

        leveliLapi: {
             imageUrl: "/level2/level1passed.png",
             altText: "level yks passed"
        },

        runRight: {
             imageUrl: "./spriteRunRight.png", // URL of the running right sprite
             altText: "Description of the image" // Alt text for accessibility
        },

        runLeft: {
             imageUrl: "./spriteRunLeft.png", // URL of the running left sprite
             altText: "Description of the image" // Alt text for accessibility
        },

        standRight: {
             imageUrl: "./spriteStandRight.png", // URL of the standing right sprite
             altText: "Description of the image" // Alt text for accessibility
        },

        standLeft: {
             imageUrl: "./spriteStandLeft.png", // URL of the standing left sprite
             altText: "Description of the image" // Alt text for accessibility
        },

        hill: {
             imageUrl: "./hills.png", // URL of the hills image
             altText: "Description of the image" // Alt text for accessibility
        }
    },

    // Get the audio elements from the DOM
    audio: {
        start: document.getElementById("start"),
        foot: document.getElementById("footAudio"),
        jump: document.getElementById("jumpAudio")
    }
};

// Function to create an image object
function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
}

// Player class definition
class Player {
    constructor() {
        // Initialize player position and velocity
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 40 };
        this.jumpCount = 0;

        // Define player dimensions
        this.width = 65;
        this.height = 150;

        // Define player sprites for standing and running
        this.sprites = {
            stand: {
                right: createImage(assets.images.standRight.imageUrl),
                left: createImage(assets.images.standLeft.imageUrl),
                cropWidth: 177,
                width: 66,
                frameCount: 60
            },
            run: {
                right: createImage(assets.images.runRight.imageUrl),
                left: createImage(assets.images.runLeft.imageUrl),
                cropWidth: 341,
                width: 127.875,
                frameCount: 30
            }
        };

        // Set the initial image and frame for the player
        this.currentSprite = this.sprites.stand;
        this.facing = "right";
        this.frame = 0;
    }

    setSprite(sprite, facing) {
        const newSprite = this.sprites[sprite];
        if (newSprite !== this.currentSprite || facing != this.facing) {
            this.frame = 0;
        }
        this.currentSprite = newSprite;
        this.facing = facing;
        this.width = this.currentSprite.width;
    }

    // Draw the player on the canvas
    draw(ctx, screenOffset) {
        ctx.drawImage(
            this.currentSprite[this.facing],
            this.currentSprite.cropWidth * this.frame,
            0,
            this.currentSprite.cropWidth,
            400,
            this.position.x - screenOffset.x,
            this.position.y - screenOffset.y,
            this.width,
            this.height
        );
    }

    // Update the player position and animation frame
    update(game) {
        this.frame++;

        // Reset frame when the end of the animation is reached
        if (this.frame >= this.currentSprite.frameCount) {
            this.frame = 0;
        }

        // Update player position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Apply gravity if the player is above the bottom of the canvas
        if (this.position.y + this.height + this.velocity.y <= game.canvas.height) {
            this.velocity.y += game.gravity;
        }
    }
}

// Platform class definition
class Platform {
    constructor(x, y, image) {
        this.position = { x: x, y: y };
        this.width = image.width;
        this.height = image.height;
        this.image = image;
    }

    // Draw the platform on the canvas
    draw(ctx, screenOffset) {
        ctx.drawImage(this.image, this.position.x - screenOffset.x, this.position.y - screenOffset.y);
    }
}

// GenericObject class for background and other static images
class GenericObject {
    constructor(x, y, image) {
        this.position = { x: x, y: y };
        this.image = image;
        this.parallax = 0.8;
    }

    // Draw the generic object on the canvas
    draw(ctx, screenOffset) {
        ctx.drawImage(this.image, this.position.x - screenOffset.x * this.parallax, this.position.y - screenOffset.y);
    }
}

// Main class for the game
class Game {
    constructor() {
        // Select the canvas element and set its dimensions
        this.canvas = document.querySelector("canvas");
        this.canvas.width = 1024;
        this.canvas.height = 576;

        // Get the 2D drawing context for the canvas
        this.ctx = this.canvas.getContext("2d");

        // Set the strength of gravity
        this.gravity = 1;

        // Define the speed of the player
        this.speed = 10;

        // Placeholders for game objects (will be filled in by init_level)
        this.player = null;
        this.platforms = [];
        this.genericObjects = [];
        this.levelWidth = 1024;

        // Offset of the screen in the game world
        this.screenOffset = { x: 0, y: 0 };

        // Key state for user input
        this.keys = {
            up: { pressed: false },
            right: { pressed: false },
            left: { pressed: false }
        };
    }

    // Initialize function to set up the game state
    init() {
        assets.audio.start.play();

        let platImage = createImage(assets.images.platform.imageUrl);
        let backImage = createImage(assets.images.background.imageUrl);
        let hillImage = createImage(assets.images.hill.imageUrl);

        this.player = new Player();
        this.platforms = [];
        this.genericObjects = [];

        // Add platforms to the platforms array
        for (let i = 0; i < 3; i++) {
            const xp = (platImage.width - 2) * i;
            const yp = this.canvas.height - platImage.height;
            this.platforms.push(new Platform(xp, yp, platImage));
            console.log("making");
        }

        for (let i = 0; i < 5; i++) {
            const xp = (800 - 2) * i;
            const yp = this.canvas.height - platImage.height;
            this.platforms.push(new Platform(xp, yp, platImage));
            console.log("making");
        }
        for (let i = 0; i < 6; i++) {
            const xp = (1000 - 2) * i + (800*5);
            const yp = this.canvas.height - platImage.height;
            this.platforms.push(new Platform(xp, yp, platImage));
            console.log("making");
        }

        for (let i = 2; i < 3; i++) {
            const xp = (platImage.width + 20) * i;
            const yp = this.canvas.height - (2 * platImage.height);
            this.platforms.push(new Platform(xp, yp, platImage));
            console.log("making");
        }

        for (let i = 10; i < 11; i++) {
            const xp = (platImage.width - 30) * i;
            const yp = this.canvas.height - (2 * platImage.height);
            this.platforms.push(new Platform(xp, yp, platImage));
            console.log("making");
        }

        // Initialize screen offset and generic objects
        this.screenOffset.x = 0;
        this.screenOffset.y = 0;
        this.genericObjects.push(new GenericObject(0, 0, backImage));
        this.genericObjects.push(new GenericObject(0, 0, hillImage));

        // Set the width of the level
        this.levelWidth = 9600;
    }

    // Animation loop to update and draw the game state
    animate() {
        const _this = this;
        requestAnimationFrame(() => _this.animate());

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Process player input
        if (this.keys.right.pressed && this.player.position.x + this.player.width < this.levelWidth) {
            footAudio.play();
            this.player.velocity.x = this.speed;
            this.player.setSprite("run", "right");
        } else if (this.keys.left.pressed && this.player.position.x > 10) {
            footAudio.play();
            this.player.velocity.x = -this.speed;
            this.player.setSprite("run", "left");
        } else {
            this.player.velocity.x = 0;
            this.player.setSprite("stand", this.player.facing);
        }

        if (this.keys.up.pressed) {
            if (this.player.jumpCount < 1) {
                assets.audio.jump.play();
                this.player.velocity.y = -20;
                this.player.jumpCount++;
            }
        }

        // Check for collision with platforms
        for (const platform of this.platforms) {
            if (
                this.player.position.y + this.player.height <= platform.position.y &&
                this.player.position.y + this.player.height + this.player.velocity.y >= platform.position.y &&
                this.player.position.x + this.player.width >= platform.position.x &&
                this.player.position.x <= platform.position.x + platform.width
            ) {
                this.player.velocity.y = 0;
                this.player.jumpCount = 0;
            }
        }

        this.player.update(this);

        // Keep the player on the screen
        this.screenOffset.x = Math.max(Math.min(this.player.position.x - 400, this.levelWidth - this.canvas.width), 0);

        // Draw generic objects (background, etc.)
        for (const genericObject of this.genericObjects) {
            genericObject.draw(this.ctx, this.screenOffset);
        }

        // Draw platforms
        for (const platform of this.platforms) {
            platform.draw(this.ctx, this.screenOffset);
        }

        // Draw the player
        this.player.draw(this.ctx, this.screenOffset);

        // Restart the game if the player falls off the screen
        if (this.player.position.y > this.canvas.height) {
            console.log("lose");
            this.init();
        }
    }

    keyEvent(code, isPress) {
        switch (code) {
        case "KeyW":
        case "ArrowUp":
            this.keys.up.pressed = isPress;
            break;
        case "KeyA":
        case "ArrowLeft":
            this.keys.left.pressed = isPress;
            break;
        case "KeyS":
        case "ArrowDown":
            break;
        case "KeyD":
        case "ArrowRight":
            this.keys.right.pressed = isPress;
            break;
        default:
            break;
        }
    }
}

const game = new Game();

// Event listener for keydown events
addEventListener("keydown", event => game.keyEvent(event.code, true));

// Event listener for keyup events
addEventListener("keyup", event => game.keyEvent(event.code, false));

game.init();
game.animate();
