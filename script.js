/********************/
/**** START MENU ****/
/********************/

// Se generan 2 jugadores
let player1, player2

const buttonPvP = document.getElementById("buttonPvP")
const buttonPvAIEasy = document.getElementById("buttonPvAIEasy")
const buttonPvAIMedium = document.getElementById("buttonPvAIMedium")
const buttonPvAIHard = document.getElementById("buttonPvAIHard")

buttonPvP.onclick = () => {
    player1 = playerFactory("X", "player")
    player2 = playerFactory("O", "player")
    startGame()
}

buttonPvAIEasy.onclick = () => {
    player1 = playerFactory("X", "player")
    player2 = playerFactory("O", "AI", "easy")
    startGame()
}

buttonPvAIMedium.onclick = () => {
    player1 = playerFactory("X", "player")
    player2 = playerFactory("O", "AI", "medium")
    startGame()
}

buttonPvAIHard.onclick = () => {
    player1 = playerFactory("X", "player")
    player2 = playerFactory("O", "AI", "hard")
    startGame()
}

/***************/
/*** PLAYER ***/
/***************/

const playerFactory = (mark, type, difficulty = "none") => {
    return {
        mark,
        type,
        difficulty,
        gamesWon: 0,
        addGameWon() { this.gamesWon++}
    }
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
                board[i][j] = ""
            }
        }

        render()

        player1 = p1
        player2 = p2

        updateActivePlayer()
    }

    
    let scoresDiv = document.getElementById('playersScore')

    const updateActivePlayer = () => {
        if(activePlayer != null && activePlayer == player1){
            activePlayer = player2

            scoresDiv.children[1].classList.add('activePlayer')
            scoresDiv.children[0].classList.remove('activePlayer')

            // Si la IA es el jugador activo realiza un movimiento
            if(player2.type == "AI"){
                // Se desactiva el tablero
                let gameCells = document.getElementsByClassName("gamecell")

                for (let i = 0; i < gameCells.length; i++) {
                    gameCells[i].onclick = undefined
                }

                IAMove()
            }

        } else {
            activePlayer = player1

            scoresDiv.children[0].classList.add('activePlayer')
            scoresDiv.children[1].classList.remove('activePlayer')
        }
    }

    // Test IA COMUN
    const IAMove = () => {
        let possibleMoves = []
        let xPosition, yPosition
        let winningPosition, losingPosition
        let emptyCenter = false

        // Decide si va a jugar aleatorio (0) o con lógica (1) si tiene dificultad media
        let mediumFlag

        if(player2.difficulty == "medium"){
            mediumFlag = Math.floor(Math.random() * 2)
        }
        
        // Devolver posiciones libres del tablero
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if(board[i][j] == ""){
                    possibleMoves.push([i, j])

                    if(i == 1 && j == 1){
                        emptyCenter = true
                    }

                    if(player2.difficulty == "hard" || mediumFlag == 1){
                        // Comprueba si es una posición ganadora
                        board[i][j] = "O"
                        let gameStatus = checkGameStatus().result
                        
                        if(gameStatus == "Win"){
                            winningPosition = {i, j}
                        }

                        // Comprueba si es una jugada perdedora
                        board[i][j] = "X"
                        gameStatus = checkGameStatus().result

                        if(gameStatus == "Win"){
                            losingPosition = {i, j}
                        }

                        board[i][j] = ""
                    }
                }
            }
        }

        // Realiza la jugada ganadora
        if(winningPosition != undefined) {
            xPosition = winningPosition.i
            yPosition = winningPosition.j
        } else if(losingPosition != undefined) { // Realiza defensa
            xPosition = losingPosition.i
            yPosition = losingPosition.j
        } else { // Si esta libre la posición central cogerla, si no mover aleatorio
            if(emptyCenter){
                xPosition = 1
                yPosition = 1
            } else {
                let randomPlay = Math.floor(Math.random() * possibleMoves.length)
                let randomPositions = possibleMoves[randomPlay]
                xPosition = randomPositions[0]
                yPosition = randomPositions[1]
            }
        }

        // Se asigna a la maquina un tiempo de respuesta entre 0.2s y 1s y se realiza la jugada
        let randomResponseTime = Math.floor(Math.random() * 800 + 200)
        setTimeout(()=>{addMark(xPosition, yPosition)}, randomResponseTime)
    }

    const render = () => {
        // Se recorre el board y se crea un elemento gamecell con el valor asignado
        let index = 0
        
        let gameboardDiv = document.getElementById("gameboard")
        gameboardDiv.textContent = ""

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {

                let gamecellDiv = document.createElement("div")
                gamecellDiv.classList.add("gamecell")
                gamecellDiv.textContent = board[i][j]

                gamecellDiv.setAttribute("data-index", index)

                gamecellDiv.onclick = () => {
                    let cellIndex = gamecellDiv.dataset.index
                    let xPosition = Math.floor(cellIndex / boardSize)
                    let yPosition = cellIndex % boardSize
                    addMark(xPosition, yPosition)
                }

                index++
                
                gameboardDiv.appendChild(gamecellDiv)
            }
        }
    }

    const addMark = (xPosition, yPosition) => {

        if(board[xPosition][yPosition] == "") {
            board[xPosition][yPosition] = activePlayer.mark

            render()

            // Se comprueba si ha terminado la partida
            let gameWon = checkGameStatus()
            let gameMessageDiv = document.getElementById("gameMessage")

            if(gameWon.result == "Win"){

                // Se desactiva el tablero
                let gameCells = document.getElementsByClassName("gamecell")

                for (let i = 0; i < gameCells.length; i++) {
                    gameCells[i].onclick = undefined
                }

                // Se muestra la jugada ganadora en verde
                for (let i = 0; i < gameWon.winningPlay.length; i++) {
                    let [x, y] = gameWon.winningPlay[i]
                    winningCellIndex = x*3+y
                    const winningCell = document.querySelector(`.gamecell[data-index="${winningCellIndex}"]`)
                    winningCell.classList.add('cellTransition')
                    setTimeout(()=> winningCell.style.backgroundColor  = "#00f586", 1)
                }

                // Se actualizan las puntuaciones al ganar un jugador
                activePlayer == player1? player1.addGameWon() : player2.addGameWon()
                
                let playerXscore = document.getElementById('playerXscore')
                playerXscore.textContent = player1.gamesWon

                let playerOscore = document.getElementById('playerOscore')
                playerOscore.textContent = player2.gamesWon

                setTimeout(() => {
                    gameMessageDiv.style.display = "none"
                    create(player1, player2)
                }, 1000)

            } else if(gameWon.result == "Tie"){

                // Se muestra en amarillo el tablero
                let gameCells = document.getElementsByClassName("gamecell")

                for (let i = 0; i < gameCells.length; i++) {
                    gameCells[i].classList.add('cellTransition')
                    setTimeout(()=> gameCells[i].style.backgroundColor  = "#feffc2", 1)
                }

                setTimeout(() => {
                    gameMessageDiv.style.display = "none"
                    create(player1, player2)
                }, 1000)

            } else {
                // Se cambia el turno de jugador
                updateActivePlayer()
            }

        }
    }

    const checkGameStatus = () => {
        // Comprobar victoria por alineación horizontal
        for (let boardRow = 0; boardRow < 3; boardRow++) {
            if (board[boardRow][0] === board[boardRow][1] && board[boardRow][0] === board[boardRow][2] && board[boardRow][0] != "") {
                return {result: "Win", winningPlay: [[boardRow, 0], [boardRow, 1], [boardRow, 2]]}
            }
        }
        
        // Comprobar victoria por alineación vertical
        for (let boardColumn = 0; boardColumn < 3; boardColumn++) {
            if (board[0][boardColumn] === board[1][boardColumn] && board[0][boardColumn] === board[2][boardColumn] && board[0][boardColumn] != "") {
                return {result: "Win", winningPlay: [[0, boardColumn], [1, boardColumn], [2, boardColumn]]}
            }
        }
        
        // Comprobar victoria por alineación diagonal
        if (board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] != "") {
            return {result: "Win", winningPlay: [[0, 0], [1, 1], [2, 2]]}
        }
        if (board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2] != "") {
            return {result: "Win", winningPlay: [[0, 2], [1, 1], [2, 0]]}
        }
        
        // No hay situación de victoria aún
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] == ""){
                    return {result: "Playing", winningPlay: []}
                }
            }
        }

        return {result: "Tie", winningPlay: []}
    }

    return {create, render, board}
})()

