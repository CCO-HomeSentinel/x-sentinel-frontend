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
        plotarClientes();
        initializeMap();
    } else {
        window.location.href = "/";
    }
}

function plotarClientes() {
    const clientContainer = document.querySelector(".client-container");
    clientContainer.innerHTML = "";

    fetch("/clientes", {
        headers: {
            "x-access-token": localStorage.getItem("token"),
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const locations = [];
        const clients = {};

        data.forEach((cliente) => {
            if (!clients[cliente.nome]) {
                clients[cliente.nome] = {
                    nome: cliente.nome,
                    residencias: [],
                };
            }

            clients[cliente.nome].residencias.push({
                residencia_id: cliente.residencia_id,
                residencia: cliente.residencia,
                bairro: cliente.bairro,
                cidade: cliente.cidade,
                estado: cliente.estado,
                foto_url: cliente.foto_url,
            });

            if (!clientCardExists(cliente.nome)) {
                createClientCard(cliente, clients[cliente.nome], clientContainer);
            }

            if (cliente.latitude && cliente.longitude) {
                locations.push([cliente.latitude, cliente.longitude, cliente.nome]);
            }
        });

        updateMap(locations);
    })
    .catch((error) => console.error("Erro ao buscar dados:", error));
}

function clientCardExists(clientName) {
    return document.querySelector(`.client-card[data-client-name="${clientName}"]`) !== null;
}

function createClientCard(cliente, clientData, container) {
    const clientCard = document.createElement("div");
    clientCard.classList.add("client-card");
    clientCard.setAttribute("data-client-name", cliente.nome);

    const fotoUrl = cliente.foto_url ? cliente.foto_url : "https://i.pinimg.com/474x/cf/4a/c1/cf4ac168846158fc8dca8e80adf2e264.jpg";

    clientCard.innerHTML = `
        <div class="client-card-inner">
            <img src="${fotoUrl}" alt="Cliente">
            <div class="client-info">
                <h3>${cliente.nome}</h3>
                <p class='residencia'>${cliente.residencia}</p>
                <p class='bairro'>${cliente.bairro}</p>
                <p class='cidade-estado'>${cliente.cidade} - ${cliente.estado}</p>
            </div>
        </div>
    `;

    clientCard.addEventListener("click", () => {
        showResidencesList(clientData.residencias);
    });

    container.appendChild(clientCard);
}

function showResidencesList(residencias) {
    const modal = createModal();

    residencias.forEach((residencia) => {
        const residenceOption = document.createElement("div");
        residenceOption.classList.add("residence-option");
        residenceOption.innerHTML = `
            <p class='residencia'>${residencia.residencia}</p>
            <p class='bairro'>${residencia.bairro}</p>
            <p class='cidade-estado'>${residencia.cidade} - ${residencia.estado}</p>
        `;
        residenceOption.addEventListener("click", () => {
            window.location.href = `residencia/${residencia.residencia_id}`;
        });
        modal.querySelector('.modal-content').appendChild(residenceOption);
    });

    document.body.appendChild(modal);
    modal.style.display = "block";
}

function createModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeModal = document.createElement("span");
    closeModal.classList.add("close");
    closeModal.innerHTML = "&times;";
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modalContent.appendChild(closeModal);
    modal.appendChild(modalContent);

    return modal;
}

function initializeMap() {
    window.map = L.map("map").setView([-23.55052, -46.633308], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(window.map);

    const southWest = L.latLng(-33.75, -73.6);
    const northEast = L.latLng(5.25, -34.75);
    const bounds = L.latLngBounds(southWest, northEast);

    map.fitBounds(bounds);
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
