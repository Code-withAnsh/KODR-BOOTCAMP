
const express = require("express")
const app = express()
const postRoutes = require("./routes/post.routes.js")

const connectDB = require("./config/db.js")

 connectDB()
app.get("/",(req,res)=>{
    res.send("ha ha ha")
})

app.use("/api/post",postRoutes)
module.exports = app