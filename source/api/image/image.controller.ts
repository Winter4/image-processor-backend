import {Request, Response} from 'express';
import {createHash} from 'crypto';
import fs from 'fs';
import sharp from 'sharp';

import * as errors from '@err';

import Image from '@models/image.model';
import processImage from './image.native-processor';

/* - - - - - - - - - - - - - - - - - - */

async function get(req: Request, res: Response) {
	const result = await Image.getMany({}, {select: ['title', 'id', 'created']});
	res.json({data: result});
}

async function upload(req: Request, res: Response) {
	const {file} = req;
	if(!file) throw new errors.InvalidRequestError('Request should contain a file to upload');

	const buffer = fs.readFileSync(file.path);
	const {width, height} = await sharp(buffer).metadata();
	if(!width || !height) throw new errors.InvalidRequestError('Can not get image WxH');

	const result = await Image.create({
		title: file.originalname,
		data: buffer,
		mimeType: file.mimetype,
		handleType: 'original',
		md5: createHash('md5').update(buffer).digest('hex'),
		width,
		height
	}, ['id', 'title']);

	fs.unlinkSync(file.path);

	res.json({data: result});
}

async function download(req: Request, res: Response) {
	const {imageId} = req.params;
	if(!imageId) throw new errors.InvalidRequestError;

	const image = await Image.getOne({id: imageId}, {select: ['data', 'mimeType']});
	if(!image) throw new errors.NotFoundError('Image');

	res.contentType(image.mimeType);
	res.send(image.data);
}

async function processNative(req: Request, res: Response) {
	const {imageId, filter} = req.body;
	if(!imageId || !filter) throw new errors.InvalidRequestError();

	const image = await Image.getOne({id: imageId});
	if(!image) throw new errors.NotFoundError('Image');

	// Используем sharp для получения несжатых данных изображения
	const {data: rawImageData, info: {width, height, channels}} = await sharp(image.data)
		.raw()
		.toBuffer({resolveWithObject: true});

	const processedBuffer = processImage({data: rawImageData, width, height}, filter);

	  // После обработки создаём новое изображение
	const outputBuffer = await sharp(processedBuffer, {
		raw: {
			width,
			height,
			channels,
		}
	}).jpeg().toBuffer();  // Или .png() для PNG-формата

	res.contentType(image.mimeType);
	res.send(outputBuffer);
}

/* - - - - - - - - - - - - - - - - - - */

export {get, upload, download, processNative};
