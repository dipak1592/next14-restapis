import connect from "@/app/lib/db";
import Teacher from "@/app/lib/models/teacher";
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";
import Category from "@/app/lib/models/category";
import Blog from "@/app/lib/models/blog";

export const GET = async (request: NextRequest, context: { params: { blog: string } }) => {
    const blogid = context.params.blog

    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get("teacherId");
        const categoryId = searchParams.get("categoryId");

        if(!teacherId || !Types.ObjectId.isValid(teacherId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing teacher ID" }),
                { status: 400 }
            );
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing category ID" }),
                { status: 400 }
            );
        }

        if(!blogid || !Types.ObjectId.isValid(blogid)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing blog ID" }),
                { status: 400 }
            );
        }

        await connect();

        const student = await Teacher.findById(teacherId);
     if(!student){
        return new NextResponse(
            JSON.stringify({message:"Teacher not found"}),
            {status:404}
        );
    }

     const category = await Category.findById(categoryId);
     if(!category) {
        return new NextResponse(
            JSON.stringify({message:"Category not found"}),
            {status:404}
        );
    } 

    const blog = await Blog.findOne({
        _id: blogid,
        teacher: teacherId,
        category: categoryId
    })
 
    if(!blog){
        return new NextResponse(
            JSON.stringify({message:"Blog not found for database"}),
            {status:404}
        );
    }

    return new NextResponse(JSON.stringify({ blog }),{
        status: 200,
    })
        
    } catch (error: unknown) {
        const err = error as Error;
        return new NextResponse("Error in fetching blogs: " + err.message, {
            status: 500,
        });
    }
}

export const PATCH = async (request: NextRequest, context: {params:{ blog: string } }) => {
    const blogid = context.params.blog

    try {
        const body = await request.json();
        const {title, description} = body;

        if(!title || !description){
            return new NextResponse(
                JSON.stringify({ message: "Title and description are required" }),
                { status: 400 }
            );
        }

        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get("teacherId")
        
        if(!teacherId || !Types.ObjectId.isValid(teacherId)){
            return new NextResponse(
                JSON.stringify({message:"Invalid or missing teacher ID"}),
                {status:400}
            );
        }

        if(!blogid || !Types.ObjectId.isValid(blogid)){
            return new NextResponse(
                JSON.stringify({message:"Invalid or missing blog ID"}),
                {status:400}
            );
        }

        await connect();

        const teacher = Teacher.findById(teacherId)

        if(!teacher){
            return new NextResponse(
                JSON.stringify({message:"Teacher not found"}),
                {status:404}
            );
        }

        const blog = Blog.findOne({_id: blogid, teacher: teacherId})

        if(!blog){
            return new NextResponse(
                JSON.stringify({message:"Blog not found"}),
                {status:404}
            );
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogid,
            {title, description},
            {new: true}
        );
 
        return new NextResponse(
            JSON.stringify({message:"Blog is updated", blog: updatedBlog}),
            {status:200}
        );

    } catch (error: unknown) {
        const err = error as Error;
        return new NextResponse("Error in updating blog: " + err.message, {
            status: 500,
        });
    }
}

export const DELETE = async (request: NextRequest,context: {params:{ blog: string } }) => {
    const blogid = context.params.blog;

    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get("teacherId")
        
        if(!teacherId || !Types.ObjectId.isValid(teacherId)){
            return new NextResponse(
                JSON.stringify({message:"Invalid or missing teacher ID"}),
                {status:400}
            );
        }

        if(!blogid || !Types.ObjectId.isValid(blogid)){
            return new NextResponse(
                JSON.stringify({message:"Invalid or missing blog ID"}),
                {status:400}
            );
        }

        await connect(); 

        const teacher = Teacher.findById(teacherId)

        if(!teacher){
            return new NextResponse(
                JSON.stringify({message:"Teacher not found"}),
                {status:404}
            );
        }

        const blog = Blog.findOne({_id: blogid, teacher: teacherId})

        if(!blog){
            return new NextResponse(
                JSON.stringify({message:"Blog not found"}),
                {status:404}
            );
        }

        await Blog.findByIdAndDelete(blogid);

        return new NextResponse(
            JSON.stringify({message:"Blog is deleted"}),
            {status:200}
        );

    } catch (error: unknown) {
        const err = error as Error;
        return new NextResponse("Error in deleting blog: " + err.message, {
            status: 500,
        });
    }
}