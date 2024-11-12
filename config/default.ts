import type Config from './config.d';
import type {NodeEnv} from './config.d';

/* checks */
if(!(process.env.NODE_ENV && ['development', 'production'].includes(process.env.NODE_ENV))) {
	throw new Error('NODE_ENV should one of: [development, production]');
}

const config: Config = {
	nodeEnv: process.env.NODE_ENV as NodeEnv,
	projectName: 'image-processor',
	deploy: {
		apiPort: 5001,
		frontendUrl: 'http://localhost:3000',
		dbUrl: 'postgresql://dev:localpass@postgres:5432/image-processor',
		dbLogs: false,
		redisUrl: 'redis://:localpass@localhost:6300/0'
	}
};

export default config;
