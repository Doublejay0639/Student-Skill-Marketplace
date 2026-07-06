import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet' //middleware security
import rateLimit from 'express-rate-limit' //middleware security
import prisma from './config/db.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import bookingRouter from './routes/bookingroute.js';
import reviewRouter from './routes/reviewRoute.js';

dotenv.config();

const app = express();


const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(helmet()) //middleware security
const limiter = rateLimit({ //middleware security
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: 'Too many requests, please try again later'
    }
})
app.use(limiter)//middleware security
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);


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