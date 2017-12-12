
var request = require('request'), assert = require("assert"), http = require("http");
describe('http tests', function() {

	it('Checking whether a user who has account can login', function(done) {
		request.post('http://localhost:3000/kusers/login', {
			form : {
				username : 'testuser2@sjsu.edu',
				password : '11'
			}
		}, function(error, response) {
			assert.equal(201, response.statusCode);
			done();
		});
	});

	it('Failed to signup, invalid path ', function(done) {
		request.post('http://localhost:3000/kusers/signup1', {
			form : {
				username : 'testuser2@sjsu.edu',
				password : '11',
				firstname:"test",
			 lastName :"test",
			 contact :"123",
			 education : "San Jose State University",
			 interest : "BasketBall"
			}
		}, function(error, response) {
			assert.equal(404, response.statusCode);
			done();
		});
	});

  it('Fail to login  for invalid user', function(done) {
    request.post('http://localhost:3000/kusers/login', {
      form : {
        username : 'testuser1@sjsu.edu',
        password : '1'
      }
    }, function(error, response, body) {
      assert.equal(401, response.statusCode);
      done();
    });
  });
  it('Get activity report of an existing user', function(done) {
		request.get('http://localhost:3000/kdata/activityreport', {
			headers : {
				servertoken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjM3LCJpYXQiOjE1MDgwMDU5MjJ9.BPPM6lcf-lIJeOxt8Y8YJEtJnRm4yiYMGwgR7X03sR0'
			}
		}, function(error, response, body) {


			assert.equal(201, response.statusCode);
			done();
		});
	});

  it('Failed to get activity report when session token is invalid', function(done) {
		request.get('http://localhost:3000/kdata/activityreport', {
			headers : {
				servertoken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjM3LCJpYXQiOjE1MDgwMDU5MjJ9.BPPM6lcf-lIJeOxt8Y8YJEtJnRm4yiYMGwgR7X03sR01'
			}
		}, function(error, response, body) {

			assert.equal(401, response.statusCode);
			done();
		});
	});

    it('Get the list of uploaded files by user', function(done) {
		request.get('http://localhost:3000/kusers/getfiledirlist', {
			headers : {
				servertoken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjM3LCJpYXQiOjE1MDgwMDU5MjJ9.BPPM6lcf-lIJeOxt8Y8YJEtJnRm4yiYMGwgR7X03sR0'
			}
		}, function(error, response, body) {

			assert.equal(201, response.statusCode);
			done();
		});
	});


    it('Failed to get the list of uploaded files if user not logged in or invalid server token', function(done) {
		request.get('http://localhost:3000/kusers/getfiledirlist', {
			headers : {
				servertoken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjM3LCJpYXQiOjE1MDgwMDU5MjJ9.BPPM6lcf-lIJeOxt8Y8YJEtJnRm4yiYMGwgR7X03sR01'
			}
		}, function(error, response, body) {

			assert.equal(401, response.statusCode);
			done();
		});
	});

	it('Successfully set favourite for a file', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/star',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			path:"testuser1_1509963356647/test/testgrp",
			star:true
		})
	};
	request.post(options, function(error, response, body) {
		assert.equal(201, response.statusCode);
		done();

	});
});
	it('Failed to set favourite for a file, if user is not authenticated', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/star',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : '111eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			path:"testuser1_1509963356647/test/testgrp",
			star:true
		})
	};
		request.post(options, function(error, response, body) {
			//console.log("response status: ",response);
			assert.equal(401, response.statusCode);
			done();
		});
	});

	it('Successfully retrieve group members', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/getgrpmembers',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			data:{path:"testuser1_1509963356647/testgrp"}
		})
	};
		request.post(options, function(error, response, body) {
			//console.log("response status: ",response);
			assert.equal(201, response.statusCode);
			done();
		});
	});

	it('Failed to  retrieve group members if user not authenticated', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/getgrpmembers',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : '111eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			data:{path:"testuser1_1509963356647/testgrp"}
		})
	};
		request.post(options, function(error, response, body) {
			//console.log("response status: ",response);
			assert.equal(401, response.statusCode);
			done();
		});
	});

	it('Successfully add new members to a group', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/addgrpmem',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			grp:{path:"testuser1_1509963356647/testgrp"},
			users:"test@sjsu.edu"
		})
	};
		request.post(options, function(error, response, body) {
			//console.log("response status: ",response);
			assert.equal(201, response.statusCode);
			done();
		});
	});

	it('Failed to  add new members to a group if user is not authenticated', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/addgrpmem',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : '111eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			grp:{path:"testuser1_1509963356647/testgrp"},
			users:"test@sjsu.edu"
		})
	};
		request.post(options, function(error, response, body) {
			//console.log("response status: ",response);
			assert.equal(401, response.statusCode);
			done();
		});
	});

	it('Failed to  access create group if user is not authenticated', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/creategroup',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : '111eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			grp:{path:"testuser1_1509963356647/testgrp"},
			users:"test@sjsu.edu"
		})
	};
		request.post(options, function(error, response, body) {
			assert.equal(401, response.statusCode);
			done();
		});
	});
	it('Failed to  access delete member from  group if user is not authenticated', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/deletegrpmem',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : '111eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			grp:{path:"testuser1_1509963356647/grpoup_1"},
			users:"test@sjsu.edu"
		})
	};
		request.post(options, function(error, response, body) {
			assert.equal(401, response.statusCode);
			done();
		});
	});

	it('Failed to  upload  if user is not authenticated', function(done) {
		var options = {
		url: 'http://localhost:3000/kdata/deletegrpmem',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			 servertoken : '111eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ0ZXN0dXNlcjFAc2pzdS5lZHUiLCJpYXQiOjE1MTAwODcyMzN9.jjuStWR7IHiI_0gFqVbiS651TFsuo9xGrWK7Yg_RNhA'
		},
		body: JSON.stringify({
			files:{path:"testuser1_1509963356647/file1.txt"},

		})
	};
		request.post(options, function(error, response, body) {
			assert.equal(401, response.statusCode);
			done();
		});
	});

});
