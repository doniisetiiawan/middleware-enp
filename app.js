import express from 'express';
import logger from 'morgan';
import session from 'express-session';

const app = express();
const port = 3000;

app.use(express.static('/public'));
app.use(
  session({
    secret: 'strategic',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
  }),
);
app.use('/public', express.static(`${__dirname}/public`));
// each time somebody visits the admin URL
// log the ip address as well as other details
app.use(
  '/admin',
  logger(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]',
    {
      immediate: true,
    },
  ),
);
app.use('/admin', (req, res, next) => {
  // we should authenticate the user somehow but for this demo
  // just set the 'isAdmin' flag directly
  req.isAdmin = true;
});
app.use((req, res) => {
  if (req.isAdmin) {
    res.send('Hello admin!\n');
  } else {
    console.log('App process id (pid): %s', process.pid);
    res.send('Hello user!\n');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
