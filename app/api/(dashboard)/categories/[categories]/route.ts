import connect from "@/app/lib/db";
import Student from "@/app/lib/models/student";
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";
import Category from "@/app/lib/models/category";

interface Params {
    params: {
        categories: string;
    };
}

export const PATCH = async (request: NextRequest,context:Params) => {

    const categoryid = context.params.categories

    try {
        const body = await request.json();
        const { title} = body;

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');

        if(!studentId || !Types.ObjectId.isValid(studentId)){
            return new NextResponse(
                JSON.stringify({message:"Invalid or missing student ID"}),
                {status:400}
            );
        }
        if(!categoryid || !Types.ObjectId.isValid(categoryid)){
            return new NextResponse(
                JSON.stringify({message:"Invalid or missing categoryid"})
            );
        }
        await connect();

        const student = await Student.findById(studentId);

        if(!student){
            return new NextResponse(
                JSON.stringify({message:"Student not found"}),
                {status:404}
            );
        }

        const category = await Category.findOne({_id: categoryid,student:studentId});

        if(!category) {
            return new NextResponse(
                JSON.stringify({message:"Category not found"}),
                {status:404}
            );
        }

        const updatedcategory = await Category.findByIdAndUpdate(
            categoryid,
            {title},
            {new: true}
        )

        return new NextResponse(
            JSON.stringify({ message: "Category is updated", category: updatedcategory }),
            { status: 200 }
        );

    } catch (error: unknown) {  
        const err = error as Error;  
        return new NextResponse(
            "Error in updating category: " + err.message,
            { status: 500 }
        );
    }
}

export const DELETE = async (request: NextRequest,context:Params) => {
    const categoryid = context.params.categories

   try {
     const { searchParams } = new URL(request.url);
     const studentId = searchParams.get('studentId');

     if(!studentId || !Types.ObjectId.isValid(studentId)){
        return new NextResponse(
            JSON.stringify({message:"Invalid or missing student ID"}),
            {status:400}
        );
    }
    if(!categoryid || !Types.ObjectId.isValid(categoryid)){
        return new NextResponse(
            JSON.stringify({message:"Invalid or missing categoryid"})
        );
    }
    await connect();

    const student = await Student.findById(studentId);

        if(!student){
            return new NextResponse(
                JSON.stringify({message:"Student not found"}),
                {status:404}
            );
        }

        const category = await Category.findOne({_id: categoryid,student:studentId});

        if(!category) {
            return new NextResponse(
                JSON.stringify({message:"Category not found or does not belongs to student"}),
                {status:404}
            );
        }
 
       await Category.findByIdAndDelete(categoryid)

       return new NextResponse(
            JSON.stringify({ message: "Category is deleted", category }),
            { status: 200 }
        );

   } catch (error: unknown) {  
    const err = error as Error;  
    return new NextResponse(
        "Error in deleting category: " + err.message,
        { status: 500 }
    );
}

}