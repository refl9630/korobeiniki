const Sounds = {
	soundvalues: {
		"music": {
		korobeiniki: {
			"name": "bgm",
			"path": './assets/audio/music/Korobeiniki.mp3',
			"loop": true
			}
		},
		"sfx": [
		 {
			"name": "move",
			"path": './assets/audio/fx/small.mp3',
			"loop": false
		},
		 {
			"name": "roll",
			"path": './assets/audio/fx/rotate.mp3',
			"loop": false
		},
		 {
			"name": "fall",
			"path": './assets/audio/fx/fall.mp3',
			"loop": false
		},
		 {
			"name": "drop",
			"path": './assets/audio/fx/drop.mp3',
			"loop": false
		},
		 {
			"name": "beam",
			"path": './assets/audio/fx/beam.mp3',
			"loop": false
		}
		]
	},
	bgm: new Audio (),
	dangerMode: false,
	sfx: {

	},
	loadFX () {
		for (let i = 0; i < this.soundvalues.sfx.length; i++) {
			const info = this.soundvalues.sfx[i]
			let name = info["name"]
			const myaudio = new Audio ()
			Object.defineProperty(this.sfx, name, {
				value: myaudio
			})
			this.load(info['path'], info["loop"], name)
		}
		console.log(this.sfx);
	},
	loadBGM (track) {
		const info = this.soundvalues.music[track]
		this.bgm.src = info['path'];
		this.bgm.loop = true;
		this.bgm.preload = "auto";
		this.bgm.volume = 0.7;
	},
	load (path, loop, name) {
		this.sfx[name].src = path;
		this.sfx[name].loop = loop;
		this.sfx[name].preload = "auto";
	},
	playFX (name) {
		this.sfx[name].currentTime = 0;
		this.sfx[name].play();
	},
	toggleDanger (dangerbool) {
		if (dangerbool === this.dangerMode) {
			return
		}
		else {
			switch (dangerbool) {
				case true:
					this.bgm.playbackRate = 1.25
					break;
				case false:
					this.bgm.playbackRate = 1
					break;
				default:
					break;
			}
			this.dangerMode = dangerbool
		}
	}
}

Sounds.loadFX()
Sounds.loadBGM()