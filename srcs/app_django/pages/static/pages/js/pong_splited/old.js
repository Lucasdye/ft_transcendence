document.addEventListener('DOMContentLoaded', (event) => {
  const canvas = document.getElementById("pongCanvas");
  const ballStyle = document.getElementById("ballStyle");
  const ballSpeed = document.getElementById("ballSpeed");
  const score_P1 = document.getElementById("score_P1");
  const score_P2 = document.getElementById("score_P2");
  const ctx = canvas.getContext("2d");

  document.getElementById("ModeButton").addEventListener("click", (event) => {
      if (gameMode == 1)
          gameMode = 0;
      else
          gameMode = 1;

      resetBall();
      player1Paddle.score_P1 = 0;
      player2Paddle.score_P2 = 0;
  });

  document.getElementById("settingsButton").addEventListener("click", (event) => {
      if (pause == 0)
          pause = 1;
      else {
          pause = 0;
          gameLoop();
      }
  });

  const paddleWidth = 20;
  const paddleHeight = 200;
  const ballRadius = 10;

  let upArrowPressed = false;
  let downArrowPressed = false;
  let wPressed = false;
  let sPressed = false;

  let hue = 0;

  let gameMode = 0;
  let pause = 0;
  let winner = 0;

  const paddleSpeed = 8;
  let player1Paddle = {
      score_P1: 0,
      x: 0,
      y: canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 0,
      phi: 0.6,
  };

  let player2Paddle = {
      score_P2: 0,
      x: canvas.width - paddleWidth,
      y: canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 4,
      phi: 0.6,
  };

  let ball = {
      speedVector: {
          dx: 5 + (Math.random() * (2 + 2) - 2),
          dy: 5 + (Math.random() * (2 + 2) - 2),
      },
      positionVector: {
          x: canvas.width / 2,
          y: canvas.height / 2,
      },
      nextBounce: {
          x: 0,
          y: 0,
      },
      trajectory: {
          a: 0,
          b: 0,
          c: 0,
          g: 0.1,
      },
      phi: 0.4,
      radius: ballRadius,
  };

  function drawPaddle(x, y, width, height) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, y, width, height);
  }

  function getNextColor(hue) {
      hue = (hue + 1) % 360;
      return hue;
  }

  function drawBallTraj(x, y) {
      x2 = x;
      y2 = y;
      if (ball.speedVector.dx > 0) {
          while (x2 < 1180 && (y2 > 0 && y2 < 600)) {
              x2 += ball.speedVector.dx / 20;
              y2 += ball.speedVector.dy / 20;
          }
      } else {
          while (x2 > 20 && (y2 > 0 && y2 < 600)) {
              x2 += ball.speedVector.dx / 200;
              y2 += ball.speedVector.dy / 200;
          }
      }
      ball.nextBounce.x = x2;
      ball.nextBounce.y = y2;
  }

  function drawBall(x, y, radius) {
      hue = getNextColor(hue);
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
  }

  function drawField() {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
  }

  function update() {
      if (wPressed && player1Paddle.y > 0)
          player1Paddle.y -= paddleSpeed;
      else if (sPressed && (player1Paddle.y < canvas.height - paddleHeight))
          player1Paddle.y += paddleSpeed;

      if (gameMode == 0) {
          player2Paddle.y += player2Paddle.dy;
          if (player2Paddle.y <= 0 || player2Paddle.y + paddleHeight >= canvas.height)
              player2Paddle.dy *= -1;
      } else {
          if (upArrowPressed && player2Paddle.y > 0)
              player2Paddle.y -= paddleSpeed;
          else if (downArrowPressed && player2Paddle.y < canvas.height - paddleHeight)
              player2Paddle.y += paddleSpeed;
      }

      ball.positionVector.x += ball.speedVector.dx;
      ball.positionVector.y += ball.speedVector.dy;

      if (ball.positionVector.y + ball.radius >= canvas.height || ball.positionVector.y - ball.radius <= 0)
          ball.speedVector.dy *= -1;

      if (ball.positionVector.x - ball.radius <= player1Paddle.x + paddleWidth && ball.positionVector.y >= player1Paddle.y && ball.positionVector.y <= player1Paddle.y + paddleHeight) {
          ball.speedVector.dx -= 0.6;
          ball.speedVector.dx *= -1;
      }
      if (ball.positionVector.x + ball.radius >= player2Paddle.x && ball.positionVector.y >= player2Paddle.y && ball.positionVector.y <= player2Paddle.y + paddleHeight) {
          ball.speedVector.dx += 0.6;
          ball.speedVector.dx *= -1;
      }

      ballSpeed.textContent = Math.abs((Math.round(ball.speedVector.dx * 100) / 100));

      if (ball.positionVector.x <= 0) {
          if ((ball.nextBounce.x <= 20) && (ball.nextBounce.y <= player1Paddle.y && ball.nextBounce.y >= player1Paddle.y + paddleHeight)) {
              ball.positionVector.x = 100;
              ball.speedVector.dx += 0.6;
              if (ball.speedVector.dx < 0)
                  ball.speedVector.dx *= -1;
              pause = 1;
          } else {
              player2Paddle.score_P2 += 1;
              score_P2.textContent = player2Paddle.score_P2;
              resetBall(1);
          }
      } else if (ball.positionVector.x >= canvas.width) {
          if ((ball.nextBounce.x >= 1180) && (ball.nextBounce.y >= player2Paddle.y && ball.nextBounce.y <= player2Paddle.y + player1Paddle.height)) {
              ball.positionVector.x = 1100;
              ball.speedVector.dx -= 0.6;
              if (ball.speedVector.dx > 0)
                  ball.speedVector.dx *= -1;
          } else {
              player1Paddle.score_P1 += 1;
              score_P1.textContent = player1Paddle.score_P1;
              resetBall(2);
          }
      }
  }

  function resetBall(x) {
      ball.positionVector.x = canvas.width / 2;
      ball.positionVector.y = canvas.height / 2;
      ball.speedVector.dx = 5 + (Math.random() * (2 + 2) - 2);
      ball.speedVector.dy = 5 + (Math.random() * (2 + 2) - 2);
      if (x == 2)
          ball.speedVector.dx *= -1;
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawField();
      drawPaddle(player1Paddle.x, player1Paddle.y, player1Paddle.width, player1Paddle.height);
      drawPaddle(player2Paddle.x, player2Paddle.y, player2Paddle.width, player2Paddle.height);
      drawBall(ball.positionVector.x, ball.positionVector.y, ball.radius);
      drawBallTraj(ball.positionVector.x, ball.positionVector.y);
  }

  function gameLoop() {
      score_P2.textContent = player2Paddle.score_P2;
      score_P1.textContent = player1Paddle.score_P1;
      if (pause == false && (player1Paddle.score_P1 < 3 && player2Paddle.score_P2 < 3)) {
          update();
          draw();
          requestAnimationFrame(gameLoop);
      }
      if (player1Paddle.score_P1 == 3)
          winner = 1;
      else if (player2Paddle.score_P2 == 3)
          winner = 2;
      if (winner == 1) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.font = "48px serif";
          ctx.fillText("Player 1 win", 10, 50);
          return;
      }
      if (winner == 2) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.font = "48px serif";
          ctx.fillText("Player 2 win", 10, 50);
          return;
      }
  }

  document.addEventListener("keydown", (event) => {
      if (event.key == "ArrowUp")
          upArrowPressed = true;
      else if (event.key == "ArrowDown")
          downArrowPressed = true;
      if (event.key == "w")
          wPressed = true;
      else if (event.key == "s")
          sPressed = true;
  });

  document.addEventListener("keyup", (event) => {
      if (event.key == "ArrowUp")
          upArrowPressed = false;
      else if (event.key == "ArrowDown")
          downArrowPressed = false;
      if (event.key == "w")
          wPressed = false;
      if (event.key == "s")
          sPressed = false;
  });

  gameLoop();
});
