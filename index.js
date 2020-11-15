require('dotenv').config();
const path = require('path');
const cors = require('cors');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const httpServer = http.createServer(app);

const HTTP_PORT = process.env.HTTP_PORT;

const routers = require('./src/api/routers/user.router');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routers);

app.use('/', (req, res) => res.send('hello worlddDD'));

app.use('*', (req, res) => {
    res.status(404).send('Page not found!');
});

try {
    httpServer.listen(HTTP_PORT, async () => {
        console.log(`Listening on port = ${HTTP_PORT}, ENV = ${process.env.NODE_ENV}`);
    });
} catch (error) {
    httpServer.close();
}
  