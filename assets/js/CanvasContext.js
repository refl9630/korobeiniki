class CanvasContext {
	constructor () {
	}
	setElement (elementid) {
		this.paper = document.getElementById(elementid);
		this.pencil = document.getElementById(elementid).getContext('2d');
	}
	setDimentions (width, height) {
		this.width = width;
		this.height = height;
		this.paper.width = width;
		this.paper.height = height;
	}
	getInfo () {

	}
	fill (x,y,color,dark, size) {
		let context = this.pencil
		let inner = size/16
		context.lineWidth = 1 
		context.strokeStyle = "gray" 
		context.strokeRect(x, y, size,size)
		context.fillStyle = color
		context.fillRect(x, y, size,size)
		context.strokeStyle = dark
		context.lineWidth = 5
		context.fillRect(x, y, size, size)
		context.strokeRect(x+inner, y+inner, size-(inner*2),size-(inner*2))
	}
	blank (x,y,size) {
		let context = this.pencil
		context.lineWidth = 1 
        context.strokeStyle = "rgb(100, 100, 100)" 
        context.strokeRect(x, y, size,size)
	}
	clear () {
		this.pencil.clearRect(0,0,this.width,this.height)
	}
}

