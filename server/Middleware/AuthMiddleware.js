const joi = require('joi');
const loginval = async (req,res,next)=>{
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).max(20).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({message: 'Bad Request',error});
    }
    next();
}
const signupval = async (req,res,next)=>{
    const schema = joi.object({
        name: joi.string().min(2).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        role: joi.string().optional()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
}
module.exports = {loginval, signupval};