var fs = require('fs');
var request = require('request');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
// }).listen(1337, 'localhost', function (err, result) {
}).listen(1337, '138.68.61.64', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at 138.68.19.136:1337');
});

/*Http request / write data to file*/

/*var j = request.jar();
var cookie = request.cookie('SESSION=NUVI-12345');
var url = 'https://nuvi-challenge.herokuapp.com/activities';
j.setCookie(cookie, url);

request({url: url, jar: j}, function (error, response, body) {
  if (error) return error;
  else {
    fs.writeFile('request.txt', cookie + response.body, (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  }
});*/









