import express from 'express';
import bodyParser from 'body-parser';
import controller from './controllers/recommenderController';
import { errorHandler } from './middleware/errorHandler';
import 'dotenv/config'

const app = express();
app.use(bodyParser.json());

app.use(controller);
app.use(errorHandler);

app.listen(3002, () => console.log('recommender-service listening on 3002'));
