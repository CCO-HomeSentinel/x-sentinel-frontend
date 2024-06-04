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
    
    fetch(`/residencia-x/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => response.json())
    .then((data) => {
        console.log(data)
        initializeMap(data.endereco.latitude, data.endereco.longitude);
        // const residencia = data.residencia;
        // const endereco = data.endereco;
        // const cliente = data.cliente;

        // document.getElementById("residencia").innerText = residencia;
        // document.getElementById("endereco").innerText = `${endereco}, ${cliente.bairro}, ${cliente.cidade} - ${cliente.estado}`;
        // document.getElementById("foto").src = cliente.foto_url;
    });

}

function initializeMap(latitude, longitude) {
    window.map = L.map("map").setView([latitude, longitude], 3);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(window.map);

    const southWest = L.latLng(latitude, longitude);
    const northEast = L.latLng(latitude, longitude);
    const bounds = L.latLngBounds(southWest, northEast);

    map.fitBounds(bounds);

    updateMap([[latitude, longitude, "Residência"]]);
}

function updateMap(locations) {
    if (window.map) {
        locations.forEach((location) => {
            L.marker([location[0], location[1]])
                .addTo(window.map)
                .bindPopup(location[2]);
        });
    }
}

listarDadosResidencia()
