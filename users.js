const userForm = document.getElementById('userForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const roleInput = document.getElementById('role');

// Load existing users or empty array
let users = JSON.parse(localStorage.getItem('users')) || [];

userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = {
        name: nameInput.value,
        email: emailInput.value,
        role: roleInput.value
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    alert(`User ${user.name} added successfully!`);

    userForm.reset();
});
