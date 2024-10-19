import { Command } from './command.class';
import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { JobWatcher } from '../services/job/job-watcher';

export class StartCommand extends Command {
    private jobWatcher: JobWatcher;

    constructor(bot: Telegraf<IBotContext>, jobWatcher: JobWatcher) {
        super(bot);
        this.jobWatcher = jobWatcher;
    }

    handle(): void {
        this.bot.command('start', async (ctx) => {
            this.jobWatcher.start(ctx); // Запуск слежения за вакансиями
            ctx.reply('Job data fetching started.');
        });
    }
}
