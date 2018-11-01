import React, {
    ComponentType,
    createContext,
    PureComponent,
    ReactNode,
} from 'react';

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

interface Msg extends MsgParams {
    key: number;
}

interface Context {
    dispatchMessage(message: MsgParams): void;
}

const { Consumer, Provider } = createContext<Context>({
    dispatchMessage: () => void 0,
});

interface State {
    messages: Msg[];
}

class MessageHub extends PureComponent<{}, State> {
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
                        messages={this.state.messages}
                        dismiss={this.dismiss}
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

const withMessageDispatcher = <P extends Context>(C: ComponentType<P>) => {
    return (props: Omit<P, 'dispatchMessage'>) => (
        <Consumer>
            {({ dispatchMessage }) => (
                <C dispatchMessage={dispatchMessage} {...props} />
            )}
        </Consumer>
    );
};

export {
    Context as MessageContext,
    Msg,
    withMessageDispatcher,
}
export default MessageHub;
