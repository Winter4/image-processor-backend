type Config = {
	nodeEnv: string;
	projectName: string;
	deploy: {
		apiPort: number;
		frontendUrl: string;
		dbUrl: string;
		dbLogs: boolean;
		redisUrl: string;
	};
}

/* checks */
if(!process.env.NODE_ENV) throw new Error('NODE_ENV should be specified');

const config: Config = {
	nodeEnv: process.env.NODE_ENV,
	projectName: 'image-processor',
	deploy: {
		apiPort: 5001,
		frontendUrl: 'http://localhost:3000',
		dbUrl: 'postgresql://dev:localpass@localhost:5400/image-processor',
		dbLogs: false,
		redisUrl: 'redis://:localpass@localhost:6300/0'
	}
};

export {Config};
export default config;
