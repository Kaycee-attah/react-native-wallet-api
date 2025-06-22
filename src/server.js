import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js'

dotenv.config()

const app = express();

// middlewares
app.use(rateLimiter); // Middleware to limit the rate of requests
app.use(express.json()); // Middleware to parse JSON bodies
app.use("/api/transactions", transactionsRoute); 

// custom middleware to log the request method
// app.use((req, res, next) => {
//     console.log("Hey we hit a req, the method is", req.method);
//     next(); // Call the next middleware or route handler
// })

const PORT = process.env.PORT || 5001;


connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on Port:', PORT);
    });
})