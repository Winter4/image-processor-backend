import {Router} from 'express';
import promClient from 'prom-client';

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

// Функция для обновления метрик
function updateMetrics() {
	const cpuUsage = process.cpuUsage(); // Использование CPU
	const ramUsage = process.memoryUsage(); // Использование RAM

	const cpuLoad = cpuUsage.user + cpuUsage.system;

	// Обновляем метрики
	cpuLoadGauge.set(cpuLoad);
	ramUsageGauge.set(ramUsage.rss); // Использование памяти (Resident Set Size)
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
