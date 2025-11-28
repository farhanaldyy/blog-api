import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';
import { connectDB } from './config/db.js';

await connectDB();
const port = process.env.PORT;

app.listen(port, () => console.log(`> Server running in http://localhost:${port}`));
