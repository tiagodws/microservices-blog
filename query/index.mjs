import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const PORT = 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    const post = { id, title, comments: {} };

    posts[id] = post;
  }

  if (type === 'CommentCreated' || type === 'CommentUpdated') {
    const { postId, ...comment } = data;
    const post = posts[postId];

    post.comments[comment.id] = comment;
  }
};

app.post('/events', (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Event received', type);
    handleEvent(type, data);

    res.status(200);
  } catch (err) {
    next(err);
  }
});

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.listen(PORT, async () => {
  try {
    console.log(`Listening on port ${PORT}`);

    const { data } = await axios.get('http://event-bus-srv:8080/events');

    data.forEach(({ type, data }) => {
      console.log('Processing event:', type);
      handleEvent(type, data);
    });
  } catch (err) {
    next(err);
  }
});
