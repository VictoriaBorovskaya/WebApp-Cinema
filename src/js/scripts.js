let modal = document.getElementById("add-modal-content")
let addModal = document.getElementById("add-modal")

// отрисовка модального окна
export function drawAddModal(object) {
    let collection = getCollection()
    const moviesIds = collection.map((o) => o.imdbID)
    const isCollection = moviesIds.includes(object.imdbID)
    let poster = object.Poster
    if (object.Poster === "N/A") {
        poster = "/images/movie-poster.png"
    }
    addModal.style.display = "flex"
    modal.innerHTML = ""
    modal.innerHTML += `
            <div class="flex justify-between" id="modal-container">
                <div class="w-2/3 flex flex-col justify-between" id="modal-container-content">
                    <p class="font-bold text-2xl md:text-4xl text-red-500 pb-5 text-center">${
                        object.Title
                    }</p>
                    <div>
                        <p class="text-modal">Year: <span class="text-span">${
                            object.Year
                        }</span></p>
                        <p class="text-modal">Country: <span class="text-span">${
                            object.Country
                        }</span></p>
                        <p class="text-modal">Genre: <span class="text-span">${
                            object.Genre
                        }</span></p>
                        <p class="text-modal">Released: <span class="text-span">${
                            object.Released
                        }</span></p>
                        <p class="text-modal">Runtime: <span class="text-span">${
                            object.Runtime
                        }</span></p>
                    </div>
                </div>
                <div class="h-80 w-60 border-box pl-2 pb-2 self-center">
                    <img src="${poster}" class="h-full w-full object-cover rounded">
                </div>
            </div>
            <div class="overflow-y-scroll">
                <p class="text-modal">Director: <span class="text-span">${
                    object.Director
                }</span></p>
                <p class="text-modal">Writer: <span class="text-span">${
                    object.Writer
                }</span></p>
                <p class="text-modal">Actors: <span class="text-span">${
                    object.Actors
                }</span></p>
                <p class="text-modal">Plot: <span class="text-span">${
                    object.Plot
                }</span></p>
                <p class="text-modal">Awards: <span class="text-span">${
                    object.Awards
                }</span></p>
                <p class="text-modal">Rating: <span class="text-span">${
                    object.imdbRating
                }</span></p>
                <p class="hidden">${object.imdbID}</p>
            </div>
            <div class="flex gap-5 pt-10">
                <button class="button py-2 hover:bg-neutral-900" id="button-close">Close</button>
                ${
                    isCollection
                        ? `<button class="button py-2 hover:bg-neutral-900" id="button-remove-${object.imdbID}">Remove from collection</button>`
                        : `<button class="button py-2 hover:bg-neutral-900" id="button-add-${object.imdbID}">Add to collection</button>`
                }
            </div>
    `
}

// обработчики на кнопку "Add to collection"
export function forEachModalButton(object) {
    let collection = getCollection()
    const moviesIds = collection.map((o) => o.imdbID)
    const isCollection = moviesIds.includes(object.imdbID)

    isCollection
        ? document
              .getElementById(`button-remove-${object.imdbID}`)
              .addEventListener("click", () => {
                  removeCollection(object, object.imdbID)
              })
        : document
              .getElementById(`button-add-${object.imdbID}`)
              .addEventListener("click", () => {
                  addToCollection(object, object.imdbID)
              })
}

// удалить из коллекции через модальное окно
function removeCollection(object, imdbID) {
    let collection = getCollection()
    console.log(object)
    const existingMovie = collection.find((object) => {
        return object.imdbID === imdbID
    })
    const index = collection.indexOf(existingMovie)
    console.log(imdbID)
    if (existingMovie) {
        collection.splice(index, 1)
        saveToLocalStorage(collection)
        drawAddModal(object)
        document
            .getElementById("button-close")
            .addEventListener("click", () => {
                closeModal()
            })
        addModal.addEventListener("click", () => {
            closeModalClick()
        })
    }
}

// добавить в коллекцию через модальное окно
function addToCollection(object, imdbID) {
    let collection = getCollection()
    console.log(object)
    const existingMovie = collection.find((object) => {
        return object.imdbID === imdbID
    })
    console.log(imdbID)
    if (!existingMovie) {
        collection.push(object)
        saveToLocalStorage(collection)
        drawAddModal(object)
        document
            .getElementById("button-close")
            .addEventListener("click", closeModal)
        addModal.addEventListener("click", closeModalClick)
    }
}

// закрытие модального окна
export const closeModal = () => (addModal.style.display = "none")
export const closeModalClick = (event) => {
    if (event.target === addModal) return (addModal.style.display = "none")
}

// для анимации загрузки
export function loadingMovies(box, elem) {
    box.style.display = "flex"
    elem.innerHTML = ""
    elem.innerHTML += `
        <div class="flex justify-center items-center my-14 py-4 px-5 gap-2 w-full ">
            <div class="w-8 h-8 animate-spin rounded-full bg-gradient-to-r from-red-600 to-neutral-900 flex items-center justify-center">
                <div class="bg-neutral-900 w-5 h-5 rounded-full"></div>
             </div>
            <p class="text-lg sm:text-2xl text-white font-bold">Loading...</p>     
        </div>
    `
}

// для состояния error (catch)
export function searchError(elem) {
    elem.style.display = "flex"
    elem.innerHTML = ""
    elem.innerHTML += `
            <p class="text-white font-bold text-2xl my-20 text-center w-full">Sorry, no movies were found by your request.</p>
        `
    document.getElementById("input").value = ""
}

// сохранение в LocalStorage
export function saveToLocalStorage(arr) {
    let moviesJson = JSON.stringify(arr)
    localStorage.setItem("collection", moviesJson)
}

// функция для LocalStorage
export function getCollection() {
    let collection = localStorage.getItem("collection")
        ? JSON.parse(localStorage.getItem("collection"))
        : []
    saveToLocalStorage(collection)
    return collection
}
