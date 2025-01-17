import fs from 'fs';
import path from 'path';

const METRICS_OUTPUT_FILE_PATH = path.join(__dirname, './metrics-output.csv');
const METRICS_HEADER = 'timestamp,cpu-usage,ram-usage\n';

// Создаём файл для записи метрик
fs.openSync(METRICS_OUTPUT_FILE_PATH, 'w');
const metricsOutputStream = fs.createWriteStream(METRICS_OUTPUT_FILE_PATH, {flags: 'w'});
metricsOutputStream.write(METRICS_HEADER);

// Функция для обновления метрик
function updateMetrics() {
	const cpuUsage = process.cpuUsage(); // Использование CPU
	const ramUsage = process.memoryUsage(); // Использование RAM

	const cpuLoad = cpuUsage.user + cpuUsage.system;

	// Пишем метрики в файл
	metricsOutputStream.write(`${Date.now()},${cpuLoad},${ramUsage.rss}\n`);
}

// Обновляем метрики каждые 5 секунд
setInterval(updateMetrics, 5000);
