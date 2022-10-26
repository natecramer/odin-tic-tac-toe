const playerFactory = (name) => {
    return { name };
}

let gameBoard = (() => {
    board = [
        0,0,0,
        0,0,0,
        0,0,0
    ];

    player1 = playerFactory('player1');
    player2 = playerFactory('player2');

    function playMove(playerId, cell) {
        if (board[cell] !== 0) // can't play on an already played cell
            return;
        
        board[cell] = playerId;

        displayController.updateBoard();

        if (playerId === 1) {
            playCpuMove();
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

    return {board, playMove};
})();

const displayController = (() => {
    updateBoard = () => {
        let i = 0;
        document.querySelectorAll('.cellButton').forEach( elem => {
            if (gameBoard.board[i] === 0)
                elem.textContent = '';
            else if (gameBoard.board[i] === 1)
                elem.textContent = 'O';
                else if (gameBoard.board[i] === 2)
                elem.textContent = 'X';
            
            i++;
        });
    };

    return { updateBoard };
})();

document.querySelectorAll('.cellButton').forEach( elem => {
    elem.addEventListener('click', event => {
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
        
        console.log(`click ${elem.id}`);

        if (cellid === -1) 
            return;

        gameBoard.playMove(1, cellid);
    });
});