const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

bot.use(async () => {
    throw new Error('Awesome error');
});

bot.catch((ctx, err) => {
    console.error(ctx, err);
});
