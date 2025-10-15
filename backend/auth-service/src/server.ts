import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import controller from './controllers/authController';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/coursesdb';
mongoose.connect(mongoUri).then(()=> console.log('auth: mongo connected')).catch(console.error);

app.use('/auth', controller);

app.use(errorHandler);

app.listen(3001, () => console.log('auth-service listening on 3001'));
