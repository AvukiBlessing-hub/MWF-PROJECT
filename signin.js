const form = document.getElementById('loginForm');
const username = document.getElementById('username');
const password = document.getElementById('password');
const userError = document.getElementById('userError');
const passError = document.getElementById('passError');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Validate Username
    const userValue = username.value.trim();
    if (userValue.length < 3) {
        userError.textContent = "Username must be at least 3 characters.";
        valid = false;
    } else {
        userError.textContent = "";
    }

    // Validate Password
    if (password.value.length < 6) {
        passError.textContent = "Password must be at least 6 characters.";
        valid = false;
    } else {
        passError.textContent = "";
    }

    if (valid) {
        alert("Login successful!");
        form.reset();
    }
});
