window.addEventListener("load", function () {
	let luni = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
	let leftArrow = document.querySelector(".fas.fa-angle-left");
	leftArrow.onclick = function () {
		let p = document.querySelector("#calendar-section span");
		let zi = parseInt(p.textContent.trim().split(" ")[0]);
		let luna = p.textContent.trim().split(" ")[1];
		let an = parseInt(p.textContent.trim().split(" ")[2]);
		let text = "";
		if (luni.indexOf(luna) == 0) {
			genereazaCalendar(11, an - 1);
			p.textContent = `${zi} ${luni[11]} ${an - 1}`;
		} else {
			genereazaCalendar(luni.indexOf(luna) - 1, an);
			p.textContent = `${zi} ${luni[luni.indexOf(luna) - 1]} ${an}`;
		}
	};
	let rightArrow = document.querySelector(".fas.fa-angle-right");
	console.log(rightArrow);
	rightArrow.onclick = function () {
		let p = document.querySelector("#calendar-section span");
		let zi = parseInt(p.textContent.trim().split(" ")[0]);
		let luna = p.textContent.trim().split(" ")[1];
		let an = parseInt(p.textContent.trim().split(" ")[2]);
		let text = "";
		if (luni.indexOf(luna) == luni.length - 1) {
			genereazaCalendar(0, an + 1);
			p.textContent = `${zi} ${luni[0]} ${an + 1}`;
		} else {
			genereazaCalendar(luni.indexOf(luna) + 1, an);
			p.textContent = `${zi} ${luni[luni.indexOf(luna) + 1]} ${an}`;
		}
	};
});

function genereazaCalendar(luna, an) {
	let d = new Date(1, luna, an);
	let nrZile = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (an % 400 == 0 || (an % 4 == 0 && an % 100 != 0)) nrZile[1] = 29;
	let nrZileCalendar = nrZile[luna];
	let zileLunaAnterioara = luna > 0 ? nrZile[luna - 1] : nrZile[nrZile.length - 1];
	primaZiLuna = new Date(an, luna, 1);
	ultimaZiLuna = new Date(an, luna, nrZileCalendar);
	ziSaptPrimaZiLuna = (primaZiLuna.getDay() - 1 + 7) % 7;
	ziSaptUltimaZiLuna = (ultimaZiLuna.getDay() - 1 + 7) % 7;

	let calendar = document.querySelector("#calendar");
	while (calendar.querySelectorAll("div").length > 7) {
		calendar.lastElementChild.remove();
	}

	for (let i = 0; i < ziSaptPrimaZiLuna; i++) {
		let div = document.createElement("div");
		div.classList.add("faded");
		div.innerHTML = `${zileLunaAnterioara - ziSaptPrimaZiLuna + i + 1}`;
		calendar.appendChild(div);
	}

	let j = ziSaptPrimaZiLuna;
	for (let i = 1; i <= nrZileCalendar; i++) {
		let div = document.createElement("div");
		div.classList.add("zi");
		div.innerHTML = `${i}`;
		if ((j == 4 && i + 7 > nrZileCalendar) || (j == 6 && i % 2 == 0) || (i == 25 && luna == 11) || (j == 4 && i == 13) || (i == 31 && luna == 9)) {
			div.style.backgroundColor = "var(--color6)";
		}
		if (j == 4 && i + 7 > nrZileCalendar) div.title = "Reducere produse";
		else if (j == 6 && i % 2 == 0) div.title = "Promotie";
		else if (i == 25 && luna == 11) div.title = "Craciun";
		else if (j == 4 && i == 13) div.title = "Vineri 13";
		else if (i == 31 && luna == 9) div.title = "Halloween";
		calendar.appendChild(div);
		j = (j + 1) % 7;
	}

	for (let i = 0; i < 6 - ziSaptUltimaZiLuna; i++) {
		let div = document.createElement("div");
		div.classList.add("faded");
		div.innerHTML = `${i + 1}`;
		calendar.appendChild(div);
	}
}
