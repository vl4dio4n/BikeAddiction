// socketUrl = "../../";
// if (document.location.href.indexOf("localhost") != -1) {
// 	socketUrl = "http://127.0.0.1:" + port;
// }
// const socket = io(socketUrl, { reconnect: true });
socket = io();
socket.on("mesaj_nou", function (nume, culoare, mesaj) {
	console.log("I was here");
	var chat = document.getElementById("mesaje-chat");
	// chat.innerHTML += `<p> ${nume} : <span style='color:${culoare}'>${mesaj}</span></p> `;
	chat.innerHTML += `
		<div class="mesaj-chat ${username == nume ? "dreapta" : "stanga"}"> 
			<p class="autor-mesaj"><a href="/utilizator/${nume}">${nume}</a></p>
			<p class="msj" style='color:${culoare}'>${mesaj}</p>
		</div> `;
	//ca sa scrolleze la finaal
	chat.scrollTop = chat.scrollHeight;
});

function trimite() {
	var culoare = document.getElementById("culoare").textContent;
	var nume = document.getElementById("nume").textContent;
	var mesaj = document.getElementById("mesaj").value;
	fetch("/mesaj", {
		method: "POST",
		headers: { "Content-Type": "application/json" },

		mode: "cors",
		cache: "default",
		body: JSON.stringify({
			culoare: culoare,
			nume: nume,
			mesaj: mesaj,
		}),
	});
}

// <label for="mesaj">Mesaj:</label><br/>
// <textarea id="mesaj" name="mesaj" value=""></textarea>
