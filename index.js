var SnackLimit = require('./SnackLimit');

var args = process.argv.slice(2);

//SnackLimit.get().then(function(result) {
//SnackLimit.get(id).then(function(result) {
SnackLimit.get('11111111').then(function(result) {
	
    console.log(result);
	return;
}).catch(function(err) {
	console.error(err);
	return;
}).finally(function() {
	SnackLimit.close();
	return;
});

function _logTest(id, filter) {
    console.log('ID: ', id);
    console.log('FILTER: ', filter);
};