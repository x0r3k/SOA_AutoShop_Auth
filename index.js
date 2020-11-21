require('dotenv').config();
const path = require('path');
const cors = require('cors');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const adminUserRouter = require('./src/api/routers/admin.user.router');
const authRouter = require('./src/api/routers/auth.router');
const { formErrorObject, errorHandling, MAIN_ERROR_CODES } = require('./src/services/errorHandling');

const app = express();
const httpServer = http.createServer(app);

const HTTP_PORT = process.env.HTTP_PORT;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/admin/user', adminUserRouter);
app.use('/api/auth', authRouter);

app.use('*', (req, res, next) => {
    return next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_FOUND)));
});

app.use(errorHandling);

try {
    httpServer.listen(HTTP_PORT, async () => {
        console.log(`Listening on port = ${HTTP_PORT}, ENV = ${process.env.NODE_ENV}`);
    });
} catch (error) {
    httpServer.close();
}
  