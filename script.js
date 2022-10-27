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
                playCpuMove();
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

    function evaluateBoard() {
        const boardW = 3;

        let filledCells = 0;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0)
                continue;
                
                if (testDir(i, 1, 0) >= boardW
                || testDir(i, 0, 1) >= boardW
                || testDir(i, 1, 1) >= boardW
                || testDir(i, -1, 1) >= boardW
                ) {
                    let s;
                    if (board[i] === 1)
                        s = 'win';
                    else if (board[i] === 2)
                        s = 'loss';
                    document.querySelector('#status').textContent = `That's a ${s}`;
                    console.log(`That's a ${s}`);
                    gameOver = true;
                }

                // check for "draw"
                filledCells++;
                if (filledCells >= 9 && !gameOver) {
                    document.querySelector('#status').textContent = `That's a draw`;
                    console.log(`That's a draw`);
                    gameOver = true;
                }
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