if (!sessionStorage.getItem('shown')) {
    window.addEventListener("load", () => {
        const loader = document.querySelector(".loader");
        setTimeout(() => {
            loader.classList.add("loader--hidden");

            loader.addEventListener("transitionend", () => {
                document.body.removeChild(loader);
            });
            sessionStorage.setItem('shown', true);
        }, 1000)
    })
} else {
    const loader = document.querySelector(".loader");
    loader.classList.add("loader--hidden");

    loader.addEventListener("transitionend", () => {
        document.body.removeChild(loader);
    });
}