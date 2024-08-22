import type {Knex} from 'knex';
import config from '@config';

// update with your config settings

const knexConfig: { [key: string]: Knex.Config } = {
	development: {
		client: 'pg',
		connection: config.deploy.dbUrl
	},
};

module.exports = knexConfig;
