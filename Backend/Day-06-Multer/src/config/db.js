const mongoose = require("mongoose")
const connectDB = async () => {
console.log(process.env.MONGO_URI);

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connect DB");
        
    } catch (error) {
            console.log("faild to connect db",error);

            
        }
    }

    
module.exports = connectDB