window.onload = function () {
	document.getElementById("input-an-fabricatie").onchange = function () {
		document.getElementById("infoRangeAn").innerHTML = ` (${this.value})`;
	};
	document.getElementById("input-pret").onchange = function () {
		document.getElementById("infoRangePret").innerHTML = ` (${this.value})`;
	};

	for (let chk of document.getElementsByName("gr-check"))
		chk.onchange = function () {
			if (chk.checked == false) document.getElementById("check-toate").checked = false;
		};

	document.getElementById("check-toate").onchange = function () {
		var checkboxes = document.getElementsByName("gr-check");
		for (let chk of checkboxes) chk.checked = this.checked;
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
		var valAutorAnunt = document.getElementById("input-autor-anunt").value;
		var valSpecificatie = document.getElementById("input-specificatii").value;
		var valPret = document.getElementById("input-pret").value;
		var keywordsArr = document.getElementById("input-keywords").value.split(" ");

		var optiuniCategToate = document.getElementById("input-categ-produse").getElementsByTagName("option");
		var optiuniCateg = [];
		for (let opt of optiuniCategToate)
			if (opt.selected) {
				optiuniCateg.push(opt.value);
			}

		var checkboxes = document.getElementsByName("gr-check");
		var producatoriArr = [];
		for (let chk of checkboxes)
			if (chk.checked) {
				producatoriArr.push(chk.value);
			}

		var articole = document.getElementsByClassName("produs");
		for (let art of articole) {
			art.style.display = "none";
			let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
			let condNume = numeArt.startsWith(valNume);

			let anFabricatieArt = parseInt(art.getElementsByClassName("val-an-fabricatie")[0].innerHTML);
			let condAnFaricatie = anFabricatieArt >= valAnFabricatie;

			let livrareArt = art.getElementsByClassName("val-livrare")[0].innerHTML;
			let condLivrare = livrare == "Toate" || livrareArt == livrare;

			let categProdArt = art.getElementsByClassName("val-categ-produse")[0].innerHTML;
			let condCategProd = optiuniCateg.includes(categProdArt) || optiuniCateg.includes("toate");

			let autorAnunt = art.getElementsByClassName("val-autor-anunt")[0].innerHTML;
			let condAutorAnunt = valAutorAnunt == "" || autorAnunt == valAutorAnunt;

			let producator = art.getElementsByClassName("val-producator")[0].innerHTML;
			let condProducator = producatoriArr.includes(producator);

			let pretArt = parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
			let condPret = pretArt >= valPret;

			let descriere = art.getElementsByClassName("val-descriere")[0].innerHTML.split(" ");
			let condKeywords = false;
			for (let keyword of keywordsArr)
				if (keyword != "" && descriere.includes(keyword)) {
					condKeywords = true;
					break;
				}
			if (keywordsArr.length == 1 && keywordsArr[0] == "") condKeywords = true;

			let specificatii = art.getElementsByClassName("val-specificatii")[0].innerHTML.split(",");
			let condSpecificatii = false;
			for (let spec of specificatii)
				if (valSpecificatie == spec) {
					condSpecificatii = true;
					break;
				}
			if (valSpecificatie == "toate") condSpecificatii = true;

			let condFinala = condNume && condLivrare && condAnFaricatie && condCategProd && condAutorAnunt && condProducator && condKeywords && condSpecificatii && condPret;
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
