const Post = require('@models/post');
const Author = require('@models/author');

/**
 * @api {post} /posts?version=v100 Create an post
 * @apiVersion  1.0.0
 * @apiName createPost
 * @apiGroup Post
 *
 * @apiParam {String} name Post name.
 * @apiParam {String} title Role
 * @apiParam {String} body Body.
 *
 * @apiSuccess {String} msg_code Message code.
 * @apiSuccess {Object} data  Post data.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "msg_code": "POST_CREATED",
 *        "data": {
 *          "id": "487bb1e6-e35a-44d4-a261-16ec2dd68d9d",
 *          "title": "test",
 *          "body": "test"
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
 *            "Titile"
 *          ],
 *          "location": "body",
 *          "messages": [
 *            "title is required"
 *          ],
 *          "types": [
 *            "any.required"
 *          ]
 *        }
 *      ]
 *    }
 */
/**
 * Create new post
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const create = async (req, res, next) => {
  try {
    const local = req.body;

    const post = await Post.create(local);
    res.status(201).json({ msgCode: 'POST_CREATED', data: post });
  } catch (err) {
    console.log('sdfsfd');
    next(err);
  }
};

/**
 * @api {get} /posts?version=v100 Get list of posts
 * @apiVersion  1.0.0
 * @apiName listPosts
 * @apiGroup Post
 * @apiParam  {String} [offset=0] number of items to skip
 * @apiParam  {String} [limit=12] items per pages
 * @apiParam  {String} [title] title to filter
 * @apiParam  {String} [body] body to filter
 *
 * @apiSuccess {Object} data Posts.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "msg_code": "POST_CREATED",
 *        "data": {
 *          "id": "487bb1e6-e35a-44d4-a261-16ec2dd68d9d",
 *          "title": "test",
 *          "body": "test"
 *        }
 *      }
/**
 * Paginated list of all posts
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

    const posts = await Post.paginate(query, options);
    const authorIds = posts.items.map(item => item.authorId);
    // console.log(authorIds);
    const authors = await Author.find({ _id: { $in: authorIds } }).exec();
    const updatedPosts = posts.items.map((item) => {
      const local = item;
      local.author = authors.map((a) => {
        if (a.id === item.authorId) return a;
        return null;
      }).pop();
      return local;
    });
    res.status(200).json({ data: updatedPosts });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {get} /posts/:id?version=v100 Get one post
 * @apiVersion  1.0.0
 * @apiName loadPost
 * @apiGroup Post
 *
 * @apiSuccess {Object} data Post.
 *
 * @apiParam {String} id ID of the Post to update
 *
 * @apiSuccessExample Success-Response:
 *  {
 *    "data": [
 *      {
 *          "id": "487bb1e6-e35a-44d4-a261-16ec2dd68d9d",
 *          "title": "test",
 *          "body": "test"
 *      }
 *    ]
 *  }
 */
/**
 * Load a single post
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const load = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    if (post === null) {
      res.status(404).json({ msgCode: 'POST_NOT_FOUND' });
    }
    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {put} /post/:id?version=v100 Update an Post
 * @apiName updatePost
 * @apiGroup Post
 * @apiVersion  1.0.0
 *
 * @apiParam {String} id ID of the User to update
 * @apiParam {String} [title] Title of the Post.
 * @apiParam {String} [body] body of the Post.
 *
 * @apiSuccess {Object} data Post.
 *
 * @apiSuccessExample {type} Success-Response:
 *  {
 *    "data":
 *      {
 *          "id": "487bb1e6-e35a-44d4-a261-16ec2dd68d9d",
 *          "title": "test",
 *          "body": "test"
 *          "createdAt": "2018-06-05T06:32:45.000Z",
 *          "updatedAt": "2018-06-05T07:07:15.000Z",
 *      }
 *  }
 */
/**
 * Update an post from database
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
    const post = await Post.findOneAndUpdate(filter, data, {
      new: true
    });
    if (post === null) {
      res.status(404).json({ msgCode: 'POST_NOT_FOUND' });
    }
    res.status(200).json({ msgCode: 'POST_UPDATED', data: post });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {delete} /posts/:id?version=v100 Delete an Post
 * @apiName deletePost
 * @apiGroup Post
 * @apiVersion  1.0.0
 *
 * @apiParam {String} id ID of the Post to delete
 *
 * @apiSuccess {String} data Id of the deleted post.
 *
 * @apiSuccessExample {type} Success-Response:
 *  {
 *    "data": "bd23bf75-8461-4799-b8e0-22780fea86f6"
 *  }
 */
/**
 * Delete a post form database
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const remove = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id }).exec();
    if (post === null) {
      res.status(404).json({ msgCode: 'POST_NOT_FOUND' });
    }
    res.status(200).json({ msgCode: 'POST_DELETED', data: { id: req.params.id } });
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
