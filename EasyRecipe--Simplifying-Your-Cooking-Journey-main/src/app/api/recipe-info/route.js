import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const POST = async (req, res) => {
    try {
        const data = await req.json();

        const { recipe_id } = data;

        const results = await query({
            query: "Call RecipeInfo(?)", // Procedure
            values: [recipe_id],
        });

        console.log(results);

        return NextResponse.json(results[0]);
    }
    catch (e) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
};
