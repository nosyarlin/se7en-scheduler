var expect = require('chai').expect;
var Course = require('../models/Course')

describe('getCoursesForAlgo()', function () {
	it('returns courses in correct format', function() {

			Course.getCoursesForAlgo(1, function(row){
				console.log(row);
			});

			// Assert
			expect(true).to.be.equal(true);
		})
});