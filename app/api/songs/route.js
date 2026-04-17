export const runtime = "nodejs";

import client from "@/lib/mongodb";

export async function POST(req) {
  const body = await req.json();

  await client.connect();

  const db = client.db("FrozenBeats");
  const songs = db.collection("songs");

  const result = await songs.insertOne(body);

  return Response.json(result);
}

export async function GET(req){
    await client.connect();

    const db = client.db("FrozenBeats");
    const songs  = db.collection("songs");

    const result = await songs.find().toArray();

    return Response.json(result);
}