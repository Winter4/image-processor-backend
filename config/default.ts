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
	sessionSecret: string;
}

/* checks */
if(!process.env.NODE_ENV) throw new Error('NODE_ENV should be specified');

const config: Config = {
	nodeEnv: process.env.NODE_ENV,
	projectName: 'project',
	deploy: {
		apiPort: 5001,
		frontendUrl: 'localhost',
		dbUrl: 'postgresql://dev:localpass@localhost:5400/dbname',
		dbLogs: false,
		redisUrl: 'redis://:localpass@localhost:6300/0'
	},
	sessionSecret: 'use uuid lol'
};

export {Config};
export default config;
