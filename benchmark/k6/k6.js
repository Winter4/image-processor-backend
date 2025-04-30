import http from 'k6/http';
import {check} from 'k6';

/* = = = = = = = = = = = = = = = = = = */

const HOST = 'http://localhost:5001';

const methods = {
	native: 'process-native',
	wasm: {
		single: 'process-wasm-single',
		multi: 'process-wasm-multi'
	}
};
const METHOD = methods.wasm.single;

const images = {
	small: '0.3mb.jpg',
	large: '10mb.jpg'
};
const IMAGE = images.small;

// Читаем файл из смонтированной директории
// eslint-disable-next-line no-undef
const fileData = open(`/k6/images/${IMAGE}`, 'b'); // 'b' - для бинарного чтения

/* = = = = = = = = = = = = = = = = = = */

export const options = {
	scenarios: {
		sequential_requests: {
			executor: 'shared-iterations',
			vus: 1,
			iterations: 15,
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
