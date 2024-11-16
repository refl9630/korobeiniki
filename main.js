//canvas elements info
const cellSize = 40                             //rendered cell size
const ce_field = new CanvasContext()            //main field canvas
const ce_held = new CanvasContext()             //held piece canvas
const ce_next = new CanvasContext()             //next piece canvas
const canvasElements = {
    "field": {
        "id": "gamegrid",
        "w": 400,
        "h": 800
    },
    "held": {
        "id": "holdt",
        "w": 200,
        "h": 200
    },
    "next": {
        "id": "nextt",
        "w": 200,
        "h": 200
    },
    init () {
        ce_field.setElement(this.field.id);
        ce_field.setDimentions(this.field.w, this.field.h);
        ce_held.setElement(this.held.id);
        ce_held.setDimentions(this.held.w, this.held.h);
        ce_next.setElement(this.next.id);
        ce_next.setDimentions(this.next.w, this.next.h);
    }
}

let speed = 800
let score = 0
let linesCleared = 0
let level = 0
let waitState = false
let hscore
let paused = false
let indanger = false
let over = false


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
    select.addEventListener('click', function (e) {
        console.log(e.target);
        
        if (e.target.type == "button") {
        let l = e.target.value
        console.log(l);
        
        document.getElementById('pause').addEventListener('click', pause);
        startLevel(l)
        }
        else {
            startGame()
        }
    }, {once: true})
}
function startLevel (l) {
    select.style.visibility = "hidden"
    document.getElementById('openstart').style.display = "none";
    document.getElementById('pause').style.display = "block";
    level = l - 1
    Sounds.bgm.play()
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
    window.location.reload();
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
    GameState.update()
    let movingblocks = GameState.fallingblocks
    if (movingblocks.length > 4) {
        console.log(GameState.gameMap, GameState.stateMap);
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
        settle ()
        waitState = false
        }
    }
    drawGrid ()
    }
}

