import { Telegraf } from 'telegraf';
import { StopCommand } from './commands/stop.command';
import { StartCommand } from './commands/start.command';
import { ConfigService } from './config/config.service';
import { JobManager } from './services/job/job.manager'; // Импортируйте JobManager

class Bot {
    bot: Telegraf<any>;
    commands: any[] = [];

    constructor(private readonly configService: ConfigService) {
        this.bot = new Telegraf(this.configService.get('TG_TOKEN'));
    }

    init() {
        console.log('Bot is starting...');

        const jobManager = new JobManager(this.configService); // Создание экземпляра JobManager
        const jobWatcher = jobManager.getJobWatcher(); // Получение JobWatcher

        this.commands.push(new StartCommand(this.bot, jobWatcher));
        this.commands.push(new StopCommand(this.bot, jobWatcher));

        for (const command of this.commands) {
            command.handle();
        }

        this.bot.launch();
    }
}

const bot = new Bot(new ConfigService());
bot.init();
