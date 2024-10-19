import { Telegraf } from 'telegraf';
import { ConfigService } from '../config/config.service';

const configService = new ConfigService();
const bot = new Telegraf(configService.get('TG_TOKEN'));

bot.start((ctx) => ctx.reply('Welcome!'));
bot.command('stop', (ctx) => ctx.reply('Goodbye!'));

// Здесь добавьте остальные команды

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Передайте обновления Telegram в бот
        await bot.handleUpdate(req.body);
        res.status(200).send('OK');
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
