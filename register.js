 // Tabs switching
    const tabSignup = document.getElementById('tab-signup');
    const tabSignin = document.getElementById('tab-signin');
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');

    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('active');
      tabSignin.classList.remove('active');
      signupForm.classList.add('active');
      signinForm.classList.remove('active');
      clearMessages();
    });

    tabSignin.addEventListener('click', () => {
      tabSignin.classList.add('active');
      tabSignup.classList.remove('active');
      signinForm.classList.add('active');
      signupForm.classList.remove('active');
      clearMessages();
    });

    function clearMessages() {
      // Clear all error and success messages
      const errors = document.querySelectorAll('.error');
      errors.forEach(e => e.textContent = '');

      const successes = document.querySelectorAll('.success-message');
      successes.forEach(s => s.textContent = '');
    }

    // Validation Helpers
    function isValidEmail(email) {
      // Simple email regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateSignup() {
      let isValid = true;

      const username = document.getElementById('signup-username').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;

      const usernameError = document.getElementById('signup-username-error');
      const emailError = document.getElementById('signup-email-error');
      const passwordError = document.getElementById('signup-password-error');
      const successMessage = document.getElementById('signup-success');

      // Clear previous errors
      usernameError.textContent = '';
      emailError.textContent = '';
      passwordError.textContent = '';
      successMessage.textContent = '';

      if (username.length < 3) {
        usernameError.textContent = 'Username must be at least 3 characters.';
        isValid = false;
      }
      if (!isValidEmail(email)) {
        emailError.textContent = 'Please enter a valid email.';
        isValid = false;
      }

      if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters.';
        isValid = false;
      }

      return isValid;
    }

    function validateSignin() {
      let isValid = true;

      const email = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value;

      const emailError = document.getElementById('signin-email-error');
      const passwordError = document.getElementById('signin-password-error');
      const successMessage = document.getElementById('signin-success');

      // Clear previous errors
      emailError.textContent = '';
      passwordError.textContent = '';
      successMessage.textContent = '';

      if (!isValidEmail(email)) {
        emailError.textContent = 'Please enter a valid email.';
        isValid = false;
      }

      if (password.length === 0) {
        passwordError.textContent = 'Password is required.';
        isValid = false;
      }

      return isValid;
    }

    // Handle signup submission
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      if (validateSignup()) {
        // In real application, here you would send signup data to backend
        document.getElementById('signup-success').textContent = 'Account created successfully!';
        signupForm.reset();
      }
    });

    // Assuming this is inside your form submit handler
const role = document.getElementById("role");

// Validate Role
if (!role.value) {
    errors.push("Please select a role.");
    showFieldError(role, "roleError", "Role is required.");
}

    // Handle signin submission
    signinForm.addEventListener('submit', e => {
      e.preventDefault();
      if (validateSignin()) {
        // In real application, here you would authenticate user with backend
        document.getElementById('signin-success').textContent = 'Signed in successfully!';
        signinForm.reset();
      }
    });