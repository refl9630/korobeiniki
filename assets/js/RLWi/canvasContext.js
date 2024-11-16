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
}

async function confirmImportCanvas() {
	return true
}