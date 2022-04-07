window.onload = function () {
	document.getElementById("input-an-fabricatie").onchange = function () {
		document.getElementById("infoRange").innerHTML = ` (${this.value})`;
	};

	document.getElementById("filtrare").onclick = function () {
		var valNume = document.getElementById("input-nume").value.toLowerCase();

		var butoaneRadio = document.getElementsByName("gr-rad");
		for (let rad of butoaneRadio)
			if (rad.checked) {
				var livrare = rad.value;
				break;
			}

		var valAnFabricatie = parseInt(document.getElementById("input-an-fabricatie").value);
		var valCategProd = document.getElementById("input-categ-produse").value;

		// livrare = livrare == "true" ? true : livrare == "false" ? false : undefined;
		// var minCalorii, maxCalorii;
		// if (valCalorii != "toate") {
		// 	[minCalorii, maxCalorii] = valCalorii.split(":");
		// 	minCalorii = parseInt(minCalorii);
		// 	maxCalorii = parseInt(maxCalorii);
		// } else {
		// 	minCalorii = 0;
		// 	maxCalorii = 10000000000;
		// }

		// console.log(valPret);

		// var valCategorie = document.getElementById("inp-categorie").value;

		var articole = document.getElementsByClassName("produs");
		for (let art of articole) {
			// art.style.display = "none";
			// let numeArt = art.getElementsByClassName("val-nume").innerHTML.toLowerCase();

			// let cond1 = numeArt.startsWith(valNume);

			// let caloriiArt = parseInt(art.getElementsByClassName("val-calorii")[0].innerHTML);
			// let cond2 = minCalorii <= caloriiArt && caloriiArt < maxCalorii;

			// let pretArt = parseInt(art.getElementsByClassName("val-pret")[0].innerHTML);
			// let cond3 = valPret <= pretArt;

			// let categArt = art.getElementsByClassName("val-categorie")[0].innerHTML;
			// let cond4 = valCategorie == "toate" || categArt == valCategorie;

			// let condFinala = cond1 && cond2 && cond3 && cond4;
			// if (condFinala) art.style.display = "block";

			art.style.display = "none";
			let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
			let condNume = numeArt.startsWith(valNume);

			let anFabricatieArt = parseInt(art.getElementsByClassName("val-an-fabricatie")[0].innerHTML);
			let condAnFaricatie = anFabricatieArt >= valAnFabricatie;

			let livrareArt = art.getElementsByClassName("val-livrare")[0].innerHTML;
			let condLivrare = livrare == "Toate" || livrareArt == livrare;

			let categProdArt = art.getElementsByClassName("val-categ-produse")[0].innerHTML;
			let condCategProd = valCategProd == "toate" || categProdArt == valCategProd;

			let condFinala = condNume && condLivrare && condAnFaricatie && condCategProd;
			if (condFinala) art.style.display = "block";
		}
	};

	// document.getElementById("reseteaza").onclick = function () {
	// 	var articole = document.getElementsByClassName("produs");
	// 	for (let art of articole) {
	// 		art.style.disply = "block";
	// 	}
	// 	document.getElementById("input-nume").value = "";
	// 	document.getElementById("input-rad3").checked = true;
	// 	document.getElementById("input-an-fabricatie").value = 0;
	// 	document.getElementById("infoRange").innerHTML = new Date().getFullYear();
	// 	document.getElementById("select-toate").selected = true;
	// };

	// function sortare(semn) {
	// 	var articole = document.getElementsByClassName("produs");
	// 	var v_articole = Array.from(articole);
	// 	v_articole.sort(function (a, b) {
	// 		let pret_a = parseFloat(a.getElementsbyClassName("val-pret")[0].innerHTML);
	// 		let pret_b = parseFloat(a.getElementsbyClassName("val-pret")[0].innerHTML);
	// 		if (pret_a != pret_b) return semn * (pret_a - pret_b);
	// 		else {
	// 			let nume_a = a.getElementsbyClassName("val-nume")[0].innerHTML.toLowerCase();
	// 			let nume_b = a.getElementsbyClassName("val-nume")[0].innerHTML.toLowerCase();
	// 			return semn * nume_a.localeCompare(nume_b);
	// 		}
	// 	});
	// 	for (let art of v_articole) {
	// 		art.parentElement.appendChild(art);
	// 	}
	// }

	// document.getElementById("sortCrescNume").onclick = function () {
	// 	sortare(1);
	// };

	// document.getElementById("sortDescrescNume").onclick = function () {
	// 	sortare(-1);
	// };
	// window.onkeypress = function (e) {
	// 	if (e.key == "c" && e.altKey) {
	// 		let p_vechi = document.getElementById("afis-suma");
	// 		if (!p_vechi) {
	// 			let p = document.createElement("p");
	// 			p.id = "afisare-suma";
	// 			let suma = 0;
	// 			var articole = document.getElementsByClassName("produs");
	// 			for (let art of articole)
	// 				if (art.style.display != "none") {
	// 					suma += parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
	// 				}
	// 			p.innerHTML = "<b>Suma: </b>" + suma;
	// 			var sectiune = document.getElementById("grid-produse");
	// 			sectiune.parentNode.insertBefore(p, sectiune);
	// 			setTimeout(function () {
	// 				let p_vechi = document.getElementById("afis-suma");
	// 				if (p_vechi) p_vechi.remove();
	// 			}, 2000);
	// 		}
	// 	}
	// };
};
