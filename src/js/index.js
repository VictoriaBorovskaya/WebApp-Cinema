import {
    drawAddModal,
    loadingMovies,
    searchError,
    saveToLocalStorage,
    getCollection,
    forEachModalButton,
    closeModal,
    closeModalClick
} from "./scripts.js"

// глобальные переменные
let movieList = document.getElementById("movie-list")
let modal = document.getElementById("add-modal-content")
let addModal = document.getElementById("add-modal")

// функция для поиска фильмов
async function searchMovie() {
    let movieTitle = document.getElementById("input").value
    loadingMovies(movieList, movieList)
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "Td24bfq18lmsh5KqGTIsh6amrNJRp1h4MngjsnIdn2a8CFcrl5",
            "X-RapidAPI-Host": "moviesdb5.p.rapidapi.com"
        }
    }
    const response = await fetch(
        `https://moviesdb5.p.rapidapi.com/om?s=${movieTitle}`,
        options
    )
    const data = await response.json()
    try {
        let movies = Array.from(data.Search)
        drawCard(movies)
        forEachCollectionButton(movies)
        document.getElementById("input").value = ""
    } catch (error) {
        console.log(error)
        searchError(movieList)
    }
}

// функция отрисовки карточек фильмов
function drawCard(arr) {
    movieList.style.display = "grid"
    movieList.innerHTML = ""
    arr.forEach((movie) => {
        let collection = getCollection()
        const moviesIds = collection.map((m) => m.imdbID)
        const isCollection = moviesIds.includes(movie.imdbID)

        let poster = movie.Poster
        if (movie.Poster === "N/A") {
            poster = "/images/movie-poster.png"
        }

        movieList.innerHTML += `
            <div class="relative border-2 border-red-600 rounded my-8 flex flex-col justify-between" id="movie-container">
                <div>
                    <img src="${poster}" class="w-full h-80 object-cover object-center text-white font-semibold text-lg text-center leading-10" alt="Unfortunately the movie poster is not displayed :(" />
                    ${
                        isCollection
                            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 absolute top-2 left-2 text-red-600 hover:text-white" id="remove-movie-${movie.imdbID}">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 absolute top-2 left-2 text-white hover:text-red-600" id="add-movie-${movie.imdbID}">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>`
                    }
                </div>
                <div class="p-2 gap-2 flex flex-col justify-between">          
                        <p class="text-white font-bold text-xl text-center py-2">${
                            movie.Title
                        }</p>
                        <p class="text-white text-center">${movie.Year}</p>
                </div>
                <div class="p-2">
                    <button class="button hover:bg-black" id="button-${
                        movie.imdbID
                    }">Details</button>
                </div>
            </div>
        `
    })
    forEachDetailsButton(arr)
}

// для привязки обработчиков на каждую кнопку
function forEachDetailsButton(arr) {
    arr.forEach((movie) => {
        document
            .getElementById(`button-${movie.imdbID}`)
            .addEventListener("click", () => {
                drawModal(movie.imdbID, arr)
            })
    })
}

// функция для открытия модального окно и отображения информации
async function drawModal(imdbID, arr) {
    loadingMovies(addModal, modal)
    const movie = arr.find((movieID) => {
        return movieID.imdbID === imdbID
    })
    console.log(movie)
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key":
                "Td24bfq18lmsh5KqGTIsh6amrNJRp1h4MngjsnIdn2a8CFcrl5",
            "X-RapidAPI-Host": "moviesdb5.p.rapidapi.com"
        }
    }
    const response = await fetch(
        `https://moviesdb5.p.rapidapi.com/om?i=${imdbID}`,
        options
    )
    const data = await response.json()
    drawAddModal(data)
    forEachModalButton(data)
    drawCard(arr)
    forEachCollectionButton(arr)
    document
        .getElementById("button-close")
        .addEventListener("click", closeModal)
    addModal.addEventListener("click", closeModalClick)
    drawCard(arr)
}

// функция для добавления в коллекцию
// привязываем обработчики на кнопки "сердце"
function forEachCollectionButton(arr) {
    arr.forEach((movie) => {
        let collection = getCollection()
        const moviesIds = collection.map((m) => m.imdbID)
        const isCollection = moviesIds.includes(movie.imdbID)

        isCollection
            ? document
                  .getElementById(`remove-movie-${movie.imdbID}`)
                  .addEventListener("click", () => {
                      deleteMovie(arr, movie.imdbID)
                  })
            : document
                  .getElementById(`add-movie-${movie.imdbID}`)
                  .addEventListener("click", () => {
                      addCollection(movie.imdbID, arr)
                  })
    })
}

// функция добавления в коллекцию
function addCollection(imdbID, arr) {
    let collection = getCollection()
    const movie = arr.find((movieID) => {
        return movieID.imdbID === imdbID
    })
    const index = arr.indexOf(movie)
    let newMovie = arr[index]
    const existingMovie = collection.find((movie) => {
        return movie.imdbID === imdbID
    })
    if (!existingMovie) {
        collection.push(newMovie)
        saveToLocalStorage(collection)
        drawCard(arr)
        forEachCollectionButton(arr)
    }
}

// функция удаления из коллекции
function deleteMovie(arr, imdbID) {
    let collection = getCollection()
    const movie = collection.find((movieID) => {
        return movieID.imdbID === imdbID
    })
    const index = collection.indexOf(movie)
    collection.splice(index, 1)
    saveToLocalStorage(collection)
    drawCard(arr)
    forEachCollectionButton(arr)
}

function initApp() {
    document
        .getElementById("button-search")
        .addEventListener("click", searchMovie)
    document.addEventListener("keyup", function (event) {
        if (event.code === "Enter") {
            searchMovie()
        }
    })
}

initApp()

/*  через сеттаймаут сделать плавную загрузку страницы (хедера) */
