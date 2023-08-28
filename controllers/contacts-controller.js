const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../models/contacts");

const { HttpError } = require("../helpers");

const { cntrlWrapper } = require("../middleware");

const getAllContacts = async (req, res) => {
  const result = await listContacts();
  res.json(result);
};

const getContactId = async (req, res) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const postContact = async (req, res) => {
  const result = await addContact(req.body);
  res.status(201).json(result);
};

const putContact = async (req, res) => {

  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Сontact deleted" });
};

module.exports = {
  getAllContacts: cntrlWrapper(getAllContacts),
  getContactId: cntrlWrapper(getContactId),
  postContact: cntrlWrapper(postContact),
  putContact: cntrlWrapper(putContact),
  deleteContact: cntrlWrapper(deleteContact),
};