let addToy = false;
let url = 'http://localhost:3000/toys/'
let newToyForm = document.getElementById('new-toy-form')

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function fetchToys() {
  fetch(url)
  .then(response => response.json())
  .then(toysData => toysData.forEach(toy => renderToy(toy)))
}

function renderToy(toy, toyDiv) {

  let toyCollection = document.getElementById('toy-collection')

  if (!toyDiv) {
    var toyDiv = document.createElement('div')
    toyDiv.className = 'card'
    toyCollection.appendChild(toyDiv)
  }

  let h2 = document.createElement('h2')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let btn = document.createElement('btn')

  h2.textContent = toy.name
  toyDiv.appendChild(h2)

  img.src = toy.image
  img.className = 'toy-avatar'
  toyDiv.appendChild(img)
  
  p.textContent = toy.likes
  p.id = `${toy.id}-like-tag`
  toyDiv.appendChild(p)
  
  btn.className = 'like-btn'
  btn.id = toy.id
  btn.textContent = 'Like ❤️'
  btn.addEventListener('click', () => { 
    toy.likes++
    updateLikes(toy, toyDiv)
  })
  
  toyDiv.appendChild(btn)
}

function updateLikes(toy, toyDiv) {
  const toyUrl = url + toy.id
  const newNumberOfLikes = toy.likes

  let patchRequest = {
    method: "PATCH",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      likes: newNumberOfLikes
    })
  }
  fetch(toyUrl, patchRequest)
    .then(response => response.json())
    .then(toyData => {
      toyDiv.innerHTML = ''
      renderToy(toyData, toyDiv)
    })
}

newToyForm.addEventListener('submit', event => newToy(event))

function newToy(event) {
  event.preventDefault()
  let toyName = document.getElementById('new-toy-name')
  let toyImg = document.getElementById('new-toy-img')

  const newToyObject = {
    name: toyName.value,
    image: toyImg.value,
    likes: 0
  }

  let postRequest = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToyObject)
  }
  fetch(url, postRequest)
    .then(response => response.json())
    .then(data => renderToy(data))
}

fetchToys()