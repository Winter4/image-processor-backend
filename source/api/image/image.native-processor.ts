type ImageParam = {
    data: Buffer;
    width: number;
    height: number;
}

function processImage(imageData: ImageParam, filter: string): Buffer {
	const {data, width, height} = imageData;

	// Преобразуем Buffer в Uint8ClampedArray для работы с изображением
	const inputArray = new Uint8ClampedArray(data);

	if(filter === 'gaussian-blur') {
		const kernelSize = 5;
		const sigma = 1.0;
		const kernel = createGaussianKernel(kernelSize, sigma);

		const outputArray = new Uint8ClampedArray(inputArray.length);

		// Применение Гауссова размытия
		for(let y = 0; y < height; y++) {
			for(let x = 0; x < width; x++) {
				applyKernel(inputArray, outputArray, x, y, width, height, kernel, kernelSize);
			}
		}

		// Преобразуем результат обратно в Buffer
		return Buffer.from(outputArray);
	} else {
		throw new Error('Unknown filter');
	}
}

function createGaussianKernel(size: number, sigma: number): number[] {
	const kernel: number[] = [];
	const halfSize = Math.floor(size / 2);
	const sigma2 = sigma * sigma;
	const normalization = 1 / (2 * Math.PI * sigma2);

	let sum = 0;
	for(let y = -halfSize; y <= halfSize; y++) {
		for(let x = -halfSize; x <= halfSize; x++) {
			const value = normalization * Math.exp(-(x * x + y * y) / (2 * sigma2));
			kernel.push(value);
			sum += value;
		}
	}

	// Нормализация ядра, чтобы сумма всех значений была равна 1
	return kernel.map(value => value / sum);
}

function applyKernel(
	input: Uint8ClampedArray,
	output: Uint8ClampedArray,
	x: number,
	y: number,
	width: number,
	height: number,
	kernel: number[],
	kernelSize: number
): void {
	const halfSize = Math.floor(kernelSize / 2);
	let r = 0, g = 0, b = 0;

	for(let ky = -halfSize; ky <= halfSize; ky++) {
		for(let kx = -halfSize; kx <= halfSize; kx++) {
			const iy = y + ky;
			const ix = x + kx;
			if(iy >= 0 && iy < height && ix >= 0 && ix < width) {
				const i = (iy * width + ix) * 3;  // Каждый пиксель имеет 3 канала (RGB)
				const kernelValue = kernel[(ky + halfSize) * kernelSize + (kx + halfSize)];

				r += input[i] * kernelValue;
				g += input[i + 1] * kernelValue;
				b += input[i + 2] * kernelValue;
			}
		}
	}

	const i = (y * width + x) * 3;
	output[i] = r;
	output[i + 1] = g;
	output[i + 2] = b;
}

/* - - - - - - - - - - - - - - - - - - */

export default processImage;
