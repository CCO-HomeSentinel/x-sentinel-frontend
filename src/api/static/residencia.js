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
        listarTweets();
    } else {
        window.location.href = "/";
    }
}

function listarTweets() {
    const url = window.location.href;
    const id = url.split("/")[4];
    
    fetch(`/tweets-x/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => response.json())
    .then((data) => {
        console.log(data)
        ofensiveTweets = data.filter(tweet => tweet.isPalavrao == 1)

        const currentDate = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);
        const recentTweets = data.filter(tweet => new Date(tweet.data_post) >= twoYearsAgo);

        document.getElementById("tweets_value").innerText = data.length
        document.getElementById("ofensivos_value").innerText = ofensiveTweets.length
        document.getElementById("recent_value").innerText = recentTweets.length

        contentElement = document.getElementById("content")

        data.forEach(tweet => {
            const tweetCard = document.createElement('div');
            tweetCard.className = "tweet-card";
            
            const header = document.createElement('div');
            header.className = "d-flex justify-content-between mb-2";
            
            const author = document.createElement('div');
            author.className = "fw-bold mb-2";
            author.innerText = tweet.nome;

            const date = document.createElement('div');
            date.className = "text-muted small mb-2";
            const tweetDate = new Date(tweet.data_post);
            date.innerText = tweetDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const message = document.createElement('div');
            message.className = "tweet-message";
            message.innerText = tweet.texto;

            header.appendChild(author);
            header.appendChild(date);

            tweetCard.appendChild(header);
            tweetCard.appendChild(message);

            contentElement.appendChild(tweetCard);
        });

    });
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