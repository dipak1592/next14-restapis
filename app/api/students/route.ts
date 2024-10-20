import { NextResponse, NextRequest } from "next/server";
import connect from "../../lib/db";
import Student from "../../lib/models/student";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

export const GET = async () =>{
    try {
        await connect();
        const student = await Student.find()
        return new NextResponse(JSON.stringify(student),{status:200});
    } catch (error: unknown) { 
        const err = error as Error; 
        return new NextResponse("Error in fetching students: " + err.message, { status: 500 });
    }
}

export const POST = async (request:NextRequest) =>{
    try {
        const body = await request.json()

        if (!body.email || !body.studentname || !body.password) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        
        await connect();
        const newStudent = new Student(body)
        await newStudent.save()
        return new NextResponse(
            JSON.stringify({message:"student is created",student:newStudent}),
            { status:200 }
        )
    } catch (error: unknown) { 
        const err = error as Error; 
        return new NextResponse("Error in creating student: " + err.message, { status: 500 });
    }
}

export const PATCH = async (request:NextRequest) =>{
    try {
        const body = await request.json();
        const {techerId, newTechername} = body;

        await connect();

        if(!techerId || !newTechername){
            return new NextResponse(
                JSON.stringify({ message:"Id and newtechername is not found"}),
                {status:400}
            );
        }

        if(!Types.ObjectId.isValid(techerId)){
            return new NextResponse(
                JSON.stringify({ message:"Invalid teacher ID"}),
                {status:400}
            );
        }

        const updatedtecher = await Student.findOneAndUpdate(
            {_id: new ObjectId(techerId)},
            {studentname: newTechername},
            {new:true}
        )

        if(!updatedtecher){
            return new NextResponse(
                JSON.stringify({message:"Teacher not found in the database"}),
                {status:400}
            )
        } 
        return new NextResponse(
            JSON.stringify({message:"Teacher is Updated",student:updatedtecher}),
            { status:200 }
        )

    } catch (error: unknown) { 
        const err = error as Error; 
        return new NextResponse("Error in updating teacher: " + err.message, { status: 500 });
    }
}

export const DELETE = async (request:NextRequest) =>{
    try {
        const {searchParams} = new URL(request.url);
        const studentId = searchParams.get("studentId");

        await connect();

        if(!studentId){
            return new NextResponse(
                JSON.stringify({ message:"Id  not found"}),
                {status:400}
            );
        }

        if(!Types.ObjectId.isValid(studentId)){
            return new NextResponse(
                JSON.stringify({ message:"Invalid student ID"}),
                {status:400}
            );
        }

        await connect();

        const deletedstudent = await Student.findByIdAndDelete(
            new Types.ObjectId(studentId)
        );

        if(!deletedstudent){
            return new NextResponse(
                JSON.stringify({message:"student not found in the database"}),
                {status:400}
            )
        }

        return new NextResponse(
            JSON.stringify({message:"Student is deleted",student:deletedstudent}),
            { status:200 }
        )
    }catch (error: unknown) { 
        const err = error as Error; 
        return new NextResponse("Error in deleting student: " + err.message, { status: 500 });
    }
}