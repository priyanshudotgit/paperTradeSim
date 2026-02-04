import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import { app } from './app.js';

// config dotnev as ES6
dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => (console.log(`Server running on PORT: ${process.env.PORT}`)));
})
.catch((err) => (console.log("Error starting server: ", err)));