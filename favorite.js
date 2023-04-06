const baseUrl = "https://webdev.alphacamp.io"
const indexUrl = baseUrl + "/api/movies/"
const posterUrl = baseUrl + "/posters/"
const dataPanel = document.querySelector("#data-panel")
const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies'))

function renderMoviesCards(data) {
    let htmlContent = ""
    data.forEach( movie => {
        htmlContent += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${posterUrl}/${movie.image}"
              class="card-img-top"
              alt="Movie Poster"
            />
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${movie.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${movie.id}">x</button>
            </div>
          </div>
        </div>
      </div>`
    })
    // console.log(htmlContent)
    dataPanel.innerHTML = htmlContent
}

function showMoiveModal(id) {
    const movieTitle = document.querySelector('#movie-modal-title')
    const movieImage = document.querySelector('#movie-modal-image')
    const movieDate = document.querySelector('#movie-modal-date')
    const movieDescription = document.querySelector('#movie-modal-description')

    axios.get(`${indexUrl}${id}`).then((res) => {
        const data = res.data.results
        movieTitle.textContent = data.title
        movieImage.innerHTML = `<img src="${posterUrl}/${data.image}" alt="movie-poster" class="img-fluid">`
        movieDate.textContent = 'Release date: ' + data.release_date
        movieDescription.textContent = data.description
    }).catch(err => console.log(err))
}

function removeFromFavorite(id) {
    if (!favoriteMovies || !favoriteMovies.length) return

    let index = favoriteMovies.findIndex((movie) => movie.id === id)
    if (index === -1) return

    favoriteMovies.splice(index,1)

    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies))
    renderMoviesCards(favoriteMovies)
}

dataPanel.addEventListener('click', e => {
    if (e.target.matches('.btn-show-movie')) {
      showMoiveModal(e.target.dataset.id)
    } else if(e.target.matches('.btn-remove-favorite')) {
      removeFromFavorite(Number(e.target.dataset.id))
    }
})

renderMoviesCards(favoriteMovies)