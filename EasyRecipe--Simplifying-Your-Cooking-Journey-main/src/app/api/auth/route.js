import { NextResponse } from "next/server"; // Import NextResponse to construct HTTP responses in Next.js server-side functions
import { query } from "@/lib/db"; // Import the query function from a database utility module located in the lib/db directory

// Define a server-side POST handler
export const POST = async (req, res) => {
  let message, status;

  // Parse JSON data from the request body
  const data = await req.json();

  // Extract username, password, and email from the parsed data
  const username = data.username;
  const password = data.password;
  const email = data.email;

  // Execute a database query to insert a new user into the 'users' table
  const user = await query({
    query:
      "INSERT INTO `users`(`username`, `email`, `password`) VALUES (?,?,?)", // SQL query to insert user data
    values: [username, email, password], // Values to be inserted into the query
  });

  // Check if there was an error during the database operation
  if (user.error) {
    message = "Something went wrong"; // Set error message if query execution failed
    status = 500; // Set HTTP status code to 500 (Internal Server Error)
  } else {
    message = "User added successfully"; // Set success message if user was inserted into the database
    status = 201; // Set HTTP status code to 201 (Created)
  }

  // Return a JSON response with message and status
  return NextResponse.json({ message: message }, { status: status });
};
