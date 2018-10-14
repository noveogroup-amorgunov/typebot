const { ConsoleConnector, Bot } = require('../../lib');

const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

bot.initialState = { todos: [] };

bot.use('/list', async ({session}) => {
    const { todos } = session.state;
    const msg = todos.length > 0 ? todos.join('\n') : 'No todos!';

    await session.send(msg);
});

bot.use('/clear', async ({session}) => {
    session.resetState();
    await session.send('Successfully clear all todos!');
});

bot.use(/\/add (.+)/, async ({session, message}) => {
    const [newTodo] = message.params;

    session.setState({ todos: [...session.state.todos, newTodo] });
    await session.send(`Todo: ${newTodo} added!`);
});

bot.use(async ({session}) => {
    await session.send('Unknown command. Type /list, /clear or /add {todo}.');
});
