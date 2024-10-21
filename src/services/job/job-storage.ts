import logger from '../logger.js';
import { Job, JobModel } from '../../models/job-model.js';


export class JobStorage {
    async readJobs(): Promise<Job[]> {
        try {
            const jobs = await JobModel.find();
            return jobs;
        } catch (error) {
            logger.error('Error reading jobs from database:', error);
            return [];
        }
    }

    async updateJobs(jobs: Job[]): Promise<void> {
        try {
            for (const job of jobs) {
                const existingJob = await JobModel.findOne({ id: job.id });
                if (existingJob) {
                    await JobModel.updateOne({ id: job.id }, job);
                    logger.info(`Job with ID ${job.id} updated.`);
                } else {
                    const newJob = new JobModel(job);
                    await newJob.save();
                    logger.info(`Job with ID ${job.id} added.`);
                }
            }
        } catch (error) {
            logger.error('Error updating jobs in database:', error);
        }
    }
}
