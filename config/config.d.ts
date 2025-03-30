export type NodeEnv = 'development' | 'production';

type Config = {
	nodeEnv: NodeEnv;
	projectName: string;
	deploy: {
		apiPort: number;
		frontendUrl: string;
	};
}

export default Config;
