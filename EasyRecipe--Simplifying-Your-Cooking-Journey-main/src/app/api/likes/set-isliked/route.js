import { NextResponse } from "next/server";
import { query } from "@/lib/db";
export const POST = async (req, res) => {

  // data = user_id 
  const data = await req.json();
  const user_id = data.user_id;

  try {
    const user = await query({
      query: "SELECT recipe_id from likes where user_id = ?",
      values: [user_id],
    });

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
};
