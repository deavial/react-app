const stormpath = require('express-stormpath');
const morgan = require('morgan');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const app = express();
const compiler = webpack(config);

app.use(morgan('combined'));

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('/css/bootstrap.min.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/css/bootstrap.min.css'));
});

stormpath.init(app, {
  website: true,
  web: {
    spaRoot: path.join(__dirname, 'build/index.html')
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.on('stormpath.ready', () => {
  console.log('Stormpath Ready');

  app.listen(3000, 'localhost', (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Listening at http://localhost:3000');
  });
});
