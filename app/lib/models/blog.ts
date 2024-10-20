import { Schema, model, models } from "mongoose";

const blogschema = new Schema(
    {
        title:{type:"string",required:true},
        description:{type:"string"},
        teacher:{type: Schema.Types.ObjectId,ref:"Teacher"},
        category:{type: Schema.Types.ObjectId,ref:"Category"},
    },
    {
        timestamps:true
    }
)

const Blog = models.Blog || model("Blog",blogschema)

export default Blog;