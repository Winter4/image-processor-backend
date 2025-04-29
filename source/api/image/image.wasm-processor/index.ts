/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';
import path from 'path';

import initSinglethreadModule from './singlethread';
import initMultithreadModule from './multithread';

/* - - - - - - - - - - - - - - - - - - */

type ModuleType = 'single' | 'multi';

type MemoryPointer = any;

type WasmModule = {
	HEAPU8: {
		buffer: Buffer,
		set: (data: Buffer, pointer: MemoryPointer) => void
	};
	_malloc: (length: number) => MemoryPointer;
	_free: (pointer: MemoryPointer) => void;
	_processImage: (inputPointer: MemoryPointer, outputPointer: MemoryPointer, width: number, height: number, kernelSize: number, sigma: number) => void
};

/* - - - - - - - - - - - - - - - - - - */

const modules: {
	single: WasmModule | null,
	multi: WasmModule | null
} = {
	single: null,
	multi: null
};

const initializers = {
	single: initSinglethreadModule,
	multi: initMultithreadModule
};

const pathes = {
	single: path.join(__dirname, 'singlethread', 'singlethread.wasm'),
	multi: path.join(__dirname, 'multithread', 'multithread.wasm'),
};

async function initializeWasmModule(type: ModuleType) {
	if(!modules[type]) {
		modules[type] = await initializers[type]({
			wasmBinary: fs.readFileSync(pathes[type])
		});
	}
}

/* - - - - - - - - - - - - - - - - - - */

async function _process(type: ModuleType, data: Buffer, width: number, height: number): Promise<Buffer> {
	await initializeWasmModule(type);

	const module = modules[type] as WasmModule;
	if(!module) throw new Error('Module initialize error: module is null. Check the initializer');

	const kernelSize = 7;
	const sigma = 7.0;

	// выделяем память в WebAssembly
	const inputPtr = module._malloc(data.length);
	const outputPtr = module._malloc(data.length);

	// копируем данные изображения в память WebAssembly
	module.HEAPU8.set(data, inputPtr);

	// вызываем функцию processImage из WA
	module._processImage(inputPtr, outputPtr, width, height, kernelSize, sigma);

	// копируем обработанный результат из памяти WebAssembly
	const outputArray = new Uint8Array(module.HEAPU8.buffer, outputPtr, data.length);

	// освобождаем выделенную память в WebAssembly
	module._free(inputPtr);
	module._free(outputPtr);

	return Buffer.from(outputArray);
}

function processImage(type: ModuleType) {
	return function(data: Buffer, width: number, height: number): Promise<Buffer> {
		return _process(type, data, width, height);
	};
}

export default processImage;
