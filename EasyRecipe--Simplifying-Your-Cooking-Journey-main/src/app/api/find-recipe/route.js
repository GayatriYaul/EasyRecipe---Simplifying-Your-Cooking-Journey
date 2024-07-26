import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const GET = async (req, res) => {
  try {
    const recipes = await query({
      query: "SELECT * FROM recipeslist",
      values: [],
    });

    return NextResponse.json(recipes);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }   
};

export const POST = async (req, res) => {
  try {
    const data = await req.json();
    //input to this req is an array of ingredient ids
    //data.ids = [5,6]
    console.log(data.ids);
    if (data.ids.length == 0) {
      return NextResponse.json(
        { message: "No ingredients selected" },
        { status: 500 }
      );
    }
    const dataString = data.ids.join(","); // "5,6"
    // [5,6]

    //ingredient id
    // [5, 6]
    //measurement unit
    // ["cup", "cup"]
    //quantity
    // [1, 1]

    // loop through req_ingredients and call procedure FindRecipesByIngredients

    const recipes = await query({
      query: "CALL FindRecipesByIngredients(?)",
      values: [dataString],
    });

    return NextResponse.json({ recipes }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
};
