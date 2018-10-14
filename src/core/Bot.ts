import * as compose from 'koa-compose';
import MemorySessionStore from '../stores/MemorySessionStore';
import { ISessionStore } from '../stores/ISessionStore';
import { IConnector, ConnectorEvent } from '../connectors/IConnector';
import { Session } from './Session';
import { Message } from './Message';
import { BotHandler, IBot, IBotContext } from './IBot';
import { ISessionState } from './ISessionState';
import { ISession } from './ISession';

interface IBotConstructorProps {
    connector: IConnector;
}

export default class Bot implements IBot {
    initialState: ISessionState = {};
    handlers: BotHandler[] = [];
    sessionStore: ISessionStore = new MemorySessionStore();
    connector: IConnector;

    constructor({ connector }: IBotConstructorProps) {
        if (!connector) {
            throw new Error('Connector argument is required');
        }

        this.connector = connector;
        this.connector.on(ConnectorEvent.receiveMessage, this.processMessage.bind(this));
        this.connector.on(ConnectorEvent.updateSession, this.updateSession.bind(this));

        return this;
    }

    handleError = (ctx: IBotContext, err: Error) => {}; // tslint:disable-line

    async updateSession({ key, session }) {
        return this.sessionStore.update(key, session);
    }

    async processHandlers(handlers: BotHandler[], context: IBotContext) {
        return compose(handlers)(context);
    }

    async getSession(message): Promise<ISession> {
        const key = message.getSessionKey();
        let session = await this.sessionStore.find(key);

        if (session) {
            return session;
        }

        session = new Session({
            user: message.getUser(),
            bot: this,
            initialState: Object.assign({}, this.initialState)
        });

        return await this.sessionStore.add(key, session);
    }

    async processMessage(message: Message) {
        const session = await this.getSession(message);
        const context: IBotContext = { session, message };

        this
            .processHandlers(this.handlers, context)
            .catch(this.handleError.bind(this, context));
    }

    use(patternOrHandler: BotHandler | RegExp | string, maybeHandler?: BotHandler) {
        const handler = maybeHandler || patternOrHandler as BotHandler;
        const pattern = patternOrHandler;

        if (typeof handler !== 'function') {
            throw new Error('BotHandler should be function');
        }

        if (pattern instanceof RegExp) {
            this.handlers.push((ctx, next) => {
                const text = ctx.message.getText();
                const match = text.match(pattern);

                if (match) {
                    ctx.params = match.length > 1 ? match.slice(1) : null;
                    return handler(ctx, next);
                }

                return next();
            });
        } else if (typeof pattern === 'string') {
            this.handlers.push((ctx, next) => {
                const text = ctx.message.getText();

                if (text === pattern) {
                    return handler(ctx, next);
                }

                return next();
            });
        } else {
            this.handlers.push(handler);
        }
    }

    catch(handler: () => any) {
        this.handleError = handler;
    }
}
