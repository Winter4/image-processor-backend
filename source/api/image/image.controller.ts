import {Request, Response} from 'express';
import {createHash} from 'crypto';
import fs from 'fs';
import sharp from 'sharp';

import * as errors from '@err';

import Image from '@models/image.model';
import processImageNative from './image.native-processor';
import processImageWasm from './image.wasm-processor';

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

async function _process(req: Request) {
	const {imageId, filter} = req.body;
	if(!imageId || !filter) throw new errors.InvalidRequestError();

	const image = await Image.getOne({id: imageId});
	if(!image) throw new errors.NotFoundError('Image');

	return {
		image,
		sharp: await sharp(image.data)
			.raw()
			.toBuffer({resolveWithObject: true})
	};
}

async function processNative(req: Request, res: Response) {
	const {image, sharp: {data: rawImageData, info: {width, height, channels}}} = await _process(req);

	const processedBuffer = processImageNative({data: rawImageData, width, height}, req.body.filter);

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

async function processWasm(req: Request, res: Response) {
	const {image, sharp: {data: rawImageData, info: {width, height, channels}}} = await _process(req);

	const processedBuffer = await processImageWasm({data: rawImageData, width, height}, req.body.filter);

	// После обработки создаём новое изображение
	const outputBuffer = await sharp(processedBuffer, {
		raw: {
			width,
			height,
			channels,
		}
	}).jpeg().toBuffer();

	res.contentType(image.mimeType);
	res.send(outputBuffer);
}

async function processNativeDirect(req: Request, res: Response) {
	const {file} = req;
	if(!file) throw new errors.InvalidRequestError('Request should contain a file to upload');

	const image = await sharp(file.path);

	const {width, height, channels} = await image.metadata();
	if(!width || !height || !channels) throw new errors.InvalidParamsError('Could not get image metadata');

	const processedBuffer = processImageNative({data: await image.raw().toBuffer(), width, height}, 'gaussian-blur');

	// После обработки создаём новое изображение
	const outputBuffer = await sharp(processedBuffer, {
		raw: {
			width,
			height,
			channels,
		}
	}).jpeg().toBuffer();

	res.contentType(file.mimetype);
	res.send(outputBuffer);
}

async function processWasmDirect(req: Request, res: Response) {
	const {file} = req;
	if(!file) throw new errors.InvalidRequestError('Request should contain a file to upload');

	const image = await sharp(file.path);

	const {width, height, channels} = await image.metadata();
	if(!width || !height || !channels) throw new errors.InvalidParamsError('Could not get image metadata');

	const processedBuffer = await processImageWasm({data: await image.raw().toBuffer(), width, height}, 'gaussian-blur');

	// После обработки создаём новое изображение
	const outputBuffer = await sharp(processedBuffer, {
		raw: {
			width,
			height,
			channels,
		}
	}).jpeg().toBuffer();

	res.contentType(file.mimetype);
	res.send(outputBuffer);
}

/* - - - - - - - - - - - - - - - - - - */

export {get, upload, download, processNative, processWasm, processNativeDirect, processWasmDirect};
