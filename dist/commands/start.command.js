"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartCommand = void 0;
const command_class_1 = require("./command.class");
class StartCommand extends command_class_1.Command {
    constructor(bot, jobWatcher) {
        super(bot);
        this.jobWatcher = jobWatcher;
    }
    handle() {
        this.bot.command('start', (ctx) => __awaiter(this, void 0, void 0, function* () {
            this.jobWatcher.start(ctx); // Запуск слежения за вакансиями
            ctx.reply('Job data fetching started.');
        }));
    }
}
exports.StartCommand = StartCommand;
