import { IMessage, IMessageProps } from './IMessage';
import { IUser } from './IUser';

export class Message implements IMessage {
    data: IMessageProps;

    constructor(data: IMessageProps) {
        this.data = data;

        return this;
    }

    getText(): string {
        return this.data.rawData.text;
    }

    getUser(): IUser {
        return this.data.user;
    }

    getSessionKey(): string {
        return this.data.sessionKey;
    }
}
