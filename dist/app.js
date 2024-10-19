"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const stop_command_1 = require("./commands/stop.command");
const start_command_1 = require("./commands/start.command");
const config_service_1 = require("./config/config.service");
const job_manager_1 = require("./services/job/job.manager"); // Импортируйте JobManager
class Bot {
    constructor(configService) {
        this.configService = configService;
        this.commands = [];
        this.bot = new telegraf_1.Telegraf(this.configService.get('TG_TOKEN'));
    }
    init() {
        console.log('Bot is starting...');
        const jobManager = new job_manager_1.JobManager(this.configService); // Создание экземпляра JobManager
        const jobWatcher = jobManager.getJobWatcher(); // Получение JobWatcher
        this.commands.push(new start_command_1.StartCommand(this.bot, jobWatcher));
        this.commands.push(new stop_command_1.StopCommand(this.bot, jobWatcher));
        for (const command of this.commands) {
            command.handle();
        }
        this.bot.launch();
    }
}
const bot = new Bot(new config_service_1.ConfigService());
bot.init();
