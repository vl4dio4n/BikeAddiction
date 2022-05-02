const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const { Client } = require("pg");
const ejs = require("ejs");
const sass = require("sass");
const formidable = require("formidable");
const crypto = require("crypto");
const session = require("express-session");
const req = require("express/lib/request");
const nodemailer = require("nodemailer");
const path = require("path");

const obGlobal = {
	obImagini: null,
	obErori: null,
	categProduse: null,
	emailServer: "bikeaddiction2@gmail.com",
	protocol: null,
	numeDomeniu: null,
	port: 8080,
	sirAlphaNum: [],
};

async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente = []) {
	var transp = nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth: {
			//date login
			user: obGlobal.emailServer,
			pass: "kmowmawxfidetdyw",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
	//genereaza html
	await transp.sendMail({
		from: obGlobal.emailServer,
		to: email,
		subject: subiect, //"Te-ai inregistrat cu succes",
		text: mesajText, //"Username-ul tau este "+username
		html: mesajHtml, // `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
		attachments: atasamente,
	});
	console.log("trimis mail");
}

if (process.env.SITE_ONLINE) {
	obGlobal.protocol = "https://";
	obGlobal.numeDomeniu = "boiling-refuge-00098.herokuapp.com";
	var client = new Client({
		user: "xokygzdfvjrupd",
		password: "ec1209476dd30ffc109c1b73c7ea39d86dc1565ac8a3858c82040235141c7f20",
		database: "d1kfoqthf001hn",
		host: "ec2-54-158-247-210.compute-1.amazonaws.com",
		port: 5432,
		ssl: {
			rejectUnauthorized: false,
		},
	});
} else {
	obGlobal.protocol = "http://";
	obGlobal.numeDomeniu = "localhost:" + obGlobal.port;
	var client = new Client({
		user: "vl4dio4n",
		password: "0000",
		database: "BikeAddiction",
		host: "localhost",
		port: 5432,
	});
}

client.connect();

app = express();

app.use(
	session({
		// aici se creeaza proprietatea session a requestului (pot folosi req.session)
		secret: "abcdefg", //folosit de express session pentru criptarea id-ului de sesiune
		resave: true,
		saveUninitialized: false,
	})
);

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));

client.query("select * from unnest(enum_range(null::categ_produse))", function (err, rezCateg) {
	let categProduse = [];
	for (let opt of rezCateg.rows) categProduse.push(opt.unnest);
	obGlobal.categProduse = categProduse;
});

app.use("/*", function (req, res, next) {
	res.locals.categProduse = obGlobal.categProduse;
	res.locals.utilizator = req.session.utilizator;
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
		specificatiiArr = [];
		for (let obj of specificatii.rows) {
			for (let specificatie of obj.specificatii) {
				if (!specificatiiArr.includes(specificatie)) specificatiiArr.push(specificatie);
			}
		}
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

var intervaleAscii = [
	[48, 57],
	[65, 90],
	[97, 122],
];
for (let interval of intervaleAscii)
	for (let i = interval[0]; i <= interval[1]; i++) {
		obGlobal.sirAlphaNum += String.fromCharCode(i);
	}

function genereazaToken(n) {
	var token = "";
	for (let i = 0; i < n; i++) {
		token += obGlobal.sirAlphaNum[Math.floor(Math.random() * obGlobal.sirAlphaNum.length)];
	}
	return token;
}

parolaServer = "tehniciweb";
app.post("/inreg", function (req, res) {
	var formular = new formidable.IncomingForm();
	formular.parse(req, function (err, campuriText, campuriFisier) {
		console.log(campuriText);

		var eroare = "";
		if (campuriText.username == "") {
			eroare += "Username necompletat. ";
		}
		if (!campuriText.username.match(new RegExp("^[A-Za-z0-9]+$"))) {
			eroare += "Username nu corespunde pattern-ului. ";
		}
		if (!eroare) {
			queryUtilizator = `select username from utilizatori where username='${campuriText.username}'`;
			console.log(queryUtilizator);
			client.query(queryUtilizator, function (err, rezUtilizator) {
				if (err) console.log(err);
				if (rezUtilizator.rows.length != 0) {
					eroare += "Username-ul mai exista. ";
					res.render("pagini/inregistrare", { err: "Eroare " + eroare });
				} else {
					var token = genereazaToken(100);
					var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
					console.log(token);
					var comandaInserare = `insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod) values ('${campuriText.username}', '${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}', '${token}')`;
					client.query(comandaInserare, function (err, rezInserare) {
						if (err) {
							console.log(err);
							res.render("pagini/inregistrare", { err: "Eroare baza de date" });
						} else {
							res.render("pagini/inregistrare", { raspuns: "Datele au fost introduse" });
							//http://localhost:8080/cod/[username]/[token]
							let linkConfirmare = `${obGlobal.protocol}${obGlobal.numeDomeniu}/cod/${campuriText.username}/${token}`;
							trimiteMail(campuriText.email, `Te-ai inregistrat`, "text", `'<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${campuriText.username}.</p> <p>Link confirmare: <a href='${linkConfirmare}'>${campuriText.username}</a></p>`);
						}
					});
				}
			});
		} else res.render("pagini/inregistrare", { err: "Eroare: " + eroare });
	});
});

app.post("/login", function (req, res) {
	var formular = new formidable.IncomingForm();
	formular.parse(req, function (err, campuriText, campuriFisier) {
		console.log(campuriText);
		var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
		var querySelect = `select * from utilizatori where username = '${campuriText.username}' and parola = '${parolaCriptata}' and confirmat_mail = true`;
		client.query(querySelect, function (err, rezSelect) {
			if (err) console.log(err);
			else {
				if (rezSelect.rows.length == 1) {
					//daca am utilizatorul si a dat credentialele corecte
					req.session.utilizator = {
						nume: rezSelect.rows[0].nume,
						prenume: rezSelect.rows[0].prenume,
						username: rezSelect.rows[0].username,
						culoareChat: rezSelect.rows[0].culoareChat,
						rol: rezSelect.rows[0].rol,
					};
				}
				res.redirect("/index");
			}
		});
	});
});

app.get("/cod/:username/:token", function (req, res) {
	var comandaSelect = `update utilizatori set confirmat_mail = true where username = '${req.params.username}' and cod = '${req.params.token}'`;
	console.log("I was here");
	client.query(comandaSelect, function (err, rezUpdate) {
		if (err) {
			console.log(err);
			randeazaEroare(res, 2);
		} else {
			if (rezUpdate.rowCount == 1) {
				res.render("pagini/confirmare");
			} else {
				randeazaEroare(res, 2, "Eroare link confirmare", "Nu e user-ul sau link-ul corect");
			}
		}
	});
});

app.get("/login", function (req, res) {
	res.render("pagini/login");
});

app.get("/logout", function (req, res) {
	req.session.destroy;
	res.locals.utilizator = null;
	req.render("pagini/logout");
});

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
	var buf = fs.readFileSync(__dirname + "/resurse/JSON/galerie.json").toString("utf8");
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
	var buf = fs.readFileSync(__dirname + "/resurse/JSON/erori.json").toString("utf8");
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

// app.listen(8080);
var s_port = process.env.PORT || obGlobal.port;
app.listen(s_port);

console.log("A pornit");
