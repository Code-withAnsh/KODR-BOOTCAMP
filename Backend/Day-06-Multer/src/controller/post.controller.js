const imageKit = require('../config/ImageKit.js')
const Post = require("../Models/post.model.js")

const createPost = async (req,res) => {

    try {
        const {title} = req.body

        const uploadedImage = await imageKit.upload({
            file:req.file.buffer,
            fileName:req.file.originalname
        })

        const post = await Post.create({
          title,
          imageurl: uploadedImage.url,
          imagekitfieldid: uploadedImage.fileId,
        });

        res.status(201).json({
            message:"post created",
            post
        })

        
    } catch (error) {
        res.status(500).json({
            message:"upload failed",
            error:error.message
        })
    }
    
}
module.exports = createPost