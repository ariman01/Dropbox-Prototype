
var request = require('request'), assert = require("assert");

describe('http tests', function() {

	it('Check successfully loading of user signin page', function(done) {
		request.get('http://localhost:3001/', {

		}, function(error, response) {
			assert.equal(200, response.statusCode);
			done();
		});
	});

	it('Fail to load user signin page', function(done) {
		request.get('http://localhost:3001/wrongurl', {

		}, function(error, response) {
			assert.equal(404, response.statusCode);
			done();
		});
	});

	it('Fail to load user signup page', function(done) {
		request.get('http://localhost:3001/signup', {

		}, function(error, response) {
			assert.equal(404, response.statusCode);
			done();
		});
	});


});
