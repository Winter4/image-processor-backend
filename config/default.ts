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
	passwordSalt: string;
}

/* checks */
if(!process.env.NODE_ENV) throw new Error('NODE_ENV should be specified');

const config: Config = {
	nodeEnv: process.env.NODE_ENV,
	projectName: 'image-processor',
	deploy: {
		apiPort: 5001,
		frontendUrl: 'localhost',
		dbUrl: 'postgresql://dev:localpass@localhost:5400/image-processor',
		dbLogs: true,
		redisUrl: 'redis://:localpass@localhost:6300/0'
	},
	sessionSecret: 'use uuid lol',
	passwordSalt: 'this should be secure'
};

export {Config};
export default config;
