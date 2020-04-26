import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

const PORT = 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/events', (req, res) => {
  try {
    const { type } = req.body;

    console.log('Event received', type);

    res.status(200);
  } catch (err) {
    next(err);
  }
});

app.post('/posts/create', async (req, res, next) => {
  try {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    const post = { id, title };
    posts[id] = post;

    const event = { type: 'PostCreated', data: post };
    await axios.post('http://event-bus-srv:8080/events', event);

    res.status(201).send(posts[id]);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
