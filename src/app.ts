import { Telegraf } from 'telegraf';
import { StopCommand } from './commands/stop.command';
import { StartCommand } from './commands/start.command';
import { ConfigService } from './config/config.service';
import { JobManager } from './services/job/job.manager';
import { DatabaseConnection } from './services/db-connection';

class Bot {
    bot: Telegraf<any>;
    commands: any[] = [];

    constructor(private readonly configService: ConfigService) {
        this.bot = new Telegraf(this.configService.get('TG_TOKEN'));
    }

    async init() {  
        const jobManager = new JobManager(this.configService);
        const jobWatcher = jobManager.getJobWatcher();
        
        this.commands = [
            new StartCommand(this.bot, jobWatcher, DatabaseConnection.getInstance(this.configService)),
            new StopCommand(this.bot, jobWatcher, DatabaseConnection.getInstance(this.configService))
        ];

        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch();
    }
}

const bot = new Bot(new ConfigService());
bot.init();

module.exports = bot;