function paragrafEroare(mesaj) {
	let p_vechi = document.getElementsByClassName("mesaj-eroare")[0] || document.getElementsByClassName("mesaj-succes")[0];
	if (!p_vechi) {
		let p = document.createElement("p");
		p.classList.add("mesaj-eroare");
		p.innerHTML = mesaj;
		var sectiune = document.getElementsByTagName("section")[0];
		sectiune.insertBefore(p, sectiune.lastChild);
	} else {
		p_vechi.classList.remove(p_vechi.classList[0]);
		p_vechi.classList.add("mesaj-eroare");
		p_vechi.innerHTML = mesaj;
	}
}

function checkNumber(str) {
	for (let ch of str) if (isNaN(ch)) return false;
	return true;
}

window.addEventListener("load", function () {
	var formular = document.getElementsByClassName("form-anunt")[0];
	console.log(formular);
	if (formular) {
		formular.onsubmit = function () {
			inputs = document.getElementsByTagName("input");
			for (let elem of inputs)
				if (elem.reqired && !elem.value) {
					paragrafEroare("Completati toate campurile obligatorii.");
					return false;
				}

			let email = document.getElementById("inp-email").value;
			if (email.length != 0 && !new RegExp("^.+@.+\\..+$", "g").test(email)) {
				paragrafEroare("Email invalid");
				return false;
			}

			if (document.getElementById("inp-nume").value.length > 50) {
				paragrafEroare("Lungimea numelui nu poate depasi 50 de caractere");
				return false;
			}

			if (document.getElementById("inp-producator").value.length > 300) {
				paragrafEroare("Lungimea numelui producatorului nu poate depasi 300 de caractere");
				return false;
			}

			let pret = document.getElementById("inp-pret").value.split(".");
			if (pret.length > 2 || (pret.length == 1 && !checkNumber(pret[0])) || (pret.length == 2 && (!checkNumber(pret[0]) || !checkNumber(pret[1])))) {
				paragrafEroare("Introduceti un numar valid");
				return false;
			}
			if (pret[0].length > 6 || (pret[1] && pret[1].length > 2)) {
				paragrafEroare(`Numarul rotunjit nu trebuie sa depaseasca valoarea 10<sup>6</sup> si precizia de 2 zecimale`);
				return false;
			}

			let an = document.getElementById("inp-an").value;
			if (an.length > 4 || parseInt(an).toString() != an) {
				paragrafEroare("Introduceti un an valid");
				return false;
			}
			return true;
		};
	}
});
