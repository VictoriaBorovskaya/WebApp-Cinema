import {
    getCollection,
    drawAddModal,
    loadingMovies,
    closeModal,
    closeModalClick,
    forEachModalButton,
    saveToLocalStorage
} from "./scripts.js"

// глобальные переменные
let collection = getCollection()
let modal = document.getElementById("add-modal-content")
let addModal = document.getElementById("add-modal")

function drawCollection(arr) {
    let collection = getCollection()
    let list = document.getElementById("movie-list-collection")
    list.innerHTML = ""
    if (collection.length === 0) {
        list.style.display = "flex"
        list.innerHTML += `<p class="text-white font-bold text-2xl my-20 text-center w-full">Your collection is currently empty.</p>`
    } else {
        list.style.display = "grid"
        list.innerHTML = ""
        collection.forEach((movie) => {
            let poster = movie.Poster
            if (movie.Poster === "N/A") {
                poster = "/images/movie-poster.png"
            }
            list.innerHTML += `
                <div class="relative border-2 border-red-600 rounded sm:my-8 flex flex-col justify-between movies-container" id="movie-container">
                <div>
                    <img src="${poster}" class="w-full h-80 object-cover object-center text-white font-semibold text-lg text-center leading-10" alt="Unfortunately the movie poster is not displayed :(" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 absolute top-2 left-2 text-red-600 hover:text-white" id="remove-movie-${movie.imdbID}">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>       
                </div>
                <div class="p-2 gap-2 flex flex-col justify-between">          
                        <p class="text-white font-bold text-xl text-center py-2">${movie.Title}</p>
                        <p class="text-white text-center">${movie.Year}</p>
                </div>
                <div class="p-2">
                    <button class="button hover:bg-black" id="button-${movie.imdbID}">Details</button>
                </div>
            </div>
            `
        })
        forEachDetailsButton()
        forEachCollectionButton()
    }
}

// для привязки обработчиков на каждую кнопку
function forEachDetailsButton() {
    let collection = getCollection()
    collection.forEach((movie) => {
        document
            .getElementById(`button-${movie.imdbID}`)
            .addEventListener("click", () => {
                drawModal(movie.imdbID)
            })
    })
}

// для удаления при нажатии на сердечко
function forEachCollectionButton() {
    let collection = getCollection()
    collection.forEach((movie) => {
        document
            .getElementById(`remove-movie-${movie.imdbID}`)
            .addEventListener("click", () => {
                deleteMovie(movie.imdbID)
            })
    })
}

// удаление из коллекции
function deleteMovie(imdbID) {
    let collection = getCollection()
    const movie = collection.find((movieID) => {
        return movieID.imdbID === imdbID
    })
    const index = collection.indexOf(movie)
    collection.splice(index, 1)
    saveToLocalStorage(collection)
    drawCollection(collection)
}

// для открытия модального окна
async function drawModal(imdbID) {
    let collection = getCollection()
    loadingMovies(addModal, modal)
    const movie = collection.find((movieID) => {
        return movieID.imdbID === imdbID
    })
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
    document
        .getElementById("button-close")
        .addEventListener("click", closeModal)
    addModal.addEventListener("click", closeModalClick)
}

// поиск по коллекции
function searchCollection() {
    let input = document.getElementById("input-collection").value
    let valueSearch = input.toLowerCase()
    let arrMovie = document.getElementsByClassName("movies-container")
    let arraySearch = Array.from(arrMovie)
    if (valueSearch) {
        arraySearch.forEach((element) => {
            let elem = element.innerText.toLowerCase()
            if (elem.search(valueSearch) == -1) {
                element.style.display = "none"
            } else {
                element.style.display = "flex"
            }
        })
    } else {
        arraySearch.forEach((element) => {
            element.style.display = "flex"
        })
    }
}

// для очищение полей на кнопку "корзина"
function clearInput() {
    document.getElementById("input-collection").value = ""
    drawCollection(collection)
}

function initApp() {
    document
        .getElementById("delete-input")
        .addEventListener("click", clearInput)
    document
        .getElementById("button-search-collection")
        .addEventListener("click", searchCollection)
    document.addEventListener("keyup", function (event) {
        if (event.code === "Enter") {
            searchCollection()
        }
    })
    drawCollection()
}

initApp()
