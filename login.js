document.getElementById('loginBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  if (username === 'Rey' && password === 'password123') {
    sessionStorage.setItem('username', username);
    window.location.href = 'dashboard.html';
  } else {
    errorMsg.textContent = 'Invalid credentials.';
    errorMsg.classList.remove('d-none');
  }
});