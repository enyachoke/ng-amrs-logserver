var Hapi = require('hapi');
var corsHeaders = require('hapi-cors-headers')
var winston = require('winston');
winston.emitErrs = true;
var server = new Hapi.Server();
server.connection({ port: 3000,host: '0.0.0.0',routes: { cors: true}});
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
      logger.info(request.payload);
    }

    reply('Ok');
  },
});
server.ext('onPreResponse', corsHeaders);
server.start(function() {
  console.log('Server running at:', server.info.uri);
});
