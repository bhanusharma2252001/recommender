import express from 'express';
import bodyParser from 'body-parser';
import controller from './controllers/courseController';
import { errorHandler } from './middleware/errorHandler';
import mongoose from 'mongoose';

const app = express();
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/coursesdb';
mongoose.connect(mongoUri).then(()=> console.log('courses: mongo connected')).catch(console.error);

app.use(controller);
app.use(errorHandler);

app.listen(3003, () => console.log('courses-service listening on 3003'));
