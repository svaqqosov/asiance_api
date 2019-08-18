global.basePath = __dirname;
module.require('dotenv').load();
const awsServerlessExpress = module.require('aws-serverless-express');
const Database = module.require('./db');

const app = module.require('./src/app');
const server = awsServerlessExpress.createServer(app);
let cachedDb = null;

exports.handler = (event, context, callback) => {
  /* eslint-disable no-param-reassign */
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    // cachedDb.connections[0].db.serverConfig.isConnected()
    if (cachedDb) {
    // console.log(cachedDb);
      console.log('=> using cached database instance');
      Promise.resolve(cachedDb);
    } else {
      const db = new Database();
      console.log('creating new Db connection');
      cachedDb = db.connect();
    }
    // If event is comming from API Gateway
    if (event.pathParameters && event.pathParameters.proxy) {
      awsServerlessExpress.proxy(server, event, context);
    }
  } catch (err) {
    console.log(err);
    callback(err);
  }
};
