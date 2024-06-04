document.addEventListener('DOMContentLoaded', () => {
    initializeLogoutButton();
});

function initializeLogoutButton() {
    document.getElementById("logout-button").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "/";
    });
}

function initializePage() {
    const token = localStorage.getItem("token");
    const nome = localStorage.getItem("nome");

    if (token && nome) {
        document.getElementById("username").innerText = nome;
        initializeMap();
    } else {
        window.location.href = "/";
    }
}

function listarDadosResidencia(){
    const url = window.location.href;
    const id = url.split("/")[4];
    console.log(id)
}

listarDadosResidencia()
