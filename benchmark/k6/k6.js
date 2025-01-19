import http from 'k6/http';
import {check} from 'k6';

const HOST = 'http://app:5001';

export const options = {
	scenarios: {
		fixed_rps: {
			executor: 'constant-arrival-rate',
			rate: 1,
			timeUnit: '1s',
			duration: '10m',
			preAllocatedVUs: 1,
			maxVUs: 100,
		},
	},
};

// Читаем файл из смонтированной директории
// eslint-disable-next-line no-undef
const fileData = open('/k6/images/0.3mb.jpg', 'b'); // 'b' - для бинарного чтения

export function setup() {
	const body = http
		.post(`${HOST}/image/upload`, {image: http.file(fileData, 'mountains.jpg')})
		.json();

	return body.data;
}

export default function({id}) {
	const url = `${HOST}/image/process-native`;

	const res = http.post(
		url,
		JSON.stringify({imageId: id, filter: 'gaussian-blur'}),
		{headers: {'Content-Type': 'application/json'}}
	);

	check(res, {
		'status is 200': r => r.status === 200,
	});
}
