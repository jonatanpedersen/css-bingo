const assert = require('assert');
const cssBingo = require('../');
const tests = require('./tests.json');

describe('css-bingo', () => {
	tests.forEach(test => {
		it(test.description, () => {
			const actual = cssBingo(test.css, test.html);
			assert.equal(actual, test.expected, `${test.description}: ${actual} !== ${test.expected}`);
		});
	});
});
