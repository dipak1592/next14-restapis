import connect from "@/app/lib/db";
import Teacher from "@/app/lib/models/teacher";
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";
import Category from "@/app/lib/models/category";
import Blog from "@/app/lib/models/blog";

export const GET = async(request: NextRequest) => {
   try {
     const { searchParams } = new URL(request.url);
     const teacherId = searchParams.get("teacherId");
     const categoryId = searchParams.get("categoryId");
     const searchKeywords = searchParams.get("Keywords") as string;
     const startDate = searchParams.get("startDate");
     const endDate = searchParams.get("endDate");
     const page = parseInt(searchParams.get("page") || "1");
     const limit = parseInt(searchParams.get("limit") || "10");

     if (!teacherId || !Types.ObjectId.isValid(teacherId)) {
         return new NextResponse(
             JSON.stringify({ message: "Invalid or missing Teacher ID" }),
             { status: 400 }
         );
     }

     if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
         return new NextResponse(
             JSON.stringify({ message: "Invalid or missing category ID" }),
             { status: 400 }
         );
     }

     await connect();

     const teacher = await Teacher.findById(teacherId);
     if(!teacher){
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

    const filter:Record<string, unknown> = {
        teacher: new Types.ObjectId(teacherId),
        category: new Types.ObjectId(categoryId)
    }

    if(searchKeywords){
        filter.$or = [
            {
                title:{$regex: searchKeywords,$options:'i'}
            },
            {
                description:{$regex: searchKeywords,$options:'i'}
            }
        ];
    }

    if(startDate && endDate){
        filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }   
    } else if(startDate){
        filter.createdAt = {
            $gte: new Date(startDate)
        };
    } else if(endDate){
        filter.createdAt = {
            $lte: new Date(endDate)
        };
    }
    
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
    .sort({ createdAt: "asc"})
    .skip(skip)
    .limit(limit);

    return new NextResponse(JSON.stringify({ blogs }), {
        status:200 
    })

   } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new NextResponse("Error in fetching blogs: " + errorMessage, {
      status: 500,
    });
  }
}

export const POST = async (request: NextRequest) =>{
    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get("teacherId");
        const categoryId = searchParams.get("categoryId");
        
        // console.log(teacherId)
        // console.log(categoryId)

        const body  = await request.json();

        const {title, description} = body;
        // console.log("Parsed body:", body);
        
        if (!title || !description) {
            return new NextResponse(
                JSON.stringify({ message: "Title or Description is missing" }),
                { status: 400 }
            );
        }

        if (!teacherId || !Types.ObjectId.isValid(teacherId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing Teacher ID" }),
                { status: 400 }
            );
        }
   
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing category ID" }),
                { status: 400 }
            );
        }

        await connect();

        const teacher = await Teacher.findById(teacherId);
        if(!teacher){
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

        const newBlog = new Blog({
            title,  
            description,
            teacher: new Types.ObjectId(teacherId),
            category: new Types.ObjectId(categoryId),
        })

        await newBlog.save();

        return new NextResponse(JSON.stringify({message:"Blog is created", blog: newBlog }), {
            status: 201
        })

    } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return new NextResponse("Error in adding blogs: " + errorMessage, {
          status: 500,
        });
      }
} 