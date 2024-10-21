import { Telegraf } from 'telegraf';
import { StopCommand } from './commands/stop.command';
import { StartCommand } from './commands/start.command';
import { ConfigService } from './config/config.service';
import { JobManager } from './services/job/job.manager'; // Импортируйте JobManager
import { DatabaseConnection } from './services/db-connection'; // Импортируйте DatabaseConnection

class Bot {
    bot: Telegraf<any>;
    commands: any[] = [];

    constructor(private readonly configService: ConfigService) {
        this.bot = new Telegraf(this.configService.get('TG_TOKEN'));
    }

    async init() {  
        const jobManager = new JobManager(this.configService); // Измените конструктор
        const jobWatcher = jobManager.getJobWatcher(); // Получение JobWatcher
        this.commands.push(new StartCommand(this.bot, jobWatcher, DatabaseConnection.getInstance(this.configService))); // Передача экземпляра
        this.commands.push(new StopCommand(this.bot, jobWatcher, DatabaseConnection.getInstance(this.configService))); // Передача экземпляра

        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch();
    }
}

const bot = new Bot(new ConfigService());
bot.init();

module.exports = bot;