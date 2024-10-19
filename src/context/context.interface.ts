import { Context } from 'telegraf';

export  interface IBotContext extends Context {
    db: any;
    dj_token: string;
};