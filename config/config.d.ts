export type NodeEnv = 'development' | 'production';

type Config = {
	nodeEnv: NodeEnv;
	projectName: string;
	deploy: {
		apiPort: number;
		frontendUrl: string;
		dbUrl: string;
		dbLogs: boolean;
		redisUrl: string;
	};
	maxImageSizeBytes: number;
}

export default Config;
