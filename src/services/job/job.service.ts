import { parse } from 'node-html-parser';

export class JobDataService {
    constructor(private readonly token: string) {}

    async getJobListings(): Promise<any[]> {
        const html = await this.fetchJobData();
        return this.parseJobItems(html);
    }

    private async fetchJobData(): Promise<string> {
        const response = await fetch('https://djinni.co/my/dashboard/', {
            method: 'GET',
            headers: { 'cookie': this.token }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.text();
    }

    private parseJobItems(html: string): any[] {
        const root = parse(html);
        const list = root.querySelector('.list-unstyled');
        const items = list?.querySelectorAll('li') || [];
        const jobs = [];

        for (const item of items) {
            const id = item.getAttribute('id');
            const companyName = item.querySelector('.text-body')?.text.replace(/\n/g, '').trim();
            const info = item.querySelector('.fw-medium');
            const infoTags = Array.from(info?.querySelectorAll('.text-nowrap') || []).map(tag => tag?.text.replace(/\n/g, '').trim());
            const jobData = item.querySelector('.job-item__title-link');
            const jobTitle = jobData?.text.replace(/\n/g, '').trim();
            const jobLink = jobData?.getAttribute('href');
            const description = item.querySelector('.js-truncated-text')?.text;

            if (companyName && infoTags.length && jobTitle && jobLink && description) {
                jobs.push({
                    id,
                    companyName,
                    jobTitle,
                    jobLink,
                    infoTags,
                    description,
                });
            }
        }

        return jobs;
    }
}
