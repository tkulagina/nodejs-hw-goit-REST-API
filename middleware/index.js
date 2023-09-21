const cntrlWrapper = require ("./cntrlWrapper");
const validateBody = require ("./validateBody");
const isValidId = require ("./isValidId");
const isFavoritePresent = require ("./isFavoritePresent");
const authenticate = require ("./authenticate");
const upload = require ("./upload");

module.exports = {
  cntrlWrapper,
  validateBody,
  isValidId, 
  isFavoritePresent,
  authenticate,
  upload,
};