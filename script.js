const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;

let snake, direction, food, score, game, isPaused = false;

const colorSequence = ["#00ff00","#00ccff","#ff00ff","#ffcc00","#ff6600"];
let colorIndex = 0;

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

function initGame() {
  snake = [{ x:200, y:200, color:"#00ff00" }];
  direction = "RIGHT";
  food = {
    x:Math.floor(Math.random()*20)*box,
    y:Math.floor(Math.random()*20)*box
  };
  score = 0;
  document.getElementById("score").innerText = score;

  colorIndex = 0;

  if(game) clearInterval(game);
  isPaused = false;

  game = setInterval(draw, 400);
}

startBtn.addEventListener("click", () => {
  if(!game) initGame();
});

pauseBtn.addEventListener("click", () => {
  if(isPaused){
    game = setInterval(draw,400);
    isPaused = false;
    pauseBtn.innerText = "Pause Game";
  } else {
    clearInterval(game);
    isPaused = true;
    pauseBtn.innerText = "Resume Game";
  }
});

restartBtn.addEventListener("click", initGame);

document.addEventListener("keydown", e => {
  if(e.key==="ArrowUp"&&direction!=="DOWN") direction="UP";
  else if(e.key==="ArrowDown"&&direction!=="UP") direction="DOWN";
  else if(e.key==="ArrowLeft"&&direction!=="RIGHT") direction="LEFT";
  else if(e.key==="ArrowRight"&&direction!=="LEFT") direction="RIGHT";
});

function draw(){
  if(isPaused) return;

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,400,400);

  // draw snake
  for(let seg of snake){
    ctx.fillStyle = seg.color;
    ctx.fillRect(seg.x,seg.y,box,box);
  }

  // draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x,food.y,box,box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if(direction==="UP") headY -= box;
  if(direction==="DOWN") headY += box;
  if(direction==="LEFT") headX -= box;
  if(direction==="RIGHT") headX += box;

  // keep same color while moving
  const newHead = {
    x: headX,
    y: headY,
    color: snake[0].color
  };

  // collision
  if(
    headX<0||headY<0||headX>=400||headY>=400||
    snake.some(s=>s.x===headX&&s.y===headY)
  ){
    clearInterval(game);
    game = null;
    alert("Game Over! Score: " + score);
    return;
  }

  // food eaten
  if(headX===food.x && headY===food.y){
    score++;
    document.getElementById("score").innerText = score;

    food = {
      x:Math.floor(Math.random()*20)*box,
      y:Math.floor(Math.random()*20)*box
    };

    // increase color index
    colorIndex++;

    // assign NEW color only to this segment
    newHead.color = colorSequence[colorIndex % colorSequence.length];

  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}