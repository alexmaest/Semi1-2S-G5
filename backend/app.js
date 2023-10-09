const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');

const mainRoute = require('./routers/mainRoute');
const userRoute = require('./routers/userRoute');
const loginRoute = require('./routers/loginRoute');
const publicationRoute = require('./routers/publicationRoute');
const commentRoute = require('./routers/commentRoute');
const translateRoute = require('./routers/translateRoute');
const filterRoute = require('./routers/filterRoute');

//const registerRoute = require('./routers/registerRoute');
//const adminRoute = require('./routers/adminRoute');
//const userRoute = require('./routers/userRoute');

//middleware
app.use(morgan('dev'));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(cors());

app.use('/', mainRoute);
app.use('/login', loginRoute);
app.use('/user', userRoute);
app.use('/publication', publicationRoute);
app.use('/comment', commentRoute);
app.use('/translator', translateRoute);
app.use('/filter', filterRoute);
//app.use('/register', registerRoute);
//app.use('/admin', adminRoute);

module.exports = app;