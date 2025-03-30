import http from 'k6/http';
import {check} from 'k6';

/* = = = = = = = = = = = = = = = = = = */

const HOST = 'http://app:5001';

const methods = {
	nativeDb: 'process-native',
	nativeDirect: 'process-native-direct',
	wasmDb: 'process-wasm',
	wasmDirect: 'process-wasm-direct'
};
const METHOD = methods.wasmDirect;

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

export function setup() {
	const body = http
		.post(`${HOST}/image/upload`, {image: http.file(fileData, 'test.jpg')})
		.json();

	return body.data;
}

const useDbMethod = (url, id) => () =>
	http.post(
		url,
		JSON.stringify({imageId: id, filter: 'gaussian-blur'}),
		{headers: {'Content-Type': 'application/json'}}
	);

const useDirectMethod = url => () =>
	http
		.post(url, {image: http.file(fileData, 'test.jpg')});

export default function({id}) {
	const url = `${HOST}/image/${METHOD}`;

	const direct = METHOD === methods.nativeDirect || METHOD === methods.wasmDirect;
	const func = direct ? useDirectMethod(url) : useDbMethod(url, id);

	const res = func();

	check(res, {
		'status is 200': r => r.status === 200,
	});
}
