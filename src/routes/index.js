const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use('/authors', require('./authors'));
// router.use('/posts', require('./posts'));

module.exports = router;
