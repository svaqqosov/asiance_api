const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', () => {
  console.log('mongo db error in connection');
});
db.once('open', () => {
  console.log('mongo db connection established');
});

class Database {
  constructor() {
    // eslint-disable-next-line max-len
    this.dbURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_SERVER}`;
    mongoose.Promise = global.Promise;
  }

  connect() {
    console.log('mongo connected');
    return mongoose.connect(this.dbURI, {
      autoIndex: false,
      useNewUrlParser: true
    });
  }
}

module.exports = Database;

