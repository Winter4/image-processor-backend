import {Request, Response, NextFunction} from 'express';
import {pinoHttp} from 'pino-http';

import AppError from './errors';
import {logger} from '@ctx';

function logHTTP(req: Request, res: Response, next: NextFunction) {
	const expressLogger = pinoHttp({
		logger,
		serializers: {
			req: (req: Request) => ({
				method: req.method,
				url: req.url,
				session: req.session,
			}),
		},
	});
	expressLogger(req, res);

	next();
}

export function preMiddlewares() {
	return [logHTTP];
}

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction // eslint-disable-line
) {
	req.log.error(err);
	if(err instanceof AppError)	res.status(err.status).json({message: err.message});
	else res.status(500).json({message: 'Internal server error'});
}
