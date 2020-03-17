import express from 'express';

const app = express.Router();

app.get('/', (req, res, next) => {
  res.send('Blog app says hello');
});

app.get('/error', (req, res, next) => next(new Error('err')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.send('BLOG: an error occured');
});

export default app;
