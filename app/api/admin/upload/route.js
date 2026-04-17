export const runtime = "nodejs";

import client from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        // Get authorization header
        const authHeader = req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: "No token provided" }, { status: 401 });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check admin role
        if (decoded.role !== 'admin') {
            return Response.json({ error: "Admin access required" }, { status: 403 });
        }
        
        // Process upload
        const formData = await req.formData();

        const title = formData.get("title");
        const artist = formData.get("artist");
        const album = formData.get("album");
        const audioFile = formData.get("audio");
        const coverFile = formData.get("cover");

        if (!audioFile || !coverFile) {
            return Response.json({ error: "Audio and cover files are required" }, { status: 400 });
        }

        const uploadToCloudinary = async (file, folder) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder, resource_type: "auto" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
        };

        const audioUpload = await uploadToCloudinary(audioFile, "songs");
        const coverUpload = await uploadToCloudinary(coverFile, "covers");

        await client.connect();
        const db = client.db("FrozenBeats");
        const songs = db.collection("songs");

        const result = await songs.insertOne({
            title,
            artist,
            album,
            audioUrl: audioUpload.secure_url,
            coverUrl: coverUpload.secure_url,
            plays: 0
        });

        return Response.json({ success: true, message: "Song uploaded successfully" });
        
    } catch (error) {
        console.error("Upload error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return Response.json({ error: "Invalid token" }, { status: 401 });
        }
        
        return Response.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }
}
