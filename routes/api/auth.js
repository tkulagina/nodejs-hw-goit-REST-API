const express = require ("express");
const cntrl = require ("../../controllers/auth-controller");

const {validateBody} = require ("../../middleware");
const {schemas} = require ("../../models/user");

const router = express.Router();

router.post ("/register", validateBody(schemas.registerSchema), cntrl.register);
router.post ("/login", validateBody(schemas.loginSchema), cntrl.login);

module.exports = router;