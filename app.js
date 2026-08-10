import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import helmet from 'helmet' //middleware security
import rateLimit from 'express-rate-limit' //middleware security
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import bookingRouter from './routes/bookingroute.js';
import reviewRouter from './routes/reviewRoute.js';
import notificationRouter from './routes/notificationRoute.js';
import { globalHandler } from './middlewares/errorMiddleware.js';


dotenv.config();
const app = express();


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
app.use("/api/notifications", notificationRouter);

app.get('/', (req, res) => {
    res.send("Hi");
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(globalHandler)


export default app;