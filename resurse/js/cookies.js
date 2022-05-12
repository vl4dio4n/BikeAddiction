window.addEventListener("DOMContentLoaded", function () {
	checkBanner();
});

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

function deleteAllCoookie(nume) {
	var vectCookies = document.cookie.split(";");
	for (let cookie of vectCookies) {
		cookieName = cookie.split("=")[0].trim();
		deleteCoookie(cookieName);
	}
}

function checkBanner() {
	if (getCookie("acceptat_banner")) {
		document.getElementById("banner-cookie").style.display = "none";
	} else {
		document.getElementById("banner-cookie").style.display = "block";
		document.getElementById("ok-cookies").onclick = function () {
			document.getElementById("banner-cookie").style.display = "none";
			setCookie("acceptat_banner", "true", 5000);
		};
	}
}
