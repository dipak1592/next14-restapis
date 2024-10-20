import { Schema, model, models } from "mongoose";

const categoryschema = new Schema(
    {
        title:{type:"string",required:true,unique:true},
        student:{type: Schema.Types.ObjectId,ref:"Student"},
    },
    {
        timestamps:true
    }
);

const Category = models.Category || model("Category",categoryschema)

export default Category; 