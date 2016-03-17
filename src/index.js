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




import DomainSearch from './domain-search';

app.get('/ping', (req, res, next) => {
  var domain = req.query['domain'];

  if (!domain) {
    return next(new Error('Domain parameter is not presented'));
  }
  if (domain.length > 64) {
    return next(new Error('The given domain is invalid (> 64 chars)'));
  }


  var zone = req.query['zone'];
  var zones = decodeURIComponent(zone).split(',');

  if (!zone) {
    return next(new Error('Zone parameter is not presented'));
  }
  if (zones.length > 10) {
    return next(new Error('Given list of domain zones are too large (> 10 items)'));
  }


  var config = {
    url: 'https://domainr.p.mashape.com',
    version: 'v2',
    mashapeKey: 'AIUtvwTaN3mshjkJ1eEufJ3Sln6kp1QfXVAjsnS9V8PeDC9h9P'
  };

  var domainModel = new DomainSearch(config);
  domainModel.getStatus({
    domain: domain,
    zones: zones
  }, (err, result) => {
    if (err) {
      next(result);
    } else {
      res.send(result);
    }
  });
});

app.use(function(err, req, res, next) {
  var message = err.message;
  var status = err.status || 500;

  res.status(status).json({error: message});
});
