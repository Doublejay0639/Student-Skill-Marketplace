import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import prisma from './config/db.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import bookingRouter from './routes/bookingroute.js';

dotenv.config();

const app = express();


const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/bookings", bookingRouter);


app.get('/', (req, res) => {
    res.send("Hi");
})

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed', error);
        process.exit(1);
    }
};

startServer();