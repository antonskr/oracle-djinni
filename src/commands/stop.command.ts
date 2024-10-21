import { Command } from './command.class';
import { Telegraf } from 'telegraf';
import { IBotContext } from '../context/context.interface';
import { JobWatcher } from '../services/job/job-watcher';
import { DatabaseConnection } from '../services/db-connection';

export class StopCommand extends Command {
    private jobWatcher: JobWatcher;
    private dbConnection: DatabaseConnection;

    constructor(bot: Telegraf<IBotContext>, jobWatcher: JobWatcher, dbConnection: DatabaseConnection) {
        super(bot);
        this.jobWatcher = jobWatcher;
        this.dbConnection = dbConnection; 
    }

    handle(): void {
        this.bot.command('stop', async (ctx) => {
            await this.dbConnection.disconnect()         // disconnect from the database
            this.jobWatcher.stop(ctx);                    // stop job watcher
            ctx.reply('Job data fetching stopped.');
        });
    }
}
