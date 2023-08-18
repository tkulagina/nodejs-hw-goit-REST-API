const express = require("express");
const {HttpError} = require ("../../helpers")

const Joi = require("joi");
const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

const contactsOperations = require("../../models/contacts");

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
  const products = await contactsOperations.listContacts();
  res.json({
      message: 'template message',
      status: "success",
      code: 200,
      data: {
          result: products
      }
  });
} catch (error) {
  next(error);  
} 
});

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await contactsOperations.getContactById(id);
    if(!result){        
        throw HttpError(404, `Contact with id=${id} not found`);        
    }
    res.json({
      message: 'template message',
        status: "success",
        code: 200,
        data: {
            result
        }
    })
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
    res.status(201).json({
      message: 'template message',
        status: "success",
        code: 201,
        data: {
            result
        }
    })
} catch (error) {
    next(error);
} 
});

router.put('/:id', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    if(error){        
        throw HttpError (400, "Missing fields");
    }
    const {id} = req.params;
    const result = await contactsOperations.updateContact(id, req.body);
    if(!result){
        throw HttpError (404, `Contact with id=${id} not found`);
    }
    res.json({
      message: 'template message',
        status: "success",
        code: 200,
        data: {
            result
        }
    })
} catch (error) {
    next(error);
}  
});

router.delete('/:id', async (req, res, next) => {  
  try {
    const {id} = req.params;
    const result = await contactsOperations.removeContact(id);
    if(!result){
      throw HttpError (404, `Contact with id=${id} not found`);
    }
      res.json({
      message: 'template message',
        status: "success",
        code: 200,
        message: "product deleted",
        data: {
            result
        }
    })

} catch (error) {
    next(error);
} 
});



module.exports = router;
