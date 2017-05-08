var SnackLimit = require('./SnackLimit');

var args = process.argv.slice(2);

var checkout = {
    //CheckoutID: 93267,
	StudentSportID: 1060, 
    isArchived: true,
    CreateDate: new Date(2017,2,26,12,30),
    ArchiveDate: new Date(2017,2,26,15,20),
	CheckoutChoices: [
		{ ChoiceID: 4, isSnack: 1, type: 0},
		{ ChoiceID: 3198, isSnack: 0, type: 1}
	]
};

var id = '93302';
var sid = '918';
var filter = ('93265,93266').split(',');
console.log("FILTER: ", filter);
//console.log(mock);

//Checkout.create(checkout).then(function(result) {
//Checkout.get(null, filter).then(function(result) {
//Checkout.today(false).then(function(result) {
//Checkout.get(id).then(function(result) {
    
//Checkout.report().then(function(result) {
SnackLimit.get(31).then(function(result) {
	
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