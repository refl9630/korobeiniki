const field = document.getElementById('gamegrid')
const fieldctx = field.getContext("2d");
const effects = document.getElementById('gameeffects')
const effectsctx = field.getContext("2d");
field.height = 800
field.width = 400
effects.height = 800
effects.width = 400
const held = document.getElementById('holdt');
const heldctx = held.getContext('2d');
held.width = 200
held.height = 200
const nextcanvas = document.getElementById('nextt');
const nextctx = nextcanvas.getContext('2d');
nextcanvas.width = 200
nextcanvas.height = 200
const bgm = new Audio('./assets/audio/Korobeiniki.mp3')
bgm.loop = true
bgm.preload = "auto"
var holdKey = false

const cellSize = 40
const cellBuffer = 4

class cell {
    constructor (line, column, attribute) {
        this.line = line
        this.column = column
        this.attribute = attribute
    }
    xPosition () {
        return (this.column - 1)*cellSize 
    }
    yPosition () {
        return (this.line-1-cellBuffer)*cellSize 
    }
    draw () {

        if (this.attribute != 0) {
            fill(fieldctx, this.xPosition(), this.yPosition(), this.attribute)
        }
        else {
		fieldctx.lineWidth = 1 
        fieldctx.strokeStyle = "rgb(100, 100, 100)" 
        fieldctx.strokeRect(this.xPosition(), this.yPosition(), cellSize,cellSize)
		}
    }
    drawSpark () {

    }
}
const tetromino = {
    1 : {
        name: "i",
        color: "aqua",
        dark: "rgb(0, 200, 200)",
        shape: {0: [[0,0,0,0],
                    [2,2,2,2],
                    [0,0,0,0],
                    [0,0,0,0]],
                1: [[0,0,2,0],
                    [0,0,2,0],
                    [0,0,2,0],
                    [0,0,2,0]],
                2: [[0,0,0,0],
                    [0,0,0,0],
                    [2,2,2,2],
                    [0,0,0,0]],
                3: [[0,2,0,0],
                    [0,2,0,0],
                    [0,2,0,0],
                    [0,2,0,0]]
                }
    
        },
    2 : {
        name: "s",
        color: "lime",
        dark: "rgb(0, 200, 0)",
        shape: {0: [[0,2,2],
                    [2,2,0],
                    [0,0,0]],
                1: [[0,2,0],
                    [0,2,2],
                    [0,0,2]],
                2: [[0,0,0],
                    [0,2,2],
                    [2,2,0]],
                3: [[2,0,0],
                    [2,2,0],
                    [0,2,0]]
            }
        },
    3 : {
        name: "z",
        color: "red",
        dark: "rgb(200, 0, 0)",
        shape: {0: [[2,2,0],
                    [0,2,2],
                    [0,0,0]],
                1: [[0,0,2],
                    [0,2,2],
                    [0,2,0]],
                2: [[0,0,0],
                    [2,2,0],
                    [0,2,2]],
                3: [[0,2,0],
                    [2,2,0],
                    [2,0,0]]
                }
        },
    4 : {
        name: "o",
        color: "yellow",
        dark: "rgb(200, 200, 0)",
        shape: {0: [[2,2],
                    [2,2]],
                1: [[2,2],
                    [2,2]],
                2: [[2,2],
                    [2,2]],
                3: [[2,2],
                    [2,2]],
            }  
        },
    5 : {
        name: "t",
        color: "purple",
        dark: "rgb(100, 0, 100)",
        shape: {0: [[0,2,0],
                    [2,2,2],
                    [0,0,0]],
                1: [[0,2,0],
                    [0,2,2],
                    [0,2,0]],
                2: [[0,0,0],
                    [2,2,2],
                    [0,2,0]],
                3: [[0,2,0],
                    [2,2,0],
                    [0,2,0]]
                }
    },
    6 : {
        name: "l",
        color: "orange",
        dark: "rgb(200, 120, 0)",
        shape: {0: [[0,0,2],
                    [2,2,2],
                    [0,0,0]],
                1: [[0,2,0],
                    [0,2,0],
                    [0,2,2]],
                2: [[0,0,0],
                    [2,2,2],
                    [2,0,0]],
                3: [[2,2,0],
                    [0,2,0],
                    [0,2,0]]
                }
        },
    7 : {
        name: "j",
        color: "blue",
        dark: "rgb(0, 0, 180)",
        shape: {0: [[2,0,0],
                    [2,2,2],
                    [0,0,0]],
                1: [[0,2,2],
                    [0,2,0],
                    [0,2,0]],
                2: [[0,0,0],
                    [2,2,2],
                    [0,0,2]],
                3: [[0,2,0],
                    [0,2,0],
                    [2,2,0]]
        }
    }
}
function getMap (shape) {
    let map = []
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape.length; j++) {
            if (shape[i][j] == 2) {
                map.push({y: i, x: j})
            }
        }
    }
    return map
}

