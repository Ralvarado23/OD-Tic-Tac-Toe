/********************/
/**** START MENU ****/
/********************/

const buttonPvP = document.getElementById('buttonPvP')
const buttonPvAI = document.getElementById('buttonPvAI')

buttonPvP.onclick = () => {
    startGame()
}

/***************/
/*** PLAYER ***/
/***************/

const playerFactory = (mark, type) => {
    let gamesWon = 0
    const addGameWon = () => gamesWon++
    return {mark, type, gamesWon, addGameWon}
}

/*****************/
/*** GAMEBOARD ***/
/*****************/

const GameBoard = (() => {
    const board = []
    const boardSize = 3

    let player1 = null
    let player2 = null
    let activePlayer = null

    const create = (p1, p2) => { 
        //Se genera un tablero vacio con un tamaño boardSize
        for (let i = 0; i < boardSize; i++) {
            board[i] = []

            for (let j = 0; j < boardSize; j++) {
                board[i][j] = "-"
            }
        }

        render()

        player1 = p1
        player2 = p2

        updateActivePlayer()
        // console.log(activePlayer)
    }

    const updateActivePlayer = () => {
        if(activePlayer != null && activePlayer == player1){
            activePlayer = player2
        } else {
            activePlayer = player1
        }
    }

    const render = () => {
        // Se recorre el board y se crea un elemento gamecell con el valor asignado
        let index = 0
        
        let gameboardDiv = document.getElementById('gameboard')
        gameboardDiv.textContent = ""

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {

                let gamecellDiv = document.createElement('div')
                gamecellDiv.classList.add('gamecell')
                gamecellDiv.textContent = board[i][j]

                gamecellDiv.setAttribute("data-index", index)
                gamecellDiv.onclick = () => addMark(gamecellDiv.dataset.index)
                index++
                
                gameboardDiv.appendChild(gamecellDiv)
            }
        }
    }

    const addMark = (cellIndex) => {
        let xPosition = Math.floor(cellIndex / boardSize)
        let yPosition = cellIndex % boardSize

        // console.log({cellIndex, boardSize, xPosition, yPosition})

        if(board[xPosition][yPosition] == "-") {
            board[xPosition][yPosition] = activePlayer.mark
            // console.log(board)

            render()

            // Se comprueba si ha terminado la partida
            let gameWon = checkGameStatus()

            if(gameWon == "Win"){
                alert(`${activePlayer.mark} won the game.`)
                create(player1, player2)
            } else if(gameWon == "Tie"){
                alert(`It's a Tie.`)
                create(player1, player2)
            } else {
                // Se cambia el turno de jugador
                updateActivePlayer()
            }

        }else{
            console.log("No hago nada")
        }
    }

    const checkGameStatus = () => {
        // Comprobar victoria por alineación horizontal
        for (let boardRow = 0; boardRow < 3; boardRow++) {
            if (board[boardRow][0] === board[boardRow][1] && board[boardRow][0] === board[boardRow][2] && board[boardRow][0] != "-") {
                return "Win"
            }
        }
        
        // Comprobar victoria por alineación vertical
        for (let boardColumn = 0; boardColumn < 3; boardColumn++) {
            if (board[0][boardColumn] === board[1][boardColumn] && board[0][boardColumn] === board[2][boardColumn] && board[0][boardColumn] != "-") {
                return "Win"
            }
        }
        
        // Comprobar victoria por alineación diagonal
        if (board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] != "-") {
            return "Win"
        }
        if (board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2] != "-") {
            return "Win"
        }
        
        // No hay alineación de 3 elementos
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] == "-"){
                    return false
                }
            }
        }

        return "Tie"
    }

    return {create, render, board} //QUITAR EL BOARD
})()

const startGame = () => {
    let menuButtonsDiv = document.getElementsByClassName('menuButtonGroup')[0]
    menuButtonsDiv.style.display = 'none'

    let gameView = document.getElementById("gameView")
    gameView.style.visibility = 'visible'
    gameView.style.opacity = 1
    gameView.style.transition = "ease-in-out 1s"

    let returnButton = document.getElementById("returnButton")
    returnButton.onclick = () => returnToMenu()

    // Se generan 2 jugadores
    let player1 = playerFactory("X", "player")
    let player2 = null

    if (true) {    
        player2 = playerFactory("O", "player")
    } else {
        player2 = playerFactory("O", "AI")
    }

    // Se muestra el tablero
    GameBoard.create(player1, player2)
}

const returnToMenu = () => {
    let gameView = document.getElementById("gameView")
    gameView.style.visibility = 'hidden'
    gameView.style.opacity = 0
    gameView.style.transition = "none"

    let menuButtonsDiv = document.getElementsByClassName('menuButtonGroup')[0]
    menuButtonsDiv.style.display = 'grid'
}