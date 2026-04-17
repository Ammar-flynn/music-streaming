export const runtime = "nodejs";

import client from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    await client.connect();
    const db = client.db("FrozenBeats");
    const Favourite = db.collection("Favourite");
    const { userId, songId } = body;

    const entry = await Favourite.findOne({ userId, songId });

    if (entry != null) {
      return Response.json({ error: "Already favourited" }, { status: 380 });
    }

    const result = await Favourite.insertOne({ userId, songId });
    return Response.json(result);
    
  } catch (error) {
    console.error("POST favorite error:", error);
    return Response.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    await client.connect();
    const db = client.db("FrozenBeats");
    const Favourite = db.collection("Favourite");

    const entry = await Favourite.find({ userId }).toArray();

    if (entry == null || entry.length === 0) {
      return Response.json([]); // Return empty array instead of error
    }

    return Response.json(entry);
    
  } catch (error) {
    console.error("GET favorites error:", error);
    return Response.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

// ADD THIS DELETE METHOD
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { userId, songId } = body;
    
    if (!userId || !songId) {
      return Response.json({ error: "userId and songId are required" }, { status: 400 });
    }
    
    await client.connect();
    const db = client.db("FrozenBeats");
    const Favourite = db.collection("Favourite");
    
    const result = await Favourite.deleteOne({ userId, songId });
    
    if (result.deletedCount === 0) {
      return Response.json({ error: "Favorite not found" }, { status: 404 });
    }
    
    return Response.json({ success: true, deletedCount: result.deletedCount });
    
  } catch (error) {
    console.error("DELETE favorite error:", error);
    return Response.json({ error: "Failed to delete favorite" }, { status: 500 });
  }
}