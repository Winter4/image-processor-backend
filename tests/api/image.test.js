/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const path = require('path');
const {api, db} = require('../setup');
const should = require('should');

const clean = async() => {
	await db('images').delete({});
};

describe('API / Image', () => {
	before(clean);
	after(clean);

	describe('#upload', () => {
		it('should work', async() => {
			const response = await api
				.post('/image/upload')
				.expect(200)
				.attach('image', path.join(__dirname, '..', 'assets', 'mountains.jpg'));

			const {body: {data: result}} = response;
			should(result).have.keys('id', 'title');
		});
	});

	describe('#get', () => {
		it('should work', async() => {
			const response = await api
				.post('/image/get')
				.expect(200);

			const {body: {data: {values, count}}} = response;
			should(count).aboveOrEqual(1);
			should(values).be.Array();
			values.forEach(item => {
				should(item).have.keys('title', 'id', 'created');
			});
		});
	});

	describe('#download', () => {
		it('should work', async() => {
			const {body: {data: {values}}} = await api
				.post('/image/get')
				.expect(200);

			const [value] = values;

			const response = await api
				.get(`/image/download/${value.id}`)
				.expect(200);
			should(response).match({
				statusCode: 200,
				headers: {
					'content-type': 'image/jpeg'
				}
			});
		});
	});

	describe('#process', () => {
		let imageId = null;

		before('get image', async() => {
			const {body: {data: {values}}} = await api
				.post('/image/get')
				.expect(200);

			imageId = values[0].id;
		});

		it('should work with filter: gaussian-blur', async() => {
			const response = await api
				.post('/image/process')
				.send({imageId, filter: 'gaussian-blur'})
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
