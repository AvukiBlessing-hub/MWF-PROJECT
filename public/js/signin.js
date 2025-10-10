// Elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const userError = document.getElementById("userError");
const passError = document.getElementById("passError");
const togglePassword = document.getElementById("togglePassword");

// =====================
// Password eye toggle
// =====================
togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.classList.toggle("fa-eye-slash");
});

// =====================
// Client-side form validation
// =====================
loginForm.addEventListener("submit", (e) => {
  userError.textContent = "";
  passError.textContent = "";
  let hasError = false;

  if (!emailInput.value.trim()) {
    userError.textContent = "Email is required";
    hasError = true;
  }

  if (!passwordInput.value.trim()) {
    passError.textContent = "Password is required";
    hasError = true;
  }

  if (hasError) e.preventDefault();
});
