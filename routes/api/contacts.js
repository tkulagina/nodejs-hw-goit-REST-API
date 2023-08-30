const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getContactId,
  postContact,
  putContact,
  patchContact,
  deleteContact,
} = require("../../controllers/contacts-controller");

const { contactSchemaJoi } = require("../../models/contact");
const { validateBody, isValidId } = require("../../middleware");

router.get("/", getAllContacts);
router.get("/:contactId", isValidId, getContactId);
router.post("/", validateBody(contactSchemaJoi), postContact);
router.put("/:contactId", isValidId, validateBody(contactSchemaJoi), putContact );
router.patch("/:contactId", isValidId, validateBody(updateFavoriteSchema), patchContact );
router.delete("/:contactId", isValidId, deleteContact);

module.exports = router;