import Joi from "joi";
const ValidateArticle = Joi.object({
  title: Joi.string().alphanum().min(3).max(20).required(),
  body: Joi.string().min(3).max(200).required(),
  author: Joi.string().min(3).max(200).required(),
});
export default ValidateArticle;