let speed = 800
let score = 0
let linesCleared = 0
let level = 0
let waitState = false
let hscore
let paused = false
//block color map
let gameMap = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]
//block attribute map
let stateMap = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

let rotation = 0
let deltaY
let deltaX
let piece
let heldPiece
let nextPiece
let graceFrames = 2

const select = document.getElementById('lvlselect');
function startGame () {
    select.style.visibility = "visible"
    document.getElementById('openstart').style.animation = 'none'
}
function startLevel (l) {
    select.style.visibility = "hidden"
    document.getElementById('openstart').style.display = "none";
    document.getElementById('pause').style.display = "block";
    level = l - 1
    bgm.play()
    levelUp ()
    startingl = l
    updateScore ()
    nextPiece = Math.round(6*Math.random()) + 1
    generateTetromino()
    gameLoop ()
}
function gameLoop () {
    if (waitState != true) {
    updateState ()
    }
    setTimeout(gameLoop, speed);
}
function gameOver () {
    alert('Game Over')
    if (score > hscore) {
        alert('NEW HIGH SCORE!');
        localStorage.setItem('high', score)
    }
    window.location.reload()
}
function levelUp () {
    level ++
    let baseSpd = 48
    let frameSpeed
    if (level < 8) {
        baseSpd -= (level*5)
    }
    else if (level < 9) {
        baseSpd = 6
    }
    else if (level <= 12) {
        baseSpd = 5
    }
    else if (level <= 15) {
        baseSpd = 4
    }
    else if (level <= 18) {
        baseSpd = 3
    }
    else if (level <= 28) {
        baseSpd = 2
    }
    else if (level > 28) {
        baseSpd = 1
    }
    frameSpeed = (baseSpd/60) * 1000
    speed = frameSpeed
}
function high () {
    let highscore = localStorage.getItem('high')
    if (highscore == null) {
        hscore = 0
    }
    else {
        hscore = highscore
        const hs = document.getElementById('high');
        hs.innerHTML = "HIGH <br>" + hscore
    }
}

