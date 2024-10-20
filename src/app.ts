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

        const PORT = Number(this.configService.get('PORT'));
        this.bot.launch({
            webhook: {
                domain: 'https://polar-taiga-55990-4eb2c6f0fedb.herokuapp.com/',
                port: PORT,
            }
        });

        console.log(`Bot is running on port ${PORT}`);
    }
}

const bot = new Bot(new ConfigService());
bot.init();
