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


// Bio Editing
function showEditBtn() {
  const editBtn = document.getElementById('editBtn')
  editBtn.style.display = 'inline-block'
}

function hideEditBtn() {
  const editBtn = document.getElementById('editBtn')
  editBtn.style.display = 'none'
}

function editBio() {
  const editBtn = document.getElementById('editBtn')
  editBtn.click()

  // let currentBio = document.getElementById('currentBio').innerHTML
  // let editor = document.getElementById('bio-editor')
  // editor.value = currentBio
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
