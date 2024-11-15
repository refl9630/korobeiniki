function updateScore () {
    const lvl = document.getElementById('level');
    const ln = document.getElementById('lines');
    const sc = document.getElementById('score');
    lvl.innerHTML = "Level " + level
    ln.innerHTML = "Lines " + linesCleared
    sc.innerHTML = "Score<br>" + score
}
function overlayOn() {
    document.getElementById("overlay").style.display = "block";
  }
function overlayOff() {
    document.getElementById("overlay").style.display = "none";
  }