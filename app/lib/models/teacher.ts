import { Schema, model, models } from "mongoose";

const teacherschema = new Schema(
    {
        email:{type:"string",required:true,unique:true},
        teachername:{type:"string",required:true,unique:true},
        password:{type:"string",required:true}

    },
    {timestamps:true}
);

const Teacher = models.Teacher || model("Teacher",teacherschema)

export default Teacher;