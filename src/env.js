let fs = require('fs');

function readEnv() {
  const env = {};
  const lines = fs.readFileSync('.env', 'utf8').split('\n');
  lines.forEach(line => {
    const [key, value] = line.split('=');
    env[key] = value;
  });
  return env;
}

process.env = Object.assign(process.env, readEnv());
