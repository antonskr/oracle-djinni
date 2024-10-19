"use strict";
// import * as fs from 'fs';
// import { Command } from './command.class';
// import { Telegraf } from 'telegraf';
// import { JobWatcher } from '../services/job-watcher.class'; // Import the new service
// import { IBotContext } from '../context/context.interface';
// import { IConfigService } from '../config/config.interface';
// import {JobDataService} from '../services/job.service.class';
// export class StarStoptCommand extends Command {
//     private jobDataService: JobDataService;
//     private jobWatcher: JobWatcher;
//     constructor(bot: Telegraf<IBotContext>, private readonly configService: IConfigService) {
//         super(bot);
//         const token = this.configService.get('DJ_TOKEN');
//         this.jobDataService = new JobDataService(token);
//         // Передача метода fetchJobs в JobWatcher
//         this.jobWatcher = new JobWatcher(this.fetchJobs.bind(this));
//     }
//     handle(): void {
//         this.bot.command('start', async (ctx) => {
//             this.jobWatcher.start(ctx); // Запуск слежения за вакансиями
//         });
//         this.bot.command('stop', async (ctx) => {
//             this.jobWatcher.stop(ctx); // Остановка процесса отслеживания
//             ctx.reply('Job data fetching stopped.');
//         });
//     }
//     private async fetchJobs(ctx: IBotContext): Promise<void> {
//         try {
//             let newJobs = await this.jobDataService.getJobListings();
//             // Чтение локального файла с вакансиями
//             const data = fs.readFileSync('src/storage/data.json', 'utf8');
//             const jobsData = JSON.parse(data);
//             const ids = jobsData.map((job: any) => job.id);
//             // Фильтрация новых вакансий
//             const isJobNew = (job: any) => !ids.includes(job.id);
//             if (newJobs.length === 0) {
//                 console.log('No new jobs available');
//                 return;
//             } else {
//                 newJobs = newJobs.filter(isJobNew);
//                 for (const job of newJobs) {
//                     const message = this.createMessage(job);
//                     ctx.reply(message);
//                 }
//                 console.log('New jobs:', newJobs);
//                 const updatedJobs = [...newJobs, ...jobsData];
//                 fs.writeFileSync('src/storage/data.json', JSON.stringify(updatedJobs, null, 2));
//             }
//         } catch (error) {
//             console.error('Error fetching job data:', error);
//             ctx.reply('Failed to fetch job data. Please try again later.');
//         }
//     }
//     private createMessage(job: any): string {
//         return `
//             [Link](https://djinni.co/${job.jobLink}) 
//             ${job.companyName}
//             ${job.jobTitle}
//             ${job.infoTags.join(', ')}
//             ${job.description}
//         `;
//     }
// }
