const rootloc = "assets/js/RLWi/";
class RLModule  {
	constructor (name, path, style) {
		this.name = name;
		this.path = rootloc + path;
		this.style = rootloc + style;
	}

	loadScript() {
		const element = document.createElement("script");
		element.setAttribute("src", this.path);
		element.setAttribute("onload", "confirmImport()");
		//    console.log(element);
		document.head.appendChild(element);
	}
	getName () {
		return this.name
	}
}

class PopUpModule extends RLModule {
	constructor() {
		super("PopUpModule", "popUp.js", "popUp.css")
	} 
	async confirmI () {
		return await confirmImportPop()
	}
}

class CanvasContextModule extends RLModule {
	constructor() {
		super("CanvasContextModule", "CanvasContextModule.js", "CanvasContextModule.css")
	} 
	async confirmI () {
		return await confirmImportCanvas()
	}
}

const scrp = [new PopUpModule(), new CanvasContextModule()]


function create () {
	for (let i = 0; i < scrp.length; i++) {
		scrp[i].loadScript();
	}
}

async function confirmImport() {
	let all = false
	for (let i = 0; i < scrp.length; i++) {
		let c = await scrp[i].confirmI()
		if (c === false) {
			all = false
			break
		}
		if (c === true) {
			all = true
		}
	}
	if (all == true) {
		main()
	}
}

create()
