/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const {api, db} = require('../setup');
const should = require('should');

/* - - - - - - - - - - - - - - - - - - */

const user = {
	email: 'user@example.com',
	password: 'qwerty123'
};

/* - - - - - - - - - - - - - - - - - - */

const cleanUsers = async() => {
	await db('images').delete({});
	await db('users').delete({});
};

describe('API / Auth', () => {
	before(() => cleanUsers());
	after(() => cleanUsers());

	describe('#sign-up', () => {
		it('should work', async() => {
			await api.post('/auth/sign-up').send(user).expect(200);
			const {data: {values, count}} = await api.post('/user/get').expect(200).then(({body}) => body);
			should(values).containDeep([{email: user.email}]);
			should(count).eql(1);
		});

		it('should error with already created user', async() => {
			await api.post('/auth/sign-up').send(user).expect(409);
		});
	});

	describe('#sign-in', () => {
		it('should work', async() => {
			await api.post('/auth/sign-in').send(user).expect(200);
		});

		it('should error with unexisting user', async() => {
			await api.post('/auth/sign-in').send({email: 'tutu', password: '123'}).expect(404);
		});
	});
});
