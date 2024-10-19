import { Command } from './command.class';
import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { JobWatcher } from '../services/job/job-watcher';

export class StopCommand extends Command {
    private jobWatcher: JobWatcher;

    constructor(bot: Telegraf<IBotContext>, jobWatcher: JobWatcher) {
        super(bot);
        this.jobWatcher = jobWatcher;
    }

    handle(): void {
        this.bot.command('stop', async (ctx) => {
            this.jobWatcher.stop(ctx); // Остановка процесса отслеживания
            ctx.reply('Job data fetching stopped.');
        });
    }
}
