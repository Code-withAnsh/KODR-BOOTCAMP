const express = require("express")
const createPostController = require("../controller/post.controller.js")

const uploads = require("../config/multer.js")

const router = express.Router()

router.post("/",uploads.single("image"),createPostController)
module.exports = router