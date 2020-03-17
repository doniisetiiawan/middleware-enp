import express from 'express';

const app = express();
const port = 3000;

const restrictAccess = (req, res, next) => {
  const { ip } = req;
  console.log(ip);
  if (ip === '127.0.0.1' || ip === '::1' || /^192\.168\./.test(ip)) {
    next();
  } else {
    res.status(403).send('Forbidden!');
  }
};

app.use(restrictAccess);
app.use((req, res, next) => {
  res.send('Hello world');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
