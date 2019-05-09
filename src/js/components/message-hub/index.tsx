import React, { createContext, PureComponent, ReactNode } from 'react';

import { ButtonProps } from 'components/buttons/button';
import { Intent } from 'utils/constants';
import Manager from './manager';

interface MsgParams {
    text: string;
    duration?: number;
    details?: ReactNode;
    intent?: Intent;
    actions?: ButtonProps[];
    onDismiss?(): void;
}

export interface Msg extends MsgParams {
    key: number;
}

export interface MessageContext {
    dispatchMessage(message: MsgParams): void;
}

const { Consumer, Provider } = createContext<MessageContext>({
    dispatchMessage: () => void 0,
});

interface State {
    messages: Msg[];
}

export default class MessageHub extends PureComponent<{}, State> {
    private static counter = 0;

    state: State = {
        messages: [],
    };

    render(): JSX.Element {
        return (
            <Provider value={{ dispatchMessage: this.addMessage }}>
                <>
                    {this.props.children}
                    <Manager
                        dismiss={this.dismiss}
                        messages={this.state.messages}
                    />
                </>
            </Provider>
        );
    }

    private addMessage = (message: MsgParams): void =>
        this.setState(state => ({
            messages: [
                { ...message, key: MessageHub.counter++ },
                ...state.messages,
            ],
        }));

    private dismiss = (message: Msg): void => {
        const idx = this.state.messages.findIndex(m => m.key === message.key);
        if (idx >= 0) {
            return this.setState(state => ({
                messages: [
                    ...state.messages.slice(0, idx),
                    ...state.messages.slice(idx + 1),
                ],
            }));
        }
    };
}

/* eslint-disable */
// FIXME: types are being a pain in my ass here
export function withMessageDispatcher(C: any) {
    return (props: any) => (
        <Consumer>
            {({ dispatchMessage }) => (
                <C dispatchMessage={dispatchMessage} {...props} />
            )}
        </Consumer>
    );
}
