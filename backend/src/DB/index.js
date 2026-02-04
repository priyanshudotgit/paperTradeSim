import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("MONGODB_CONN_SUCCESS::HOST: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("DB_CONN_ERR: ", error);
        process.emit(1);
    }
}

export default connectDB;