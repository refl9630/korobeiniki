const GameState = {
//block color map
	gameMap: [
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
],
//block attribute map
	stateMap: [
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
	],
    getAtt (y, x) {
        return this.gameMap[y][x]
    },
    getState (y, x) {
        return this.stateMap[y][x]
    },
	fallingblocks: [],
    preview: [],
	update () {
		this.fallingblocks = []
		for (let i = 1; i <= 24; i++) {
			for (let j = 1; j <= 10; j++) {
				let st = this.stateMap[i-1][j-1]
				let position = {x: j-1, y: i-1}
				if (st == 2) {
						this.fallingblocks.push(position)
					}
				}
		}
		if (this.fallingblocks.length > 4) {
			console.log(this.gameMap, this.stateMap);
		}

        this.previewg()
	},
    previewg () {
        this.preview = []
        const distance = dropDistance()
        for (let i = 0; i < this.fallingblocks.length; i++) {
            const myblock = this.fallingblocks[i];
            
            let gposition = {x: myblock.x, y: (myblock.y + distance - 1)}
            this.preview.push(gposition)
            
            if (this.stateMap[gposition.y][gposition.x] == 0) {
                this.gameMap[gposition.y][gposition.x] = 8
            }
        }
    },
	eraseMoving () {
		let moving = this.fallingblocks
        let ghost = this.preview
		for (let i = 0; i < moving.length; i++) {
			let cell = moving[i]
            let pre = ghost[i]
			this.gameMap[cell.y][cell.x] = 0
            this.gameMap[pre.y][pre.x] = 0
			this.stateMap[cell.y][cell.x] = 0      
		}
	}
}

class Coord {
	
}