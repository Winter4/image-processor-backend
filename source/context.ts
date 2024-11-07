import pino from 'pino';
import knex from 'knex';
// import Redis from 'ioredis';
import config from '@config';

export const logger = pino({});

export const db = knex({
	client: 'pg',
	connection: config.deploy.dbUrl,
	debug: config.deploy.dbLogs
});
