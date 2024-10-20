import * as fs from 'fs/promises'; 
import { IBotContext } from '../../context/context.interface';
import { JobFetcher } from './job-fetcher';

export class JobWatcher {
    private intervalId: NodeJS.Timeout | null = null;
    private readonly statusFile = 'src/storage/status.json';

    constructor(private readonly jobFetcher: JobFetcher) {}

    async start(ctx: IBotContext): Promise<void> {
        if (await this.isRunning()) {
            ctx.reply('Fetching jobs is already running.');
            return;
        }

        await this.jobFetcher.fetchJobs(ctx); // Initial data load


        this.intervalId = setInterval(async () => {
            await this.jobFetcher.fetchJobs(ctx);
        }, 1000 * 60 * 1); // every 1 minute

        await this.updateStatus(true);
    }

    async stop(ctx: IBotContext): Promise<void> {
        if (!this.isRunning()) {
            ctx.reply('Fetching jobs is not running.');
            return;
        }

        clearInterval(this.intervalId as NodeJS.Timeout);
        this.intervalId = null;

        await this.updateStatus(false);
    }

    async isRunning(): Promise<boolean> {
        try {
            const data = await fs.readFile(this.statusFile, 'utf8');
            const { isRunning } = JSON.parse(data);
            return isRunning;
        } catch (error) {
            console.error('Error reading status file:', error);
            return false;
        }
    }

    private async updateStatus(isRunning: boolean): Promise<void> {
        try {
            const status = { isRunning };
            await fs.writeFile(this.statusFile, JSON.stringify(status, null, 2));
        } catch (error) {
            console.error('Error writing status file:', error);
        }
    }
}
