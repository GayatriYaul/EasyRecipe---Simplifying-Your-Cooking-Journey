import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// retrive the all comments for perticular recipe 
export const POST = async (req, res) => {
    try {
        const data = await req.json();
        const recipe_id = data.recipe_id;
        const comments = await query({

            // The query fetches all comments for a given recipe, including the username of the commenter, and sorts the comments from newest to oldest. The recipe_id is provided as a parameter.
            // Ineer join is used 
            query: "SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.user_id WHERE comments.recipe_id = ? ORDER BY comments.comment_date DESC",
            values: [recipe_id],
        });
        return NextResponse.json(comments);
    }
    catch (e) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
