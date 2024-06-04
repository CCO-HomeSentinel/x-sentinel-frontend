function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordType = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', passwordType);
}

document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('nome', result.nome);
        window.location.href = '/main';
    } else {
        document.getElementById('errorMessage').innerText = result.message;
    }

    console.log(response)

    if (response.status === 500) {
        document.getElementById('errorMessage').innerText = 'Internal server error';
    }
});