import { Message } from './Message';
import { IBot } from './IBot';
import { IUser } from './IUser';
import { MessageSender } from './IMessage';
import { ISessionState } from './ISessionState';
import { ISession } from './ISession';
import { ConnectorEvent } from '../connectors/IConnector';

interface ISessionConstructorProps {
    user: IUser;
    bot: IBot;
    initialState?: ISessionState;
}

export class Session implements ISession {
    bot: IBot;
    state: ISessionState;
    initialState: ISessionState = {};
    isNew: boolean = true;
    user: IUser;

    constructor({ user, bot, initialState }: ISessionConstructorProps) {
        this.bot = bot;
        this.initialState = initialState || {};
        this.state = { ...initialState };
        this.user = user;
    }

    getUsername(): string {
        return this.user.name;
    }

    getSessionKey(): string {
        return this.bot.connector.getUniqueSessionKey();
    }

    send(text: string, options: any) {
        this.isNew = false;

        const message = new Message({
            rawData: { text },
            user: this.user,
            sessionKey: this.getSessionKey(),
            sender: MessageSender.bot
        });

        return this.bot.connector.send(message, this.user, options);
    }

    resetState(): void {
        this.state = { ...this.initialState };

        this.bot.connector.emit(ConnectorEvent.updateSession, {
            key: this.getSessionKey(),
            session: this
        });
    }

    setState(state: ISessionState): void {
        Object.keys(state).forEach((key) => {
            this.state[key] = state[key];
        });
    }
}
