const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require('mongoose-hidden')();

mongoose.Promise = global.Promise;

const authorSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, unique: true },
  role: { type: String, hide: false },
  avatarName: { type: String, hide: true },
  location: String
}, {
  timestamps: {},
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

// mongoosejs doesn't like arrow function
// eslint-disable-next-line func-names
authorSchema.virtual('avatar').get(function () {
  if (this.avatarName) {
    return `${process.env.STORAGE_DOMAIN}/profile/${this.id}/${this.fileName}`;
  }
  return `${process.env.STORAGE_DOMAIN}/profile/default.png`;
});

authorSchema.plugin(mongoosePaginate);
authorSchema.plugin(uniqueValidator);
authorSchema.plugin(mongooseHidden);

let model;
try {
  model = mongoose.model('Author');
} catch (error) {
  model = mongoose.model('Author', authorSchema);
}
module.exports = model;
