/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const path = require('path');
const {api, db} = require('../setup');
const should = require('should');

/* - - - - - - - - - - - - - - - - - - */

const user = {
	email: 'user@example.com',
	password: 'qwerty123'
};

let loginCookies = null;

/* - - - - - - - - - - - - - - - - - - */

const clean = async() => {
	await db('images').delete({});
	await db('users').delete({});
};

describe.only('API / Image', () => {
	before(clean);
	before('create & login user', async() => {
		await api.post('/auth/sign-up').send(user).expect(200);
		const loginResp = await api.post('/auth/sign-in').send(user).expect(200);
		loginCookies = loginResp.headers['set-cookie'];
		should(loginCookies).match(new RegExp('.*sessionid=.*'));
	});

	after(clean);

	describe('#upload', () => {
		it('should work', async() => {
			const response = await api
				.post('/image/upload')
				.expect(200)
				.set('Cookie', [loginCookies])
				.attach('image', path.join(__dirname, '..', 'assets', 'mountains.jpg'));

			const {body: {data: result}} = response;
			should(result).have.keys('id', 'title');
		});
	});

	describe('#get', () => {
		it('should work', async() => {
			const response = await api
				.post('/image/get')
				.expect(200)
				.set('Cookie', [loginCookies]);

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
				.expect(200)
				.set('Cookie', [loginCookies]);

			const [value] = values;

			const response = await api
				.get(`/image/download/${value.id}`)
				.expect(200)
				.set('Cookie', [loginCookies]);
			should(response).match({
				statusCode: 200,
				headers: {
					'content-type': 'image/jpeg'
				}
			});
		});
	});
});
