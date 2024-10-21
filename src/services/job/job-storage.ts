import { JobModel } from '../../models/job-model.js';

export class JobStorage {
    async readJobs(): Promise<any[]> {
        try {
            const jobs = await JobModel.find();
            return jobs;
        } catch (error) {
            console.error('Error reading jobs from database:', error);
            return [];
        }
    }

    async updateJobs(jobs: any[]): Promise<void> {
        try {
            for (const job of jobs) {
                const existingJob = await JobModel.findOne({ id: job.id });
                if (existingJob) {
                    await JobModel.updateOne({ id: job.id }, job);
                    console.log(`Job with ID ${job.id} updated.`);
                } else {
                    const newJob = new JobModel(job);
                    await newJob.save();
                    console.log(`Job with ID ${job.id} added.`);
                }
            }
        } catch (error) {
            console.error('Error updating jobs in database:', error);
        }
    }
}
