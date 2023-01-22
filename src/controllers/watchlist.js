const https = require('https');
const db = require('../db');
const MOVIE_DB_ENDPOINT = 'https://api.themoviedb.org';
const MOVIE_DB_API = process.env.TMDB_API;

function send(res, code) {
  res.writeHead(code);
  res.end();
}

function getDetailMovie(category, id) {
  return new Promise((resolve, reject) => {
    https
      .get(generateDetailMovieUrl(category, id), (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      })
      .on('error', reject);
  });
}

function generateMovieUrl(content) {
  return `${MOVIE_DB_ENDPOINT}/3/${content}?api_key=${MOVIE_DB_API}`;
}

function generateDetailMovieUrl(category, id) {
  return generateMovieUrl(`${category}/${id}`);
}

function getById(req, res) {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', async () => {
    try {
      body = JSON.parse(body);
      const lineUid = body.lineUId;
      const filmId = body.filmId;
      const movie = await db.get(lineUid, filmId);
      if (movie) {
        res.writeHead(200);
      } else {
        res.writeHead(300);
      }
    } catch (error) {
      res.writeHead(400);
    }
    res.end();
  });
}

function getAll(req, res) {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', async () => {
    try {
      body = JSON.parse(body);
      const lineUid = body.lineUId;
      const movies = await db.getAll(lineUid);
      if (movies) {
        resMovies = [];
        if (movies.length > 0) {
          movies.forEach((movie) => {
            getDetailMovie(movie.category, movie.filmId)
              .then((movie) => {
                resMovies.push(movie);

                if (resMovies.length == movies.length) {
                  res.writeHead(200);
                  res.write(`{"results": [${resMovies}]}`);
                  res.end();
                }
              })
              .catch(() => {
                send(res, 204);
              });
          });
        } else {
          res.write(`{"results": [${resMovies}]}`);
          send(res, 200);
        }
      } else {
        send(res, 300);
      }
    } catch (error) {
      send(res, 400);
    }
  });
}

function add(req, res) {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', async () => {
    try {
      body = JSON.parse(body);
      const lineUId = body.lineUId;
      const name = body.name;
      const movie = body.movie;
      await db.addUser(lineUId, name);
      const wl = await db.get(lineUId, movie.id);
      if (wl) {
        await db.delWL(lineUId, movie.id);
        send(res, 200);
      } else {
        await db.addWL(lineUId, movie);
        send(res, 201);
      }
    } catch (error) {
      send(res, 400);
    }
  });
}

module.exports = { getById, getAll, add };
