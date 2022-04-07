const fs = require("fs");
const sharp = require("sharp");

let cale = "/resurse/imagini/produse/";

fs.readdir(__dirname + cale, (err, files) => {
	if (err) console.log(err);
	else {
		console.log("\nCurrent directory filenames:");
		const width = 300;
		const height = 300;
		for (let imag of files)
			if (imag != "resized") {
				imag_dest = __dirname + cale + "resized/" + imag;
				if (!fs.existsSync(imag_dest))
					sharp(__dirname + cale + imag)
						.resize(width, height)
						.toFile(imag_dest);
			}
	}
});

// for (let imag of obImagini.imagini) {
// 	let nume_imag, extensie;
// 	[nume_imag, extensie] = imag.cale_fisier.split("/")[1].split(".");

// 	const width = 400;
// 	const height = 300;
// 	imag.mare_dest = `${obImagini.cale_galerie}/mare/${nume_imag}-${width}.webp`;
// 	imag.mare = `${obImagini.cale_galerie}/${nume_imag}.${extensie}`;
// 	console.log(__dirname + "/" + imag.mare);
// 	if (!fs.existsSync(imag.mare_dest))
// 		sharp(__dirname + "/" + imag.mare)
// 			.resize(width, height)
// 			.toFile(__dirname + "/" + imag.mare_dest);
// }
