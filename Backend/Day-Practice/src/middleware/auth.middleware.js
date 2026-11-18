const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model.js")
const authenticate = async (req,res,next) => {
const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            message:"invalid token"
        })
    }

    const data = jwt.verify(token,process.env.JWT_SECRET_KEY)

    const user = await userModel.findById(data.id)

    if(!user){
        return res.status(401).json({
            message:"user does not exist"
        })
    }
    next()
}

module.exports = authenticate