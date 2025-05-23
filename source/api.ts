import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

import config from '@config';
import {logger} from '@ctx';

import {errorHandler, preMiddlewares} from './middlewares';
import api from './api/api.router';

const tmpDirPath = path.resolve(__dirname, '..', '.tmp');

async function main() {
	const {deploy: {apiPort, frontendUrl}} = config;

	const app = express();

	// system middlewares
	app.use(cors({credentials: true, origin: frontendUrl}));
	app.use(express.json());
	app.use(cookieParser());

	// api and stuff
	app.use(preMiddlewares());
	app.use(api);

	app.use(errorHandler);

	// run
	app.listen(apiPort);

	logger.info(`\\|/ API is running on port ${apiPort} \\|/`);

	if(!fs.existsSync(tmpDirPath))
		fs.mkdirSync(tmpDirPath);
}

main();
