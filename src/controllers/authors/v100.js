const Author = require('@models/author');

/**
 * @api {post} /authors?version=v100 Create an author
 * @apiVersion  1.0.0
 * @apiName createAuthor
 * @apiGroup Author
 *
 * @apiParam {String} name Author name.
 * @apiParam {String} role Role
 * @apiParam {String} location Location.
 *
 * @apiSuccess {String} msg_code Message code.
 * @apiSuccess {Object} data  Author data.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "msg_code": "AUTHOR_CREATED",
 *        "data": {
 *          "id": "487bb1e6-e35a-44d4-a261-16ec2dd68d9d",
 *          "name": "Jenifer Ware",
 *          "role": "orc",
 *          "location": "Sanchezview",
 *        }
 *      }
 * @apiError VALIDATION_ERROR Some field are not correct.
 *
 * @apiErrorExample Error-Response:
 *    {
 *      "msg_code": "VALIDATION_ERROR",
 *      "errors": [
 *        {
 *          "field": [
 *            "Name"
 *          ],
 *          "location": "body",
 *          "messages": [
 *            "name is required"
 *          ],
 *          "types": [
 *            "any.required"
 *          ]
 *        }
 *      ]
 *    }
 */
/**
 * Create new author
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const create = async (req, res, next) => {
  try {
    const local = req.body;

    const author = await Author.create(local);
    res.status(201).json({ msgCode: 'AUTHOR_CREATED', data: author });
  } catch (err) {
    console.log('sdfsfd');
    next(err);
  }
};

/**
 * @api {get} /authors?version=v100 Get list of authors
 * @apiVersion  1.0.0
 * @apiName listAuthors
 * @apiGroup Author
 * @apiParam  {String} [offset=0] number of items to skip
 * @apiParam  {String} [limit=12] items per pages
 * @apiParam  {String} [name] name to filter
 * @apiParam  {String} [role] role to filter
 *
 * @apiSuccess {Object} data Authors.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "msg_code": "AUTHOR_CREATED",
 *        "data": {
 *          "id": "487bb1e6-e35a-44d4-a261-16ec2dd68d9d",
 *          "name": "Jenifer Ware",
 *          "role": "orc",
 *          "location": "Sanchezview",
 *        }
 *      }
/**
 * Paginated list of all authors
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const list = async (req, res, next) => {
  try {
    const options = {
      offset: req.query.offset ? req.query.offset * 1 : 0,
      limit: req.query.limit ? req.query.limit * 1 : process.env.DEFAULT_PAGINATION_LIMIT * 1
    };

    const query = {};

    // get name filter
    if (req.query.name) {
      query.name = req.query.name.toLowerCase();
    }
    // get role filter
    if (req.query.role) {
      query.role = req.query.role;
    }
    // get search filter
    if (req.query.q) {
      // set or condition for name, public title and address
      query.$or = [
        { id: new RegExp(req.query.q, 'i') },
        { _id: new RegExp(req.query.q, 'i') },
        { name: new RegExp(req.query.q, 'i') },
        { role: new RegExp(req.query.q, 'i') }
      ];
    }
    if (req.query.type) {
      query.type = req.query.type;
    }

    // set sort params
    if (req.query.sort) {
      options.sort = {};
      const order = req.query.order ? req.query.order : 'asc';
      options.sort[req.query.sort] = order;
    }
    options.customLabels = {
      docs: 'items'
    };


    const authors = await Author.paginate(query, options);

    res.status(200).json({ data: authors });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {get} /authors/:id?version=v100 Get one author
 * @apiVersion  1.0.0
 * @apiName loadAuthor
 * @apiGroup Author
 *
 * @apiSuccess {Object} data Author.
 *
 * @apiParam {String} id ID of the Author to update
 *
 * @apiSuccessExample Success-Response:
 *  {
 *    "data": [
 *      {
 *          "id": "487bb1e6-e35a-44d4-a261-16ec2dd68d9d",
 *          "name": "Jenifer Ware",
 *          "role": "orc",
 *          "location": "Sanchezview",
 *      }
 *    ]
 *  }
 */
/**
 * Load a single author
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const load = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id).exec();
    if (author === null) {
      res.status(404).json({ msgCode: 'AUTHOR_NOT_FOUND' });
    }
    res.status(200).json({ data: author });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {put} /author/:id?version=v100 Update an Author
 * @apiName updateAuthor
 * @apiGroup Author
 * @apiVersion  1.0.0
 *
 * @apiParam {String} id ID of the User to update
 * @apiParam {String} [name] Name of the Author.
 * @apiParam {String} [role] Role of the Author.
 *
 * @apiSuccess {Object} data User.
 *
 * @apiSuccessExample {type} Success-Response:
 *  {
 *    "data":
 *      {
 *      "id": "487bb1e6-e35a-44d4-a261-16ec2dd68d9d",
 *      "name": "Jenifer Ware",
 *      "role": "orc",
 *      "location": "Sanchezview",
 *      "createdAt": "2018-06-05T06:32:45.000Z",
 *      "updatedAt": "2018-06-05T07:07:15.000Z",
 *      }
 *  }
 */
/**
 * Update an author from database
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const update = async (req, res, next) => {
  const data = req.body;
  delete data.id;
  const filter = { _id: req.params.id };
  try {
    const author = await Author.findOneAndUpdate(filter, data, {
      new: true
    });
    if (author === null) {
      res.status(404).json({ msgCode: 'AUTHOR_NOT_FOUND' });
    }
    res.status(200).json({ msgCode: 'AUTHOR_UPDATED', data: author });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {delete} /authors/:id?version=v100 Delete an Author
 * @apiName deleteAuthor
 * @apiGroup Author
 * @apiVersion  1.0.0
 *
 * @apiParam {String} id ID of the Author to delete
 *
 * @apiSuccess {String} data Id of the deleted author.
 *
 * @apiSuccessExample {type} Success-Response:
 *  {
 *    "data": "bd23bf75-8461-4799-b8e0-22780fea86f6"
 *  }
 */
/**
 * Delete a author form database
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const remove = async (req, res, next) => {
  try {
    const author = await Author.findOneAndDelete({ _id: req.params.id }).exec();
    if (author === null) {
      res.status(404).json({ msgCode: 'AUTHOR_NOT_FOUND' });
    }
    res.status(200).json({ msgCode: 'AUTHOR_DELETED', data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  list,
  load,
  remove,
  update
};
