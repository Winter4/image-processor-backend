import http from 'k6/http';
import {check} from 'k6';

export const options = {
	vus: 10,         // Количество виртуальных пользователей (aka RPS)
	duration: '10s',  // Время нагрузки
};

// Читаем файл из смонтированной директории
// eslint-disable-next-line no-undef
const fileData = open('/k6/images/mountains.jpg', 'b'); // 'b' - для бинарного чтения

// Создаём payload для multipart-запроса
const payload = {
	image: http.file(fileData, 'mountains.jpg')
};
const url = 'http://app:5001/image/upload';

export default function () {
	const res = http.post(url, payload);

	check(res, {
		'status is 200': r => r.status === 200,
	});
}

/* export default function() {
	const url = 'http://app:5001/ping/';
	const res = http.get(url);

	check(res, {
		'status is 200': r => r.status === 200
	});
} */
