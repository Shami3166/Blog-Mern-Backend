
import mongoose from "mongoose";

const connectDB = async () : Promise<void> =>{

    const uri = process.env.MONGO_URI
    if (!uri) {
        throw new Error("MONGO_URI is missing the .env")
    }

    try {
        const conn = await mongoose.connect(uri)
        console.log(`MongoDB connected to : ${conn.connection.host}/${conn.connection.name}`)
    } catch (err) {
        console.error("MongoDn not connected", err)
        process.exit(1)
    }

}

export default connectDB