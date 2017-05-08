'use strict';
var SnackLimit = require('./SnackLimit');
const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

var moduleName = 'snack-limit-svc';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from the snack-limit microservice for FuelStationApp'
//      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.get = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'GET from the snack-limit microservice for FuelStationApp'
    })
  };
    //check the event path params for an employee id to use during lookup
    var id = (event.pathParameters && event.pathParameters.slid) ? event.pathParameters.slid : null;
    var filter = ((event.queryStringParameters != null) && (event.queryStringParameters.filter != null))?	
		event.queryStringParameters.filter.split(','):null;
    console.log(moduleName, 'filter created - ' + JSON.stringify(filter));
	
    SnackLimit.get(id,filter).then(function(result) {
        if (result.count == 0) response.statusCode = 404;
        response.body = JSON.stringify({
            message: 'Successful get command found: ' + result.count,
            snacklimit: result.snacklimits
        });
        callback(null, response);
    }).catch(function(err) {
        console.log(moduleName, 'there was an error during the get call');
        console.error(err);
    }).finally(function() {
        console.info(moduleName, 'completed the employee model get');
    });
};

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'POST from the snacklimit microservice for FuelStationApp'
    })
  };
    
    var json = JSON.parse(event.body);
    var snacklimit;
    
    SnackLimit.create(json).then(function(s) {
        console.log(moduleName, 'snacklimit created');
        snacklimit = s;	//stash the snacklimit in a function scoped variable
        response.body = JSON.stringify({
            message: 'Successfully created a new snacklimit: ' + snacklimit.SnackLimitID,
            snacklimit: snacklimit
        });
        callback(null, response);
    }).catch(function(err) {
        console.log(moduleName, 'there was an error creating the snacklimit');
        console.error(err);
    }).finally(function() {
        console.info(moduleName, 'completed the snacklimit model create');
    });
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'PUT from the snacklimit microservice for FuelStationApp'
    })
  };
    var json = JSON.parse(event.body);
    var id = (event.pathParameters && event.pathParameters.slid) ? event.pathParameters.slid : null;
	
  SnackLimit.update(json).then(function(snacklimit) {
      console.log('snacklimit updated using the SPORT utility module');
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error updating the snacklimit record');
      console.error(err);
      callback(err);
  });
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  var response = {
    statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({
      message: 'DELETE from the snacklimit microservice for FuelStationApp'
    })
  };

  var id = (event.pathParameters && event.pathParameters.slid) ? event.pathParameters.slid : null;
  if (!id) {
      callback(null, {
          statusCode: 400,
          body: JSON.stringify({ message: 'Valid snacklimit id was not passed to the delete method.' })
      })
  }
	
  SnackLimit.delete(id).then(function(count) {
      console.log('(' + count + ') - snacklimit successfully deleted');
      callback(null, response);
  }).catch(function(err) {
      console.log('There was an error deleting the snacklimit record');
      console.error(err);
      callback(err);
  });
};
