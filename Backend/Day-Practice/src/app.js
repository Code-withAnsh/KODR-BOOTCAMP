const express = require("express")
const connectDB = require("./config/db.js")
const authRoute = require("./routes/auth.route.js")
const authenticate = require("./controller/auth.controller.js")
const app = express()


app.use(express.json())
app.use("/auth",authRoute)

connectDB()
module.exports = app