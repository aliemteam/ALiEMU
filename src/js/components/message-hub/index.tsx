import { createContext, ReactNode, useState } from '@wordpress/element';

import { ButtonProps } from 'components/buttons/button';
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

export const MessageContext = createContext({
    dispatchMessage: (_msg: MsgParams) => {},
});

interface Props {
    children: ReactNode;
}
export default function MessageHub({ children }: Props) {
    const [counter, setCounter] = useState(0);
    const [messages, setMessages] = useState<Msg[]>([]);
    const dispatchMessage = (data: MsgParams) => {
        setMessages([{ ...data, key: counter }, ...messages]);
        setCounter(counter + 1);
    };

    return (
        <MessageContext.Provider value={{ dispatchMessage }}>
            <>
                {children}
                <Manager
                    dismiss={(msg: Msg) => {
                        setMessages(messages.filter(m => m !== msg));
                    }}
                    messages={messages}
                />
            </>
        </MessageContext.Provider>
    );
}
