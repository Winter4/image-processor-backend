import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import RedisStore from 'connect-redis';
import cors from 'cors';
import type {UUID} from 'crypto';
import fs from 'fs';
import path from 'path';

import config from '@config';
import {logger, redis} from '@ctx';

import {errorHandler, preMiddlewares} from './middlewares';
import api from './api/api.router';

declare module 'express-session' {
  export interface SessionData {
    user: {
		id: UUID,
		email: string,
	}
  }
}

const tmpDirPath = path.resolve(__dirname, '..', '.tmp');

async function main() {
	const {nodeEnv, deploy: {apiPort, frontendUrl}, sessionSecret} = config;

	const app = express();

	// session config
	app.use(
		session({
			store: new RedisStore({
				client: redis,
			}),
			cookie: {
				httpOnly: true,
				secure: nodeEnv === 'production',
				// month
				maxAge: 30 * 24 * 60 * 60 * 1000
			},
			name: 'sessionid',
			saveUninitialized: false,
			secret: sessionSecret,
			resave: false,
		})
	);
	// system middlewares
	app.use(cors({credentials: true, origin: frontendUrl}));
	app.use(express.json());
	app.use(cookieParser());

	// api and stuff
	app.use(preMiddlewares());
	if(nodeEnv === 'development') app.use('/api', api);
	else api.use(api);

	app.use(errorHandler);

	// run
	app.listen(apiPort);

	logger.info(`\\|/ API is running on port ${apiPort} \\|/`);

	if(!fs.existsSync(tmpDirPath))
		fs.mkdirSync(tmpDirPath);
}

main();
