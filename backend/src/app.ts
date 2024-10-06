import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; 
import authRoutes from './routes/authRoutes'; 

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

export default app; 
