import client from "@/lib/mongodb";

export async function POST (req){
    const body = await req.json();

    await client.connect();

    const {email , otp } = body;

    const db = client.db("FrozenBeats");
    const Otp = db.collection("otp"); 
    const Users = db.collection("users"); 

    const entry = await Otp.findOne({$and: [{email: email} , {otp: otp}]});
    
    if(entry == null){
        return Response.json({error: "Invalid Otp"}, {status: 400});    
    }

    const result = await Users.insertOne({
        username: entry.username,
        email: entry.email,
        password: entry.password,
        role: "user"
    })

     const deleted = await Otp.deleteOne({otp: otp});

    return Response.json(result);
}