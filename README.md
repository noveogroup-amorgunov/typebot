# typebot

Make your awesome bots in few steps!

![](https://github.com/noveogroup-amorgunov/typebot/raw/master/preview.png)

- Written with typescript
- Very easy to use
- Use custom session store, platform connector with same interface

## Installation

You can install typebot

```bash
npm install @typebot/core --save
```

## Examples

You can find a lot of examples in the [examples folder](https://github.com/noveogroup-amorgunov/typebot/tree/master/examples) :rocket:.

Here is the simple example of usign typebot as the **echo-bot**. It always says what you said. There is used async/await function as message's handler.

```js
const { ConsoleConnector, Bot } = require('@typebot/core');

 // Create "console" connector to listen process.stdin
const connector = new ConsoleConnector().listen();
const bot = new Bot({ connector });

// Middleware for handling messages
bot.use(async ({ session, message }, next) => {
    const text = message.getText(); // Get user's message
    
    await session.send(`> You said: ${text}`); // Send back
    
    next();
});
```

You can run script and type text to console:

```bash
hello bot
> You said: hello bot
yo
> You said: you
```

Another examples:

- [echo-bot](examples/echo-bot)
- [async-middleware](examples/async-middleware) - notify the execution time
- [handle-error](examples/handle-error) - custom function for handling errors
- [todos](examples/todos) - todolist
- [with-regexp](examples/with-regexp) - exucate middleware by cetrain regexp/string (like command)
- [with-state](examples/with-state) - operate with session state
- :fire: [giphy-bot](examples/giphy-bot) - find any gif by keywords
