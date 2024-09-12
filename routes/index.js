const express = require('express');
const router = express.Router();
const UserRegister = require("../controller/User")

router.post("/Register",UserRegister.UserRegister)


module.exports = router;
