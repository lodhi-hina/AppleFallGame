const basket = document.getElementById('basket');
const apple = document.querySelector('.apple');
const game = document.getElementById('game');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('message');
const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const exitButton = document.getElementById('exit');
const catchSound = new Audio('catch.mp3'); // Add this line
const uncatchSound = new Audio('uncatch.mp3');


let basketX = game.clientWidth / 2 - basket.clientWidth / 2;
let appleX = Math.random() * (game.clientWidth - 30);
let appleY = -30;
let score = 0;
let appleSpeed = 6;  // Start with a reasonable initial speed
let missedApples = 0;
let totalApples = 0;
let gameInterval;
let gameStarted = false;
let gamePaused = false;


function setAppleSpeed() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) { // Small devices
        appleSpeed = 3; // Slower speed for small devices
    } else if (screenWidth <= 768) { // Medium devices
        appleSpeed = 5; // Moderate speed for medium devices
    } else { // Large devices
        appleSpeed = 6; // Default speed for large devices
    }
}

function startGame() {
    if (!gameStarted) {
        setAppleSpeed();
        gameStarted = true;
        missedApples = 0;
        score = 0;
        totalApples = 0;
        appleY = -30;
        appleX = Math.random() * (game.clientWidth - 30);
        apple.style.left = `${appleX}px`;
        scoreElement.textContent = `Score: ${score}`;
        messageElement.textContent = '';
        document.addEventListener('mousemove', updateBasketPosition);
        gameInterval = setInterval(moveApple, 20);
    }
}

function stopGame(message) {
    gameStarted = false;
    clearInterval(gameInterval);
    document.removeEventListener('mousemove', updateBasketPosition);
    messageElement.textContent = message;
}

function resetGame() {
    stopGame('Game reset.');
    startGame();
}

function exitGame() {
    stopGame('Game over');
}

function moveApple() {
    appleY += appleSpeed;
    if (appleY > game.clientHeight) {
        appleY = -30;
        appleX = Math.random() * (game.clientWidth - 30);
        apple.style.left = `${appleX}px`;
        missedApples++;
        totalApples++;
        uncatchSound.play();
        if (missedApples >= 3) {
            stopGame(`Game over: Missed 3 apples! Score: ${score}`);
        }
        if (totalApples >= 50) {
            stopGame(`Game over: 50 apples fallen! Score: ${score}`);
        }
    }
    apple.style.top = `${appleY}px`;
    checkCollision();
}

function checkCollision() {
    const basketRect = basket.getBoundingClientRect();
    const appleRect = apple.getBoundingClientRect();

    if (appleRect.bottom >= basketRect.top &&
        appleRect.right >= basketRect.left &&
        appleRect.left <= basketRect.right) {
        catchSound.play(); // Add this line to play the sound effect
        score++;
        appleY = -30;
        appleX = Math.random() * (game.clientWidth - 30);
        apple.style.left = `${appleX}px`;
        missedApples = 0;
        totalApples++;
        // Increase speed when score is a multiple of 3
        if (score % 5 === 0) {
            appleSpeed *= 1.2;
        }
        scoreElement.textContent = `Score: ${score}`;
        if (totalApples >= 50) {
            stopGame(`Game over: 50 apples fallen! Score: ${score}`);
        }
    }
}

function updateBasketPosition(event) {
    if (gameStarted) {
        basketX = event.clientX - basket.clientWidth / 2;
        if (basketX < 0) basketX = 0;
        if (basketX > game.clientWidth - basket.clientWidth) basketX = game.clientWidth - basket.clientWidth / 2;
        basket.style.left = `${basketX}px`;
    }
}

// Call setAppleSpeed when the window is resized to adjust speed dynamically
window.addEventListener('resize', setAppleSpeed);

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', resetGame);
exitButton.addEventListener('click', exitGame);

