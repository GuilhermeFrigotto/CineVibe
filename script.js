async function searchMovie() {
    const query = document.getElementById('search').value;
    const apiKey = '5870f87c'; // Substitua pela sua chave da API
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`; // URL da API

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            document.getElementById('movie-list').innerHTML = "<p>Filme ou série não encontrada.</p>";
        }
    } catch (error) {
        console.error("Erro ao buscar filme:", error);
    }
}

async function getMovieDetails(imdbID) {
    const apiKey = '5870f87c'; // Substitua pela sua chave da API
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`; // URL para detalhes do filme

    try {
        const response = await fetch(url);
        const movie = await response.json();
        return movie;
    } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
        return null;
    }
}

async function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    for (const movie of movies) {
        const movieDetails = await getMovieDetails(movie.imdbID);

        if (movieDetails) {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            movieDiv.innerHTML = `
                <img src="${movieDetails.Poster !== "N/A" ? movieDetails.Poster : 'placeholder.png'}" alt="${movieDetails.Title}">
                <div>
                    <h2>${movieDetails.Title}</h2>
                    <p><strong>Ano:</strong> ${movieDetails.Year}</p>
                    <p><strong>Sinopse:</strong> ${movieDetails.Plot}</p>
                    <div class="review-box">
                        <input type="text" placeholder="Seu nome" id="username-${movieDetails.imdbID}">
                        <input type="text" placeholder="Título" id="title-${movieDetails.imdbID}">
                        <textarea placeholder="Escreva seu review aqui..." id="user-review-${movieDetails.imdbID}"></textarea>
                        <div class="stars" id="stars-${movieDetails.imdbID}">
                            <span data-value="1">★</span>
                            <span data-value="2">★</span>
                            <span data-value="3">★</span>
                            <span data-value="4">★</span>
                            <span data-value="5">★</span>
                        </div>
                        <button onclick="submitReview('${movieDetails.imdbID}')">Enviar Review</button>
                    </div>
                    <div class="comments-list" id="comments-${movieDetails.imdbID}"></div>
                </div>
            `;
            movieList.appendChild(movieDiv);

            // Adicionar evento de clique às estrelas
            const stars = document.querySelectorAll(`#stars-${movieDetails.imdbID} span`);
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    selectRating(stars, star);
                });
            });
        }
    }
}

// Função para selecionar a avaliação por estrela
function selectRating(stars, selectedStar) {
    stars.forEach(star => {
        star.classList.remove('selected'); // Remove a seleção de todas as estrelas
    });
    for (let i = 0; i < parseInt(selectedStar.dataset.value); i++) {
        stars[i].classList.add('selected'); // Marca até a estrela clicada
    }
}

// Função para enviar a avaliação e exibir o comentário
function submitReview(movieID) {
    const username = document.getElementById(`username-${movieID}`).value;
    const title = document.getElementById(`title-${movieID}`).value;
    const review = document.getElementById(`user-review-${movieID}`).value;
    const selectedStars = document.querySelectorAll(`#stars-${movieID} .selected`);

    if (!username || !title || !review || selectedStars.length === 0) {
        alert("Por favor, preencha todos os campos e selecione uma classificação por estrelas.");
        return;
    }

    const rating = selectedStars.length; // Número de estrelas selecionadas
    const commentsList = document.getElementById(`comments-${movieID}`);
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `
        <p><strong>Avaliação:</strong> ${'★'.repeat(rating)}</p>
        <p><strong>${title}</strong></p>
        <p>${review}</p>
        <p><em>Por: ${username}</em></p>
    `;
    commentsList.appendChild(commentDiv);
    
    // Limpar campos após o envio
    document.getElementById(`username-${movieID}`).value = '';
    document.getElementById(`title-${movieID}`).value = '';
    document.getElementById(`user-review-${movieID}`).value = '';
    selectedStars.forEach(star => star.classList.remove('selected'));
}
