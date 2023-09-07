const express = require ("express");
const cntrl = require ("../../controllers/auth-controller");

const {validateBody, authenticate} = require ("../../middleware");
const {schemas} = require ("../../models/user");

const router = express.Router();

router.post ("/register", validateBody(schemas.registerSchema), cntrl.register);
router.post ("/login", validateBody(schemas.loginSchema), cntrl.login);
router.get ("/current", authenticate, cntrl.getCurrent);
router.post ("/logout", authenticate, cntrl.logout);

module.exports = router;