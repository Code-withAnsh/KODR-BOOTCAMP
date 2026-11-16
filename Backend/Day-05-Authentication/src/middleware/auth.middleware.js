import jwt from 'jsonwebtoken'
import userModel from '../models/usermodel.js'

export const authenticate = async (req,res,next)=>{

const token = req.headers.authorization;

if(!token){
    return res.status(401).json({
message:'token not found'
    })
}
const data = jwt.verify(token,process.env.JWT_SECRET)

const user = await userModel.findById(data.id)

if(!user){
     return res.status(401).json({
        message:"user not found"
    })

}

req.user = user //ab agar user mil jata hai toh hum req.user me user ki value bhej denege jo humne upar find ki hai

next() //aur ye sab hone ke baad hum aage ka code chala denge

}

