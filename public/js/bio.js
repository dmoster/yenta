// Bio Editing

// Set variables
let bioStr
let bioDiv = document.getElementById('bio-div')
let saveBioBtn = document.getElementById('saveBio')

// Add event listeners
bioDiv.addEventListener('mouseover', showEditBtn)
bioDiv.addEventListener('mouseout', hideEditBtn)
bioDiv.addEventListener('click', editBio)
saveBioBtn.addEventListener('click', saveBio)


function showEditBtn() {
  const editBtn = document.getElementById('editBtn')
  editBtn.style.display = 'inline-block'
}

function hideEditBtn() {
  const editBtn = document.getElementById('editBtn')
  editBtn.style.display = 'none'
}

function displayBio(bio) {
  bioStr = bio
  currentBio = document.getElementById('currentBio')
  currentBio.innerHTML = ''

  let bioParagraphs = bio.split('\n')
  bioParagraphs.forEach(element => {
    element = '<p>' + element + '</p>'
    currentBio.innerHTML += element
  });
}

function editBio() {
  const editBtn = document.getElementById('editBtn')
  editBtn.click()

  let currentBio = bioStr
  let editor = document.getElementById('bio-editor')
  editor.value = currentBio
}

function saveBio() {
  newBio = document.getElementById('bio-editor').value
  console.log('New bio: ', newBio)
  $.post('/updateBio', { newBio: newBio }, res => {
    console.log('Result: ', res.bio)
    displayBio(res)
  })
}