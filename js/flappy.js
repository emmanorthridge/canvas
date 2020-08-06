const myObstacles = [];

// Game Area
const myGameArea = {
  canvas: document.createElement("canvas"),
  frames: 0,
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    // call updateGameArea() every 20 milliseconds
    this.interval = setInterval(updateGameArea, 20);
  },

  // clear canvas
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  stop: function () {
    clearInterval(this.interval);
  },

  score: function () {
    const points = Math.floor(this.frames / 5);
    this.context.font = "18px serif";
    this.context.fillStyle = "black";
    this.context.fillText(`Score: ${points}`, 350, 50);
  },
};

// Component class
class Component {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;

    // speed properties
    this.speedX = 0;
    this.speedY = 0;
  }

  // newPos()
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  update() {
    const ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
}

// New player
const flappyBox = new Component(30, 30, "red", 0, 110);

function updateGameArea() {
  myGameArea.clear();
  flappyBox.newPos();
  flappyBox.update();
  updateObstacles();
  checkGameOver();
  myGameArea.score();
}

myGameArea.start();

document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 38: // up arrow
      flappyBox.speedY -= 1;
      break;
    case 40: // down arrow
      flappyBox.speedY += 1;
      break;
    case 37: // left arrow
      flappyBox.speedX -= 1;
      break;
    case 39: // right arrow
      flappyBox.speedX += 1;
      break;
  }
});

document.addEventListener("keyup", () => {
  flappyBox.speedX = 0;
  flappyBox.speedY = 0;
});

function updateObstacles() {
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }

  myGameArea.frames += 1;

  if (myGameArea.frames % 120 === 0) {
    let x = myGameArea.canvas.width;
    let minHeight = 20;
    let maxHeight = 200;
    let height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    let minGap = 50;
    let maxGap = 200;
    let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObstacles.push(new Component(10, height, "green", x, 0));
    myObstacles.push(
      new Component(10, x - height - gap, "green", x, height + gap)
    );
  }
}

function checkGameOver() {
  const crashed = myObstacles.some((obstacle) => flappyBox.crashWith(obstacle));

  if (crashed) {
    myGameArea.stop();
  }
}
