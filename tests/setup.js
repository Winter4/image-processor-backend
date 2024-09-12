/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const supertest = require('supertest');
const path = require('path');
const knex = require('knex');

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config', 'config.json')));
const api = supertest(`http://localhost:${config.deploy.apiPort}/api`);

const db = knex({
	client: 'pg',
	connection: config.deploy.dbUrl,
	debug: config.deploy.dbLogs
});
const tables = {
	User: db('users')
};

module.exports = {config, api, tables, db};
