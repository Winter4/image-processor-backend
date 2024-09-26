import {Request, Response} from 'express';
import {createHash} from 'crypto';
import fs from 'fs';
import path from 'path';
import * as canvas from 'canvas';

import * as errors from '@err';

import Image from '@models/image.model';
import processImage from './image.processor';

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

async function process(req: Request, res: Response) {
	// if(!req.session.user) throw new errors.UnauthorizedError;

	const {imageId, filter} = req.body;
	if(!imageId || !filter) throw new errors.InvalidRequestError();

	const image = await Image.getOne({id: imageId});
	if(!image) throw new errors.NotFoundError('Image');

	const processedBuffer = Buffer.from(processImage(image, filter));
	fs.writeFileSync(path.join(__dirname, 'test.jpeg'), processedBuffer);

	const loadedImg = await canvas.loadImage(processedBuffer);
	loadedImg.src = processedBuffer;

	const canvasObj = canvas.createCanvas(image.width, image.height);
	const canvasCtx = canvasObj.getContext('2d');

	canvasCtx.drawImage(loadedImg, 0, 0);
	const outputBuffer = canvasObj.toBuffer(image.mimeType);

	res.contentType(image.mimeType);
	res.send(outputBuffer);
}

/* - - - - - - - - - - - - - - - - - - */

export {get, upload, download, process};


/* const img = await loadImage(buffer);

	// Создаем холст с размерами изображения
	const canvas = createCanvas(img.width, img.height);
	const ctx = canvas.getContext('2d');

	// Рисуем изображение на холсте
	ctx.drawImage(img, 0, 0);

	// Конвертируем холст обратно в буфер
	const outputBuffer = canvas.toBuffer(image.mimeType);

	res.contentType(image.mimeType);
	res.send(outputBuffer); */
