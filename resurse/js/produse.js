window.addEventListener("load", function () {
	document.getElementById("check-filtre").onchange = function () {
		let container_filtre = document.getElementById("container-filtre");
		if (container_filtre.classList[0] == "clasa-ascundere") {
			container_filtre.classList.remove("clasa-ascundere");
			container_filtre.classList.add("grid-filtre");
		} else {
			container_filtre.classList.remove("grid-filtre");
			container_filtre.classList.add("clasa-ascundere");
		}

		if (this.checked == true) {
			document.getElementById("arrow-up").style.display = "inline";
			document.getElementById("arrow-down").style.display = "none";
		} else {
			document.getElementById("arrow-up").style.display = "none";
			document.getElementById("arrow-down").style.display = "inline";
		}
	};

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

		let p_vechi = document.getElementById("afis-suma-medie");
		if (p_vechi) p_vechi.remove();
	};

	document.getElementById("resetare").onclick = function () {
		var articole = document.getElementsByClassName("produs");

		for (let art of articole) {
			art.style.display = "block";
		}

		var checkboxes = document.getElementsByName("gr-check");
		for (let chk of checkboxes) chk.checked = true;

		var optiuniCategToate = document.getElementById("input-categ-produse").getElementsByTagName("option");
		for (let opt of optiuniCategToate) opt.selected = false;
		document.getElementById("select-multiplu-toate").selected = true;

		document.getElementById("input-nume").value = "";
		document.getElementById("input-rad3").checked = true;
		document.getElementById("input-an-fabricatie").value = parseInt(document.getElementById("an-minim").innerHTML.slice(1, -1));
		document.getElementById("infoRangeAn").innerHTML = parseInt(parseInt(document.getElementById("an-minim").innerHTML.slice(1, -1)));
		document.getElementById("input-pret").value = parseInt(document.getElementById("pret-minim").innerHTML.slice(1, -1));
		document.getElementById("infoRangePret").innerHTML = parseInt(parseInt(document.getElementById("pret-minim").innerHTML.slice(1, -1)));
		document.getElementById("select-toate").selected = true;
		document.getElementById("input-keywords").value = "";
		document.getElementById("input-autor-anunt").value = "";

		let p_vechi = document.getElementById("afis-suma-medie");
		if (p_vechi) p_vechi.remove();
	};

	function sortare(semn) {
		var articole = document.getElementsByClassName("produs");
		var arrArticole = Array.from(articole);
		arrArticole.sort(function (a, b) {
			let an_a = parseInt(a.getElementsByClassName("val-an-fabricatie")[0].innerHTML);
			let an_b = parseInt(b.getElementsByClassName("val-an-fabricatie")[0].innerHTML);
			let pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
			let pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);

			if (an_a / pret_a != an_b / pret_b) return semn * (an_a / pret_a - an_b / pret_b);
			else {
				let categ_a = a.getElementsByClassName("val-categ-produse")[0].innerHTML.toLowerCase();
				let categ_b = b.getElementsByClassName("val-categ-produse")[0].innerHTML.toLowerCase();
				return semn * categ_a.localeCompare(categ_b);
			}
		});
		for (let art of arrArticole) {
			art.parentElement.appendChild(art);
		}
	}

	document.getElementById("sortCresc").onclick = function () {
		sortare(1);
	};

	document.getElementById("sortDescresc").onclick = function () {
		sortare(-1);
	};

	window.onkeydown = function (e) {
		if (e.key == "c" && e.altKey) {
			let p_vechi = document.getElementById("afis-suma-medie");
			if (!p_vechi) {
				let p = document.createElement("p");
				p.id = "afis-suma-medie";
				let suma = 0;
				let cntArt = 0;
				let articole = document.getElementsByClassName("produs");
				for (let art of articole)
					if (art.style.display != "none") {
						suma += parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
						cntArt++;
					}
				p.innerHTML = `Pretul mediu al articolelor afisate: ${suma / cntArt}`;
				var sectiune = document.getElementById("container-filtre");
				p.classList.add("mesaj-succes");
				p.style.gridArea = "z-mesaj";
				p.style.marginBottom = "20px";
				sectiune.insertBefore(p, sectiune.lastChild);
				setTimeout(function () {
					let p_vechi = document.getElementById("afis-suma-medie");
					if (p_vechi) p_vechi.remove();
				}, 5000);
			}
		}
	};

	var checkboxuri = this.document.getElementsByClassName("select-cos");
	for (let ch of checkboxuri) {
		ch.onchange = function () {
			let iduriCos = localStorage.getItem("cos_virtual");
			if (iduriCos) {
				iduriCos = iduriCos.split(",");
			} else {
				iduriCos = [];
			}
			if (this.checked) {
				iduriCos.push(this.value);
			} else if (iduriCos.includes(this.value)) {
				iduriCos.remove(this.value);
			}
			localStorage.setItem("cos_virtual", iduriCos.join(","));
		};
	}
});
