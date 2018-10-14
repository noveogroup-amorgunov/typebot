const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

bot.use(async (ctx, next) => {
    const start = Date.now();

    await next();

    const end = Math.round((Date.now() - start) / 1000);

    console.log(`Request is handled for about ${end}sec`);
});

bot.use(async (ctx) => {
    // Генерируем таймаут случайным образом
    const timeout = Math.round(Math.random() * 10) * 1000;

    await sleep(timeout);

    ctx.session.send(`timeout ${timeout}ms`);
});
