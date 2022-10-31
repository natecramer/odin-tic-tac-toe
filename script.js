const playerFactory = (name) => {
    return { name };
}

let gameBoard = (() => {
    board = [
        0,0,0,
        0,0,0,
        0,0,0
    ];

    let gameOver = false;

    player1 = playerFactory('player1');
    player2 = playerFactory('player2');

    function playMove(playerId, cell) {
        if (board[cell] !== 0) // can't play on an already played cell
            return;
        
        board[cell] = playerId;

        displayController.update();

        evaluateBoard();

        if (!gameOver) {
            if (playerId === 1) {
                const difficulty = document.getElementById('difficuly-select').value;
                if (difficulty === 'easy')
                    playCpuMove();
                else if (difficulty === 'hard')
                    playCpuMoveSmart();
            }
            evaluateBoard();
        }
    }

    function playCpuMove() {
        // only play empty cells, so find them, pick a random one, and play
        let emptyCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0)
                emptyCells.push(i);
        }

        let r = Math.floor(Math.random() * emptyCells.length);
 
        playMove(2, emptyCells[r]);
    }

    function playCpuMoveSmart() {
        // only play empty cells, so find them, pick a random one, and play
        let emptyCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0)
                emptyCells.push(i);
        }

        // go thru and play cells, if win condition is found, play that
        // go thru again, if player win condition is found, block that
        // else play random
        for (const idx of emptyCells) {
            board[idx] = 2;
            if (checkBoardForGameOver() === "cpu") {
                board[idx] = 0;
                playMove(2, idx);
                console.log(`smart cpu: win found, playing ${idx}`);
                return;
            }
            board[idx] = 0;
        }

        for (const idx of emptyCells) {
            board[idx] = 1;
            if (checkBoardForGameOver() === "player") {
                board[idx] = 0;
                playMove(2, idx);
                console.log(`smart cpu: player win found, playing ${idx} to block`);
                done = true;
                return;
            }
            board[idx] = 0;
        }

        console.log('smart cpu: none found, playing random');
        let r = Math.floor(Math.random() * emptyCells.length);
 
        playMove(2, emptyCells[r]);
    }

    // returns number of matching adjacent, in the direction specified
    function testDir(startIdx, dirX, dirY) {
        let result = 0;
        
        const boardW = 3;

        let colTest = startIdx % boardW;
        let rowTest = Math.floor(startIdx / boardW);

        const maxNumToTest = 3
        let newIdx = startIdx;

        while (true) {
            newIdx = colTest + (rowTest * boardW);
            
            if (colTest >= boardW
                || rowTest >= boardW
                || newIdx >= board.length
                || colTest < 0
                || rowTest < 0
                || newIdx < 0
            ) {
                break;
            }
                
            if (board[newIdx] === board[startIdx]) {
                result++;
            } else {
                break;
            }
            colTest += dirX;
            rowTest += dirY;
        }

        return result;
    }

    // returns "" for not gameover, or the winner: "player" "cpu" "draw"
    function checkBoardForGameOver() {
        const boardW = 3;

        let filledCells = 0; // counter for played cells, once all cells are played and there is no win state, it's a draw

        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0)
                continue;
                
                if (testDir(i, 1, 0) >= boardW
                || testDir(i, 0, 1) >= boardW
                || testDir(i, 1, 1) >= boardW
                || testDir(i, -1, 1) >= boardW
                ) {
                    if (board[i] === 1)
                        return "player"
                    else if (board[i] === 2)
                        return "cpu"
                }

                // check for "draw"
                filledCells++;
                if (filledCells >= 9 && !gameOver) {
                    return "draw";
                }
        }
    }

    function evaluateBoard() {
        let winner = checkBoardForGameOver();
        if (winner === "player") {
            document.querySelector('#status').textContent = `That's a win`;
            gameOver = true;
        } else if (winner === "cpu") {
            document.querySelector('#status').textContent = `That's a loss`;
            gameOver = true;
        } else if (winner === "draw") {
            document.querySelector('#status').textContent = `That's a draw`;
            gameOver = true;
        }
    }

    function reset() {
        for (let i = 0; i < board.length; i++) {
            board[i] = 0;
            gameOver = false;
            document.querySelector('#status').textContent = `-`;
        }
    }

    function getGameOver() { return gameOver};

    return {board, getGameOver, playMove, reset};
})();

const displayController = (() => {
    update = () => {
        let i = 0;
        document.querySelectorAll('.cellButton').forEach( elem => {
            if (gameBoard.board[i] === 0) {
                elem.textContent = '';
                elem.classList.remove('o');
                elem.classList.remove('x');
            } else if (gameBoard.board[i] === 1) {
                elem.textContent = 'O';
                elem.classList.add('o');
                elem.classList.remove('x');
            } else if (gameBoard.board[i] === 2) {
                elem.textContent = 'X';
                elem.classList.add('x');
                elem.classList.remove('o');
            }
            
            i++;
        });
    };

    return { update };
})();

// attach event listeners to all buttons
document.querySelectorAll('.cellButton').forEach( elem => {
    elem.addEventListener('click', event => {
        if (gameBoard.getGameOver()) return;

        let cellid = -1;
        if (elem.id === 'cellButton0') cellid = 0;
        if (elem.id === 'cellButton1') cellid = 1;
        if (elem.id === 'cellButton2') cellid = 2;
        if (elem.id === 'cellButton3') cellid = 3;
        if (elem.id === 'cellButton4') cellid = 4;
        if (elem.id === 'cellButton5') cellid = 5;
        if (elem.id === 'cellButton6') cellid = 6;
        if (elem.id === 'cellButton7') cellid = 7;
        if (elem.id === 'cellButton8') cellid = 8;

        if (cellid === -1) 
            return;

        gameBoard.playMove(1, cellid);
    });
});

// reset button
document.querySelector('#resetButton').addEventListener('click', e => {
    gameBoard.reset();
    displayController.update();
});

// difficulty selector
document.querySelector('#difficuly-select').addEventListener