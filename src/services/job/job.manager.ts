import { ConfigService } from '../../config/config.service';
import { JobDataService } from './job.service';
import { JobStorage } from './job-storage';
import { JobFetcher } from './job-fetcher';
import { JobWatcher } from './job-watcher';

export class JobManager {
    private jobDataService: JobDataService;
    private jobStorage: JobStorage;
    private jobFetcher: JobFetcher;
    private jobWatcher: JobWatcher;
    constructor(private readonly configService: ConfigService) {
        this.jobDataService = new JobDataService(this.configService.get('DJ_TOKEN'));
        this.jobStorage = new JobStorage();
        this.jobFetcher = new JobFetcher(this.jobDataService, this.jobStorage);
        this.jobWatcher = new JobWatcher(this.jobFetcher);
    }

    getJobWatcher() {
        return this.jobWatcher;
    }
}