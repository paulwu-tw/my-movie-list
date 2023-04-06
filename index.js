const baseUrl = "https://webdev.alphacamp.io"
const indexUrl = baseUrl + "/api/movies/"
const posterUrl = baseUrl + "/posters/"
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector('#search-form')
const pagination = document.querySelector('#paginator')
const moviesPerPage = 12

const movies = []
let filteredMovies = []

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * moviesPerPage
  return data.slice(startIndex, startIndex + moviesPerPage)
}

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
              <button class="btn btn-info btn-add-favorite" data-id="${movie.id}">+</button>
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

function renderPaginator(length) {
  const numberOfPage = Math.ceil(length / moviesPerPage)
  
  let htmlContent = ""
  for (let i=0; i < numberOfPage; i++) {
    htmlContent += `<li class="page-item"><a class="page-link" href="#" data-page=${i+1}>${i+1}</a></li>`
  }
  pagination.innerHTML = htmlContent
}

function renderMoviesList(url) {
  axios
    .get(url)
    .then( (response) => {
        // movies.push(...response.data.results) // (...) spread operator
        response.data.results.forEach(movie => {
            movies.push(movie)
        })
        renderPaginator(movies.length)
        renderMoviesCards(getMoviesByPage(1))
    }).catch((err) => console.log(err))  
}

function addToFavorite(id) {
  // 從 localStorage 取得 favoriteMovies 陣列，若沒有 new 一個空陣列
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  
  // 在 list 中尋找 favoriteMovies 清單中，是否已經蒐藏
  // some : 陣列中有就回傳 true
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  
  if (list.some(function (info) {return info.id === id})) {
    return alert('此電影已經在收藏清單中！')
  }

  const tempMovie = movies.find((movie) => movie.id === id)

  list.push(tempMovie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  
}

dataPanel.addEventListener('click', e => {
    if (e.target.matches('.btn-show-movie')) {
      showMoiveModal(e.target.dataset.id)
    } else if(e.target.matches('.btn-add-favorite')) {
      addToFavorite(Number(e.target.dataset.id))
    }
})

searchForm.addEventListener('submit', e => {
  e.preventDefault()
  const inputValue = document.querySelector('#search-input').value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(inputValue)
  )
  
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${inputValue} 沒有符合條件的電影`)
  }
  
  renderPaginator(filteredMovies.length)
  renderMoviesCards(getMoviesByPage(1))
})

pagination.addEventListener('click', e => {
  if (e.target.tagName !== 'A') return

  const page = Number(e.target.textContent)
  renderMoviesCards(getMoviesByPage(page))
  scrollTo({
    top: 0,
    behavior: 'smooth'
  });
})

renderMoviesList(indexUrl)


