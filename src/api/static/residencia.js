document.addEventListener('DOMContentLoaded', () => {
    initializeLogoutButton();
    initializePage();
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
        listarDadosResidencia();
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
        const residencia = data.residencia; 
        const endereco = data.endereco;
        const cliente = data.cliente;

        document.getElementById("photo").src = cliente.foto_url;
        document.getElementById("nome_value").innerText = cliente.nome + ' ' + cliente.sobrenome;
        document.getElementById("email_value").innerText = cliente.email;
        document.getElementById("telefone_value").innerText = cliente.telefone;
        document.getElementById("cpf_value").innerText = cliente.cpf;
        document.getElementById("residencia_name").innerText = residencia.nome;
        document.getElementById("cliente_logradouro").innerText = endereco.logradouro + ', ' + endereco.numero + ' - ' + endereco.cep;
        document.getElementById("cliente_bairro").innerText = endereco.bairro;
        document.getElementById("cliente_cidade").innerText = endereco.cidade;
        document.getElementById("cliente_estado").innerText = endereco.estado;
        document.getElementById("cliente_latitude").innerText = endereco.latitude;
        document.getElementById("cliente_longitude").innerText = endereco.longitude;

        initializeMap(endereco.latitude, endereco.longitude);
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