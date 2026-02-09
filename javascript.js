let gameInitialized = false;

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

    const gridElement = document.querySelector(".tic-tac-toe-grid");
    const cells = [];
    const statusElement = document.getElementById("game-status");
    const overlay = document.getElementById("game-overlay");
    const winnerImage = document.getElementById("winner-image");

    const playerCards = [
        document.getElementById("player-and-score-one"),
        document.getElementById("player-and-score-two")
    ];

    const highlightCells = (indices) => {
        indices.forEach(i => {
            cells[i].cell.classList.add("winning-cell");
        });
    };

    const createGrid = (handleCellClick) => {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("button");
            cell.classList.add("grid-cell");
            cell.setAttribute("aria-label", `Cell ${i + 1}`);

            const img = document.createElement("img");
            img.hidden = true;
            cell.appendChild(img);

            cell.addEventListener("click", () => handleCellClick(i));

            cells.push({ cell, img });
            gridElement.appendChild(cell);
        }
    };

    const render = (board, handleCellClick) => {
        if (cells.length === 0) {
            gridElement.innerHTML = "";
            createGrid(handleCellClick);
        }

        cells.forEach(({ cell }) => {
            cell.classList.remove("winning-cell");
        });

        board.forEach((value, index) => {
            const { img } = cells[index];

            if (!value) {
                img.src = "";
                img.alt = "";
                img.hidden = true;
                return;
            }

            img.src = value === "X" ? "./images/x-image.svg" : "./images/o-image.svg";
            img.alt = value;
            img.hidden = false;
        });
    };

    const disableBoard = () => {
        cells.forEach(({ cell }) => {
            cell.disabled = true;
        });
    };

    const enableBoard = () => {
    cells.forEach(({ cell }) => {
        cell.disabled = false;
    });
    };

    const setStatus = (message) => {
        statusElement.textContent = message;
    };

    const setActivePlayer = (playerIndex) => {
        playerCards.forEach(card => card.classList.remove("active-player"));
        playerCards[playerIndex].classList.add("active-player");
    };

    const showOverlay = (message, winnerSymbol) => {
        document.getElementById("winner-text").innerHTML = message;

        if (winnerSymbol === "X") {
            winnerImage.src = "./images/x-image.svg";
            winnerImage.alt = "X";
        } else if (winnerSymbol === "O") {
            winnerImage.src = "./images/o-image.svg";
            winnerImage.alt = "O";
        } else {
            winnerImage.src = "";
            winnerImage.alt = "";
        }

        overlay.classList.remove("hidden");
    };

    const hideOverlay = () => {
        overlay.classList.add("hidden");
    }

    const updateScore = (playerIndex, score) => {
        document.querySelectorAll(".player-score")[playerIndex].textContent = score;
    };

    return { render, highlightCells, disableBoard, enableBoard, setStatus, setActivePlayer, showOverlay, hideOverlay, updateScore };
})();

// 
const GameController = (() => {

    let players = [
        { name: "Player 1", symbol: "X", score: 0 },
        { name: "Player 2", symbol: "O", score: 0 }
    ];

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

    let currentPlayerIndex = 0;
    let startingPlayerIndex = 0;
    let gameOver = false;
    let gameNumber = 1;

    const checkWin = (board, symbol) => {
        for (const pattern of winPatterns) {
            if (pattern.every(index => board[index] === symbol)) {
                return pattern;
            }
        }
        return null;
    };


    


    const handleCellClick = (index) => {

        console.log("handleCellClick -> currentPlayerIndex:", currentPlayerIndex);
        
        const board = GameBoard.getBoard();
        const currentPlayer = players[currentPlayerIndex];
        const symbol = currentPlayer.symbol;


        if (board[index] || gameOver) return;

        GameBoard.setCell(index, symbol);

        const updatedBoard = GameBoard.getBoard();
        const winningPattern = checkWin(updatedBoard, symbol);

        DisplayController.render(updatedBoard, handleCellClick);

        // win condition
        if (winningPattern) {
            gameOver = true;
            DisplayController.highlightCells(winningPattern);
            DisplayController.disableBoard();
            currentPlayer.score = Math.min(currentPlayer.score + 1, 99);
            DisplayController.showOverlay(`${currentPlayer.name} wins!`, symbol);
            DisplayController.updateScore(currentPlayerIndex, currentPlayer.score); 
            return;
        }

        // tie condition
        if (updatedBoard.every(cell => cell !== null)) {
            gameOver = true;
            DisplayController.disableBoard();
            DisplayController.showOverlay("It's a tie!", null);
            return;
        }


        console.log("current player" + currentPlayerIndex);
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        console.log("current player" + currentPlayerIndex);


        DisplayController.setActivePlayer(currentPlayerIndex);
        
    };

    

    const start = () => {
        currentPlayerIndex = startingPlayerIndex;
        DisplayController.setActivePlayer(currentPlayerIndex);
        
        // removed  players[currentPlayerIndex] arg
        DisplayController.render(GameBoard.getBoard(), handleCellClick);
    };

    const reset = () => {

        gameOver = false;

        GameBoard.reset();

        DisplayController.render(GameBoard.getBoard(), handleCellClick);

        DisplayController.enableBoard();
        DisplayController.setStatus("");
        currentPlayerIndex = startingPlayerIndex;
        DisplayController.setActivePlayer(currentPlayerIndex);
    };

    const resetFromNewGameModal = () => {
        gameNumber = 1;
        startingPlayerIndex = 0;
        reset();
    };

    const setPlayerNames = (name1, name2) => {
        players[0].name = name1;
        players[1].name = name2;
    };

    return { start, reset, resetFromNewGameModal, setPlayerNames };
})();



// reset match button
document.getElementById("ttt-button").addEventListener("click", () => {
    const newGameModal = document.getElementById("new-game-modal");
    newGameModal.showModal();
});

// close new game modal
document.getElementById("close-modal-button").addEventListener("click", () => {
    document.getElementById("new-game-form").reset();
    document.getElementById("new-game-modal").close();
});

// submit new game modal
document.getElementById("new-game-form").addEventListener("submit", (e) => {
    e.preventDefault();

    gameInitialized = true;
    document.getElementById("close-modal-button").style.display = "inline-block";
 

    const playerOneName = document.getElementById("player-one").value.trim() || "Player 1";
    const playerTwoName = document.getElementById("player-two").value.trim() || "Player 2";

    GameController.setPlayerNames(playerOneName, playerTwoName);

    document.getElementById("player-one-name").textContent = playerOneName;
    document.getElementById("player-two-name").textContent = playerTwoName;

    document.getElementById("new-game-modal").close();
    GameController.resetFromNewGameModal();

    
    
});


document.getElementById("game-overlay").addEventListener("click", () => {
    // console.log("overlay clicked");
    // e.preventDefault();
    // e.stopPropagation();
    DisplayController.hideOverlay();
    GameController.reset();
});



// show modal on startup
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("new-game-modal").showModal();
    document.getElementById("close-modal-button").style.display = "none";
});

// start game
GameController.start();