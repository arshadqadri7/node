import Joi from "joi";
import CustomeErrorHandler from "../../services/CustomeErrorHandler";

const registerController = {
  async register(req, res, next) {
    //validation
    const notEmpty = `Field connot be empty`
    const registerSchema = Joi.object({
      name: Joi.string().min(3).required().messages({
        'string.base': `"a" should be a type of 'text'`,
        'string.empty':notEmpty,
        'string.min':`Name should be {#limit} charecters long`
      }),
      email: Joi.string().email().required().messages({
        'string.empty':notEmpty,
        'string.email':`Email is not valid`}),
      password: Joi.string().min(3).required().messages({
        'string.empty':notEmpty,
        'string.min':`Password should be {#limit} charecters long`,
      }),
      repeat_password: Joi.any().valid(Joi.ref('password')).messages({
        'string.empty':notEmpty,
        'any.only':`Password does not match`,
      }),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    //check if user in already database

    try {
      const exist = await User.exist({ email: req.body.email });
      if (exist) {
        return next(CustomeErrorHandler.alreadyExist("Already exist"));
      }
    } catch (err) {
      return next(err);
    }

    res.json({ message: "Hello" });
  },
};

export default registerController;
