document.addEventListener('DOMContentLoaded', ()=>{
    
    //main vars
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));

    const width = 10;
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-pause');
    let nextRandom = 0;
    let timerId;
    let score = 0;

    //Tetris tiles
    const lTetromino = [
        [1, width+1,width*2+1,2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [width*2, width+1, width*2+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width+1, width*2+1, width+2],
        [0, width, width+1, width*2+1]
    ];
    
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const theTetrominos = [
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino
    ];

    let currentPosition = 4;
    let currentRotation = 0;

    //random positioning
    let random = Math.floor(Math.random()*theTetrominos.length);

    let current = theTetrominos[random][currentRotation];


    //draw the tetromino

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        });
    }

    //undraw the tetromino

    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        })
    }

    //make move down every second

    // timerId = setInterval(moveDown, 1000);

    //move down function

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //keyboard contols
    function control(e){
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control);

    //freezing

    function freeze() {
        if(current.some(index =>
            squares[currentPosition + index + width].classList.contains('taken')
        )) {
            current.forEach(index => 
                squares[currentPosition + index].classList.add('taken')
            )
            //starting new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominos.length);
            current = theTetrominos[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    //move left function with edge stoping

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index)%width===0)
        if (!isAtLeftEdge) {currentPosition -= 1};

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1;
        };

        draw();
    }


    //move right function edge edge stopping


    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);
        if (!isAtRightEdge) {currentPosition += 1};
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1;
        }
        draw();
    }

    //rotating tetrominos

    function rotate(){
        undraw();
        currentRotation++;
        if (currentRotation === current.length){
            currentRotation = 0;
        }
        current = theTetrominos[random][currentRotation];
        draw();
    }


    //showing up next tetromino in the mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;
    

    //Tetramino without rotation
    const upNextTetrominoes = [
        [1, displayWidth+1,displayWidth*2+1,2], //lTetraminno
        [displayWidth*2, displayWidth+1, displayWidth*2+1, displayWidth+2], //zTetramino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetramino
        [0, 1, displayWidth, displayWidth+1], //oTetramino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetramino

    ];
    //dipslaing on mini-grid
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        })
    }
//start and pause
    startBtn.addEventListener('click', ()=> {
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominos.length);    
            displayShape();
        }
    })
// add score

    function addScore() {
        for (let i=0; i<199; i++) {
            let row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

        //game over

    function gameOver() {
        if(current.some(index => squares[currentPosition +index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }





})