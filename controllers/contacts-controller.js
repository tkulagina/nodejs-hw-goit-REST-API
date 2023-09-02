const {Contact} = require ("../models/contact");

const { HttpError } = require("../helpers");

const { cntrlWrapper } = require("../middleware");

const getAllContacts = async (req, res) => {
  const result = await Contact.find({}, "-createdAt -updatedAt");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(201).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if (!result) {
    throw HttpError(404, "missing field favorite");
  }
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Сontact deleted" });
};

module.exports = {
  getAllContacts: cntrlWrapper(getAllContacts),
  getContactById: cntrlWrapper(getContactById),
  addContact: cntrlWrapper(addContact),
  updateContactById: cntrlWrapper(updateContactById),
  updateStatusContact: cntrlWrapper(updateStatusContact),
  deleteContact: cntrlWrapper(deleteContact),
};