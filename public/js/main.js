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
activateNavLink()
updateCopyright()

function activateNavLink() {
  const path = window.location.pathname
  const navLinks = document.getElementsByClassName('nav-link')

  for (let i = 0; i < navLinks.length; i++) {
    if (navLinks[i].pathname === path) {
      navLinks[i].parentElement.classList.add('active')
    }
  }
}

function updateCopyright() {
  const d = new Date()
  const year = d.getFullYear()

  if (year !== 2019) {
    document.getElementById('copyright-current-year').innerText = '-' + year
  }
}
