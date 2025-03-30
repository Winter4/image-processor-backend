/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const path = require('path');
const {api} = require('../setup');
const should = require('should');

describe('API / Image', () => {
	describe('#process', () => {
		it('should work', async() => {
			const response = await api
				.post('/image/process-native')
				.attach('image', path.join(__dirname, '..', 'assets', 'mountains.jpg'))
				.expect(200);
			should(response).match({
				statusCode: 200,
				headers: {
					'content-type': 'image/jpeg'
				}
			});
		});
	});
});
