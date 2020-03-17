import express from 'express';
import logger from 'morgan';

const app = express();
const port = 3000;

app.use('/public', express.static(`${__dirname}/public`));
// each time somebody visits the admin URL
// log the ip address as well as other details
app.use('/admin', logger({ immediate: true }));
app.use('/admin', (req, res, next) => {
  // we should authenticate the user somehow but for this demo
  // just set the 'isAdmin' flag directly
  req.isAdmin = true;
});
app.use((req, res) => {
  if (req.isAdmin) {
    res.send('Hello admin!\n');
  } else {
    res.send('Hello user!\n');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
