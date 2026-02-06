const GameBoard = (() => {

    const board = Array(9).fill(null);

    const setCell = (index, value) => {
        if (!board[index]) board[index] = value;
    };

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    };

    const getBoard = () => [...board];

    return { setCell, reset, getBoard };

})();

const DisplayController = (() => {
    const grid = document.querySelector(".tic-tac-toe-grid");
    const cells = [];

    const highlightCells = (indices) => {
        indices.forEach(i => {
            cells[i].cell.classList.add("winning-cell");
        });
    };

    const createGrid = (handleCellClick) => {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("button");
            cell.classList.add("grid-cell");

            const img = document.createElement("img");
            img.hidden = true;
            cell.appendChild(img);

            cell.addEventListener("click", () => handleCellClick(i));

            cells.push({ cell, img });
            grid.appendChild(cell);
        }
    };

    const render = (board, handleCellClick) => {
        if (cells.length === 0) {
            createGrid(handleCellClick);
        }

        cells.forEach(({ cell }) => {
            cell.classList.remove("winning-cell");
        });

        board.forEach((value, index) => {
            const { img } = cells[index];

            if (!value) {
                img.hidden = true;
                return;
            }

            img.src =
                value === "X" ? "./images/x-image.svg" : "./images/o-image.svg";
            img.alt = value;
            img.hidden = false;
        });
    };

    return { render, highlightCells };
})();


const GameController = (() => {

    let players = [
        { name: "Player 1", symbol: "X" },
        { name: "Player 2", symbol: "O" }
    ];

    let currentPlayerIndex = 0;

    const winPatterns = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    const checkWin = (board, symbol) => {
        for (const pattern of winPatterns) {
            if (pattern.every(index => board[index] === symbol)) {
                return pattern;
            }
        }
        return null;
    };

    const start = () => {
        DisplayController.render(GameBoard.getBoard(), handleCellClick, players[currentPlayerIndex]);
    };

    const handleCellClick = (index) => {

        
        const board = GameBoard.getBoard();
        const currentPlayer = players[currentPlayerIndex];
        const symbol = currentPlayer.symbol;

        if (board[index]) return;

        GameBoard.setCell(index, symbol);

        const updatedBoard = GameBoard.getBoard();
        const winningPattern = checkWin(updatedBoard, symbol);

        DisplayController.render(updatedBoard, handleCellClick);

        if (winningPattern) {
            DisplayController.highlightCells(winningPattern);
            return;
            // setTimeout(() => {
            //     alert(`${currentPlayer.name} wins!`);
            // }, 50);
        }

        if (!winningPattern && updatedBoard.every(cell => cell !== null)) {
        setTimeout(() => {
            alert("It's a tie!");
        }, 50);
        return;
    }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        
    };

    const reset = () => {
        GameBoard.reset();
        currentPlayerIndex = 0;
        DisplayController.render(GameBoard.getBoard(), handleCellClick, players[currentPlayerIndex]);
    };

    return { start, reset };
})();



document.getElementById("ttt-button").addEventListener("click", () => {
    const newGameModal = document.getElementById("new-game-modal");
    newGameModal.showModal();
});

document.getElementById("close-modal-button").addEventListener("click", () => {
    document.getElementById("new-game-form").reset();
    document.getElementById("new-game-modal").close();
});

document.getElementById("new-game-form").addEventListener("submit", (e) => {
    e.preventDefault();
    GameController.reset();
    document.getElementById("new-game-modal").close();
});

// show modal on startup
// window.addEventListener("DOMContentLoaded", () => {
//     document.getElementById("new-game-modal").showModal();
// });



GameController.start();