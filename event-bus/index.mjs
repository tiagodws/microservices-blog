import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';

const PORT = 8080;

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;
  const { type } = event;

  console.log('Event received', type);

  events.push(event);

  axios.post('http://posts-srv:8080/events', event);
  axios.post('http://comments-srv:8080/events', event);
  axios.post('http://query-srv:8080/events', event);
  axios.post('http://moderation-srv:8080/events', event);

  res.sendStatus(200);
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
