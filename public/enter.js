const form = document.querySelector('form');
const input = document.getElementById('name');

form.addEventListener('submit', async event => {
    event.preventDefault();
    let url = input.value.trim();
    console.log(url)
    if (url == "hwhelp") {
        window.location.href = "/hwhelp";
    } else {
        location.reload()
    }
    // window.location.href = "/hwhelp.html";
});