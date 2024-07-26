import { NextResponse } from "next/server";

export const GET = async (req, res) => {
    return NextResponse.json({ message: "hello world" });
};

export const POST = async (req, res) => {
    return NextResponse.json({ message: "hello world form post" });
};

// not required