function updateState () {
    if (paused == false) {
    let falling = true
    let movingblocks = fallingBlocks ()
    if (movingblocks.length > 4) {
        console.log(gameMap, stateMap);
    }
    for (let i = 0; i < movingblocks.length; i++) {
        let myblock = movingblocks[i]
        if (checkUnder(myblock.y, myblock.x) == false) {
            falling = false
        }
    }
    if (falling == true) {
        moveDown (movingblocks, 1)
    }
    else if (falling == false) {
        if (graceFrames > 0) {
            graceFrames -=1
        }
        else {
        waitState = true
        settle (movingblocks)
        waitState = false
        }
    }
    drawGrid ()
    }
}
function generateTetromino () {
    let n = nextPiece
    nextPiece = Math.floor(7*Math.random()) + 1
    let t = n
    let shape = tetromino[t].shape
    let startingx = 3
    deltaY = 0
    deltaX = startingx
    rotation = 0
    piece = t
    for (let i = 0; i < shape[0].length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
            if (shape[0][i][j] == 2) {
                gameMap[i][j+startingx] = piece
                stateMap[i][j+startingx] = 2
            }
        }
    }
    updateNext ()
}
function settle (falling) {
    let movingblocks = falling
    for (let i = 0; i < movingblocks.length; i++) {
        let myblock = movingblocks[i]
        gameMap[myblock.y][myblock.x] = piece;
        stateMap[myblock.y][myblock.x] = 1;
    }
    let lines = checkLine ()
    if (lines != false) {
        clearLines (lines)
    }
    switch (isOver()) {
        case true:
            gameOver ();
            break;
        case false:
            generateTetromino ();
            break;
    };
}
function checkLine () {
    let completed = []
    for (let i = 23; i >= 0; i--) {
        const myline = stateMap[i] 
        let score = true
            for (let j = 0; j < 10; j++) {
                if (myline[j] == 1) {
                    continue
                }
                else {
                    score = false
                    break
                }
            }
        if (score == true) {
            completed.push(i)
        }
    }
    return completed
}
function clearLines (lines) {
    const points = [40,100,300,1200];
    for (let i = 0; i < lines.length; i++) {
        stateMap.splice(lines[i], 1);
        gameMap.splice(lines[i], 1);
    }
    for (let i = 0; i < lines.length; i++) {
        let newLine = [0,0,0,0,0,0,0,0,0,0];
        let newLine2 = [0,0,0,0,0,0,0,0,0,0];
        gameMap.splice(0, 0, newLine);
        stateMap.splice(0, 0, newLine2);
    }
    linesCleared += lines.length;
    score += (points[lines.length-1]*(level+1)); 
    if (linesCleared/10 >= level+1-startingl) {
        levelUp ()
    }
    updateScore ()
}
function isOver () {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 10; j++) {
            if (stateMap[i][j] == 1) {
                return true;
            }
        }
    }
    return false;
}
function pause () {
    const pauseButton = document.getElementById('pause');
    switch (paused) {
        case true:
            pauseButton.style.backgroundColor = "rgb(255, 210, 210)";
            pauseButton.innerHTML = "PAUSE";
            bgm.volume = 1
            overlayOff ()
            waitState = false;
            paused = false;
            break;
        case false:
            pauseButton.style.backgroundColor = "red";
            pauseButton.innerHTML = "PAUSED";
            bgm.volume = 0.2
            overlayOn ()
            waitState = true;
            paused = true;
            break;
    };

}

//movimento
function moveDown (falling, drop) {
    let movelist = falling 
    eraseMoving ()
    let attribute = piece
    for (let i = movelist.length-1; i >= 0; i--) {
        const move = movelist[i]
        let to = move.y + drop
        gameMap[to][move.x] = attribute
        gameMap[move.y][move.x] = 0
        stateMap[move.y][move.x] = 0
        stateMap[to][move.x] = 2
    }
    deltaY++
    graceFrames = 2
    drawGrid ()
}
function checkUnder (line, column) {
    if (line == 23) {
        return false
    }
    else if ((stateMap[line+1][column]) == 1) {
        return false
    }
    else {
        return true}
}
function moveSide (side) {
    if (paused == false) {
    let blocked = false
    let movingblocks = fallingBlocks ()
    const attribute = piece
    for (let i = 0; i < movingblocks.length; i++) {
        let myblock = movingblocks[i]
        if (checkSides(myblock.y, myblock.x, side) == false) {
            blocked = true
            return
        }
    } 
    if (blocked == false) {
        switch (side) {
            case "l":
                deltaX--
                break;
            case "r":
                deltaX++
                break;
        };
    for (let i = movingblocks.length-1; i >= 0; i--) {
        const move = movingblocks[i];
        gameMap[move.y][move.x] = 0;
        stateMap[move.y][move.x] = 0;
    }
    for (let i = movingblocks.length-1; i >= 0; i--) {
        const move = movingblocks[i];
        let column = move.x;
        let to;
        switch (side) {
            case "l":
                to = column-1;
                break;
            case "r":
                to = column+1;
                break;
        };
        gameMap[move.y][to] = attribute
        stateMap[move.y][to] = 2
        }
    graceFrames = 2
    drawGrid ()
    }
    }
}
function checkSides (line, column, side) {
    let wall
    let direction
    switch (side) {
        case "l":
            wall = 0;
            direction = column-1;
            break;
        case "r":
            wall = 9;
            direction = column+1;
            break;
    };
    if (column == wall) {
        return false
    }
    else if ((stateMap[line][direction]) == 1) {
        return false
    }
    else {
        return true}
}
function fallingBlocks () {
    let fallingBlocks = []
    for (let i = 1; i <= 24; i++) {
        for (let j = 1; j <= 10; j++) {
            let st = stateMap[i-1][j-1]
            let position = {x: j-1, y: i-1}
            if (st == 2) {
                    fallingBlocks.push(position)
                }
            }
        }
    if (fallingBlocks.length > 4) {
        console.log(gameMap, stateMap);
    }
    return fallingBlocks
}
function hardDrop () {
    waitState = true;
    let falling = true
    let movingblocks = fallingBlocks ()
	if (!holdKey) {
	holdKey = true
    if (paused == false) {
        let j = 0;
        while (falling == true) {
            for (let i = 0; i < movingblocks.length; i++) {
                let myblock = movingblocks[i]
                if (checkUnder((myblock.y+j), myblock.x) == false) {
                    falling = false
                }
            }
            j++
        }
        moveDown (movingblocks, j-1)
        score += ((j-1)*2)
        updateScore ()
    } 
    settle (fallingBlocks ())
    waitState = false 
	}
}


