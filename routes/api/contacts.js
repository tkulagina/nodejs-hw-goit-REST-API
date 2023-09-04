const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getContactById,
  addContact,
  updateContactById,
  updateStatusContact,
  deleteContact,
} = require("../../controllers/contacts-controller");

const { schemas } = require("../../models/contact");
const { validateBody, isValidId, isFavoritePresent } = require("../../middleware");

router.get("/", getAllContacts);
router.get("/:contactId", isValidId, getContactById);
router.post("/", validateBody(schemas.contactSchemaJoi), addContact);
router.put("/:contactId", isValidId, validateBody(schemas.contactSchemaJoi), updateContactById );
router.patch("/:contactId/favorite", isValidId, isFavoritePresent(schemas.updateFavoriteSchema), updateStatusContact );
router.delete("/:contactId", isValidId, deleteContact);

module.exports = router;