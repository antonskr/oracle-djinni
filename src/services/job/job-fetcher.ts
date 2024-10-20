import { IBotContext } from '../../context/context.interface';
import { JobDataService } from './job.service';
import { JobStorage } from './job-storage';

export class JobFetcher {
    constructor(
        private jobDataService: JobDataService,
        private jobStorage: JobStorage
    ) {}

    async fetchJobs(ctx: IBotContext): Promise<void> {
        try {
            const jobsData = this.jobStorage.readJobs();
            const ids = jobsData.map((job: any) => job.id);

            const allJobs = await this.jobDataService.getJobListings();
            if (allJobs.length === 0) {
                console.log('No jobs from the API response');
                return;
            }

            const newJobs = this.filterNewJobs(allJobs, ids);
            if (newJobs.length === 0) {
                console.log('No new jobs available', jobsData);
                return;
            }

            this.notifyUsers(newJobs, ctx);
            this.jobStorage.updateJobs([...newJobs, ...jobsData]);

        } catch (error) {
            console.error('Error fetching job data:', error);
            ctx.reply('Failed to fetch job data. Please try again later.');
        }
    }

    private filterNewJobs(allJobs: any[], existingIds: any[]): any[] {
        return allJobs.filter(job => !existingIds.includes(job.id));
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
