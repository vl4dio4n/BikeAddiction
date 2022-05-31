window.addEventListener("load", function () {
	let raspunde = document.querySelectorAll(".raspunde");
	for (let rasp of raspunde) {
		console.log(rasp);
		rasp.onchange = function () {
			document.querySelector(`.raspuns.${rasp.id}`).classList.toggle("ascundere");
		};
	}
	let raspunsuri = document.querySelectorAll(".raspunsuri");
	for (let r of raspunsuri) {
		r.onchange = function () {
			document.querySelector(`.grup-raspunsuri.${r.id}`).classList.toggle("ascundere");
		};
	}
});
