import express from 'express';

import blog from './blog';
import admin from './admin';

const app = express();
const port = 3000;

app.use('/blog', blog);
app.use('/admin', admin);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
