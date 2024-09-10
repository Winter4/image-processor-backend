import fs from 'fs';
import path from 'path';
import defaultConfig from './default';

const config = {
	...defaultConfig
};

const jsonConfigPath = path.resolve(__dirname, 'config.json');
fs.writeFileSync(jsonConfigPath, JSON.stringify(config));

export default config;
