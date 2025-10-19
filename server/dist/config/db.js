import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('FATAL: MONGO_URI is not defined in environment variables.');
            process.exit(1);
        }
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map