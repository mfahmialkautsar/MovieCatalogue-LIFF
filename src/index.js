let fs = require('fs');
let envFile = '.env';

if (fs.existsSync(envFile)) {
  require('./env');
} else {
  console.log('No .env file found');
}

const port = process.env.PORT || 5000;
const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes);
server.listen(port);
