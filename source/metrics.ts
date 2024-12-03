import {Router} from 'express';
import promClient from 'prom-client';
import fs from 'fs';
import path from 'path';

const METRICS_OUTPUT_FILE_PATH = path.join(__dirname, './metrics-output.csv');
const METRICS_HEADER = 'timestamp,cpu-usage,ram-usage\n';

const metrics = Router();

// Регистр метрик
const register = new promClient.Registry();

// Счетчики и гистограммы
const cpuLoadGauge = new promClient.Gauge({
	name: 'app_cpu_usage_microsec',
	help: 'CPU Usage in micro seconds',
});
const ramUsageGauge = new promClient.Gauge({
	name: 'app_ram_usage_bytes',
	help: 'RAM usage in bytes',
});

// Регистрация метрик
register.registerMetric(cpuLoadGauge);
register.registerMetric(ramUsageGauge);

// Создаём файл для записи метрик
fs.openSync(METRICS_OUTPUT_FILE_PATH, 'w');
const metricsOutputStream = fs.createWriteStream(METRICS_OUTPUT_FILE_PATH, {flags: 'w'});
metricsOutputStream.write(METRICS_HEADER);

// Функция для обновления метрик
function updateMetrics() {
	const cpuUsage = process.cpuUsage(); // Использование CPU
	const ramUsage = process.memoryUsage(); // Использование RAM

	const cpuLoad = cpuUsage.user + cpuUsage.system;

	// Обновляем метрики
	cpuLoadGauge.set(cpuLoad);
	ramUsageGauge.set(ramUsage.rss); // Использование памяти (Resident Set Size)

	// Пишем метрики в файл
	metricsOutputStream.write(`${Date.now()},${cpuLoad},${ramUsage.rss}\n`);
}

// Обновляем метрики каждые 1 секунду
setInterval(updateMetrics, 1000);

// Endpoint для экспорта метрик
metrics.get('/metrics', async (req, res) => {
	try {
		res.set('Content-Type', register.contentType);
		res.send(await register.metrics());
	} catch (ex) {
		res.status(500).send(`Error while fetching metrics: ${ex}`);
	}
});

export default metrics;
