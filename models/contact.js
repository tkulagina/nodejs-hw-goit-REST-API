const {Schema, model} = require ("mongoose");
const Joi = require("joi");

const {handleMongooseError} = require ("../helpers");

const contactSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      favorite: {
        type: Boolean,
        default: false,
      }
}, {vertionKey: false, timestamps: true})

contactSchema.post ("save", handleMongooseError);

const contactSchemaJoi = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
  }),
  favorite: Joi.boolean().required().messages({
    "any.required": "missing required favorite field",
  }),
})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
  }),
})

const schemas = {
  contactSchemaJoi,
  updateFavoriteSchema,
}
const Contact = model ("contact", contactSchema);

module.exports = {
  Contact,
  schemas
};