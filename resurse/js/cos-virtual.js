window.addEventListener("load", function () {
	/*
	TO DO: preluare vector id-uri din localStorage

	*/
	prod_sel = localStorage.getItem("cos_virtual");
	if (prod_sel) {
		var vect_ids = prod_sel.split(",");
		fetch("/produse_cos", {
			method: "POST",
			headers: { "Content-Type": "application/json" },

			mode: "cors",
			cache: "default",
			body: JSON.stringify({
				ids_prod: vect_ids,
			}),
		})
			.then(function (rasp) {
				console.log("Rasp:", rasp);
				x = rasp.json();
				console.log("x:", x);
				return x;
			})
			.then(function (objson) {
				console.log("objson:", objson);
				let main = document.getElementsByTagName("main")[0];
				let btn = document.getElementById("sectiune-cumpara");
				for (let prod of objson) {
					// objson e vectorul de produse
					let section = document.createElement("section");
					section.classList.add("art-produs");
					section.id = `prod_${prod.id}`;

					let div = document.createElement("div");
					div.classList.add("container-produs-cos");

					let h3 = document.createElement("h3");
					h3.innerHTML = `<a href="/produs/${prod.id}" ><span class="val-nume">${prod.nume}</span></a>`;
					h3.classList.add("nume");
					section.appendChild(h3);

					let figure = document.createElement("figure");
					figure.classList.add("imag-produs");
					figure.innerHTML = `<a href="/produs/${prod.id}" ><img src="/${prod.imagine}" style="width:50%;height:auto;" alt="[imagine <%- prod.nume %>]" /></a>`;
					div.appendChild(figure);

					let data = new Date(prod.data_adaugare);
					let zile = ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"];
					let luni = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
					let dataAfisata = `${data.getDate()} ${luni[data.getMonth()]} ${data.getFullYear()} (${zile[data.getDay()]})`;

					let table = document.createElement("table");
					table.classList.add("tabel-produs");
					table.innerHTML = `
						<thead>
							<tr>
								<th colspan="2" class="celula-tabel-produs">${prod.nume}</td>
							</tr>                            
						</thead>
						<tbody>
							<tr>
								<th scope = "row" class="celula-tabel-produs">Pret</th>
								<td class="celula-tabel-produs">${prod.pret} (lei)</td>
							</tr>
							<tr>
								<th scope = "row" class="celula-tabel-produs">Autor anunt</th>
								<td class="celula-tabel-produs"><a href="/utilizator/${prod.autor_anunt}" class="link">${prod.autor_anunt}</a></td>
							</tr>
							<tr>
								<th scope = "row" class="celula-tabel-produs">Data adaugare</th>
								<td class="celula-tabel-produs"> <time datetime="${prod.data_adaugare}">${dataAfisata}</time></td>
							</tr>
							<tr>
								<th scope = "row" class="celula-tabel-produs">Anul fabricarii</th>
								<td class="celula-tabel-produs">${prod.an_fabricatie}</td>
							</tr>
							<tr>
								<th scope = "row" class="celula-tabel-produs">Producator</th>
								<td class="celula-tabel-produs">${prod.producator}</td>
							</tr>
							<tr>
								<th scope = "row" class="celula-tabel-produs">Specificaii</th>
								<td class="celula-tabel-produs">${prod.specificatii}</td>
							</tr>
							<tr>
								<th scope = "row" class="celula-tabel-produs">Livrare inclusa</th>
								<td class="celula-tabel-produs">${prod.livrare ? "Da" : "Nu"}</td>
							</tr>
						</tbody>`;
					div.appendChild(table);
					section.appendChild(div);

					let div_buton = document.createElement("div");
					div_buton.classList.add("div-buton");
					div_buton.innerHTML = `<button class="buton" value="${prod.id}">Elimina din cos</button>`;
					div.appendChild(div_buton);

					main.insertBefore(section, btn);
					/* TO DO 
				pentru fiecare produs, creăm un articol in care afisam imaginea si cateva date precum:
				- nume, pret, imagine, si alte caracteristici

				
				document.getElementsByTagName("main")[0].insertBefore(divCos, document.getElementById("cumpara"));
				*/
				}

				let butoane = document.querySelectorAll(".div-buton .buton");
				for (let buton of butoane) {
					buton.onclick = function () {
						let iduriProduse = localStorage.getItem("cos_virtual");
						//hint pentru cantitate "1|20,5|10,3|2" 20 produse cu id-ul 1...
						if (iduriProduse) {
							iduriProduse = iduriProduse.split(",");
						} else {
							iduriProduse = [];
						}
						var poz = iduriProduse.indexOf(this.value);
						if (poz != -1) iduriProduse.splice(poz, 1);
						let parentSection = document.querySelector(`[id="prod_${parseInt(this.value)}"].art-produs`);
						parentSection.remove();
						localStorage.setItem("cos_virtual", iduriProduse.join(","));
					};
				}
			})
			.catch(function (err) {
				console.log(err);
			});
		document.getElementById("goleste-cosul").onclick = function () {
			let sectiuniProduse = document.querySelectorAll(`.art-produs`);
			for (let sectiune of sectiuniProduse) {
				sectiune.remove();
			}
			localStorage.setItem("cos_virtual", "");
		};
		setInterval(function () {
			if (!localStorage.getItem("cos_virtual")) {
				document.getElementById("sectiune-cumpara").remove();
				document.getElementsByTagName("main")[0].innerHTML = `<section><p class="mesaj-eroare">Nu aveti nimic in cos!</p></section>`;
			}
		}, 250);

		document.getElementById("cumpara").onclick = function () {
			//TO DO: preluare vector id-uri din localStorage
			prod_sel = localStorage.getItem("cos_virtual");
			if (prod_sel) {
				var vect_ids = prod_sel.split(",");
				fetch("/cumpara", {
					method: "POST",
					headers: { "Content-Type": "application/json" },

					mode: "cors",
					cache: "default",
					body: JSON.stringify({
						ids_prod: vect_ids,
					}),
				})
					.then(function (rasp) {
						console.log("Yo, man", rasp);
						return rasp.text();
					})
					.then(function (raspunsText) {
						console.log(raspunsText);
						//Ștergem conținutul paginii
						//creăm un paragraf în care scriem răspunsul de la server
						//Dacă utilizatorul e logat și cumpărarea a reușit,
						if (raspunsText.startsWith("Totu bine")) {
							localStorage.removeItem("cos_virtual");
							document.getElementsByTagName("main")[0].innerHTML = `<section><p class="mesaj-succes">Factura a fost emisa cu succes</p></section>`;
						}
					})
					.catch(function (err) {
						console.log(err);
					});
			}
		};
	} else {
		document.getElementsByTagName("main")[0].innerHTML = `<section><p class="mesaj-eroare">Nu aveti nimic in cos!</p></section>`;
	}
});
