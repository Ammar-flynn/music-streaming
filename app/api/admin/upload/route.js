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
        const artistCoverFile = formData.get("artistCover");

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

        // Helper function to delete image from Cloudinary
        const deleteFromCloudinary = async (imageUrl) => {
            if (!imageUrl) return;
            try {
                // Extract public ID from URL
                // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
                const parts = imageUrl.split('/');
                const filename = parts.pop();
                const folder = parts.pop();
                const publicId = `${folder}/${filename.split('.')[0]}`;
                
                await cloudinary.uploader.destroy(publicId);
                console.log(`🗑️ Deleted: ${publicId}`);
                return true;
            } catch (error) {
                console.error("Failed to delete image:", error);
                return false;
            }
        };

        const audioUpload = await uploadToCloudinary(audioFile, "songs");
        const coverUpload = await uploadToCloudinary(coverFile, "covers");
        
        // Upload artist cover if provided
        let artistCoverUrl = coverUpload.secure_url; // fallback to song cover
        if (artistCoverFile && artistCoverFile.size > 0) {
            const artistCoverUpload = await uploadToCloudinary(artistCoverFile, "artists");
            artistCoverUrl = artistCoverUpload.secure_url;
        }

        await client.connect();
        const db = client.db("FrozenBeats");
        const songs = db.collection("songs");
        const artists = db.collection("artists");

        // ========== AUTO-CREATE OR UPDATE ARTIST WITH DELETION ==========
        const existingArtist = await artists.findOne({ name: artist });
        
        let artistCreated = false;
        let imageUpdated = false;
        
        if (!existingArtist) {
            // Create new artist
            const newArtist = {
                name: artist,
                imageUrl: artistCoverUrl,
                bio: "",
                socialLinks: {},
                songCount: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            await artists.insertOne(newArtist);
            artistCreated = true;
            console.log(`✅ Auto-created artist: ${artist}`);
            
        } else {
            // Artist exists - update
            const updateData = {
                $inc: { songCount: 1 },
                $set: { updatedAt: new Date() }
            };
            
            // If new artist cover uploaded, delete old and update
            if (artistCoverFile && artistCoverFile.size > 0) {
                // Delete old image from Cloudinary
                if (existingArtist.imageUrl) {
                    await deleteFromCloudinary(existingArtist.imageUrl);
                }
                
                updateData.$set.imageUrl = artistCoverUrl;
                imageUpdated = true;
                console.log(`🖼️ Updated artist image for: ${artist}`);
            }
            
            await artists.updateOne({ name: artist }, updateData);
            
            if (!imageUpdated) {
                console.log(`📈 Updated song count for artist: ${artist}`);
            }
        }

        // Insert the song
        const result = await songs.insertOne({
            title,
            artist,
            album,
            audioUrl: audioUpload.secure_url,
            coverUrl: coverUpload.secure_url,
            plays: 0,
            createdAt: new Date()
        });

        return Response.json({ 
            success: true, 
            message: "Song uploaded successfully",
            artist: {
                name: artist,
                created: artistCreated,
                imageUpdated: imageUpdated,
                imageUrl: artistCoverUrl
            }
        });
        
    } catch (error) {
        console.error("Upload error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return Response.json({ error: "Invalid token" }, { status: 401 });
        }
        
        return Response.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }
}