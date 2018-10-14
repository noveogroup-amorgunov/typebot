const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

bot.initialState = { asking: false, name: null };

if (process.env.DEBUG_SESSION_STATE) {
    bot.use(async (ctx, next) => {
        console.log(`State before request: ${JSON.stringify(ctx.session.state)}`);
        await next();
        console.log(`State after request: ${JSON.stringify(ctx.session.state)}`);
    });
}

bot.use(async ({ session, message }) => {
    if (session.state.asking) {
        session.setState({ name: message.getText(), asking: false });

        await session.send(`Hey ${session.state.name}!`);
    } else {
        session.resetState();
        session.setState({ asking: true });

        await session.send('Hi, what\'s your nickname?');
    }
});
