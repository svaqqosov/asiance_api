global.basePath = __dirname;
require('dotenv').config();
const Database = require('./db');
const app = require('./src/app');

let cachedDb = null;
if (cachedDb && cachedDb.serverConfig.isConnected()) {
  console.log('=> using cached database instance');
  Promise.resolve(cachedDb);
} else {
  const db = new Database();
  console.log('creating new Db connection');
  cachedDb = db.connect();
}

// let's set the port on which the server will run
const port = process.env.PORT || 3000;
// start the server
app.listen(
  port,
  () => {
    console.log(`Server Running at http://127.0.0.1:${port}`);
  }
);
module.exports = app;
