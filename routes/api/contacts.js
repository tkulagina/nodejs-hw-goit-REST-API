const express = require("express");

const router = express.Router();

const cntrl = require("../../controllers/contacts-controller");

const { schemas } = require("../../models/contact");
const { validateBody, isValidId, isFavoritePresent, authenticate } = require("../../middleware");

router.get("/", authenticate, cntrl.getAllContacts);
router.get("/:contactId", authenticate, isValidId, cntrl.getContactById);
router.post("/", authenticate, validateBody(schemas.contactSchemaJoi), cntrl.addContact);
router.put("/:contactId", authenticate, isValidId, validateBody(schemas.contactSchemaJoi), cntrl.updateContactById );
router.patch("/:contactId/favorite", authenticate, isValidId, isFavoritePresent(schemas.updateFavoriteSchema), cntrl.updateStatusContact );
router.delete("/:contactId", authenticate, isValidId, cntrl.deleteContact);

module.exports = router;