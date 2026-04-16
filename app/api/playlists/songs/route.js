import client from "@/lib/mongodb";

export async function POST (req){
    const body = await req.json();

    await client.connect();
    const db = client.db("FrozenBeats");
    const PlaylistSongs = db.collection("PlaylistSongs");

    const {playlistId , songId} = body;

    const result = await PlaylistSongs.insertOne({playlistId : playlistId , songId : songId});

    return Response.json(result);
}

export async function DELETE (req){
    const body = await req.json();

    await client.connect();
    const db = client.db("FrozenBeats");
    const PlaylistSongs = db.collection("PlaylistSongs");

    const {playlistId , songId} = body;

    const result = await PlaylistSongs.deleteOne({playlistId : playlistId , songId : songId});

    return Response.json(result);
}