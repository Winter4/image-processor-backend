import type {ImageTable} from '@models/image.model';
import * as errors from '@err';

async function processImage(image: ImageTable, filter: string) {
	switch (filter) {
	case 'sharpen':
		return _applySharpen(image);
	case 'edge':
		return _applyEdgeDetection(image);
	case 'blur':
		return _applyGaussianBlur(image);
	default:
		throw new errors.InvalidRequestError();
	}
}

/* - - - - - - - - - - - - - - - - - - */

function _applySharpen(image: ImageTable) {
	const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];

	return _applyConvolution(image, weights);
};

function _applyEdgeDetection(image: ImageTable) {
	const weights = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

	return _applyConvolution(image, weights);
};

function _applyGaussianBlur(image: ImageTable) {
	const weights = [1, 2, 1, 2, 4, 2, 1, 2, 1].map(x => x / 16);

	return _applyConvolution(image, weights);
};

/* - - - - - - - - - - - - - - - - - - */

const _applyConvolution = ({width, height, data}: ImageTable, weights: number[]) => {
	const side = Math.round(Math.sqrt(weights.length));
	const halfSide = Math.floor(side / 2);

	const result: number[] = [];

	for(let y = 0; y < height; y++) {
		for(let x = 0; x < width; x++) {
			const sy = y;
			const sx = x;
			const dstOffset = (y * width + x) * 4;
			let r = 0,
				g = 0,
				b = 0;

			for(let cy = 0; cy < side; cy++) {
				for(let cx = 0; cx < side; cx++) {
					const scy = sy + cy - halfSide;
					const scx = sx + cx - halfSide;

					if(scy >= 0 && scy < height && scx >= 0 && scx < width) {
						const srcOffset = (scy * width + scx) * 4;
						const wt = weights[cy * side + cx];

						r += data[srcOffset] * wt;
						g += data[srcOffset + 1] * wt;
						b += data[srcOffset + 2] * wt;
					}
				}
			}

			result[dstOffset] = r;
			result[dstOffset + 1] = g;
			result[dstOffset + 2] = b;
			result[dstOffset + 3] = 255; // полностью непрозрачный пиксель
		}
	}

	return result;
};

/* - - - - - - - - - - - - - - - - - - */

export default processImage;
