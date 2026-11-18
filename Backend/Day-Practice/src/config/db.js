const mongoose = require("mongoose")

const connectDB = async () => {
try {

    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to Databases");
    
    
} catch (error) {
    console.log(error);
    
}
    
}

module.exports = connectDB