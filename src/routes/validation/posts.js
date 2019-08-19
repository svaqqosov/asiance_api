const Joi = require('@hapi/joi');

module.exports = {
  create: {
    body: Joi.object().keys({
      authorId: Joi.string().regex(/^[0-9a-zA-Z-]{36}$/).required(),
      title: Joi.string().regex(/^(?=.*[a-zA-Z])[A-Za-z0-9._ -]*$/).max(255).min(3),
      body: Joi.string().min(1).max(50).required(),
      tags: Joi.array().required(),

      createdAt: Joi.date(),
      updatedAt: Joi.date()
    })
  },

  getAndDelete: {
    params: {
      id: Joi.string().regex(/^[0-9a-zA-Z-]{36}$/).required()
    }
  },

  // PUT /api/tasks/:taskId
  update: {
    params: {
      id: Joi.string().regex(/^[0-9a-zA-Z-]{36}$/).required()
    },
    body: Joi.object().keys({
      title: Joi.string().regex(/^(?=.*[a-zA-Z])[A-Za-z0-9._ -]*$/).max(255).min(3),
      body: Joi.string().min(1).max(50),
      tags: Joi.array(),

      createdAt: Joi.date(),
      updatedAt: Joi.date()
    })
  }
};
