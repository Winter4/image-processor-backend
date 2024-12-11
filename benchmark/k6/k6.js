import http from 'k6/http';
import {check} from 'k6';
// import {readFileSync} from 'k6/fs';

export const options = {
	vus: 10,         // Количество виртуальных пользователей
	duration: '1m',  // Время нагрузки (1 минута)
};

/* export default function () {
	// Читаем файл из смонтированной директории
	const fileData = readFileSync('/k6/images/mountains.jpg', 'b'); // 'b' - для бинарного чтения

	// Создаём payload для multipart-запроса
	const payload = {
		image: http.file(fileData, 'mountains.jpg')
	};
	const headers = {
		'Content-Type': 'multipart/form-data',
	};

	const url = 'http://app:5001/image/upload';
	const res = http.post(url, payload, {headers});

	check(res, {
		'status is 200': r => r.status === 200,
	});
} */

export default function() {
	const url = 'http://app:5001/ping/';
	const res = http.get(url);

	check(res, {
		'status is 200': r => r.status === 200
	});
}
