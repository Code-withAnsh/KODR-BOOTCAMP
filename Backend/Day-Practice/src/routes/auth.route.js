const express = require("express")
const {
  checkCredential,
  loginUser,
} = require("../controller/auth.controller.js");
const router = express.Router()
router.post("/register",checkCredential)
router.post("/login",loginUser)
module.exports = router