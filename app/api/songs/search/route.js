import client from "@/lib/mongodb";

export async function GET (req){
    const  { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    await client.connect();

    const db = client.db("FrozenBeats");
    const songs = db.collection("songs");

    if(query == null){
        const entry = await songs.find().toArray();
        return Response.json(entry);
    }

    const result = await songs.find(
        {$or: 
            [
            { title : { $regex: query, $options: "i" } } , 
            { artist : { $regex: query, $options: "i" } }
        ]}
    ).toArray();

    if(result.length === 0 ){
        return Response.json({error: "No Song Found Notify The Dev for a Song Request"} , {status: 210});
    }

    return Response.json(result);
}