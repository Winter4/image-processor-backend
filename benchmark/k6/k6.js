import http from 'k6/http';
import {check} from 'k6';

/* = = = = = = = = = = = = = = = = = = */

const HOST = 'http://app:5001';

const methods = {
	native: 'process-native',
	wasm: 'process-wasm',
};
const METHOD = methods.native;

const images = {
	small: '0.3mb.jpg',
	large: '10mb.jpg'
};
const IMAGE = images.large;

// Читаем файл из смонтированной директории
// eslint-disable-next-line no-undef
const fileData = open(`/k6/images/${IMAGE}`, 'b'); // 'b' - для бинарного чтения

/* = = = = = = = = = = = = = = = = = = */

export const options = {
	scenarios: {
		sequential_requests: {
			executor: 'shared-iterations',
			vus: 1,
			iterations: 150,
			maxDuration: '60m',
		},
	},
};

export default function() {
	const url = `${HOST}/image/${METHOD}`;

	const res = http.post(url, {image: http.file(fileData, 'test.jpg')});

	check(res, {
		'status is 200': r => r.status === 200,
	});
}
