function seteazaButonTema() {
	document.getElementById("sun").style.display = localStorage.getItem("tema") ? "none" : "inline";
	document.getElementById("moon").style.display = localStorage.getItem("tema") ? "inline" : "none";
}

window.addEventListener("load", function () {
	if (document.getElementById("btn-tema")) {
		seteazaButonTema();
		document.getElementById("btn-tema").onclick = function () {
			var tema = localStorage.getItem("tema");
			if (tema) localStorage.removeItem("tema");
			else localStorage.setItem("tema", "volcano");
			document.body.classList.toggle("volcano");
			seteazaButonTema();
			console.log("I was here");
		};
	}
});
