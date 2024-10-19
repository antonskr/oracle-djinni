import * as fs from 'fs';

export class JobStorage {
    private readonly filePath = 'src/storage/data.json';

    readJobs(): any[] {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading jobs file:', error);
            return [];
        }
    }

    updateJobs(jobs: any[]): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(jobs, null, 2));
        } catch (error) {
            console.error('Error writing jobs file:', error);
        }
    }
}
