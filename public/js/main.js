function getLogin() {
  document.getElementById('login-username').focus()
}

function comparePasswords() {
  let pw1 = document.getElementById('password')
  let pw2 = document.getElementById('password-verify')

  pw1 = pw1.value
  pw2 = pw2.value

  let signupSubmit = document.getElementById('signup-submit')

  if (pw1 === pw2) {
    signupSubmit.disabled = false
  }
  else {
    signupSubmit.disabled = true
  }
}

// Select active nav button
const path = window.location.pathname
