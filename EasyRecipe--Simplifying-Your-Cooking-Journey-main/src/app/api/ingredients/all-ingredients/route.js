import { NextResponse } from "next/server";
import { query } from "@/lib/db";
export const GET = async (req, res) => {
  const ingredients = await query({
    query: "select * from ingredients",
  });

  if (ingredients.length > 0) {
    return NextResponse.json({ ingredients: ingredients }, { status: 200 });
  }
  return NextResponse.json(
    { message: "Cant Fetch Ingredients" },
    { status: 400 }
  );
};
// not needed