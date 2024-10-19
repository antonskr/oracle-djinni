import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;

    constructor() {
        const { error, parsed } = config();
        if (error || !parsed) throw new Error(`ConfigService: ${error}`);
        this.config = parsed;
    }
 
    get(key: string): string {
        if (!this.config[key]) throw new Error(`ConfigService: ${key} not found`);
        return this.config[key];
    }
}