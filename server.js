import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { ConnectDB } from "./config/db.js"
import bookRoutes from "./routes/book.route.js"
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173', // Update this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };
  app.use(cors(corsOptions));

ConnectDB()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

