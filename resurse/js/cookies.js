function getPageURL() {
	let scripts = document.getElementsByTagName("script");
	let lastScript = scripts[scripts.length - 1];
	return lastScript.getAttribute("pageURL");
}

let pageURL = getPageURL();

window.addEventListener("DOMContentLoaded", function () {
	setCookie(generateCookieName(), pageURL, 500000);
	checkBanner();
	let secIstoric = document.getElementById("istoric");
	let linkuri = getLinkuriPagini();
	secIstoric.innerHTML = `<div>Pagini recente: ${linkuri}</div>`;
});

function getLinkuriPagini() {
	var vectCookies = document.cookie.split(";");
	let str = "";
	let i = 0;
	for (let cookie of vectCookies) {
		i++;
		cookie = cookie.trim();
		if (cookie.startsWith("istoric")) {
			[nume, val] = cookie.split("=");
			str += `<a href=${val}>${val}</a>`;
			if (i < vectCookies.length - 1) str += ", ";
			else if (i == vectCookies.length - 1) str += " | ";
		}
	}
	return str;
}

function generateCookieName() {
	let date = new Date();
	let day = ("0" + date.getDate()).slice(-2);
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let year = date.getFullYear();
	let hours = ("0" + date.getHours()).slice(-2);
	let minutes = ("0" + date.getMinutes()).slice(-2);
	let seconds = ("0" + date.getSeconds()).slice(-2);
	return "istoric" + day + month + year + hours + minutes + seconds;
}

function setCookie(nume, val, timpExpirare, path = "/") {
	let d = new Date();
	d.setTime(new Date().getTime() + timpExpirare);
	document.cookie = `${nume}=${val}; expires=${d.toUTCString()}; path=${path}`;
}

function getCookie(nume) {
	var vectCookies = document.cookie.split(";");
	for (let cookie of vectCookies) {
		cookie = cookie.trim();
		if (cookie.startsWith(nume + "=")) {
			return cookie.substring(nume.length + 1);
		}
	}
}

function deleteCoookie(nume) {
	setCookie(nume, "", 0);
}

function deleteAllCoookie() {
	var vectCookies = document.cookie.split(";");
	for (let cookie of vectCookies) {
		cookieName = cookie.split("=")[0].trim();
		deleteCoookie(cookieName);
	}
}

function checkBanner() {
	if (getCookie("acceptat_banner")) {
		document.getElementById("sectiune-cookie").style.display = "none";
	} else {
		document.getElementById("sectiune-cookie").style.display = "block";
		document.getElementById("ok-cookies").onclick = function () {
			document.getElementById("sectiune-cookie").style.display = "none";
			setCookie("acceptat_banner", "true", 5000);
			setCookie("istoric", "true", 5000);
		};
	}
}
