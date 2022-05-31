const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const { Client } = require("pg");
const ejs = require("ejs");
const sass = require("sass");
const formidable = require("formidable");
const crypto = require("crypto");
const session = require("express-session");
const nodemailer = require("nodemailer");
const path = require("path");

const request = require("request");

const xmljs = require("xml-js");

const html_to_pdf = require("html-pdf-node");

const juice = require("juice");
const QRCode = require("qrcode");

const mongodb = require("mongodb");

const http = require("http");
const socket = require("socket.io");

var url = "mongodb://localhost:27017";

const obGlobal = {
	obImagini: null,
	obErori: null,
	categProduse: null,
	emailServer: "bikeaddiction2@gmail.com",
	protocol: null,
	numeDomeniu: null,
	port: 8080,
	sirAlphaNum: [],
	clientMongo: mongodb.MongoClient,
	bdMongo: null,
	urlMongo: null,
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
	obGlobal.urlMongo = "mongodb+srv://vl4dio4n:Elena1973@cluster0.7qxqm.mongodb.net/?retryWrites=true&w=majority";
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
	obGlobal.urlMongo = "mongodb://localhost:27017";
	var client = new Client({
		user: "vl4dio4n",
		password: "0000",
		database: "BikeAddiction",
		host: "localhost",
		port: 5432,
	});
}

obGlobal.clientMongo.connect(obGlobal.urlMongo, function (err, bd) {
	if (err) console.log(err);
	else {
		obGlobal.bdMongo = bd.db("BikeAddiction");
	}
});

client.connect();

foldere = ["temp", "poze_uploadate"];
for (let folder of foldere) {
	let caleFolder = path.join(__dirname, folder);
	if (!fs.existsSync(caleFolder)) fs.mkdirSync(caleFolder);
}

app = express();

const server = new http.createServer(app);
var io = socket(server);
io = io.listen(server); //asculta pe acelasi port ca si serverul

io.on("connection", function (socket) {
	console.log("Conectare!");
	socket.on("disconnect", function () {
		conexiune_index = null;
		console.log("Deconectare");
	});
});

