/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const supertest = require('supertest');
const path = require('path');

const configPath = process.env.NODE_ENV === 'production'
	? path.resolve(__dirname, '../compiled/config', 'config.json')
	: path.resolve(__dirname, '../config', 'config.json');

const config = JSON.parse(fs.readFileSync(configPath));
const api = supertest(`http://localhost:${config.deploy.apiPort}`);

module.exports = {config, api};
