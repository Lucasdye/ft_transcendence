
const gameId = 'test';  // Generate or fetch this ID as needed


// Example game loop (implement your Pong game logic here)
function gameLoop() {
    // context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw game elements (e.g., paddles, ball) here

    // 1 sec delay
    setTimeout(() => {
        // socket.send(JSON.stringify({ message: 'Hello, world!' }));
    }, 1000);
}

setInterval(gameLoop, 1000 / 60);
