"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobManager = void 0;
const job_service_1 = require("./job.service");
const job_storage_1 = require("./job-storage");
const job_fetcher_1 = require("./job-fetcher");
const job_watcher_1 = require("./job-watcher");
class JobManager {
    constructor(configService) {
        this.configService = configService;
        this.jobDataService = new job_service_1.JobDataService(this.configService.get('DJ_TOKEN'));
        this.jobStorage = new job_storage_1.JobStorage();
        this.jobFetcher = new job_fetcher_1.JobFetcher(this.jobDataService, this.jobStorage);
        this.jobWatcher = new job_watcher_1.JobWatcher(this.jobFetcher);
    }
    getJobWatcher() {
        return this.jobWatcher;
    }
}
exports.JobManager = JobManager;
