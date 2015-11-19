var Hapi = require('hapi');
var corsHeaders = require('hapi-cors-headers');
var winston = require('winston');
var path  = require('path');
var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000, host: '0.0.0.0', routes: { cors: true}});
server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply('This is a simple server receiveing stackTrace logs from ng-amrs');
  },
});

server.route({
  method: ['POST'],
  path: '/javascript-errors',
  handler: function(request, reply) {
    if (request.payload) {
      var logger = new winston.Logger({
        transports: [
          new winston.transports.File({
            level: 'info',
            filename: 'client-logs.log',
            handleExceptions: true,
            json: true,
            colorize: false,
          }),
      ],
        exitOnError: false,
      });
      logger.add(require('winston-daily-rotate-file'),
      {filename: path.join(__dirname, 'logs', 'client-logs.log')});
      logger.info(request.payload);
    }

    reply({message:'ok'});
  },
});
server.ext('onPreResponse', corsHeaders);
server.start(function() {
  console.log('Server running at:', server.info.uri);
});
