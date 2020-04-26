import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';

const PORT = 8080;

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Event received', type);

    if (type === 'CommentCreated') {
      const { content } = data;

      if (content.includes('orange')) {
        data.status = 'rejected';
      } else {
        data.status = 'approved';
      }

      await new Promise((res) => setTimeout(res, 5000));

      const event = { type: 'CommentModerated', data };
      await axios.post('http://event-bus-srv:8080/events', event);
    }

    res.status(200);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
