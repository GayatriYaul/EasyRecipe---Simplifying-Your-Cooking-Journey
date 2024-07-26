import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// to write a comments 
export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const recipe_id = data.recipe_id;
        const user_id = data.user_id;
        const comment_text = data.comment_text;
        const comment_date = new Date();
        const comments = await query({
            // to instert a comment in a comment table 
            query: "INSERT INTO comments (recipe_id, user_id, comment_text, comment_date) VALUES (?, ?, ?, ?)",
            values: [recipe_id, user_id, comment_text, comment_date],
        });
        return NextResponse.json(comments);
    }
    catch (e) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
