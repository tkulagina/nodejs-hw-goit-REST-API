const express = require("express");
const {HttpError} = require ("../../helpers")

const Joi = require("joi");
const contactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
  }),
})

const contactsOperations = require("../../models/contacts");

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
  const result = await contactsOperations.listContacts();
  res.json(result);
} catch (error) {
  next(error);  
} 
});

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await contactsOperations.getContactById(id);
    if(!result){        
        throw HttpError(404, "Not found");        
    }
    res.json(result)
} catch (error) {
   next(error);
} 
});

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    
    if(error){
      throw HttpError (400, error.message);
    }
    const result = await contactsOperations.addContact(req.body);
    res.status(201).json(result)
} catch (error) {
    next(error);
} 
});

router.put('/:id', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    if(error){        
        throw HttpError (400, error.message);
    }
    const {id} = req.params;
    const result = await contactsOperations.updateContact(id, req.body);
    if(!result){
        throw HttpError (404, "Missing fields");
    }
    res.json(result)
} catch (error) {
    next(error);
}  
});

router.delete('/:id', async (req, res, next) => {  
  try {
    const {id} = req.params;
    const result = await contactsOperations.removeContact(id);
    if(!result){
      throw HttpError (404, "Not found");
    }
      res.json({      
        message: "contact deleted",        
    })

} catch (error) {
    next(error);
} 
});



module.exports = router;
