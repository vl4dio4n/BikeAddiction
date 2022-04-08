// const { shallowCopyFromList } = require("ejs/lib/utils");
const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const { Client } = require("pg");
const ejs = require("ejs");
const sass = require("sass");

var client = new Client({ user: "vl4dio4n", password: "0000", database: "BikeAddiction", host: "localhost", port: 5432 });
client.connect();

const obGlobal = { obImagini: null, obErori: null };

app = express();

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));

app.use("/*", function (req, res, next) {
	res.locals.propGenerala = "bbn$";
	next();
});

app.get(["/", "/index", "/home"], function (req, res) {
	client.query("select * from produse", function (err, rezQuery) {
		if (err) console.log(err);
		else {
			res.render("pagini/index", { ip: req.ip, produse: rezQuery.rows });
		}
	});
});

app.get("/produse", function (req, res) {
	client.query("select distinct autor_anunt from produse", function (err, users) {
		res.locals.users = users.rows;
	});
	client.query("select distinct producator from produse", function (err, producatori) {
		res.locals.producatori = producatori.rows;
	});

	client.query("select distinct specificatii from produse", function (err, specificatii) {
		console.log(specificatii);
		specificatiiArr = [];
		for (let obj of specificatii.rows) {
			for (let specificatie of obj.specificatii) {
				if (!specificatiiArr.includes(specificatie)) specificatiiArr.push(specificatie);
			}
		}
		console.log(specificatiiArr);
		res.locals.specificatii = specificatiiArr;
	});

	client.query("select min(an_fabricatie) from produse", function (err, an_minim) {
		res.locals.an_minim = parseInt(an_minim.rows[0].min);
	});

	client.query("select min(pret) from produse", function (err, pret_minim) {
		res.locals.pret_minim = parseFloat(pret_minim.rows[0].min);
	});

	client.query("select max(pret) from produse", function (err, pret_maxim) {
		res.locals.pret_maxim = parseFloat(pret_maxim.rows[0].max);
	});

	client.query("select * from unnest(enum_range(null::categ_produse))", function (err, rezCateg) {
		var condWhere = req.query.tip ? `categ_produse='${req.query.tip}'` : "1=1";
		console.log(condWhere);
		client.query("select * from produse where " + condWhere, function (err, rezQuery) {
			res.render("pagini/produse", { produse: rezQuery.rows, optiuni: rezCateg.rows });
		});
	});
});

app.get("/produs/:id", function (req, res) {
	client.query(`select * from produse where id = ${req.params.id}`, function (err, rezQuery) {
		res.render("pagini/produs", { prod: rezQuery.rows[0] });
	});
});

app.get("/eroare", function (req, res) {
	randeazaEroare(res, 1, "Titlu scimbat");
});

app.get("/galerie", function (req, res) {
	nr_imag = Math.floor(Math.random() * 5) * 2 + 6;
	res.render("pagini/galerie.ejs", { imagini_static: selecteazaImaginiStatic(), imagini_animat: selecteazaImaginiAnimat() });
});

app.get("*/galerie-animata.css", function (req, res) {
	prelucrareSass(res, "galerie-animata.scss", { nr_imag: nr_imag });
});

// app.get("*/pagina-produse.css", function (req, res) {
// 	prelucrareSass(res, "pagina-produse.scss", { nr_produse: nr_produse });
// });

// app.get("*/galerie-animata.css", function (req, res) {
// 	let sirScss = fs.readFileSync(__dirname + "/resurse/sass/galerie-animata.scss").toString("utf8");
// 	let rezScss = ejs.render(sirScss, { nr_imag: nr_imag });
// 	let caleScss = __dirname + "/temp/galerie-animata.scss";
// 	fs.writeFileSync(caleScss, rezScss);
// 	try {
// 		let rezCompilare = sass.compile(caleScss, { sourceMap: true });
// 		let caleCss = __dirname + "/temp/galerie-animata.css";
// 		fs.writeFileSync(caleCss, rezCompilare.css);
// 		res.setHeader("Content-Type", "text/css");
// 		res.sendFile(caleCss);
// 	} catch (err) {
// 		console.log(err);
// 		res.send("Eroare");
// 	}
// });

