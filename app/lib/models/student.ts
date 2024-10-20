import { Schema, model, models } from "mongoose";

const studentschema = new Schema(
    {
        email:{type:"string",required:true,unique:true},
        studentname:{type:"string",required:true,unique:true},
        password:{type:"string",required:true}

    },
    {timestamps:true}
);

const Student = models.Student || model("Student",studentschema)

export default Student;