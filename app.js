//home
const home = document.querySelector(".home");
const game = document.querySelector(".game");
const startButton = document.querySelector(".startButton");
const speed = document.querySelector("#speed");
const field = document.querySelector("#field");

//game
function start() {
    home.classList.remove("show");
    game.classList.add("show");
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    const text = document.querySelector(".text");
    const button = document.querySelector(".button");
    const againButton = button.querySelector(".againButton");
    const restartButton = button.querySelector(".restartButton");

    const initialSnakeNumber = 5;
    const snakeSize = 20;
    const snakeSpace = 5;

    const widthMultiple = parseInt(field.value);
    const heightMultiple = 20;

    const initialX = (snakeSize + snakeSpace) * Math.floor(widthMultiple / 2);
    const initialY = (snakeSize + snakeSpace) * Math.floor(heightMultiple / 2);

    const canvasWidth =
        snakeSize * widthMultiple + snakeSpace * (widthMultiple - 1);
    const canvasHeight =
        snakeSize * heightMultiple + snakeSpace * (heightMultiple - 1);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const moveTime = parseInt(speed.value);

    let snakesPosition = Array(initialSnakeNumber)
        .fill("")
        .map((_, index) => [
            initialX - (snakeSize + snakeSpace) * index,
            initialY,
        ]);
    let snakeCaneMove = false;
    let headPosition = [initialX, initialY];
    let headMove = { direction: "x", value: 1 };
    let dotPosition = randomPosition();
    let collision = false;
    let timeID;
    let startGame = true;
    let score = 0;

    // draw canvas
    function createSnake() {
        snakesPosition.map((position, index) => {
            ctx.beginPath();
            if (index == 0) {
                ctx.fillStyle = "black";
            } else {
                ctx.fillStyle = "green";
            }
            ctx.fillRect(position[0], position[1], snakeSize, snakeSize);
            ctx.closePath();
        });
    }

    function createDot(color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fillRect(dotPosition[0], dotPosition[1], snakeSize, snakeSize);
        ctx.closePath();
    }

    function draw() {
        moveSnake();
        collisionCheck();
        if (startGame) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            createSnake();
        }
        createDot("red");
        snakeCaneMove = true;
    }

    // movePosition
    function moveSnake() {
        if (headMove.direction === "x") {
            headPosition[0] += headMove.value * (snakeSize + snakeSpace);
        } else if (headMove.direction === "y") {
            headPosition[1] += headMove.value * (snakeSize + snakeSpace);
        }
        if (collision) {
            snakesPosition.unshift([...headPosition]);
            collision = false;
        } else {
            snakesPosition.pop();
            snakesPosition.unshift([...headPosition]);
        }
    }

    function randomPosition() {
        const positionX =
            Math.floor(Math.random() * widthMultiple) *
            (snakeSize + snakeSpace);
        const positionY =
            Math.floor(Math.random() * heightMultiple) *
            (snakeSize + snakeSpace);
        const isSameDot = snakesPosition.find(
            ([x, y]) => positionX === x && positionY === y
        );
        if (isSameDot) {
            return randomPosition();
        } else {
            return [positionX, positionY];
        }
    }

    function changeHeadPosition(direction, value) {
        if (headMove.direction === direction && headMove.value !== value) {
            return;
        } else {
            headMove.direction = direction;
            headMove.value = value;
        }
    }

    function changeHeadMove(e) {
        if (!snakeCaneMove) return;
        switch (e.key) {
            case "ArrowRight":
                changeHeadPosition("x", 1);
                break;
            case "ArrowLeft":
                changeHeadPosition("x", -1);
                break;
            case "ArrowUp":
                changeHeadPosition("y", -1);
                break;
            case "ArrowDown":
                changeHeadPosition("y", 1);
                break;
        }
        snakeCaneMove = false;
    }

    // collision
    function collisionCheck() {
        const [collisionSelf] = new Set(
            snakesPosition.map((target, _, selfArg) => {
                const match = selfArg.filter(
                    (position) =>
                        target[0] === position[0] && target[1] === position[1]
                );
                return match.length;
            })
        );
        //collision dot
        if (
            headPosition[0] === dotPosition[0] &&
            headPosition[1] === dotPosition[1]
        ) {
            dotPosition = randomPosition();
            collision = true;
            score += 1;
            text.textContent = `score : ${score}`;
        }
        //collision self or border
        if (
            headPosition[0] < 0 ||
            headPosition[0] > canvasWidth - snakeSize ||
            headPosition[1] < 0 ||
            headPosition[1] > canvasHeight - snakeSize ||
            collisionSelf > 1
        ) {
            stopGame();
        }
    }

    function stopGame() {
        startGame = false;
        text.textContent = "You lose!";
        button.classList.add("show");
        clearInterval(timeID);
    }

    function clearSetting() {
        button.classList.remove("show");
        snakesPosition = Array(initialSnakeNumber)
            .fill("")
            .map((_, index) => [
                initialX - (snakeSize + snakeSpace) * index,
                initialY,
            ]);
        headPosition = [initialX, initialY];
        headMove = { direction: "x", value: 1 };
        dotPosition = randomPosition();
        collision = false;
        startGame = true;
        text.textContent = "score : ";
    }

    function againGame() {
        clearSetting();
        timeID = setInterval(draw, moveTime);
    }

    function restartGame() {
        game.classList.remove("show");
        home.classList.add("show");
        clearSetting();
        window.removeEventListener("keydown", changeHeadMove);
        againButton.removeEventListener("click", againGame);
        restartButton.removeEventListener("click", restartGame);
    }

    window.addEventListener("keydown", changeHeadMove);
    againButton.addEventListener("click", againGame);
    restartButton.addEventListener("click", restartGame);
    timeID = setInterval(draw, moveTime);
}

startButton.addEventListener("click", start);
