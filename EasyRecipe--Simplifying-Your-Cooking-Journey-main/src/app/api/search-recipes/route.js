import { NextResponse } from "next/server";
import { query } from "@/lib/db";


export const POST = async (req, res) => {
  const data = await req.json();

  const recipe_name = data.recipe_name;
  const ingredients = await query({
    query: "SELECT * FROM recipeslist WHERE LOWER(recipe_name) LIKE LOWER(?)",
    values: [recipe_name],
  });
  console.log(ingredients);
  if (ingredients) {
    return NextResponse.json({ ingredients: ingredients }, { status: 200 });
  }
  return NextResponse.json({ message: "No Recipes Found" }, { status: 400 });
};
