"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobFetcher = void 0;
class JobFetcher {
    constructor(jobDataService, jobStorage) {
        this.jobDataService = jobDataService;
        this.jobStorage = jobStorage;
    }
    fetchJobs(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobsData = this.jobStorage.readJobs();
                const ids = jobsData.map((job) => job.id);
                const allJobs = yield this.jobDataService.getJobListings();
                if (allJobs.length === 0) {
                    console.log('No jobs from the API response');
                    return;
                }
                const newJobs = this.filterNewJobs(allJobs, ids);
                if (newJobs.length === 0) {
                    console.log('No new jobs available');
                    return;
                }
                this.notifyUsers(newJobs, ctx);
                this.jobStorage.updateJobs([...newJobs, ...jobsData]);
            }
            catch (error) {
                console.error('Error fetching job data:', error);
                ctx.reply('Failed to fetch job data. Please try again later.');
            }
        });
    }
    filterNewJobs(allJobs, existingIds) {
        return allJobs.filter(job => !existingIds.includes(job.id));
    }
    notifyUsers(newJobs, ctx) {
        for (const job of newJobs) {
            const message = this.formatJobMessage(job);
            ctx.reply(message);
        }
    }
    formatJobMessage(job) {
        return `
            [Link](https://djinni.co/${job.jobLink}) 
            ${job.companyName}
            ${job.jobTitle}
            ${job.infoTags.join(', ')}
            ${job.description}
        `;
    }
}
exports.JobFetcher = JobFetcher;
