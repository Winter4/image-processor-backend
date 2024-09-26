/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const {api, db} = require('../setup');
const should = require('should');
const {faker} = require('@faker-js/faker');

/* - - - - - - - - - - - - - - - - - - */

const createRandomUser = () => ({
	email: faker.internet.email(),
	password: faker.internet.password()
});
const users = faker.helpers.multiple(createRandomUser, {count: 10});

/* - - - - - - - - - - - - - - - - - - */

const cleanUsers = async() => {
	await db('images').delete({});
	await db('users').delete({});
};

describe('API / User', () => {
	before(cleanUsers);
	before('create users', () => Promise.all(users.map(user => api.post('/auth/sign-up').send(user).expect(200))));

	after(() => cleanUsers());

	describe('#get', () => {
		it('should work', async() => {
			const {body: {data: {values, count}}} = await api.post('/user/get').expect(200);
			should(count).eql(10);
			should(values).containDeep(users.map(({email}) => ({email})));
		});
	});
});
