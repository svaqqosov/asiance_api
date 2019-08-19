const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require('mongoose-hidden')();

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  authorId: { type: String, hide: false },
  title: { type: String, hide: false },
  body: { type: String, hide: false },
  tags: { type: Array, hide: false },
  image: { type: String, hide: true },
  author: Object
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
postSchema.virtual('imageUrl').get(function () {
  if (this.avatarName) {
    return `${process.env.STORAGE_DOMAIN}/posts/images/${this.id}/${this.fileName}`;
  }
  return `${process.env.STORAGE_DOMAIN}/posts/images/default.png`;
});

postSchema.plugin(mongoosePaginate);
postSchema.plugin(uniqueValidator);
postSchema.plugin(mongooseHidden);

let model;
try {
  model = mongoose.model('Post');
} catch (error) {
  model = mongoose.model('Post', postSchema);
}
module.exports = model;
