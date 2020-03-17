import express from 'express';
import logger from 'morgan';
import session from 'express-session';
import responseTime from 'response-time';
import compress from 'compression';
import errorHandler from 'errorhandler';

const app = express();
const port = 3000;

const configureByEnvironment = (env) => {
  if (!env) {
    env = process.env.NODE_ENV;
  }

  // default to development
  env = env || 'development';

  return (env2, callback) => {
    if (env === env2) {
      callback();
    }
  };
};

const configure = configureByEnvironment();

configure('development', () => {
  app.use(logger('dev'));
  app.use(responseTime());
  app.use(express.static(`${__dirname}/public`));
});
configure('production', () => {
  app.use(logger());
  // enable gzip compression for static resources in production
  app.use(compress());
  app.use(express.static(`${__dirname}/public`));
});

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
app.use('/admin', (req, res, next) => {
  // we should authenticate the user somehow but for this demo
  // just set the 'isAdmin' flag directly
  req.isAdmin = true;
});
// app.use((req, res) => {
//   if (req.isAdmin) {
//     res.send('Hello admin!\n');
//   } else {
//     console.log('App process id (pid): %s', process.pid);
//     res.send('Hello user!\n');
//   }
// });

app.get('/', (req, res, next) => {
  res.send('Hello world');
});
app.get('/error', (req, res, next) => {
  next(new Error('manually triggered error'));
});

const articles = {
  'express-tutorial': {
    title: 'Practical web apps with Express',
    content: 'Lean how to create web apps with Express',
  },
  'node-videos': {
    title: 'Node.js video tutorials',
    content: 'Practical Node tips!',
  },
};

const loadArticle = (req, res, next) => {
  // we assume that the /:article placeholder
  // is present in the path
  if (!articles[req.params.article]) {
    return res.status(404).send('No such article!');
  }

  req.article = articles[req.params.article];

  next();
};

const requireAdmin = (req, res, next) => {
  if (req.ip !== '127.0.0.1') {
    return res.status(403).send('Forbidden');
  }

  next();
};

app.param('article', loadArticle);
app.get('/articles/:article/:action', requireAdmin);

app.get('/articles/:article', (req, res, next) => {
  res.send(req.article.content);
});

app.get(
  '/articles/:article/edit',
  requireAdmin,
  (req, res, next) => {
    res.send(`Editing article ${req.article.title}`);
  },
);

configure('development', () => {
  app.use(errorHandler());
});
configure('production', () => {
  app.use((err, req, res, next) => {
    res.status(500).send('500 - Internal Server Error');
    console.error(err.stack);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
console.log(
  'application environment: %s',
  process.env.NODE_ENV || 'development',
);
