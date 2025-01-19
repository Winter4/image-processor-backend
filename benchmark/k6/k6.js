import http from 'k6/http';
import {check} from 'k6';

const HOST = 'http://app:5001';

export const options = {
	scenarios: {
		fixed_rps: {
			executor: 'constant-arrival-rate',
			rate: 3,
			timeUnit: '1s',
			duration: '3m',
			preAllocatedVUs: 1,
			maxVUs: 100,
		},
	},
};

// Читаем файл из смонтированной директории
// eslint-disable-next-line no-undef
const fileData = open('/k6/images/0.3mb.jpg', 'b'); // 'b' - для бинарного чтения

export default function() {
	const url = `${HOST}/image/process-native-direct`;

	const res = http
		.post(url, {image: http.file(fileData, 'mountains.jpg')});

	check(res, {
		'status is 200': r => r.status === 200,
	});
}
