import {Request, Response} from 'express';
import {createHash} from 'crypto';

import {db} from '@ctx';
import type {ImageTable} from '@tables';
import * as errors from '@err';

const Image = db<ImageTable>('images');

/* - - - - - - - - - - - - - - - - - - */

async function get(req: Request, res: Response) {
	const {userId} = req.body;

	const images = await Image.where({userId});
	res.json({data: images});
}

async function upload(req: Request, res: Response) {
	const {file} = req;
	if(!file) throw new errors.InvalidRequestError('Request should contain a file to upload');

	const {user} = req.session;
	if(!user) throw new errors.UnauthorizedError();

	const {title, handleType} = req.body;

	await Image.insert({
		userId: user!.id,
		title,
		data: file.buffer,
		mimeType: file.mimetype,
		handleType,
		md5: createHash('md5').update(file.buffer).digest('hex')
	});

	res.send(200);
}

/* - - - - - - - - - - - - - - - - - - */

export {get, upload};
