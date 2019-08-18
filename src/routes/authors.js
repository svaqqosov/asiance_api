const validate = require('express-validation');
const validations = require('./validation/authors');
const apiByVersion = require('../middlewares/apiByVersion');
const ctrl = require('../controllers/authors');
const express = require('express');

const router = express.Router();

router.route('/').post(validate(validations.create), apiByVersion(ctrl, 'create'));

router.route('/').get(apiByVersion(ctrl, 'list'));

router.route('/:id').get(validate(validations.getAndDelete), apiByVersion(ctrl, 'load'));

router.route('/:id').put(validate(validations.update), apiByVersion(ctrl, 'update'));

router.route('/:id').delete(validate(validations.getAndDelete), apiByVersion(ctrl, 'remove'));

module.exports = router;
