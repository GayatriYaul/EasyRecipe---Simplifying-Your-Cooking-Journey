import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Define a server-side POST handler
export const POST = async (req, res) => {
  // Parse JSON data from the request body
  const data = await req.json();

  // Log the received data (for debugging purposes)
  console.log(data);

  // Extract username and password from the parsed data
  const username = data.username;
  const password = data.password;

  // Query the database to find a user with matching username and password
  const user = await query({
    query: "SELECT * FROM users WHERE username = ? AND password = ?",
    values: [username, password],
  });

  // Check if a user was found in the database
  if (user.length > 0) {
    // If user exists, return a JSON response with the user data and status 200 (OK)
    return NextResponse.json({ user: user }, { status: 200 });
  } else {
    // If no user found, return a JSON response with an error message and status 400 (Bad Request)
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 400 }
    );
  }
};