//rotação
function rotate (direction) {
    if (paused == false) {
    let shape = tetromino[piece].shape
    waitState = true
    if (deltaX < 0) {
        deltaX = 0
    }
    if (deltaX > 10-(shape[0].length)) {
        deltaX = 10-(shape[0].length)
    }
    let n = nextRotation(rotation, direction)
    let next = getMap (shape[n])
    let can = canRotate(next)
    while (can == false) {
        n = nextRotation(n, direction)
        next = getMap (shape[n])
        can = canRotate(next)
    }
    if (can == true) {
        eraseMoving ()
        for (let i = 0; i < next.length; i++) {
                let x = next[i].x
                let y = next[i].y
                    gameMap[deltaY+y][deltaX+x] = piece
                    stateMap[deltaY+y][deltaX+x] = 2
            }
        }
        rotation = n
        graceFrames = 2
        drawGrid ()
    waitState = false
    }
}
function canRotate (shape) {
    for (let i = 0; i < shape.length; i++) {
        const cor = shape[i];
        if (stateMap[deltaY+cor.y][deltaX+cor.x] == 1) {
            return false
        }
    }
    return true
}
function nextRotation (cr, di) {
    let r
    switch (di) {
        case "cw":
            r = cr+1
            if (r > 3) {
            return 0
            }
            return r;
        case "ccw":
            r = cr-1
                if (r < 0) {
            return 3
            }
            return r
    }

}
function eraseMoving () {
    let moving = fallingBlocks ()
    for (let i = 0; i < moving.length; i++) {
        let cell = moving[i]
        gameMap[cell.y][cell.x] = 0
        stateMap[cell.y][cell.x] = 0      
    }
}

//guardar
function hold () {
    if (paused == false) {
    let held = heldPiece
    let active = piece
    if (held !== undefined) {
    heldPiece = active
    piece = held
    }
    else {
        heldPiece = active;
        generateTetromino ()
    }
    updateHold ()
    rotate ("cw")
    }
}

