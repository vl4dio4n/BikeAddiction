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

foldere = ["temp", "poze_uploadate"];
for (let folder of foldere) {
	let caleFolder = path.join(__dirname, folder);
	if (!fs.existsSync(caleFolder)) fs.mkdirSync(caleFolder);
}

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

app.use("/poze_uploadate", express.static(__dirname + "/poze_uploadate"));

client.query("select * from unnest(enum_range(null::categ_produse))", function (err, rezCateg) {
	let categProduse = [];
	for (let opt of rezCateg.rows) categProduse.push(opt.unnest);
	obGlobal.categProduse = categProduse;
});

app.use("/*", function (req, res, next) {
	res.locals.categProduse = obGlobal.categProduse;
	res.locals.utilizator = req.session.utilizator;
	res.locals.mesajLogin = req.session.mesajLogin;
	req.session.mesajLogin = null;

	var cale_poza_mica;
	var cale_poza_mare;
	if (req.session.utilizator) {
		let cale_utiliz = path.join(__dirname, "poze_uploadate", req.session.utilizator.username);
		if (fs.readdirSync(cale_utiliz).includes("poza-mica.png")) {
			cale_poza_mica = path.join("poze_uploadate", req.session.utilizator.username, "poza-mica.png");
			cale_poza_mare = path.join("poze_uploadate", req.session.utilizator.username, "poza.png");
		} else {
			cale_poza_mica = path.join("resurse", "imagini", "altele", "poza-mica.png");
			cale_poza_mare = path.join("resurse", "imagini", "altele", "poza.png");
		}
		res.locals.utilizator.cale_poza_mica = cale_poza_mica;
		res.locals.utilizator.cale_poza_mare = cale_poza_mare;
	}

	next();
});

