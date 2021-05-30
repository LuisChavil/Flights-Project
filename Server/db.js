const Pool = require('pg').Pool;

var fs = require('fs');
var content = fs.readFileSync('password.txt','utf8');

var list = content.split('\n');

const pool = new Pool({
  host: 'code.cs.uh.edu',
  user: 'cosc0114',
  password: '1775115AA',
  port: 5432,
  database: 'COSC3380'
});

module.exports = pool;