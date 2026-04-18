export const runtime = "nodejs";

import client from "@/lib/mongodb";

// GET - Fetch all artists (merge from songs and artists collection)
export async function GET() {
    try {
        await client.connect();
        const db = client.db("FrozenBeats");
        const artistsCollection = db.collection("artists");
        const songsCollection = db.collection("songs");
        
        // Get all artists from artists collection
        const customArtists = await artistsCollection.find({}).toArray();
        
        // Get all songs to extract artists
        const allSongs = await songsCollection.find({}).toArray();
        
        // Create sets to track artists
        const customArtistNames = new Set(customArtists.map(a => a.name));
        
        // Helper function for random followers
        const getRandomFollowers = () => {
            return Math.floor(Math.random() * 1000000).toLocaleString();
        };
        
        // FIRST: Add artists from songs that DON'T exist in custom artists
        const songOnlyArtists = [];
        const processedArtists = new Set();
        
        allSongs.forEach(song => {
            if (!customArtistNames.has(song.artist) && !processedArtists.has(song.artist)) {
                processedArtists.add(song.artist);
                songOnlyArtists.push({
                    id: `song-${song.artist.toLowerCase().replace(/\s/g, '-')}`,
                    name: song.artist,
                    image: song.coverUrl,
                    followers: getRandomFollowers()
                });
            }
        });
        
        // SECOND: Add custom artists (from artists collection)
        const customArtistsList = customArtists.map(artist => ({
            id: artist._id.toString(),
            name: artist.name,
            image: artist.imageUrl,
            followers: getRandomFollowers()
        }));
        
        // Combine: Song-only artists first, then custom artists
        const mergedArtists = [...songOnlyArtists, ...customArtistsList];
        
        return Response.json(mergedArtists);
        
    } catch (error) {
        console.error("Error fetching artists:", error);
        return Response.json({ error: "Failed to fetch artists" }, { status: 500 });
    }
}