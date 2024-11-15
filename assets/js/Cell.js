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
            let color = tetromino[this.attribute].color
            let dark = tetromino[this.attribute].dark
            ce_field.fill(this.xPosition(), this.yPosition(), color, dark, cellSize)
        }
        else {
            ce_field.blank(this.xPosition(), this.yPosition(), cellSize)
		}
    }
}


