//controle virtual
var holdKey = false
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