// app.get("*/pagina-produse.css", function (req, res) {
// 	let sirScss = fs.readFileSync(__dirname + "/resurse/sass/pagina-produse.scss").toString("utf8");
// 	let rezScss = ejs.render(sirScss, { nr_imag: nr_imag });
// 	let caleScss = __dirname + "/temp/pagina-produse.scss";
// 	fs.writeFileSync(caleScss, rezScss);
// 	try {
// 		let rezCompilare = sass.compile(caleScss, { sourceMap: true });
// 		let caleCss = __dirname + "/temp/pagina-produse.css";
// 		fs.writeFileSync(caleCss, rezCompilare.css);
// 		res.setHeader("Content-Type", "text/css");
// 		res.sendFile(caleCss);
// 	} catch (err) {
// 		console.log(err);
// 		res.send("Eroare");
// 	}
// });

app.get("/*.ejs", function (req, res) {
	console.log("Eroare ejs");
	randeazaEroare(res, 403);
});

app.get("/*", function (req, res) {
	res.render("pagini" + req.url, function (err, rezRender) {
		if (err) {
			if (err.message.includes("Failed to lookup view")) {
				randeazaEroare(res, 404);
			} else res.render("pagini/eroare", { message: "Eroare generala", title: "Eroare generala" });
		} else res.send(rezRender);
	});
	res.end();
});

/********************************************************************************************************************/

function prelucrareSass(res, fileName, kwargs) {
	let sirScss = fs.readFileSync(__dirname + "/resurse/sass/" + fileName).toString("utf8");
	let rezScss = ejs.render(sirScss, kwargs);
	let caleScss = __dirname + "/temp/" + fileName;
	fs.writeFileSync(caleScss, rezScss);
	try {
		let rezCompilare = sass.compile(caleScss, { sourceMap: true });
		let caleCss = __dirname + "/temp/" + fileName;
		fs.writeFileSync(caleCss, rezCompilare.css);
		res.setHeader("Content-Type", "text/css");
		res.sendFile(caleCss);
	} catch (err) {
		console.log(err);
		res.send("Eroare");
	}
}

function creeazaImagini() {
	var buf = fs.readFileSync(__dirname + "/resurse/json/galerie.json").toString("utf8");
	obImagini = JSON.parse(buf);

	for (let imag of obImagini.imagini) {
		let nume_imag, extensie;
		[nume_imag, extensie] = imag.cale_fisier.split("/")[1].split(".");

		let dim_mic = 150;
		imag.mic = `${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp`;
		imag.mare = `${obImagini.cale_galerie}/${imag.cale_fisier}`;
		if (!fs.existsSync(imag.mic))
			sharp(__dirname + "/" + imag.mare)
				.resize(dim_mic)
				.toFile(__dirname + "/" + imag.mic);

		let dim_mediu = 300;
		imag.mediu = `${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.webp`;
		if (!fs.existsSync(imag.mediu))
			sharp(__dirname + "/" + imag.mare)
				.resize(dim_mediu)
				.toFile(__dirname + "/" + imag.mediu);
	}
}
creeazaImagini();

function creeazaErori() {
	var buf = fs.readFileSync(__dirname + "/resurse/json/erori.json").toString("utf8");
	obErori = JSON.parse(buf);
}
creeazaErori();

function randeazaEroare(res, identificator, titlu, text, imagine, icon) {
	let eroare = obErori.erori.find(function (elem) {
		return elem.identificator == identificator;
	});
	titlu = titlu || (eroare && eroare.titlu) || "Eroare - eroare";
	text = text || (eroare && eroare.text) || "Ce eroare ciudata";
	imagine = imagine || (eroare && eroare.imagine) || obErori.cale_baza + "/" + "interzis.png";
	icon = icon || (eroare && eroare.icon) || "fas fa-ban";

	if (eroare && eroare.status) {
		res.status(eroare.identificator).render("pagini/eroare", { titlu: eroare.titlu, text: eroare.text, imagine: obErori.cale_baza + "/" + eroare.imagine, icon: eroare.icon });
	} else {
		res.render("pagini/eroare", { titlu: titlu, text: text, imagine: imagine, icon: icon });
	}
}

function selecteazaImaginiStatic() {
	let imagini = [];
	const luna_curenta = new Date().getMonth();
	const luni = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];
	for (let imag of obImagini.imagini)
		if (imag.luni.includes(luni[luna_curenta])) {
			imagini.push(imag);
		}
	imagini = imagini.sort((a, b) => 0.5 - Math.random());
	imagini = imagini.slice(0, 12);
	return imagini;
}

function selecteazaImaginiAnimat() {
	let imagini = [];
	for (let imag of obImagini.imagini)
		if (imagini.length < nr_imag) {
			imagini.push(imag);
		}
	return imagini;
}

app.listen(8080);
console.log("A pornit");
