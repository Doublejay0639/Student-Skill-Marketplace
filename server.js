import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';
import connectDB from './config/mongodb.js'


const PORT = process.env.PORT || 8080;


const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('PostgreSQL connected successfully');

        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed', error);
        process.exit(1);
    }
};

startServer();