const splashs = ["Dont get onto any weird stuff plz", "Dont die...", "As seen on TV!", "Unlock-o-matic?"]
var randomNumber = Math.floor(Math.random()*splashs.length);
let splash = splashs[randomNumber]

const bar = document.querySelector("#uv-address");
bar.placeholder = splash