"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
class ConfigService {
    constructor() {
        const { error, parsed } = (0, dotenv_1.config)();
        if (error || !parsed)
            throw new Error(`ConfigService: ${error}`);
        this.config = parsed;
    }
    get(key) {
        if (!this.config[key])
            throw new Error(`ConfigService: ${key} not found`);
        return this.config[key];
    }
}
exports.ConfigService = ConfigService;
