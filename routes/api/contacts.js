/*const express = require("express");
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
    if (Object.keys(req.body).length === 0) {
      throw HttpError (404, "missing fields");
    }
    const {error} = contactSchema.validate(req.body);
    if(error){        
        throw HttpError (400, error.message);
    }
    
    const {id} = req.params;
    const result = await contactsOperations.updateContact(id, req.body);
    if(!result){
        throw HttpError (404, "missing fields");
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



module.exports = router;*/

const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getContactId,
  postContact,
  putContact,
  deleteContact,
} = require("../../controllers/contacts-controller");

const { contactSchema } = require("../../schemas");
const { validateBody } = require("../../decorators");

router.get("/", getAllContacts);
router.get("/:contactId", getContactId);
router.post("/", validateBody(contactSchema), postContact);
router.put("/:contactId", validateBody(contactSchema), putContact );
router.delete("/:contactId", deleteContact);

module.exports = router;