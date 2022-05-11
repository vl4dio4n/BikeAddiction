console.log();

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
		p_vechi.textContent = mesaj;
	}
}

window.addEventListener("load", function () {
	var formularProfil = document.getElementsByClassName("form-inreg")[0];
	if (formularProfil) {
		formularProfil.onsubmit = function () {
			inputs = document.getElementsByTagName("input");
			for (let elem of inputs)
				if (elem.reqired && !elem.value) {
					paragrafEroare("Completati toate campurile obligatorii.");
					return false;
				}

			if (!new RegExp("^.+@.+\\..+$", "g").test(document.getElementById("inp-email").value)) {
				paragrafEroare("Email invalid");
				return false;
			}

			parola = document.getElementById("inp-parl-noua").value;
			if (parola.length > 0)
				if (parola.length < 8 || !new RegExp("[a-z]", "g").test(parola) || !new RegExp("[A-Z]", "g").test(parola) || !new RegExp(".", "g").test(parola) || parola.match(new RegExp("[0-9]", "g")).length < 2) {
					paragrafEroare("Parola nu respecta conditiile cerute.");
					return false;
				}

			return true;
		};
	}
	var formularStergere = document.getElementsByClassName("form-inreg")[1];
	if (formularStergere)
		formularStergere.onsubmit = function () {
			ans = prompt("Esti sigur ca vrei sa stergi aces cont? Da sau Nu:");
			return ans == "Da";
		};
});
