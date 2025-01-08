const inputBox = document.getElementById("input-box") // input box
const searchButton = document.getElementById("search-button") // search button

const apiKey = "Mzk2MzI1MDJ8MTcwNjMyNTU5Mi40OTQ4OTkz"
const apiUrl = "https://api.seatgeek.com/2/"

const subscriptionKey = '91f168658f8e4412ad9e67bd8aed1254';
const endpoint = 'https://api.bing.microsoft.com/v7.0/images/search'

function getImage(input, callback) {

  const headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
  };

  const params = {
    q: input, // search word
    count: 1,  // Retrieve only one result (the first image)
  };

  const queryString = new URLSearchParams(params).toString();
  const url = `${endpoint}?${queryString}`;

  fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
      // Extract the URL of the first image
      const firstImageUrl = data.value[0].contentUrl;
      callback(firstImageUrl) // return the url
    })
    .catch(error => {
      console.error('Error fetching image data:', error);
    });
}

function clickUrl(url) {
  window.open(url, '_blank').focus() // open url in new tab
}

function addGrid(name, eventCount, url, address) {

  const gridContainer = document.querySelector('.grid-container') // holds all the grid items
  const gridItem = document.createElement('div') // grid item
  const gridName = document.createElement('p') // grid name 
  const gridButton = document.createElement('button') // grid button
  const gridImage = document.createElement("img") // grid image

  const gridContent = document.createElement('div') // holds the grid content
  const description = document.createElement('div') // grid description
  const gridAddress = document.createElement('div') // venue address

  description.textContent = "Event Count: " + eventCount // set description to show event count
  description.setAttribute('class', 'content-description')

  gridAddress.textContent = address // show address
  gridAddress.setAttribute('class', 'content-address')

  // add description and address to grid content
  gridContent.appendChild(description)
  gridContent.appendChild(gridAddress)
  gridContent.setAttribute('class', 'grid-content')


  // create image element
  gridImage.setAttribute('id', 'myImage')
  gridImage.setAttribute('width', '250px')
  gridImage.setAttribute('height', '250px')

  getImage(name, function(imageLink) {
    gridImage.src = imageLink
  });

  gridName.textContent = name.split(' ').slice(0, 3).join(' ') // display only first 3 words in name

  // configure grid button
  gridButton.textContent = "Buy Tickets"
  gridButton.addEventListener("click", function() {
    clickUrl(url)
  }, false)
  gridContent.appendChild(gridButton) // add grid button to grid content

  gridItem.appendChild(gridContent) // add grid content
  gridItem.appendChild(gridName) // add grid name to grid item
  gridItem.appendChild(gridImage) // add image to grid item

  gridItem.classList.add('grid-item') // set class name to grid-item
  gridContainer.appendChild(gridItem) // add grid to grid container

}

async function getVenues(city) {

  if (inputBox.value === "") {
    // empty input box
    alert("You cannot leave this blank!")
    return
  }

  // clear grid
  const gridContainer = document.querySelector('.grid-container')
  gridContainer.replaceChildren()

  const url = apiUrl + "venues?city=" + city + "&client_id=" + apiKey

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status)
    }

    const data = await response.json()

    for (let i = 0; i < data.venues.length; i++) { // loop through all venues
      const venue = data.venues[i] // get venue
      const eventCount = venue.num_upcoming_events // get event count
      if (eventCount > 0) { // skip venue if it has no events
        addGrid(venue.name, eventCount, venue.url, venue.address) // add venue to grid
      }

    }

  } catch (error) {
    console.error('Error:', error.message)
  }

}

searchButton.addEventListener("click", () => {
  getVenues(inputBox.value)
})

inputBox.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    getVenues(inputBox.value)
  }
});

window.addEventListener('resize', function() {
  document.querySelector('.slide').style.height = window.innerHeight + 'px'; // dynamically resize the sidebar to take up entire screen
});