function settle () {
    let movingblocks = GameState.fallingblocks
    Sounds.playFX("move")
    for (let i = 0; i < movingblocks.length; i++) {
        let myblock = movingblocks[i]
        GameState.gameMap[myblock.y][myblock.x] = piece;
        GameState.stateMap[myblock.y][myblock.x] = 1;
    }
    let lines = checkLine ()
    if (lines != false) {
        clearLines (lines)
    }
    switch (isOver()) {
        case true:
            gameOver()
            break;
        case false:
            danger();
            generateTetromino ();
            break;
    };
    GameState.update()
}
function checkLine () {
    let completed = []
    for (let i = 23; i >= 0; i--) {
        const myline = GameState.stateMap[i] 
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
    Sounds.playFX("beam")
    for (let i = 0; i < lines.length; i++) {
        GameState.stateMap.splice(lines[i], 1);
        GameState.gameMap.splice(lines[i], 1);
    }
    for (let i = 0; i < lines.length; i++) {
        let newLine = [0,0,0,0,0,0,0,0,0,0];
        let newLine2 = [0,0,0,0,0,0,0,0,0,0];
        GameState.gameMap.splice(0, 0, newLine);
        GameState.stateMap.splice(0, 0, newLine2);
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
            if (GameState.stateMap[i][j] == 1) {
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
            Sounds.bgm.volume = 0.7
            overlayOff ()
            waitState = false;
            paused = false;
            break;
        case false:
            pauseButton.style.backgroundColor = "red";
            pauseButton.innerHTML = "PAUSED";
            Sounds.bgm.volume = 0.2
            overlayOn ()
            waitState = true;
            paused = true;
            break;
    };

}
function danger () {
    let dangerline = GameState.stateMap[9]
    for (let i = 0; i < dangerline.length; i++) {
        if(dangerline[i] == 1) {
            Sounds.toggleDanger(true);
            return;
        }
    }
    Sounds.toggleDanger(false)
}

//movimento
function moveDown (falling, drop) {
    let movelist = falling 
    GameState.eraseMoving ()
    let attribute = piece
    for (let i = movelist.length-1; i >= 0; i--) {
        const move = movelist[i]
        let to = move.y + drop
        GameState.gameMap[to][move.x] = attribute
        GameState.gameMap[move.y][move.x] = 0
        GameState.stateMap[move.y][move.x] = 0
        GameState.stateMap[to][move.x] = 2
    }
    deltaY++
    graceFrames = 2
    drawGrid ()
}
function checkUnder (line, column) {
    if (line >= 23) {
        return false
    }
    else if ((GameState.stateMap[line+1][column]) == 1) {
        return false
    }
    else {
        return true}
}
function moveSide (side) {
    if (paused == false) {
    let blocked = false
    let movingblocks = GameState.fallingblocks
    const attribute = piece
    for (let i = 0; i < movingblocks.length; i++) {
        let myblock = movingblocks[i]
        if (checkSides(myblock.y, myblock.x, side) == false) {
            blocked = true
            return
        }
    } 
    if (blocked == false) {
        Sounds.playFX("move")
        switch (side) {
            case "l":
                deltaX--
                break;
            case "r":
                deltaX++
                break;
        };
/*     for (let i = movingblocks.length-1; i >= 0; i--) {
        const move = movingblocks[i];
        GameState.gameMap[move.y][move.x] = 0;
        GameState.stateMap[move.y][move.x] = 0;
    } */
    GameState.eraseMoving ()
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
        GameState.gameMap[move.y][to] = attribute
        GameState.stateMap[move.y][to] = 2
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
    else if ((GameState.stateMap[line][direction]) == 1) {
        return false
    }
    else {
        return true}
}
function dropDistance () {
    let falling = true
    let movingblocks = GameState.fallingblocks
    let dr = 0;
    while (falling == true) {
        for (let i = 0; i < movingblocks.length; i++) {
            let myblock = movingblocks[i]
            if (checkUnder((myblock.y+dr), myblock.x) == false) {
                falling = false
            }
        }
        dr++
    }
    return dr
}

function hardDrop () {
    waitState = true;
    let movingblocks = GameState.fallingblocks
	if (!holdKey) {
	holdKey = true
    if (paused == false) {
        let j = dropDistance()
        Sounds.playFX("drop")
        moveDown (movingblocks, j-1)
        score += ((j-1)*2)
        updateScore ()
        settle()
    } 

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
        GameState.eraseMoving ()
        Sounds.playFX('roll')
        for (let i = 0; i < next.length; i++) {
                let x = next[i].x
                let y = next[i].y
                    GameState.gameMap[deltaY+y][deltaX+x] = piece
                    GameState.stateMap[deltaY+y][deltaX+x] = 2
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
        if (GameState.stateMap[deltaY+cor.y][deltaX+cor.x] == 1) {
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
    }
    updateHold ()
    rotate ("cw")
    }
}

//atualizar tela
function drawGrid () {
    ce_field.clear()
    for (let i = 5; i <= 24; i++) {

        for (let j = 1; j <= 10; j++) {
            let att = GameState.getAtt(i-1, j-1)
            let myCell = new cell (i, j, att)
            myCell.draw()
        }
    }
    GameState.update()
}
function updateHold () {
    ce_held.clear()
    let shape = tetromino[heldPiece].shape
    let color = tetromino[heldPiece].color
	let dark = tetromino[heldPiece].dark
    for (let i = 0; i < shape[0].length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
            if (shape[0][i][j] == 2) {
                ce_held.fill(j*cellSize, i*cellSize, color, dark, cellSize)
            }
        }
    }
}
function updateNext () {
    ce_next.clear()
    let shape = tetromino[nextPiece].shape
    let color = tetromino[nextPiece].color
	let dark = tetromino[nextPiece].dark
    for (let i = 0; i < shape[0].length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
            if (shape[0][i][j] == 2) {
				ce_next.fill(j*cellSize, i*cellSize, color, dark, cellSize)
            }
        }
    }
}


  function main () {
    high ();
    document.getElementById('openstart').addEventListener('click', startGame)
    canvasElements.init()
    Sounds.loadBGM("korobeiniki")
  }

  main()