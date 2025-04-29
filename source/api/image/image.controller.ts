import {Request, Response} from 'express';
import sharp from 'sharp';

import * as errors from '@err';

import processImageNative from './image.native-processor';
import processImageWasm from './image.wasm-processor';

/* - - - - - - - - - - - - - - - - - - */

type ProcessFunction = (data: Buffer, width: number, height: number) => Buffer | Promise<Buffer>;

async function _process(req: Request, res: Response, process: ProcessFunction) {
	const {file} = req;
	if(!file) throw new errors.InvalidRequestError('Request should contain a file to upload');

	// console.time('pre');
	const image = await sharp(file.path, {limitInputPixels: 858_000_000});

	const {width, height, channels} = await image.metadata();
	if(!width || !height || !channels) throw new errors.InvalidParamsError('Could not get image metadata');
	// console.timeEnd('pre');

	// console.time('process');
	const processedBuffer = await process((await image.raw().toBuffer()), width, height);
	// console.timeEnd('process');

	// console.time('post');
	// После обработки создаём новое изображение
	const outputBuffer = await sharp(processedBuffer, {
		raw: {
			width,
			height,
			channels,
		},
		limitInputPixels: 858_000_000
	}).jpeg().toBuffer();
	// console.timeEnd('post');

	res.contentType(file.mimetype);
	res.send(outputBuffer);
}

function processNative(req: Request, res: Response) {
	return _process(req, res, processImageNative);
}

async function processWasmSinglethread(req: Request, res: Response) {
	return _process(req, res, processImageWasm('single'));
}

async function processWasmMultithread(req: Request, res: Response) {
	return _process(req, res, processImageWasm('multi'));
}

/* - - - - - - - - - - - - - - - - - - */

export {processNative, processWasmSinglethread, processWasmMultithread};
