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
    clientCard.classList.add("col-lg-6");
    clientCard.setAttribute("data-client-name", cliente.nome);

    const fotoUrl = cliente.foto_url ? cliente.foto_url : "https://i.pinimg.com/474x/cf/4a/c1/cf4ac168846158fc8dca8e80adf2e264.jpg";

    clientCard.innerHTML = `
        <div class="card mb-4 cursor-pointer">
            <img src="${fotoUrl}" class="custom-img-height" alt="Cliente">
            <div class="card-body">
                <h5 class="card-title">${cliente.nome}</h5>
                <p class="card-text">${cliente.residencia}</p>
                <p class="card-text">${cliente.bairro}</p>
                <p class="card-text">${cliente.cidade} - ${cliente.estado}</p>
            </div>
        </div>
    `;

    clientCard.addEventListener("click", () => {
        showResidencesList(clientData.residencias);
    });

    container.appendChild(clientCard);
}

function showResidencesList(residencias) {
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", "residencesModal");
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("aria-labelledby", "residencesModalLabel");
    modal.setAttribute("aria-hidden", "true");

    const modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    modalHeader.innerHTML = `
        <h5 class="modal-title" id="residencesModalLabel">Lista de Residências</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    `;

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    residencias.forEach((residencia) => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-3", "cursor-pointer");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        cardBody.innerHTML = `
            <h5 class="card-title">${residencia.residencia}</h5>
            <p class="card-text"><strong>Bairro:</strong> ${residencia.bairro}</p>
            <p class="card-text"><strong>Cidade - Estado:</strong> ${residencia.cidade} - ${residencia.estado}</p>
        `;

        card.appendChild(cardBody);

        card.addEventListener("click", () => {
            window.location.href = `residencia/${residencia.residencia_id}`;
        });

        modalBody.appendChild(card);
    });

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
    `;

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    // Adiciona o modal ao corpo do documento
    document.body.appendChild(modal);

    // Inicializa o modal usando Bootstrap
    var myModal = new bootstrap.Modal(modal);

    // Adiciona um ouvinte de evento para resetar o modal quando ele for fechado
    modal.addEventListener('hidden.bs.modal', function () {
        // Remove todos os filhos do modal-content para resetar seu conteúdo
        modal.querySelector('.modal-content').innerHTML = '';
    });

    // Mostra o modal
    myModal.show();
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
