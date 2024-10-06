import mysql, { Pool } from 'mysql2';
import dotenv from 'dotenv'; 

dotenv.config({ path: './src/.env' }); 

const pool: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default pool.promise();

import app from './app'; 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
