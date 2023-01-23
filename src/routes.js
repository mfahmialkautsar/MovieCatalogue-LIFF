const {getLineId, getTmdb} = require('./controllers/data');
const file = require('./controllers/file');
const {getById, getAll, add} = require('./controllers/watchlist');

async function routes(req, res) {
  let url = new URL(`${req.protocol}://${req.headers.host}${req.url}`);
  switch (req.method) {
    case 'GET':
      switch (url.pathname) {
        case '/send-id':
          getLineId(req, res);
          break;
        case String(url.pathname.match(/\/tmdb\/.+/)):
          getTmdb(req, res);
          break;
        default:
          file(req, res, url);
          break;
      }

      break;
    case 'POST':
      switch (url.pathname) {
        case '/addWL':
          add(req, res);
          break;
        case '/getWLs':
          getAll(req, res);
          break;
        case '/getWLById':
          getById(req, res);
          break;
        default:
          res.writeHead(400);
          res.end();
          break;
      }
      break;
    default:
      res.end();
      break;
  }
}

module.exports = routes;
