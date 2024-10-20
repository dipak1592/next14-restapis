import connect from "@/app/lib/db";
import Student from "@/app/lib/models/student";
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";
import Category from "@/app/lib/models/category";

export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");

        if(!studentId || !Types.ObjectId.isValid(studentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing StudentID" }),
                { status: 400 }
            );
        }

        await connect();

        const student = await Student.findById(studentId);

        if(!student) {
            return new NextResponse(
                JSON.stringify({ message: "Student not found in the database" }),
                { status: 404 }
            );
        }

        const categories = await Category.find({student:new Types.ObjectId(studentId)})

        return new NextResponse(
            JSON.stringify(JSON.stringify(categories)),
            { status: 200 }
        );

    } catch (error: unknown) {
        const err = error as Error; 
        return new NextResponse(
            JSON.stringify({ message: "An error occurred while fetching student categories", error: err.message }),
            { status: 500 }
        );
    }
}

export const POST = async (request: NextRequest) => {
     try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get("studentId");

        const { title } = await request.json()

        if(!studentId || !Types.ObjectId.isValid(studentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing StudentID" }),
                { status: 400 }
            );
        }

        await connect();

        const student = await Student.findById(studentId)

        if(!student){
            return new NextResponse(
                JSON.stringify({ message: "Student not found in the database" }),
                { status: 404 }
            );
        }
        
        const newCategory = new Category({ 
            title, 
            student: new Types.ObjectId(studentId), 
        });

        await newCategory.save();

        return new NextResponse(
            JSON.stringify({ message: "Category is created", category: newCategory }),
            { status: 200 }
        );
     }catch (error: unknown) {
        const err = error as Error; 
        return new NextResponse(
            JSON.stringify({ message: "An error occurred while creating student categories", error: err.message }),
            { status: 500 }
        );
    }
}