//atualizar tela
function drawGrid () {
    fieldctx.clearRect(0,0,field.width,field.height)
    for (let i = 5; i <= 24; i++) {
        for (let j = 1; j <= 10; j++) {
            let att = gameMap[i-1][j-1]
            let myCell = new cell (i, j, att)
            myCell.draw()
        }
    }
}
function updateHold () {
    heldctx.clearRect(0,0,nextcanvas.width,nextcanvas.height)
    let shape = tetromino[heldPiece].shape
    for (let i = 0; i < shape[0].length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
            if (shape[0][i][j] == 2) {
				fill (heldctx, j*40, i*40, heldPiece)
            }
        }
    }
}
function updateNext () {
    nextctx.clearRect(0,0,nextcanvas.width,nextcanvas.height)
    let shape = tetromino[nextPiece].shape
    for (let i = 0; i < shape[0].length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
            if (shape[0][i][j] == 2) {
				fill (nextctx, j*40, i*40, nextPiece)
            }
        }
    }
}
function updateScore () {
    const lvl = document.getElementById('level');
    const ln = document.getElementById('lines');
    const sc = document.getElementById('score');
    lvl.innerHTML = "Level " + level
    ln.innerHTML = "Lines " + linesCleared
    sc.innerHTML = "Score<br>" + score
}
function overlayOn() {
    document.getElementById("overlay").style.display = "block";
  }
function overlayOff() {
    document.getElementById("overlay").style.display = "none";
  }
function fill (context, x, y, type) {
	let color = tetromino[type].color
	let dark = tetromino[type].dark
	let inner = cellSize/16
	context.lineWidth = 1 
    context.strokeStyle = "black" 
    context.strokeRect(x, y, cellSize,cellSize)
	context.fillStyle = color
	context.fillRect(x, y, cellSize,cellSize)
    context.strokeStyle = dark
    context.lineWidth = 5
	context.fillRect(x, y, cellSize, cellSize)
    context.strokeRect(x+inner, y+inner, cellSize-(inner*2),cellSize-(inner*2))
}


//controle virtual
const btnContainer = document.getElementById("vcontrols");
const btns = btnContainer.getElementsByTagName("div");
btns[1].addEventListener("click", function (e) {
    let bt = btns[1]
    highlight(bt)
    moveSide("l");
});
btns[2].addEventListener("click", function (e) {
	let bt = btns[2]
    highlight(bt)
	hardDrop ()
	document.addEventListener("mouseup", function () {
		holdKey = false
		document.removeEventListener("mouseup")
	}) 
});
btns[3].addEventListener("click", function (e) {
    let bt = btns[3]
    highlight(bt)
    score++
	updateState();
    updateScore();
});
btns[5].addEventListener("click", function (e) {
    let bt = btns[5]
    highlight(bt)
	moveSide("r");
});
btns[4].addEventListener("click", function (e) {
    let bt = btns[4]
    highlight(bt)
	rotate("cw");
});
btns[0].addEventListener("click", function (e) {
    let bt = btns[0]
    highlight(bt)
	rotate("ccw");
});
document.getElementById("hold").addEventListener("click", function () {
	hold();
});

document.addEventListener("dblclick", function (e) {
    e.preventDefault()
})

//teclado
document.addEventListener("keydown", function (e) {
    let mykey = e.code
    let vbtn
    switch (mykey) {
        case "ArrowLeft":
        case "KeyA":
            vbtn = btns[1];
            moveSide("l");
            break;
        case "ArrowRight":
        case "KeyD":
            vbtn = btns[5];
            moveSide("r");
            break;
        case "KeyX":
        case "KeyE":
            vbtn = btns[4];
            rotate("cw");
            break;
        case "KeyZ":
        case "KeyQ":
            vbtn = btns[0];
            rotate("ccw");
            break;
        case "ArrowDown":
        case "KeyS":
            vbtn = btns[3];
            score++
            updateState();
            updateScore()
            break;
        case "KeyC":
        case "Space":
            hold();
            break;
        case "Escape":
            pause ();
            break;
        case "ArrowUp":
        case "KeyW":
            vbtn = btns[2];
            hardDrop ();
            break;
        default:
            break;
    }
    if (vbtn != undefined) {
        vbtn.classList.add('active');
        document.addEventListener('keyup', activebtn)
    }
})

function highlight (bt) {
    let vbtn = bt
    vbtn.classList.add('active');
    activebtn ()
}

function activebtn () {
	holdKey = false
    document.removeEventListener('keyup', activebtn)
    setTimeout(function () {
        let current = document.getElementsByClassName("active");
        for (let i = 0; i < current.length; i++) {
            current[i].className = current[i].className.replace(" active", "");
        }
    }, 100);
  }