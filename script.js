const playerFactory = (name) => {
    return { name };
}

let gameBoard = (() => {
    score = [];

    player1 = playerFactory('player1');
    player2 = playerFactory('player2');

    turn = 1; // 1 for player1, 2 for player2

    addToScore = (num) => {
        score.push(num);
    };

    printScore = () => console.log(score);

    return {score, addToScore, printScore};
})();

gameBoard.addToScore(5);
gameBoard.addToScore(10);

gameBoard.printScore();

document.querySelectorAll('.cellButton').forEach( elem => {
    elem.textContent = 'O';
    elem.addEventListener('click', event => elem.textContent = 'X');
});