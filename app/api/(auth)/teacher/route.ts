import { NextResponse, NextRequest } from "next/server";
import connect from "../../../lib/db";
import Teacher from "../../../lib/models/teacher";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

export const GET = async () =>{
    try {
        await connect();
        const teacher = await Teacher.find()
        return new NextResponse(JSON.stringify(teacher),{status:200});
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error in fetching teacher: " + error.message, { status: 500 });
        }
        return new NextResponse("An unknown error occurred", { status: 500 });
    }
}

export const POST = async (request: NextRequest) =>{
    try {
        const body = await request.json()

        if (!body.email || !body.teachername || !body.password) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        
        await connect();
        const newTeacher = new Teacher(body)
        await newTeacher.save()
        return new NextResponse(
            JSON.stringify({message:"Teacher is created",student:newTeacher}),
            { status:200 }
        )
    }catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error in creating teacher: " + error.message, { status: 500 });
        }
        return new NextResponse("An unknown error occurred", { status: 500 });
    }
}

export const PATCH = async (request:NextRequest) =>{
    try {
        const body = await request.json();
        const {teacherId, newTeachername} = body;

        await connect();

        if(!teacherId || !newTeachername){
            return new NextResponse(
                JSON.stringify({ message:"Id and newTeachername is not found"}),
                {status:400}
            );
        }

        if(!Types.ObjectId.isValid(teacherId)){
            return new NextResponse(
                JSON.stringify({ message:"Invalid Teacher ID"}),
                {status:400}
            );
        }

        const updatedteacher = await Teacher.findOneAndUpdate(
            {_id: new ObjectId(teacherId)},
            {teachername: newTeachername},
            {new:true}
        )

        if(!updatedteacher){
            return new NextResponse(
                JSON.stringify({message:" not found in the database"}),
                {status:400}
            )
        } 
        return new NextResponse(
            JSON.stringify({message:"Teaacher is Updated",teacher:updatedteacher}),
            { status:200 }
        )

    } catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error in updating teacher: " + error.message, { status: 500 });
        }
        return new NextResponse("An unknown error occurred", { status: 500 });
    }
}

export const DELETE = async (request:NextRequest) =>{
    try {
        const {searchParams} = new URL(request.url);
        const teacherId = searchParams.get("teacherId");

        await connect();

        if(!teacherId){
            return new NextResponse(
                JSON.stringify({ message:"Id  not found"}),
                {status:400}
            );
        }

        if(!Types.ObjectId.isValid(teacherId)){
            return new NextResponse(
                JSON.stringify({ message:"Invalid teacher ID"}),
                {status:400}
            );
        }

        await connect();

        const deletedteacher = await Teacher.findByIdAndDelete(
            new Types.ObjectId(teacherId)
        );

        if(!deletedteacher){
            return new NextResponse(
                JSON.stringify({message:"student not found in the database"}),
                {status:400}
            )
        }

        return new NextResponse(
            JSON.stringify({message:"Teacher is deleted",teacher:deletedteacher}),
            { status:200 }
        )

    }catch (error: unknown) {
        if (error instanceof Error) {
            return new NextResponse("Error in deleting teacher: " + error.message, { status: 500 });
        }
        return new NextResponse("An unknown error occurred", { status: 500 });
    }
}