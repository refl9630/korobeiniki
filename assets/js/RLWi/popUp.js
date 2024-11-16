async function popUp (message, type) {
	overlayOn()

	document.getElementById("overlay").innerHTML = "<div id=\"pop\"\
	<p>" + message +  "</p>\
	<button type=\"button\">NO</button>\
	<button type=\"button\">YES</button>\
	</div>"

	const conf = document.getElementById('pop');

	const btns = conf.querySelectorAll('button')
	if (type != 'selection') {
		btns[0].style.visibility = "hidden"
		btns[1].innerHTML = "OK"
	}
	else {
		btns[0].style.visibility = "visible"
		btns[1].innerHTML = "YES"
	}

	btns[0].addEventListener("click",function(){
          document.dispatchEvent(
            new CustomEvent('choice', { detail:false })
          )
        },{ once: true })
	btns[1].addEventListener("click",function(){
          document.dispatchEvent(
            new CustomEvent('choice', { detail:true })
          )
    	},{ once: true })
	
	return new Promise((resolve,reject)=>{ 
        document.addEventListener("choice",function(e){
            document.getElementById('overlay').style.display = "none";
			resolve(e.detail)
        },{ once: true })
    })
}



async function confirmImportPop() {
	return true
}