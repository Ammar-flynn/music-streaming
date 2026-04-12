import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST (req){
    const body = await req.json();

    await client.connect();
    const db = client.db("FrozenBeats");
    const Playlists = db.collection("Playlists");

    const {userId , name} = body;

    const result = await Playlists.insertOne({userId : userId , name: name});

    return Response.json(result);
}

export async function GET (req){    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    await client.connect();
    const db = client.db("FrozenBeats");
    const Playlists = db.collection("Playlists");

    const result = await Playlists.find({userId : userId}).toArray();

    return Response.json(result);
}

export async function DELETE (req){    
    const { searchParams } = new URL(req.url);
    const playlistId = searchParams.get("playlistId");

    await client.connect();
    const db = client.db("FrozenBeats");
    const Playlists = db.collection("Playlists");

    const result = await Playlists.deleteOne({ _id: new ObjectId(playlistId) });

    return Response.json(result);
}