/* @flow */

import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import morgan from 'morgan';

const app = express();
const upload = multer();

app.use(express.static(__dirname + '/../public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(2300, () => {
  console.log('Server is listening');
});

app.get('/ping', (req, res) => {
  res.send({field1: '1', field2: 2});
});