/*
app.get("/*", function (req, res, next) {
	let id_utiliz = req.session.utilizator ? req.session.utilizator.id : null;
	let queryInsert = `insert into accesari(ip, user_id, pagina) values ('${getIp(req)}', ${id_utiliz} ,'${req.url}')`;
	client.query(queryInsert, function (err, rezQuery) {
		if (err) console.log(err);
	});
	next();
});

function stergeAccesariVechi() {
	let queryDelete = `delete from accesari where now() - data_accesare > interval '10 minutes'`;
	client.query(queryDelete, function (err, rezQuery) {
		if (err) console.log(err);
	});
}
setInterval(stergeAccesariVechi, 10 * 60 * 1000);

app.get(["/", "/index", "/home"], function (req, res) {
	querySelect = `select username, nume from utilizatori where utilizatori.id in (select distinct user_id from accesari where now() - data_accesare <= interval '5 minutes')`;
	client.query(querySelect, function (err, rezQuery) {
		let utiliz_online = [];
		if (err) console.log(err);
		else {
			utiliz_online = rezQuery.rows;
		}
		res.render("pagini/index", { ip: getIp(req), utiliz_online: utiliz_online });
	});
});*/
app.get(["/", "/index", "/home"], function (req, res) {
	res.render("pagini/index", { ip: req.ip });
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

var intervaleAscii = [[65, 90]];
for (let interval of intervaleAscii)
	for (let i = interval[0]; i <= interval[1]; i++)
		if (!"aeiouAEIOU".includes(String.fromCharCode(i))) {
			obGlobal.sirAlphaNum += String.fromCharCode(i);
		}

function genereazaToken1(n) {
	var token = "";
	for (let i = 0; i < n; i++) {
		token += obGlobal.sirAlphaNum[Math.floor(Math.random() * obGlobal.sirAlphaNum.length)];
	}
	return token;
}
function genereazaToken2(n) {
	let date = new Date();
	let day = ("0" + date.getDate()).slice(-2);
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let year = date.getFullYear();
	let hours = ("0" + date.getHours()).slice(-2);
	let minutes = ("0" + date.getMinutes()).slice(-2);
	let seconds = ("0" + date.getSeconds()).slice(-2);
	return year + month + day + hours + minutes + seconds;
}

parolaServer = "tehniciweb";
app.post("/inreg", function (req, res) {
	var username;
	var formular = new formidable.IncomingForm();
	formular.parse(req, function (err, campuriText, campuriFisier) {
		console.log(campuriText);

		var eroare = verificaFormular(campuriText, "inreg");
		campuriText["problema_vedere"] = campuriText["problema_vedere"] ? true : false;

		if (!eroare) {
			queryUtilizator = `select username from utilizatori where username='${campuriText.username}'`;
			console.log(queryUtilizator);
			client.query(queryUtilizator, function (err, rezUtilizator) {
				if (err) console.log(err);
				if (rezUtilizator.rows.length != 0) {
					eroare += "Username-ul mai exista. ";
					res.render("pagini/inregistrare", { err: eroare });
				} else {
					var token1 = genereazaToken2();
					var token2 = genereazaToken1(80);
					var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
					var caleUtilizator = path.join(__dirname, "poze_uploadate", username, "poza.png");
					var comandaInserare = `insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod, problema_vedere, poza_profil) values ('${campuriText.username}', '${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}', '${token2}', ${campuriText.problema_vedere}, '${caleUtilizator}')`;
					client.query(comandaInserare, function (err, rezInserare) {
						if (err) {
							console.log(err);
							res.render("pagini/inregistrare", { err: "Eroare baza de date" });
						} else {
							res.render("pagini/inregistrare", { raspuns: "Datele au fost introduse" });
							let linkConfirmare = `${obGlobal.protocol}${obGlobal.numeDomeniu}/confirmare_mail/${token1}/${campuriText.username}/${token2}`;
							trimiteMail(campuriText.email, "Te-ai inregistrat", "text", `<h1>Salut!</h1><p>Pe site-ul BikeAddiction ai username-ul ${campuriText.username}, incepand de azi, <span style="color: purple; text-decoration: underline;">${getDate()}</span></p><p>Link confirmare: <a href='${linkConfirmare}'>${campuriText.username}</a></p>`);
						}
					});
				}
			});
		} else res.render("pagini/inregistrare", { err: "Eroare: " + eroare });
	});

	formular.on("field", function (nume, val) {
		if (nume == "username") username = val;
	});
	formular.on("fileBegin", function (nume, fisier) {
		caleUtilizator = path.join(__dirname, "poze_uploadate", username);
		if (!fs.existsSync()) fs.mkdirSync(caleUtilizator);
		var file_name = fisier.originalFilename.split(".");
		fisier.filepath = path.join(caleUtilizator, `_poza.${file_name[file_name.length - 1]}`);
	});
	formular.on("file", function (nume, fisier) {
		var file_name = fisier.originalFilename.split(".");
		convertImage(username, `_poza.${file_name[file_name.length - 1]}`);
	});
});

app.post("/login", function (req, res) {
	var formular = new formidable.IncomingForm();
	formular.parse(req, function (err, campuriText, campuriFisier) {
		console.log(campuriText);
		var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
		// var querySelect = `select * from utilizatori where username = '${campuriText.username}' and parola = '${parolaCriptata}' and confirmat_mail = true`;

		var querySelect = `select * from utilizatori where username = $1::text and parola = $2::text`;

		client.query(querySelect, [campuriText.username, parolaCriptata], function (err, rezSelect) {
			if (err) console.log(err);
			else {
				if (rezSelect.rows.length == 1) {
					//daca am utilizatorul si a dat credentialele corecte
					if (rezSelect.rows[0].confirmat_mail) {
						req.session.utilizator = {
							id: rezSelect.rows[0].id,
							nume: rezSelect.rows[0].nume,
							prenume: rezSelect.rows[0].prenume,
							username: rezSelect.rows[0].username,
							email: rezSelect.rows[0].email,
							culoareChat: rezSelect.rows[0].culoareChat,
							rol: rezSelect.rows[0].rol,
							problema_vedere: rezSelect.rows[0].problema_vedere,
						};
						res.redirect("/index");
					} else {
						req.session.mesajLogin = "Mail-ul acestui cont nu a fost inca confirmat.";
						res.redirect("/login");
					}
				} else {
					req.session.mesajLogin = "Login Esuat";
					res.redirect("/login");
				}
			}
		});
	});
});

app.get("/useri", function (req, res) {
	if (req.session.utilizator && req.session.utilizator.rol == "admin")
		client.query("select * from utilizatori where rol = 'comun`", function (err, rezQuery) {
			res.render("pagini/useri", { useri: rezQuery.rows });
		});
	else {
		randeazaEroare(res, 403);
	}
});

app.post("/sterge_utiliz", function (req, res) {
	var formular = new formidable.IncomingForm();
	formular.parse(req, function (err, campuriText, campuriFisier) {
		let queryDel = `delete from utilizatori where id = ${campuriText.id_utiliz}`;
		client.query(queryDel, function (err, rezQuery) {
			console.log(err);
			res.redirect("/useri");
		});
	});
});

app.get("/confirmare_mail/:token1/:username/:token2", function (req, res) {
	var comandaSelect = `update utilizatori set confirmat_mail = true where username = '${req.params.username}' and cod = '${req.params.token2}'`;
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

app.post("/profil", function (req, res) {
	console.log("profil");
	if (!req.session.utilizator) {
		randeazaEroare(res, -1, "Eroare", "Nu sunteti logat.");
		return;
	}
	var username = req.session.utilizator.username;
	var formular = new formidable.IncomingForm();

	formular.parse(req, function (err, campuriText, campuriFile) {
		var criptareParola = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
		var criptareParolaNoua = crypto.scryptSync(campuriText.parola_noua, parolaServer, 64).toString("hex");
		campuriText["problema_vedere"] = campuriText["problema_vedere"] ? true : false;

		var eroare = verificaFormular(campuriText, "profil");
		if (eroare != "") res.render("pagini/profil", { type: false, raspuns: eroare });
		else {
			//TO DO query
			var queryUpdate = `update utilizatori set nume='${campuriText.nume}', prenume = '${campuriText.prenume}', email = '${campuriText.email}', culoare_chat = '${campuriText.culoare_chat}', problema_vedere = ${campuriText.problema_vedere} where parola='${criptareParola}' and username='${username}'`;
			if (campuriText.parola_noua != "") queryUpdate = `update utilizatori set nume='${campuriText.nume}', prenume = '${campuriText.prenume}', parola = '${criptareParolaNoua}', email = '${campuriText.email}', culoare_chat = '${campuriText.culoare_chat}', problema_vedere = ${campuriText.problema_vedere} where parola='${criptareParola}' and username='${username}'`;
			client.query(queryUpdate, function (err, rez) {
				if (err) {
					console.log(err);
					randeazaEroare(res, -1, "Eroare", "Eroare baza date. Incercati mai tarziu.");
					return;
				}
				console.log(rez.rowCount);
				if (rez.rowCount == 0) {
					res.render("pagini/profil", { type: false, raspuns: "Update-ul nu s-a realizat. Verificati parola introdusa." });
					return;
				} else {
					req.session.utilizator.nume = campuriText.nume;
					req.session.utilizator.prenume = campuriText.prenume;
					req.session.utilizator.email = campuriText.email;
					req.session.utilizator.culoare_chat = campuriText.culoare_chat;
					req.session.utilizator.problema_vedere = campuriText.problema_vedere;
					console.log("hey", req.session.utilizator, "hey");
					let link = `${obGlobal.protocol}${obGlobal.numeDomeniu}`;
					trimiteMail(campuriText.email, "Ti-ai schimbat profilul", "text", `<h1>Salut!</h1><p>Te informam ca ai schimbat profilul de utilizator al contului <span style="color: blue; text-decoration: underline;">${username}</span> pe site-ul <a href="${link}">BikeAddiction</a></p><p>Noile tale date sunt:</p><ul><li>Nume: ${campuriText.nume}</li><li>Prenume: ${campuriText.prenume}</li><li>Email: ${campuriText.email}</li><li>Culoare Chat: ${campuriText.culoare_chat}</li><li>Problema de vedere: ${campuriText.problema_vedere}</li></ul>`);
				}

				res.render("pagini/profil", { type: true, raspuns: "Update-ul s-a realizat cu succes." });
			});
		}
	});
	formular.on("fileBegin", function (nume, fisier) {
		var caleUtilizator = path.join(__dirname, "poze_uploadate", username);
		// if (fs.readdirSync(caleUtilizator).length > 0) {
		// 	console.log("I was here");
		// 	fs.unlinkSync(fs.readdirSync(caleUtilizator)[0]);
		// 	fs.unlinkSync(fs.readdirSync(caleUtilizator)[0]);
		// 	fs.unlinkSync(fs.readdirSync(caleUtilizator)[0]);
		// }
		let file_name = fisier.originalFilename.split(".");
		fisier.filepath = path.join(caleUtilizator, `_poza.${file_name[file_name.length - 1]}`);
	});
	formular.on("file", function (nume, fisier) {
		var caleUtilizator = path.join(__dirname, "poze_uploadate", username, "poza.png");
		var queryUpdate = `update utilizatori set poza_profil = '${caleUtilizator}' where username='${username}'`;
		client.query(queryUpdate, function (err, rezUpdate) {});
		var file_name = fisier.originalFilename.split(".");
		convertImage(username, `_poza.${file_name[file_name.length - 1]}`);
		req.session.utilizator.cale_poza_mica = path.join("poze_uploadate", req.session.utilizator.username, "poza-mica.png");
		req.session.utilizator.cale_poza_mare = path.join("poze_uploadate", req.session.utilizator.username, "poza.png");
	});
});

app.post("/stergere_cont", function (req, res) {
	console.log("profil");
	if (!req.session.utilizator) {
		randeazaEroare(res, -1, "Eroare", "Nu sunteti logat.");
		return;
	}
	var username = req.session.utilizator.username;
	var formular = new formidable.IncomingForm();

	formular.parse(req, function (err, campuriText, campuriFile) {
		var criptareParola = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
		var queryDelete = `delete from utilizatori where parola='${criptareParola}' and username='${username}'`;
		client.query(queryDelete, function (err, rez) {
			if (err) {
				console.log(err);
				randeazaEroare(res, -1, "Eroare", "Eroare baza date. Incercati mai tarziu.");
				return;
			}
			if (rez.rowCount == 0) {
				res.render("pagini/profil", { type: false, raspuns: "Contul nu a putut fi sters. Verificati parola introdusa.", flag: true });
				return;
			} else {
				let link = `${obGlobal.protocol}${obGlobal.numeDomeniu}`;
				trimiteMail(req.session.utilizator.email, "Stergere cont", "text", `<h1>Salut!</h1><p>Te informam ca ti-ai sters contul <span style="color: blue; text-decoration: underline;">${req.session.utilizator.username}</span> de pe site-ul <a href="${link}">BikeAddiction</a>.</p><p>Ne pare rau ca ai luat aceasta decizie dar speram ca vei reveni asupra ei.</p>`);
				req.session.destroy();
				res.locals.utilizator = null;
				res.render("pagini/logout", { raspuns: "Contul a fost sters!" });
				//TO DO stergere folder utilizator
			}
		});
	});
});

app.get("/login", function (req, res) {
	res.render("pagini/login");
});

app.get("/logout", function (req, res) {
	req.session.destroy();
	res.locals.utilizator = null;
	res.render("pagini/logout", { raspuns: "Ai fost delogat!" });
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
function getDate() {
	let date = new Date();
	let day = ("0" + date.getDate()).slice(-2);
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let year = date.getFullYear();
	let hours = ("0" + date.getHours()).slice(-2);
	let minutes = ("0" + date.getMinutes()).slice(-2);
	let seconds = ("0" + date.getSeconds()).slice(-2);
	return day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
}

function verificaFormular(campuriText, type) {
	var eroare = "";
	if (campuriText.email == "") eroare += "Email necompletat. ";
	if (campuriText.nume == "") eroare += "Nume necompletat. ";
	if (campuriText.prenume == "") eroare += "Prenume necompletat. ";
	if (campuriText.parola == "") eroare += "Parola necompletata. ";
	if (!new RegExp("^.+@.+\\..+$", "g").test(campuriText.email)) eroare += "Email invalid. ";
	if (type == "inreg") {
		if (campuriText.username == "") eroare += "Username necompletat. ";
		if (!campuriText.username.match(new RegExp("^[A-Za-z0-9]+$"))) eroare += "Username nu corespunde pattern-ului. ";
		if (campuriText.parola.length < 8 || !new RegExp("[a-z]", "g").test(campuriText.parola) || !new RegExp("[A-Z]", "g").test(campuriText.parola) || !new RegExp(".", "g").test(campuriText.parola) || campuriText.parola.match(new RegExp("[0-9]", "g")).length < 2) eroare += "Parola nu corespunde patternului. ";
	} else {
		if (campuriText.parola_noua.length > 0) if (campuriText.parola_noua.length < 8 || !new RegExp("[a-z]", "g").test(campuriText.parola_noua) || !new RegExp("[A-Z]", "g").test(campuriText.parola_noua) || !new RegExp(".", "g").test(campuriText.parola_noua) || campuriText.parola_noua.match(new RegExp("[0-9]", "g")).length < 2) eroare += "Parola nu corespunde patternului. ";
	}
	return eroare;
}

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

function convertImage(username, file) {
	let old_path = path.join(__dirname, "poze_uploadate", username, file);
	[nume, extensie] = file.slice(1).split(".");
	let new_path = path.join(__dirname, "poze_uploadate", username, nume + ".png");
	sharp(old_path).resize({ height: 300, width: 300 }).toFile(new_path);
	new_path = path.join(__dirname, "poze_uploadate", username, nume + "-mica.png");
	sharp(old_path).resize({ height: 50, width: 50 }).toFile(new_path);
	// let caleUtilizator = path.join(__dirname, "poze_uploadate", username);
	// fs.unlinkSync(fs.readdirSync(caleUtilizator)[0]);
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
