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
   /*res.status(500).json({
       status: "error",
      code: 500,
       message: "Server error"
   })*/
} 
});

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await contactsOperations.getContactById(id);
    if(!result){
        //throw new NotFound( `Contact with id=${id} not found`);
        throw HttpError(404, `Contact with id=${id} not found`);
        // const error = new Error(`Product with id=${id} not found`);
        // error.status = 404;
        // throw error;
        /*res.status(404).json({
             status: "error",
            code: 404,
             message: `Product with id=${id} not found`
         });
         return;*/
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
   /*res.status(500).json({
    status: "error",
   code: 500,
    message: "Server error"
})*/
} 
});

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    if(error){
        error.status = 400;
        throw error;
    }
    const result = await contactsOperations.add(req.body);
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

router.delete('/:contactId', async (req, res, next) => {
  
  try {
    const {id} = req.params;
    const result = await contactsOperations.removeById(id);
    if(!result){
        throw new NotFound( `Contact with id=${id} not found`);
    }
    // res.status(204).json()
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

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = contactSchema.validate(req.body);
    if(error){
        error.status = 400;
        throw error;
    }
    const {id} = req.params;
    const result = await contactsOperations.updateById(id, req.body);
    if(!result){
        throw new NotFound( `Contact with id=${id} not found`);
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

module.exports = router;
