"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobWatcher = void 0;
const fs = __importStar(require("fs"));
class JobWatcher {
    constructor(jobFetcher) {
        this.jobFetcher = jobFetcher;
        this.intervalId = null;
        this.statusFile = 'src/storage/status.json';
    }
    start(ctx) {
        if (this.isRunning()) {
            ctx.reply('Fetching jobs is already running.');
            return;
        }
        this.jobFetcher.fetchJobs(ctx); // Первичная загрузка данных
        this.intervalId = setInterval(() => {
            this.jobFetcher.fetchJobs(ctx);
        }, 10000); // каждые 5 минут
        this.updateStatus(true);
    }
    stop(ctx) {
        if (!this.isRunning()) {
            ctx.reply('Fetching jobs is not running.');
            return;
        }
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.updateStatus(false);
    }
    isRunning() {
        try {
            const data = fs.readFileSync(this.statusFile, 'utf8');
            const { isRunning } = JSON.parse(data);
            return isRunning;
        }
        catch (error) {
            console.error('Error reading status file:', error);
            return false;
        }
    }
    updateStatus(isRunning) {
        try {
            const status = { isRunning };
            fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
        }
        catch (error) {
            console.error('Error writing status file:', error);
        }
    }
}
exports.JobWatcher = JobWatcher;
