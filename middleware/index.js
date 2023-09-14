const cntrlWrapper = require ("./cntrlWrapper");
const validateBody = require ("./validateBody");
const isValidId = require ("./isValidId");
const isFavoritePresent = require ("./isFavoritePresent")
const authenticate = require ("./authenticate")

module.exports = {
  cntrlWrapper,
  validateBody,
  isValidId, 
  isFavoritePresent,
  authenticate,
};