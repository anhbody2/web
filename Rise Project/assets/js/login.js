document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
    } else if (password !== confirmPassword) {
        document.getElementById('confirm-password').setCustomValidity('Passwords do not match.');
        form.classList.add('was-validated');
    } else {
        document.getElementById('confirm-password').setCustomValidity('');
        alert('Form submitted successfully!');
    }
});
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        form.classList.add('was-validated');} 
    else {
        alert('Form submitted successfully!');
        window.location.href = 'index.html';}
});

const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');
const showLoginForm = document.getElementById('showLoginForm');
const showRegisterForm = document.getElementById('showRegisterForm');

registerFormContainer.classList.add('active');
showLoginForm.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormContainer.classList.add('active');
    registerFormContainer.classList.remove('active');
});

showRegisterForm.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormContainer.classList.remove('active');
    registerFormContainer.classList.add('active');
});