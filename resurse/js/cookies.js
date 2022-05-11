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
