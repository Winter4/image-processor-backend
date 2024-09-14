import {Request, Response} from 'express';
import {createHash} from 'crypto';
import fs from 'fs';

import * as errors from '@err';

import Image from '@models/image.model';

/* - - - - - - - - - - - - - - - - - - */

async function get(req: Request, res: Response) {
	const {user} = req.session;
	if(!user) throw new errors.UnauthorizedError();

	const result = await Image.getMany({userId: user.id}, {select: ['title', 'id', 'created']});
	res.json({data: result});
}

async function upload(req: Request, res: Response) {
	const {file} = req;
	if(!file) throw new errors.InvalidRequestError('Request should contain a file to upload');

	const {user} = req.session;
	if(!user) throw new errors.UnauthorizedError();

	const buffer = fs.readFileSync(file.path);

	await Image.create({
		userId: user!.id,
		title: 'test-img',
		data: buffer,
		mimeType: file.mimetype,
		handleType: 'original',
		md5: createHash('md5').update(buffer).digest('hex')
	});

	res.sendStatus(200);
}

async function download(req: Request, res: Response) {
	const {imageId} = req.params;
	if(!imageId) throw new errors.InvalidRequestError;

	if(!req.session.user) throw new errors.UnauthorizedError;

	const image = await Image.getOne({id: imageId, userId: req.session.user.id}, {select: ['data', 'userId', 'mimeType']});
	if(!image) throw new errors.NotFoundError('Image');

	res.contentType(image.mimeType);
	res.send(image.data);
}

/* - - - - - - - - - - - - - - - - - - */

export {get, upload, download};
