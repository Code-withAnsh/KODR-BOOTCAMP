const jwt = require('jsonwebtoken')
const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs")
const checkCredential = async (req,res) => {

    const {name,email,password} = req.body;
    const isUserExist = await userModel.findOne({email})

    if(isUserExist){
      return  res.status(401).json({
            message:"user already exists"
        })
    }
    const user =await userModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET_KEY)

    res.status(201).json({
        message:"user registered successfully",
        user:{
            name:user.name,
            email:user.email
        },
        token
    })
}

const loginUser = async (req,res) => {

    const {email,password} = req.body;
    const isUserRegistered = await userModel.findOne({email})

    if(!isUserRegistered){
        return res.status(401).json({
            message:"user not registered please register first"
        })
    }
    const isvalidPassword = await bcrypt.compare(password, isUserRegistered.password);

    if(!isvalidPassword){
        return res.status(401).json({
            message:"password is wrong chl nikal bkl"
        })
    }

    const token = jwt.sign({
    id:isUserRegistered._id,
email: isUserRegistered.email
    },process.env.JWT_SECRET_KEY)
    res.status(200).json({
      message: "user logged in succesfully",
      user: {
        name: isUserRegistered.name,
      },
      token
    });
}


module.exports = {
  checkCredential,
  loginUser,
};