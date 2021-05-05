const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getAll(lineuid) {
  try {
    let get = await pool.query('SELECT * FROM watchlists WHERE lineuid = $1', [
      lineuid,
    ]);
    return get.rows;
  } catch (error) {}
}

async function getMovies(lineuid) {
  try {
    let get = await pool.query(
      "SELECT * FROM watchlists WHERE lineuid = $1 AND category = 'movie'",
      [lineuid]
    );
    return get.rows;
  } catch (error) {}
}

async function getTvs(lineuid) {
  try {
    let get = await pool.query(
      "SELECT * FROM watchlists WHERE lineuid = $1 AND category = 'tv'",
      [lineuid]
    );
    return get.rows;
  } catch (error) {}
}

async function get(lineuid, id) {
  try {
    let get = await pool.query(
      'SELECT * FROM watchlists WHERE lineuid = $1 AND filmid = $2::int',
      [lineuid, id]
    );
    return get.rows[0];
  } catch (error) {}
}

async function addUser(lineuid, linename) {
  try {
    await pool.query(
      `INSERT INTO users (lineuid, linename)
			SELECT * FROM (SELECT $1, $2) AS tmp
			WHERE NOT EXISTS (
				SELECT lineuid from users WHERE lineuid = $3
			) LIMIT 1`,
      [lineuid, linename, lineuid]
    );
  } catch (error) {}
}

async function addWL(lineuid, linename, movie) {
  try {
    addUser(lineuid, linename);
    let title = movie.title || movie.name;
    title = title.replace("'", "''");
    const insert = await pool.query(
      `INSERT INTO watchlists (wlid, lineuid, linename, filmid, filmTitle, category)
			SELECT * FROM (SELECT $1, $2, $3, $4::int, $5, $6) AS tmp
			WHERE NOT EXISTS (
				SELECT lineuid, filmid FROM watchlists WHERE lineuid = $7 AND filmid = $8::int
			) LIMIT 1`,
      [
        lineuid + movie.id,
        lineuid,
        linename,
        movie.id,
        title,
        movie.title ? 'movie' : 'tv',
        lineuid,
        movie.id,
      ]
    );
    if (insert.rowCount == 0) {
      return await delWL(lineuid, movie.id);
    }
    return insert;
  } catch (error) {
    if (error.code == 23505) {
      return await delWL(lineuid, movie.id);
    }
  }
}

async function delWL(lineuid, filmid) {
  try {
    const wl = await pool.query(
      'DELETE FROM watchlists WHERE lineuid = $1 AND filmid = $2::int',
      [lineuid, filmid]
    );
    return wl;
  } catch (error) {}
}

module.exports = { getAll, get, addWL, delWL };
