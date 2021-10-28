const MOVIE_DB_ENDPOINT = 'https://api.themoviedb.org';
const MOVIE_DB_IMAGE_ENDPOINT = 'https://image.tmdb.org/t/p/w500';
const MOVIE_DB_IMAGE_ENDPOINT_ORIGINAL = 'https://image.tmdb.org/t/p/original';
let MOVIE_DB_API;

function getImagePath(path, type, original = false) {
	if (!path) {
		switch (type) {
			case 'poster':
				return 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg';
			case 'cast':
				return 'https://anara-africa.com/wp-content/uploads/2016/12/placeholder-profile-male.jpg';
			default:
				return '';
		}
	}
	if (original) return MOVIE_DB_IMAGE_ENDPOINT_ORIGINAL + path;
	return MOVIE_DB_IMAGE_ENDPOINT + path;
}

const getAPIKey = () => {
	if (!MOVIE_DB_API) {
		return new Promise((resolve, _) => {
			fetch('/getapik', {
				method: 'POST',
			})
				.then((response) => (MOVIE_DB_API = response.text()))
				.then(resolve);
		});
	}
	return MOVIE_DB_API;
};

async function requestFilm(url, onComplete, onError) {
	fetch(await url)
		.then((response) => response.json())
		.then(onComplete)
		.then()
		.catch(onError);
}

async function postFilm(url, body, onComplete, onError) {
	fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
		.then((response) => response.json())
		.then(onComplete)
		.then()
		.catch(onError);
}

async function generateFilmUrl(content) {
	return `${MOVIE_DB_ENDPOINT}/3/${content}?api_key=${await getAPIKey()}`;
}

async function generateDetailFilmUrl(category, id) {
	return await generateFilmUrl(`${category}/${id}`);
}

async function generateFilmListUrl(path, page, addition = '') {
	return (await generateFilmUrl(`${path}`)) + `&page=${page}${addition}`;
}

async function generateFilmsByGenreUrl(category, genre_id, page) {
	return (
		(await generateFilmListUrl(`${category}/popular`, page)) +
		'&with_genres=' +
		genre_id
	);
}

async function generateListGenreUrl(category) {
	return await generateFilmUrl(`genre/${category}/list`);
}

function getPopularFilms(renderFilms, category, page, i = 0) {
	let topTitle;
	if (category == 'movie') {
		topTitle = 'Movies';
	} else {
		topTitle = 'TV Shows';
	}
	const url = generateFilmListUrl(`${category}/popular`, page);
	const render = renderFilms.bind({ title: `Popular ${topTitle}` }, i);
	requestFilm(url, render, handleGeneralError);
}

function getUpcomingFilms(render, page = 1) {
	const category = 'movie';
	let topTitle;
	if (category == 'movie') {
		topTitle = 'Movies';
	} else {
		topTitle = 'TV Shows';
	}
	const url = generateFilmListUrl(`${category}/upcoming`, page);
	requestFilm(url, render.bind(topTitle), 'handleGeneralError');
}

function getWatchlistMovies(renderFilms, lineUId) {
	const url = `/getWLs`;
	const body = {
		lineUId: lineUId,
	};
	const render = renderFilms.bind({ title: 'Watchlist' }, 0);
	postFilm(url, body, render, handleGeneralError);
}

function getSearchFilm(renderFilms, category, value, page) {
	const url = generateFilmListUrl(
		`search/${category}`,
		page,
		'&query=' + value
	);
	const render = renderFilms.bind({ title: 'Showing: ' + value }, 0);
	const inputId = document.getElementById('movie-input');
	inputId.value = value;
	requestFilm(url, render, handleGeneralError);
}

function getFilmsByGenre(renderFilms, category, genre_id, genre_name, page) {
	const url = generateFilmsByGenreUrl(category, genre_id, page);
	const render = renderFilms.bind({ title: genre_name }, 0);
	requestFilm(url, render, handleGeneralError);
}

function getHomeScreen(renderFilms) {
	getPopularFilms(renderFilms, 'movie', 1, 0);
	getPopularFilms(renderFilms, 'tv', 1, 1);
}

function handleGeneralError(error) {
	// console.log(error);
	// container.innerHTML = "";
	// alert("Error! " + error.message);
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

export {
	generateDetailFilmUrl,
	generateListGenreUrl,
	getPopularFilms,
	getWatchlistMovies,
	getSearchFilm,
	getFilmsByGenre,
	getHomeScreen,
	getUpcomingFilms,
	handleGeneralError,
	getImagePath,
};
