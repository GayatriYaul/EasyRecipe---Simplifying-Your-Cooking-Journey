import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const GET = async (req, res) => {

    try {
        const recipes = await query({
            // soups, vegetables , fruits 
            query: "select * from recipe_category",
            values: [],
        });

        return NextResponse.json(recipes);
    }
    catch (e) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
};
