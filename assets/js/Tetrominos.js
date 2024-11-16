const cellBuffer = 4                        //space reserved for spawning pieces
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
                GameState.gameMap[i][j+startingx] = piece
                GameState.stateMap[i][j+startingx] = 2
            }
        }
    }
    updateNext ()
}