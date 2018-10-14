import 'colors';
import { EventEmitter } from 'events';
import * as readline from 'readline';
import { Message } from '../core/Message';
import { IConnector, ConnectorEvent } from './IConnector';
import { IUser } from '../core/IUser';
import { IMessage, MessageSender } from '../core/IMessage';

export default class ConsoleConnector extends EventEmitter implements IConnector {
    static _getUser(): IUser {
        return {id: 'user', name: 'Console User'};
    }

    getConnectorName(): string {
        return 'console';
    }

    getUniqueSessionKey() {
        return this.getConnectorName();
    }

    async getUser(): Promise<IUser> {
        return Promise.resolve(ConsoleConnector._getUser());
    }

    async send(message: IMessage) {
        /* tslint:disable-next-line no-console */
        console.log(message.getText().green);

        return Promise.resolve();
    }

    listen() {
        const rl = readline.createInterface(process.stdin, process.stdout);

        rl.on('line', (line: string = '') => {
            if (line.toLowerCase() === 'quit') {
                rl.close();
                process.exit();
            }

            const msg = new Message({
                rawData: { text: line },
                user: ConsoleConnector._getUser(),
                sessionKey: this.getUniqueSessionKey(),
                sender: MessageSender.user
            });

            this.emit(ConnectorEvent.receiveMessage, msg);
        });

        return this;
    }
}