const startGame = () => {
    // Se muestra el tablero
    GameBoard.create(player1, player2)
    loadGameView(player1, player2)
}

const loadGameView = (player1, player2) => {
    let title = document.getElementsByClassName("title")[0]
    title.style.display = "none"
    
    let menuButtonsDiv = document.getElementById("menuButtonGroup")
    menuButtonsDiv.style.display = "none"

    let gameView = document.getElementById("gameView")
    gameView.style.visibility = "visible"
    gameView.style.opacity = 1
    gameView.style.transition = "ease-in-out 1s"

    let gameButtons = document.getElementById("ingameHeader")
    gameButtons.style.visibility = "visible"
    gameButtons.style.opacity = 1
    gameButtons.style.transition = "ease-in-out 1s"

    let returnButton = document.getElementById("returnButton")
    returnButton.onclick = () => returnToMenu()

    let restartButton = document.getElementById("restartButton")
    restartButton.onclick = () => GameBoard.create(player1, player2)

    let playerXscore = document.getElementById('playerXscore')
    playerXscore.textContent = player1.gamesWon

    let playerOscore = document.getElementById('playerOscore')
    playerOscore.textContent = player2.gamesWon
}

const returnToMenu = () => {
    let gameView = document.getElementById("gameView")
    gameView.style.visibility = "hidden"
    gameView.style.opacity = 0
    gameView.style.transition = "none"

    let gameButtons = document.getElementById("ingameHeader")
    gameButtons.style.visibility = "hidden"
    gameButtons.style.opacity = 0
    gameButtons.style.transition = "none"

    let title = document.getElementsByClassName("title")[0]
    title.style.display = "block"

    let menuButtonsDiv = document.getElementById("menuButtonGroup")
    menuButtonsDiv.style.display = "grid"

    // Se eliminan los jugadores anteriores
    player1=undefined
    player2=undefined
}