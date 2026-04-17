export const runtime = "nodejs";

import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST (req){
    const body = await req.json();

    await client.connect();
    const db = client.db("FrozenBeats");
    const songs = db.collection("songs");

    const { songId } = body;

    const result = await songs.updateOne({_id : new ObjectId(songId)} , {$inc: {plays : 1}});

    return Response.json(result);
}