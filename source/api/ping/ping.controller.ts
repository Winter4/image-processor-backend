import {Request, Response} from 'express';

export function method(req: Request, res: Response) {
	res.json({message: 'Running and ready to kick-up'});
}
