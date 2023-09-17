const express = require ("express");
const cntrl = require ("../../controllers/users-controller");

const {validateBody, authenticate, upload} = require ("../../middleware");
const {schemas} = require ("../../models/user");

const router = express.Router();

router.post ("/register", validateBody(schemas.registerSchema), cntrl.register);
router.post ("/login", validateBody(schemas.loginSchema), cntrl.login);
router.get ("/current", authenticate, cntrl.getCurrent);
router.post ("/logout", authenticate, cntrl.logout);
router.patch ("/avatars", authenticate, upload.single("avatar"), cntrl.updateAvatar);

module.exports = router;