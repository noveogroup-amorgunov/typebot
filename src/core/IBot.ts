import { IConnector } from '../connectors/IConnector';
import { ISessionStore } from '../stores/ISessionStore';
import { IMessage } from './IMessage';
import { ISession } from './ISession';
import { ISessionState } from './ISessionState';

export interface IBotContext {
    session: ISession;
    message: IMessage;
    params?: object;
}

export type BotHandler = (context: IBotContext, next?: () => void) => void;

export interface IBot {
    initialState: ISessionState;
    handlers: BotHandler[];
    sessionStore: ISessionStore;
    connector: IConnector;

    getSession(message: IMessage): Promise<ISession>;
    processMessage(message: IMessage): void;
    processHandlers(handlers: BotHandler[], context: IBotContext): any;
    use(patternOrHandler: BotHandler | RegExp | string, handler?: BotHandler);
}
