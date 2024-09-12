const express = require('express');
const router = express.Router();
const UserRegister = require("../controller/User")
const StatusChange = require("../controller/ChangeUserStatus")
const getDistance = require("../controller/Distance")
const getUserListing = require("../controller/getUserListing")

router.post("/Register",UserRegister.UserRegister)
router.post("/Login" , UserRegister.UserLogin)
router.post("/changeStatus",StatusChange.ChangeUserStatus)
router.get("/getDistance", getDistance.getDistance)
router.get("/getUserListing",getUserListing.getUserListing)


module.exports = router;
