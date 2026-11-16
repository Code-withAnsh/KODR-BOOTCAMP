import express from "express"
import jwt from "jsonwebtoken"
import userModel from "./models/usermodel.js"
import { authenticate } from "./middleware/auth.middleware.js"
import bcrypt from 'bcryptjs'
const app = express()

app.use(express.json())
app.get("/",(req,res)=>{
    res.status(200).json({
        message:"welcome to authentication"
    })
})
console.log(" i am running");

app.post("/api/auth/register",async (req,res)=>{
const {email,name,password} = req.body;


let userExist = await userModel.findOne({email})
if(userExist){
    return res.status(400).json({
        message:"user already exist"
    })
}
console.log(" i am running also");

const user = await userModel.create({
    email,name,password:await bcrypt.hash(password,10)
})

const token = jwt.sign(
  {
    id:user._id
  }, 
  process.env.JWT_SECRET,
);
res.status(201).json({
    message:"user regsitered succesfully",
    data:{
        user:{
            email,name,
            id:user._id
        },token
    }
})
})
console.log(" i am running also");

app.get("/api/auth/me",authenticate,async(req,res)=>{
    console.log(req.user);

    res.status(200).json({
        data:{
            user:req.user
        }
    })
    
})

app.post("/api/auth/login",async (req,res)=>{
    const {email,password} = req.body

    const user = await userModel.findOne({
        email
    })
    const isvalidPassword = bcrypt.compare(password,user.password)

    if(!isvalidPassword){
        return res.status(401).json({
            message:"auntothorised acess"
        })
    }

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)
    res.status(200).json({
        message:"user logged in succesfully",
        data:{
            email:user.email,
            name:user.name
        }
    })
})

export default app;