app.use(["/produse_cos", "/cumpara", "/mesaj"], express.json({ limit: "2mb" }));
app.use(["/forum"], express.urlencoded({ extended: true }));

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
app.use("/socket.io", express.static(__dirname + "/socket.io"));

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
	res.locals.port = s_port;
	req.session.mesajLogin = null;

	var cale_poza_mica;
	var cale_poza_mare;
	if (req.session.utilizator) {
		let cale_utiliz = path.join(__dirname, "poze_uploadate", req.session.utilizator.username);
		if (fs.existsSync(cale_utiliz) && fs.readdirSync(cale_utiliz).includes("poza-mica.png")) {
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

app.get("/*", function (req, res, next) {
	res.locals.pageURL = req.url;
	let id_utiliz = req.session.utilizator ? req.session.utilizator.id : null;
	let queryInsert = `insert into accesari(ip, user_id, pagina) values ('${getIp(req)}', ${id_utiliz} ,'${req.url}')`;
	client.query(queryInsert, function (err, rezQuery) {
		if (err) console.log(err);
	});
	next();
});

function stergeAccesariVechi() {
	let queryDelete = `delete from accesari where now() - data_accesare > interval '24 hours'`;
	client.query(queryDelete, function (err, rezQuery) {
		if (err) console.log(err);
	});
}
setInterval(stergeAccesariVechi, 60 * 60 * 1000);

app.get(["/", "/index", "/home"], function (req, res) {
	querySelect = `select u.username, u.nume, u.prenume, u.poza_profil, MAX(acc.data_accesare) last_date
		from utilizatori u
		join accesari acc ON acc.user_id = u.id
		where u.id in 
			(select distinct user_id 
			from accesari 
			where now() - data_accesare <= interval '5.5 minutes'
			)
		group by u.username, u.nume, u.prenume, u.poza_profil
		order by last_date desc;`;
	client.query(querySelect, function (err, rezQuery) {
		let utiliz_online = [];
		if (err) console.log(err);
		else utiliz_online = rezQuery.rows;
		// res.locals.ip = getIp(req);
		// res.locals.utiliz_online = utiliz_online;

		res.render("pagini/index", { ip: getIp(req), utiliz_online: utiliz_online });

		// request(
		// 	"https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=109.99.96.15", //se inlocuieste cu req.ip; se testeaza doar pe Heroku
		// 	function (error, response, body) {
		// 		if (error) {
		// 			console.error("error:", error);
		// 		} else {
		// 			var obiectLocatie = JSON.parse(body);
		// 			locatie = obiectLocatie.geobytescountry + " " + obiectLocatie.geobytesregion;
		// 		}

		// 		res.render("pagini/index");
		// 	}
		// );
	});
});

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

		// TO DO posa profil

		var eroare = verificaFormular(campuriText, "inreg");
		campuriText["problema_vedere"] = campuriText["problema_vedere"] ? true : false;

		if (!eroare) {
			// queryUtilizator = `select username from utilizatori where username='${campuriText.username}'`;

			var queryUtilizator = `select username from utilizatori where username= $1::text`;

			console.log(queryUtilizator);
			client.query(queryUtilizator, [campuriText.username], function (err, rezUtilizator) {
				if (err) console.log(err);
				if (rezUtilizator.rows.length != 0) {
					eroare += "Username-ul mai exista. ";
					res.render("pagini/inregistrare", { err: eroare });
				} else {
					var token1 = genereazaToken2();
					var token2 = genereazaToken1(80);
					var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
					var comandaInserare = `insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod, problema_vedere) 
										values ('${campuriText.username}', '${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', 
										'${campuriText.culoare_chat}', '${token2}', ${campuriText.problema_vedere})`;
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
		if (!fs.existsSync(caleUtilizator)) {
			fs.mkdirSync(caleUtilizator);
			fs.mkdirSync(path.join(caleUtilizator, "produse"));
		}
		var file_name = fisier.originalFilename.split(".");
		fisier.filepath = path.join(caleUtilizator, `_poza.${file_name[file_name.length - 1]}`);
	});
	formular.on("file", function (nume, fisier) {
		if (fisier.size == 0) {
			fs.unlinkSync(fisier.filepath);
			return;
		}
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
							culoareChat: rezSelect.rows[0].culoare_chat,
							rol: rezSelect.rows[0].rol,
							problema_vedere: rezSelect.rows[0].problema_vedere,
						};
						console.log("hey", req.session.utilizator, "hey");
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

app.get("/facturi", function (req, res) {
	if (req.session.utilizator && req.session.utilizator.rol == "admin") {
		obGlobal.bdMongo
			.collection("facturi")
			.find({})
			.toArray(function (err, result) {
				if (err) console.log(err);
				else res.render("pagini/facturi", { facturi: result });
			});
	} else {
		randeazaEroare(res, 403);
	}
});

app.get("/useri", function (req, res) {
	if (req.session.utilizator && req.session.utilizator.rol == "admin") {
		var querySelect = `select * from utilizatori where rol = 'comun'`;
		client.query(querySelect, function (err, rezQuery) {
			if (err) randeazaEroare(-1, "Eroare", "Eroare baza de date");
			else res.render("pagini/useri", { users: rezQuery.rows });
		});
	} else {
		randeazaEroare(res, 403);
	}
});

app.post("/stergere_poza_profil", function (req, res) {
	var formular = new formidable.IncomingForm();
	formular.parse(req, function (err, campuriText, campuriFisier) {
		let queryUpdate = `update utilizatori set poza_profil = false where id=${parseInt(campuriText.id_utiliz)} and poza_profil = true`;
		console.log(queryUpdate);
		client.query(queryUpdate, function (err, rezUpdate) {
			if (err) console.log(err);
			else {
				if (rezUpdate.rowCount == 0) {
					res.redirect("/useri");
				} else {
					// afisat mesaj la user

					querySelect = `select username, email from utilizatori where id = ${parseInt(campuriText.id_utiliz)}`;
					client.query(querySelect, function (err, rezQuery) {
						if (err) console.log(err);
						else {
							let link = `${obGlobal.protocol}${obGlobal.numeDomeniu}`;
							var caleUtilizator = path.join(__dirname, "poze_uploadate", rezQuery.rows[0].username);
							for (let fileName of fs.readdirSync(caleUtilizator))
								if (fileName != "produse") {
									fs.unlinkSync(path.join(caleUtilizator, fileName));
								}
							trimiteMail(rezQuery.rows[0].email, "Ne pare rau", "text", `<h1>Salut</h1><p>Ne pare rau insa am decis sa-ti stergem poza de profil a contului <span style="color: blue; text-decoration: underline;">${rezQuery.rows[0].username}</span> de pe site-ul <a href=${link}>BikeAddiction</a></p>`);
							res.redirect("/useri");
						}
					});
				}
			}
		});
	});
});

app.get("/utilizator/:username", function (req, res) {
	username = req.params.username;
	var querySelect1 = `select * from produse where autor_anunt = '${username}'`;

	client.query(querySelect1, function (err, rezQuery) {
		res.locals.produse = rezQuery.rows;
		var querySelect2 = `select nume, prenume, rol, poza_profil from utilizatori
							where username = '${username}'`;
		client.query(querySelect2, function (err, rezQuery) {
			res.locals.username_profil = username;
			res.locals.nume = rezQuery.rows[0].nume;
			res.locals.prenume = rezQuery.rows[0].prenume;
			res.locals.rol = rezQuery.rows[0].rol;
			res.locals.cale_poza = rezQuery.rows[0].poza_profil ? `poze_uploadate/${username}/poza.png` : "resurse/imagini/altele/poza.png";
			res.render("pagini/profil");
		});
	});
});

app.get("/confirmare_mail/:token1/:username/:token2", function (req, res) {
	var username = req.params.username;
	var comandaSelect = `update utilizatori set confirmat_mail = true where username = '${username}' and cod = '${req.params.token2}'`;
	client.query(comandaSelect, function (err, rezUpdate) {
		if (err) {
			console.log(err);
			randeazaEroare(res, 2);
		} else {
			if (fs.readdirSync(path.join(__dirname, "poze_uploadate", username)).length > 1) {
				var queryUpdate = `update utilizatori set poza_profil = true where username='${username}'`;
				client.query(queryUpdate, function (err, rezUpdate) {});
			}
			if (rezUpdate.rowCount == 1) {
				res.render("pagini/confirmare");
			} else {
				randeazaEroare(res, 2, "Eroare link confirmare", "Nu e user-ul sau link-ul corect");
			}
		}
	});
});

app.post("/cont", function (req, res) {
	console.log("Cont");
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

		var eroare = verificaFormular(campuriText, "cont");
		if (eroare != "") res.render("pagini/cont", { type: false, raspuns: eroare });
		else {
			var queryUpdate = `update utilizatori set nume='${campuriText.nume}', prenume = '${campuriText.prenume}', email = '${campuriText.email}', 
							culoare_chat = '${campuriText.culoare_chat}', problema_vedere = ${campuriText.problema_vedere}
							where parola='${criptareParola}' and username='${username}'`;
			if (campuriText.parola_noua != "")
				queryUpdate = `update utilizatori set nume='${campuriText.nume}', prenume = '${campuriText.prenume}', parola = '${criptareParolaNoua}',
							email = '${campuriText.email}', culoare_chat = '${campuriText.culoare_chat}', problema_vedere = ${campuriText.problema_vedere}
							where parola='${criptareParola}' and username='${username}'`;
			client.query(queryUpdate, function (err, rez) {
				if (err) {
					console.log(err);
					randeazaEroare(res, -1, "Eroare", "Eroare baza date. Incercati mai tarziu.");
					return;
				}
				console.log(rez.rowCount);
				if (rez.rowCount == 0) {
					res.render("pagini/cont", { type: false, raspuns: "Update-ul nu s-a realizat. Verificati parola introdusa." });
					return;
				} else {
					req.session.utilizator.nume = campuriText.nume;
					req.session.utilizator.prenume = campuriText.prenume;
					req.session.utilizator.email = campuriText.email;
					req.session.utilizator.culoare_chat = campuriText.culoare_chat;
					req.session.utilizator.problema_vedere = campuriText.problema_vedere;
					let link = `${obGlobal.protocol}${obGlobal.numeDomeniu}`;
					trimiteMail(campuriText.email, "Ti-ai schimbat contul", "text", `<h1>Salut!</h1><p>Te informam ca ai schimbat profilul de utilizator al contului <span style="color: blue; text-decoration: underline;">${username}</span> pe site-ul <a href="${link}">BikeAddiction</a></p><p>Noile tale date sunt:</p><ul><li>Nume: ${campuriText.nume}</li><li>Prenume: ${campuriText.prenume}</li><li>Email: ${campuriText.email}</li><li>Culoare Chat: ${campuriText.culoare_chat}</li><li>Problema de vedere: ${campuriText.problema_vedere}</li></ul>`);
				}

				res.render("pagini/cont", { type: true, raspuns: "Update-ul s-a realizat cu succes." });
			});
		}
	});
	formular.on("fileBegin", function (nume, fisier) {
		var caleUtilizator = path.join(__dirname, "poze_uploadate", username);
		for (let fileName of fs.readdirSync(caleUtilizator))
			if (fileName[0] == "_") {
				fs.unlinkSync(path.join(caleUtilizator, fileName));
				break;
			}
		let file_name = fisier.originalFilename.split(".");
		fisier.filepath = path.join(caleUtilizator, `_poza.${file_name[file_name.length - 1]}`);
	});
	formular.on("file", function (nume, fisier) {
		if (fisier.size == 0) {
			fs.unlinkSync(fisier.filepath);
			return;
		}
		var caleUtilizator = path.join(__dirname, "poze_uploadate", username);
		for (let fileName of fs.readdirSync(caleUtilizator))
			if (fileName[0] != "_" && fileName != "produse") {
				fs.unlinkSync(path.join(caleUtilizator, fileName));
			}
		var queryUpdate = `update utilizatori set poza_profil = true where username='${username}'`;
		client.query(queryUpdate, function (err, rezUpdate) {});
		var file_name = fisier.originalFilename.split(".");
		convertImage(username, `_poza.${file_name[file_name.length - 1]}`);
		req.session.utilizator.cale_poza_mica = path.join("poze_uploadate", username, "poza-mica.png");
		req.session.utilizator.cale_poza_mare = path.join("poze_uploadate", username, "poza.png");
	});
});

app.post("/stergere_cont", function (req, res) {
	if (!req.session.utilizator) {
		randeazaEroare(res, -1, "Eroare", "Nu sunteti logat.");
		return;
	}
	var username = req.session.utilizator.username;
	var formular = new formidable.IncomingForm();

	formular.parse(req, function (err, campuriText, campuriFile) {
		var criptareParola = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
		var queryDelete1 = `delete from accesari where user_id = 
							(
								select id from utilizatori
								where parola='${criptareParola}' and username='${username}'
							)`;
		client.query(queryDelete1, function (err, rez) {
			var queryDelete2 = `delete from utilizatori where parola='${criptareParola}' and username='${username}'`;
			client.query(queryDelete2, function (err, rez) {
				if (err) {
					console.log(err);
					randeazaEroare(res, -1, "Eroare", "Eroare baza date. Incercati mai tarziu.");
					return;
				}
				if (rez.rowCount == 0) {
					res.render("pagini/cont", { type: false, raspuns: "Contul nu a putut fi sters. Verificati parola introdusa.", flag: true });
					return;
				} else {
					let link = `${obGlobal.protocol}${obGlobal.numeDomeniu}`;
					trimiteMail(req.session.utilizator.email, "Stergere cont", "text", `<h1>Salut!</h1><p>Te informam ca ti-ai sters contul <span style="color: blue; text-decoration: underline;">${req.session.utilizator.username}</span> de pe site-ul <a href="${link}">BikeAddiction</a>.</p><p>Ne pare rau ca ai luat aceasta decizie dar speram ca vei reveni asupra ei.</p>`);
					fs.rmdirSync(path.join(__dirname, "poze_uploadate", username), { recursive: true });
					req.session.destroy();
					res.locals.utilizator = null;
					res.render("pagini/logout", { raspuns: "Contul a fost sters!" });
				}
			});
		});
	});
});

app.post("/creeaza-anunt", function (req, res) {
	console.log("I was here");
	if (!req.session.utilizator) {
		randeazaEroare(res, -1, "Eroare", "Nu sunteti logat.");
		return;
	}
	var username = req.session.utilizator.username;
	var id_user = req.session.utilizator.id;
	var formular = new formidable.IncomingForm();
	var eroareBD = false;

	formular.parse(req, function (req, campuriText, campuriFisier) {
		campuriText["livrare"] = campuriText["livrare"] ? true : false;

		var eroare = verificaFormular(campuriText, "anunt");

		if (eroare != "") res.render("pagini/creeaza-anunt", { type: false, raspuns: eroare });
		else {
			var caleProdus = path.join(__dirname, "poze_uploadate", username, "produse");
			var calePoza = `poze_uploadate/${username}/produse/produs_${fs.readdirSync(caleProdus).length}.png`;

			let arrSpecificatii = campuriText.specificatii.split(",");
			let strSpecificatii = "";
			for (let spec of arrSpecificatii)
				if (spec.trim() != "") {
					if (strSpecificatii != "") strSpecificatii += ", ";
					strSpecificatii += `"${spec.trim()}"`;
				}

			var queryInsert = `insert into produse (nume, pret, an_fabricatie, producator, categ_produse, specificatii, descriere, autor_anunt, email, telefon, livrare, imagine, user_id) 
					values ('${campuriText.nume}', ${campuriText.pret}, ${campuriText.an}, '${campuriText.producator}', '${campuriText.categ_produse}', 
					'{${strSpecificatii}}', '${campuriText.descriere.trim()}', '${username}', '${campuriText.email}', '${campuriText.telefon}', ${campuriText.livrare}, '${calePoza}', ${id_user})`;

			client.query(queryInsert, function (err, rezInserare) {
				if (err) {
					console.log(err);
					eroareBD = true;
					res.render("pagini/creeaza-anunt", { type: false, raspuns: "Eroare baza de date" });
				} else {
					res.render("pagini/creeaza-anunt", { type: true, raspuns: "Produsul a fost adaugat cu succes" });
				}
			});
		}
	});
	formular.on("fileBegin", function (nume, fisier) {
		caleProdus = path.join(__dirname, "poze_uploadate", username, "produse");
		var file_name = fisier.originalFilename.split(".");
		fisier.filepath = path.join(caleProdus, `_produs.${file_name[file_name.length - 1]}`);
	});
	formular.on("file", function (nume, fisier) {
		let calePoza = path.join(__dirname, "poze_uploadate", username, "produse", `produs_${fs.readdirSync(caleProdus).length}.png`);
		if (fisier.size == 0) {
			fs.unlinkSync(fisier.filepath);
			if (!eroareBD) {
				let caleSrc = path.join(__dirname, "resurse", "imagini", "altele", "produs.png");
				fs.copyFileSync(caleSrc, calePoza);
			}
			return;
		}
		var file_name = fisier.originalFilename.split(".");
		convertImageProdus(username, `_produs.${file_name[file_name.length - 1]}`, `produs_${fs.readdirSync(caleProdus).length}.png`);
	});
});

app.get("/editare_anunt/:id_anunt", function (req, res) {
	if (!req.session.utilizator) {
		randeazaEroare(res, -1, "Eroare", "Nu sunteti logat.");
		return;
	}
	let username = req.session.utilizator.username;
	let querySelect = `select * from produse where id=${req.params.id_anunt}`;
	client.query(querySelect, function (err, rezQuery) {
		if (err) {
			console.log(err);
			randeazaEroare(res, -1, "Eroare", "Eroare baza de date");
		} else {
			if (rezQuery.rowCount == 0) randeazaEroare(res, -1, "Eroare", "Produsul nu exista");
			else if (rezQuery.rows[0].autor_anunt != username) {
				randeazaEroare(res, 403);
			} else {
				res.render("pagini/editeaza-anunt", { produs: rezQuery.rows[0] });
			}
		}
	});
});

app.post("/modifica_anunt/:id_anunt", function (req, res) {
	if (!req.session.utilizator) {
		randeazaEroare(res, -1, "Eroare", "Nu sunteti logat.");
		return;
	}

	var id_anunt = req.params.id_anunt;
	var querySelect = `select user_id from produse where id = ${id_anunt} and user_id = ${req.session.utilizator.id}`;
	client.query(querySelect, function (err, rezSelect) {
		if (err) {
			console.log(err);
			res.render("pagini/editeaza-anunt", { type: false, raspuns: "Eroare baza de date" });
		} else if (rezSelect.rowCount[0]) randeazaEroare(res, 403);
		else {
			var username = req.session.utilizator.username;
			var formular = new formidable.IncomingForm();

			formular.parse(req, function (req, campuriText, campuriFisier) {
				campuriText["livrare"] = campuriText["livrare"] ? true : false;

				var eroare = verificaFormular(campuriText, "anunt");

				if (eroare != "") res.render("pagini/editeaza-anunt", { type: false, raspuns: eroare });
				else {
					let arrSpecificatii = campuriText.specificatii.split(",");
					let strSpecificatii = "";
					for (let spec of arrSpecificatii)
						if (spec.trim() != "") {
							if (strSpecificatii != "") strSpecificatii += ", ";
							strSpecificatii += `"${spec.trim()}"`;
						}

					var queryUpdate = `update produse set nume = '${campuriText.nume}', pret = ${campuriText.pret}, an_fabricatie = ${campuriText.an},
							producator = '${campuriText.producator}', categ_produse = '${campuriText.categ_produse}', specificatii = '{${strSpecificatii}}',
							descriere = '${campuriText.descriere.trim()}', email = '${campuriText.email}', telefon = '${campuriText.telefon}',
							livrare = ${campuriText.livrare} where id = ${id_anunt}`;

					client.query(queryUpdate, function (err, rezUpdate) {
						if (err) {
							console.log(err);
							res.render("pagini/editeaza-anunt", { type: false, raspuns: "Eroare baza de date" });
						} else {
							res.redirect(`/editare_anunt/${id_anunt}`);
						}
					});
				}
			});
			formular.on("fileBegin", function (nume, fisier) {
				caleProdus = path.join(__dirname, "poze_uploadate", username, "produse");
				var file_name = fisier.originalFilename.split(".");
				fisier.filepath = path.join(caleProdus, `_produs.${file_name[file_name.length - 1]}`);
			});
			formular.on("file", function (nume, fisier) {
				// let calePoza = path.join(__dirname, "poze_uploadate", username, "produse", `produs_${fs.readdirSync(caleProdus).length}.png`);
				if (fisier.size == 0) {
					fs.unlinkSync(fisier.filepath);
					return;
				}
				let querySelect = `select imagine from produse where id = ${id_anunt}`;
				client.query(querySelect, function (err, rezSelect) {
					if (err) console.log(err);
					else {
						let index = rezSelect.rows[0].imagine.split("_");
						index = parseInt(index[index.length - 1].split(".")[0]);
						var file_name = fisier.originalFilename.split(".");
						convertImageProdus(username, `_produs.${file_name[file_name.length - 1]}`, `produs_${index}.png`);

						let calePoza = `poze_uploadate/${username}/produse/produs_${index}.png`;
						let queryUpdate = `update produse set imagine = '${calePoza}' where id = ${id_anunt}`;
						client.query(queryUpdate);
					}
				});
			});
		}
	});
});

app.post("/stergere_anunt/:id_anunt", function (req, res) {
	if (!req.session.utilizator) {
		randeazaEroare(res, -1, "Eroare", "Nu sunteti logat.");
		return;
	}

	let id_anunt = req.params.id_anunt;
	let id_user = req.session.utilizator.id;
	let username = req.session.utilizator.username;
	let querySelect = `select user_id from produse where id = ${id_anunt} and user_id = ${id_user}`;

	client.query(querySelect, function (err, rezSelect) {
		if (err) {
			console.log(err);
			res.render("pagini/editeaza-anunt", { type: false, raspuns: "Eroare baza de date", flag: true });
		} else if (rezSelect.rowCount[0]) randeazaEroare(res, 403);
		else {
			var formular = new formidable.IncomingForm();
			formular.parse(req, function (err, campuriText, campuriFile) {
				var criptareParola = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");
				var queryDelete = `delete from produse where id = ${id_anunt} and user_id =  
							(
								select id from utilizatori
								where parola='${criptareParola}' and id=${id_user}
							)`;

				client.query(queryDelete, function (err, rezQuery) {
					if (err) {
						console.log(err);
						randeazaEroare(res, -1, "Eroare", "Eroare baza date. Incercati mai tarziu.");
						return;
					}
					if (rezQuery.rowCount == 0) {
						res.render("pagini/editeaza-anunt", { type: false, raspuns: "Anuntul nu a putut fi sters. Verificati parola introdusa.", flag: true });
						return;
					} else {
						res.redirect(`/utilizator/${username}`);
					}
				});
			});
		}
	});
});

//############################# Cos virtual ###################################

app.post("/produse_cos", function (req, res) {
	console.log("La la la", req.body);
	if (req.body.ids_prod.length != 0) {
		let querySelect = `select * from produse where id in (${req.body.ids_prod.join(",")})`;
		client.query(querySelect, function (err, rezQuery) {
			if (err) {
				console.log(err);
				res.send("Eroare baza de date");
			} else {
				res.send(rezQuery.rows);
			}
		});
	} else {
		res.send([]);
	}
});

app.post("/cumpara", function (req, res) {
	if (!req.session.utilizator) {
		randeazaEroare(res, -1, "Eroare", "Nu sunteti logat.");
		return;
	}
	//TO DO verificare id-uri pentru query-ul la baza de date
	console.log("Hey", req.body.ids_prod, "Hey");
	client.query("select * from produse where id in (" + req.body.ids_prod + ")", function (err, rez) {
		//console.log(err, rez);
		//console.log(rez.rows);

		let rezFactura = ejs.render(fs.readFileSync("views/pagini/factura.ejs").toString("utf8"), { utilizator: req.session.utilizator, produse: rez.rows, data: getDate(), protocol: obGlobal.protocol, domeniu: obGlobal.numeDomeniu });
		//console.log(rezFactura);
		let options = { format: "A4", args: ["--no-sandbox", "--disable-extensions", "--disable-setuid-sandbox"] };

		let file = { content: juice(rezFactura, { inlinePseudoElements: true }) };
		//////
		let mText = `Stimate ${req.session.utilizator.username}, aveți atașată factura.`;
		let mHtml = `<h1>Salut!</h1><p>${mText}</p>`;

		trimiteMail(req.session.utilizator.email, "Factura", mText, mHtml);

		res.write("Totu bine!");
		res.end();
		// res.render("pagini/cos-virtual", { type: true, raspuns: "Procesul s-a incheiat cu succes" });
		let factura = { data: new Date(), username: req.session.utilizator.username, produse: rez.rows };
		obGlobal.bdMongo.collection("facturi").insertOne(factura, function (err, res) {
			if (err) console.log(err);
			else {
				console.log("Am inserat factura in mongodb");
				//doar de debug:
				obGlobal.bdMongo
					.collection("facturi")
					.find({})
					.toArray(function (err, result) {
						if (err) console.log(err);
						else console.log(result);
					});
			}
		});

		// html_to_pdf.generatePdf(file, options).then(function (pdf) {
		// 	if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
		// 	var numefis = "./temp/test" + new Date().getTime() + ".pdf";
		// 	fs.writeFileSync(numefis, pdf);
		// 	let mText = `Stimate ${req.session.utilizator.username}, aveți atașată factura.`;
		// 	let mHtml = `<h1>Salut!</h1><p>${mText}</p>`;

		// 	trimiteMail(req.session.utilizator.email, "Factura", mText, mHtml, [
		// 		{
		// 			filename: "factura.pdf",
		// 			content: fs.readFileSync(numefis),
		// 		},
		// 	]);
		// 	res.write("Totu bine!");
		// 	res.end();
		// 	// res.render("pagini/cos-virtual", { type: true, raspuns: "Procesul s-a incheiat cu succes" });
		// 	let factura = { data: new Date(), username: req.session.utilizator.username, produse: rez.rows };
		// 	obGlobal.bdMongo.collection("facturi").insertOne(factura, function (err, res) {
		// 		if (err) console.log(err);
		// 		else {
		// 			console.log("Am inserat factura in mongodb");
		// 			//doar de debug:
		// 			obGlobal.bdMongo
		// 				.collection("facturi")
		// 				.find({})
		// 				.toArray(function (err, result) {
		// 					if (err) console.log(err);
		// 					else console.log(result);
		// 				});
		// 		}
		// 	});
		// });
	});
});

/////////////////////////////////////////// Forum ///////////////////////////////////////////////////

var caleXMLMesaje = "resurse/xml/forum.xml";
var headerXML = `<?xml version="1.0" encoding="utf-8"?>`;
function creeazaXMlForumDacaNuExista() {
	if (!fs.existsSync(caleXMLMesaje)) {
		let initXML = {
			declaration: {
				attributes: {
					version: "1.0",
					encoding: "utf-8",
				},
			},
			elements: [
				{
					type: "element",
					name: "forum",
					elements: [
						{
							type: "element",
							name: "mesaje",
							elements: [],
						},
					],
				},
			],
		};
		let sirXml = xmljs.js2xml(initXML, { compact: false, spaces: 4 }); //obtin sirul xml (cu taguri)
		console.log(sirXml);
		fs.writeFileSync(caleXMLMesaje, sirXml);
		return false; //l-a creat
	}
	return true; //nu l-a creat acum
}

function parseazaMesaje() {
	let existaInainte = creeazaXMlForumDacaNuExista();
	let mesajeXml = [];
	let obJson;
	if (existaInainte) {
		let sirXML = fs.readFileSync(caleXMLMesaje, "utf8");
		obJson = xmljs.xml2js(sirXML, { compact: false, spaces: 4 });

		let elementMesaje = obJson.elements[0].elements.find(function (el) {
			return el.name == "mesaje";
		});
		let vectElementeMesaj = elementMesaje.elements ? elementMesaje.elements : []; // conditie ? val_true: val_false
		console.log(
			"Mesaje: ",
			obJson.elements[0].elements.find(function (el) {
				return el.name == "mesaje";
			})
		);
		let mesajeXml = vectElementeMesaj.filter(function (el) {
			return el.name == "mesaj";
		});
		return [obJson, elementMesaje, mesajeXml];
	}
	return [obJson, [], []];
}

app.get("/forum", function (req, res) {
	let obJson, elementMesaje, mesajeXml;
	[obJson, elementMesaje, mesajeXml] = parseazaMesaje();

	res.render("pagini/forum", { utilizator: req.session.utilizator, mesaje: mesajeXml });
});

app.post("/forum", function (req, res) {
	let obJson, elementMesaje, mesajeXml;
	[obJson, elementMesaje, mesajeXml] = parseazaMesaje();

	let u = req.session.utilizator ? req.session.utilizator.username : "anonim";
	let mesajNou = {
		type: "element",
		name: "mesaj",
		attributes: {
			username: u,
			data: new Date(),
		},
		elements: [{ type: "text", text: req.body.mesaj }],
	};
	if (elementMesaje.elements) elementMesaje.elements.push(mesajNou);
	else elementMesaje.elements = [mesajNou];
	console.log("mf", elementMesaje.elements, "mf");
	let sirXml = xmljs.js2xml(obJson, { compact: false, spaces: 4 });
	console.log("XML: ", sirXml);
	fs.writeFileSync("resurse/xml/forum.xml", sirXml);

	res.render("pagini/forum", { utilizator: req.session.utilizator, mesaje: elementMesaje.elements });
});

app.post("/forum/raspunde/:id", function (req, res) {
	let obJson, elementMesaje, mesajeXml;
	[obJson, elementMesaje, mesajeXml] = parseazaMesaje();

	let u = req.session.utilizator ? req.session.utilizator.username : "anonim";
	let mesajNou = {
		type: "element",
		name: "raspuns",
		attributes: {
			username: u,
			data: new Date(),
		},
		elements: [{ type: "text", text: req.body.raspuns }],
	};
	let userId = req.params.id.split("-")[0];
	let dateId = getDateFromString(req.params.id);

	for (let elem of elementMesaje.elements)
		if (elem.attributes.username == userId && elem.attributes.data == dateId) {
			if (elem.elements) elem.elements.push(mesajNou);
			else elem.elements = [mesajNou];
			break;
		}
	let sirXml = xmljs.js2xml(obJson, { compact: false, spaces: 4 });
	console.log("XML: ", sirXml);
	fs.writeFileSync("resurse/xml/forum.xml", sirXml);

	res.render("pagini/forum", { utilizator: req.session.utilizator, mesaje: elementMesaje.elements });
});

////////////////////////////////////////////// Chat //////////////////////////////////////////////////

app.post("/mesaj", function (req, res) {
	console.log("primit mesaj");
	console.log(req.body);
	io.sockets.emit("mesaj_nou", req.body.nume, req.body.culoare, req.body.mesaj);
	res.send("ok");
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/terms", function (req, res) {
	res.render("pagini/terms-and-conditions");
});

app.get("/privacy", function (req, res) {
	res.render("pagini/privacy-policy");
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
function getDateFromString(strData) {
	let day = parseInt(strData.split("-")[1]);
	let month = parseInt(strData.split("-")[2]);
	let year = parseInt(strData.split("-")[3]);
	let hour = parseInt(strData.split("-")[4]);
	let mins = parseInt(strData.split("-")[5]);
	let secs = parseInt(strData.split("-")[6]);
	return new Date(year, month, day, hour, mins, secs);
}

function getDate(data) {
	let date = data ? data : new Date();
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

	var checkNumber = function (str) {
		for (let ch of str) if (isNaN(ch)) return false;
		return true;
	};

	if (type != "anunt") {
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
	} else {
		if (campuriText.nume == "") eroare += "Nume necompletat. ";
		if (campuriText.pret == "") eroare += "Pret necompletat. ";
		if (campuriText.an == "") eroare += "An necompletat. ";
		if (campuriText.producator == "") eroare += "Producator necompletat. ";
		if (campuriText.nume.length > 50) eroare += "Lungimea numelui nu poate depasi 50 de caractere. ";
		if (campuriText.producator.length > 300) eroare += "Lungimea numelui producatorului nu poate depasi 300 de caractere. ";
		if (campuriText.email != "" && !new RegExp("^.+@.+\\..+$", "g").test(campuriText.email)) eroare += "Email invalid. ";

		let pret = campuriText.pret.split(".");
		if (pret.length > 2 || (pret.length == 1 && !checkNumber(pret[0])) || (pret.length == 2 && (!checkNumber(pret[0]) || !checkNumber(pret[1])))) eroare += "Introduceti un numar valid. ";
		if (pret[0].length > 6 || (pret[1] && pret[1].length > 2)) eroare += `Numarul rotunjit nu trebuie sa depaseasca valoarea 10<sup>6</sup> si precizia de 2 zecimale. `;

		let an = campuriText.an;
		if (an.length > 4 || parseInt(an).toString() != an) eroare += "Introduceti un an valid.";
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
	sharp.cache(false);
	sharp(old_path).resize({ height: 300, width: 300 }).toFile(new_path);
	new_path = path.join(__dirname, "poze_uploadate", username, nume + "-mica.png");
	sharp(old_path).resize({ height: 50, width: 50 }).toFile(new_path);
}

function convertImageProdus(username, src_file, dest_file) {
	let caleProduse = path.join(__dirname, "poze_uploadate", username, "produse");
	let old_path = path.join(caleProduse, src_file);
	let new_path = path.join(caleProduse, dest_file);
	sharp.cache(false);
	sharp(old_path)
		.resize({ height: 300, width: 400 })
		.toFile(new_path, function (err, info) {
			fs.unlinkSync(old_path);
		});
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

function getIp(req) {
	//pentru Heroku
	var ip = req.headers["x-forwarded-for"]; // ip-ul userului pentru care este forwardat mesajul
	if (ip) {
		let vect = ip.split(",");
		return vect[vect.length - 1];
	} else if (req.ip) {
		return req.ip;
	} else {
		return req.connection.remoteAddress;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Resetare folder imagini qr-code

cale_qr = "./resurse/imagini/qrcode";
if (fs.existsSync(cale_qr)) fs.rmSync(cale_qr, { force: true, recursive: true });
fs.mkdirSync(cale_qr);
client.query("select id from produse", function (err, rez) {
	for (let prod of rez.rows) {
		let cale_prod = obGlobal.protocol + obGlobal.numeDomeniu + "/produs/" + prod.id;
		//console.log(cale_prod);
		QRCode.toFile(cale_qr + "/" + prod.id + ".png", cale_prod);
	}
});

// app.listen(8080);
var s_port = process.env.PORT || obGlobal.port;
// app.listen(s_port);
server.listen(s_port);

console.log("A pornit");
