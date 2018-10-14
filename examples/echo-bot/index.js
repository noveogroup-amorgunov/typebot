const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

bot.use(async ({ session, message }, next) => {
    const text = message.getText(); // Получаем сообщение пользователя
    await session.send(`You said: ${text}`); // Отсылаем его обратно
    next();
});
