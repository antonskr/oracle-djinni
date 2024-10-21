import { Job } from '../../models/job-model';
import { JobStorage } from './job-storage';
import { IBotContext } from '../../context/context.interface';
import { JobDataService } from './job.service';
import logger from '../logger';

export class JobFetcher {
    constructor(
        private jobDataService: JobDataService,
        private jobStorage: JobStorage,
    ) {}

    async fetchJobs(ctx: IBotContext): Promise<void> {
        try {
            const jobsData = await this.jobStorage.readJobs();
            const ids = jobsData.map((job: Job) => job.id);

            const allDjinniJobs = await this.jobDataService.getJobListings();
            if (allDjinniJobs.length === 0) {
                logger.error('No jobs from the Djinni API');
                return;
            }

            const newJobs = this.filterNewJobs(allDjinniJobs, ids);
            if (newJobs.length === 0) {
                logger.info('No new jobs available');
                return;
            }

            this.notifyUsers(newJobs, ctx);
            this.jobStorage.updateJobs(newJobs);

        } catch (error) {
            logger.error('Error fetching job data:', error);
            ctx.reply('Failed to fetch job data. Please try again later.');
        }
    }

    private filterNewJobs(allDjinniJobs: any[], existingIds: any[]): any[] {
        return allDjinniJobs.filter(job => !existingIds.includes(job.id));
    }

    private notifyUsers(newJobs: any[], ctx: IBotContext): void {
        for (const job of newJobs) {
            const message = this.formatJobMessage(job);
            ctx.reply(message);
        }
    }

    private formatJobMessage(job: any): string {
        return `
        [Link](https://djinni.co/${job.jobLink}) 
        ${job.companyName}
        ${job.jobTitle}
        ${job.infoTags.join(', ')}
        ${job.description}`;
    }
}
