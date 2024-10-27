import path from 'path';
import fs from 'fs';

type ImageParam = {
    data: Buffer;
    width: number;
    height: number;
};

let wasmModule: any;

async function initializeWasmModule() {
	if(!wasmModule) {
		const wasmFilePath = path.resolve(__dirname, './image.wasm-processor.wasm');
		const wasmBuffer = await fs.readFileSync(wasmFilePath);

		// загружаем и инициализируем WebAssembly модуль
		const wasmInstance = await WebAssembly.instantiate(wasmBuffer, {});
		wasmModule = wasmInstance.instance.exports;
	}
}

async function processImageWasm(imageData: ImageParam, filter: string): Promise<Buffer> {
	await initializeWasmModule();

	const {data, width, height} = imageData;

	if(filter === 'gaussian-blur') {
		const filterNumber = 1;

		const kernelSize = 7;
		const sigma = 7.0;

		// выделяем память в WebAssembly
		const inputPtr = wasmModule._malloc(data.length);
		const outputPtr = wasmModule._malloc(data.length);

    	// копируем данные изображения в память WebAssembly
		wasmModule.HEAPU8.set(data, inputPtr);

		// вызываем функцию processImage из WA
		wasmModule._processImage(inputPtr, outputPtr, width, height, kernelSize, sigma, filterNumber);

		// копируем обработанный результат из памяти WebAssembly
		const outputArray = new Uint8Array(wasmModule.HEAPU8.buffer, outputPtr, data.length);

		// освобождаем выделенную память в WebAssembly
		wasmModule._free(inputPtr);
		wasmModule._free(outputPtr);

		return Buffer.from(outputArray);
	} else {
		throw new Error('Unknown filter');
	}
}

export default processImageWasm;
