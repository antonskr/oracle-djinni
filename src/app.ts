import { Telegraf } from 'telegraf';
import { StopCommand } from './commands/stop.command';
import { StartCommand } from './commands/start.command';
import { ConfigService } from './config/config.service';
import { JobManager } from './services/job/job.manager';

class Bot {
    bot: Telegraf<any>;
    commands: any[] = [];

    constructor(private readonly configService: ConfigService) {
        this.bot = new Telegraf(this.configService.get('TG_TOKEN'));
    }

    init() {
        console.log('Bot is starting...');

        const jobManager = new JobManager(this.configService);
        const jobWatcher = jobManager.getJobWatcher();

        this.commands.push(new StartCommand(this.bot, jobWatcher));
        this.commands.push(new StopCommand(this.bot, jobWatcher));

        for (const command of this.commands) {
            command.handle();
        }
    }

    async setWebhook() {
        const webhookUrl = `${this.configService.get('VERCEL_URL')}/api/webhook`;
        await this.bot.telegram.setWebhook(webhookUrl);
        this.bot.launch({
            webhook: {
                domain: this.configService.get('VERCEL_URL'),
                hookPath: '/api/webhook',
                port: 3000
            }
        });
    }
}

const bot = new Bot(new ConfigService());
bot.init();
bot.setWebhook();
