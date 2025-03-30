/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const supertest = require('supertest');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config', 'config.json')));
const api = supertest(`http://localhost:${config.deploy.apiPort}`);

module.exports = {config, api};
