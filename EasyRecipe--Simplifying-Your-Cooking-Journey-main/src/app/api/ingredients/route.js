// get req res ingredients api
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const POST = async (req, res) => {
  const data = await req.json();

  console.log(data);
  const category_id = data.category_id;

  const ingredients = await query({
    query: "select * from ingredients where category_id = ?",
    values: [category_id],
  });
 
  if (ingredients.length > 0) {
    return NextResponse.json({ ingredients: ingredients }, { status: 200 });
  }
  return NextResponse.json({ message: "Invalid category Id" }, { status: 400 });
};

export const GET = async (req, res) => {
  const ingredients_category = await query({
    query: "select * from ingredients_category",
  });

  if (ingredients_category.length > 0) {
    return NextResponse.json(
      { ingredients_category: ingredients_category },
      { status: 200 }
    );
  }
  return NextResponse.json(
    { message: "Cant Fetch Ingredients_category" },
    { status: 400 }
  );
};
