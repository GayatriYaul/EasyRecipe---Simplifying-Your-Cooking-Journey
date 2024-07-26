import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";

// not using 
export const POST = async (req, res) => {
    const data = await req.formData();
    const file = data.get("file");
    if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 500 });
    
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);   
    const path = "./public/uploads/" + file.name;

    await writeFile(path, buffer);
    return NextResponse.json({ message: "File uploaded" }, { status: 201 });

};