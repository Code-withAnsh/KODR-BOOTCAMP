// connection ko chor ke sare code yaha rhega
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const NotesModel = require("./models/Note.model");
const app = express();
app.use(express.json())
let port = 3000;
connectDB()
app.get("/", (req, res) => {
  res.send("done- ");
});

app.post('/create',async (req,res)=>{
  let {title,description}= req.body

  const newNote =await NotesModel.create({
    title,
    description,
  })


  res.send(

    {
      sucess:true,
      message:"notes created sucessfully",

    }
  )
})
module.exports=app;