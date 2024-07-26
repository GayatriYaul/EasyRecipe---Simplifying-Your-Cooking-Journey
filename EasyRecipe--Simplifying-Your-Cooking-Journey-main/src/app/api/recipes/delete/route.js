import { NextResponse } from "next/server";
import { query } from "@/lib/db";


export const POST = async (req, res) => {
    const data = await req.json();
    const { recipeId } = data;
    console.log(recipeId+"kofjoids ufoosdfjoids hifdjos jiodsoipfdskfj*****************");

    try {
        // delete from receipes where recipe_id = ?
        const results = await query({
            query: "DELETE FROM recipes WHERE recipe_id = ?",
            values: [recipeId],
          });
        console.log(results);

        return NextResponse.json({ message: "Recipe deleted" });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: e.message });
    }
}

