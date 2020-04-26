import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

const PORT = 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.post('/events', async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Event received', type);

    if (type === 'CommentModerated') {
      const { postId, id, status } = data;
      const comments = commentsByPostId[postId];
      const comment = comments[id];

      comment.status = status;

      const event = { type: 'CommentUpdated', data: { ...comment, postId } };

      await axios.post('http://event-bus-srv:8080/events', event);
    }

    res.status(200);
  } catch (err) {
    next(err);
  }
});

app.get('/posts/:id/comments', (req, res) => {
  try {
    const id = req.params.id;
    const comments = commentsByPostId[id] || {};
    res.send(comments);
  } catch (err) {
    next(err);
  }
});

app.post('/posts/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;

    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comment = { id: commentId, status: 'pending', content };

    const comments = commentsByPostId[postId] || {};
    comments[commentId] = comment;
    commentsByPostId[postId] = comments;

    const event = { type: 'CommentCreated', data: { ...comment, postId } };
    await axios.post('http://event-bus-srv:8080/events', event);

    res.status(201).send(comments);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
