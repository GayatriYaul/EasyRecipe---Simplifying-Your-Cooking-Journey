import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const POST = async (req, res) => {
  let message, status;

  const data = await req.json();

  const recipe_id = data.recipe_id;
  const user_id = data.user_id;
 
  // check if user already liked post or not 
  const checkLike = await query({
    query: "SELECT * FROM `likes` WHERE `user_id` = ? AND `recipe_id` = ?",
    values: [user_id, recipe_id],
  });
  console.log(checkLike);
  if (checkLike.length === 0) {
    const user = await query({
      query:
        "INSERT INTO `likes`(`recipe_id`, `user_id`, `liked_date`) VALUES (?,?,?)",
      values: [recipe_id, user_id, new Date()],
    });
    message = "post Liked";
    status = 201;
  } else {
    console.log("User has already liked the post");
    message = "Something went wrong User has already liked the post";
    status = 500;
  }
  return NextResponse.json({ message: message }, { status: status });
};
