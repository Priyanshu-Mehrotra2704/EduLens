const Joi = require('joi');

/* ================= LOGIN VALIDATION ================= */
const loginval = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

/* ================= SIGNUP VALIDATION ================= */
const signupval = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
    adminCode: Joi.string().optional(),

    role: Joi.string().valid('user', 'admin').optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

module.exports = { loginval, signupval };
