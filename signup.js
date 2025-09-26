form.addEventListener('submit', function (e) {
    // Prevent default only temporarily
    e.preventDefault();
    let valid = true;

    // Validate Full Name
    const nameValue = fullname.value.trim();
    if (nameValue.length < 3 || nameValue[0] !== nameValue[0].toUpperCase()) {
        nameError.textContent = "Name must start with a capital letter and be at least 3 characters.";
        valid = false;
    } else {
        nameError.textContent = "";
    }

    // Validate Email with regex
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        emailError.textContent = "Please enter a valid email address.";
        valid = false;
    } else {
        emailError.textContent = "";
    }

    // Validate Password
    if (password.value.length < 6) {
        passError.textContent = "Password must be at least 6 characters.";
        valid = false;
    } else {
        passError.textContent = "";
    }

    // If valid, submit the form to backend
    if (valid) {
        form.submit(); // <-- let the browser send the request to Express
    }
});
