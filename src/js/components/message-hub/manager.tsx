import React, { CSSProperties } from 'react';
import { animated, config, Transition } from 'react-spring/renderprops';

import { Msg } from './';

import Message from './message';

import styles from './manager.scss';

interface IProps {
    readonly messages: Msg[];
    dismiss(message: Msg): void;
}

const Manager = (props: IProps) => {
    const { messages, dismiss } = props;
    const keyFromItem = (item: any) => item.key;
    return (
        <div className={styles.manager}>
            <Transition
                native
                keys={keyFromItem}
                config={{
                    ...config.default,
                    tension: 300,
                }}
                items={messages}
                from={
                    {
                        height: 0,
                        transform: 'translateY(-120px)',
                        opacity: 0,
                    } as any
                }
                enter={{
                    overflow: 'hidden',
                    height: 'auto',
                    transform: 'translateY(0)',
                    opacity: 1,
                }}
                leave={{
                    opacity: 0,
                    transform: 'translateY(0)',
                    height: 0,
                }}
            >
                {(item: Msg) => (cssProps: CSSProperties) => (
                    <animated.div style={cssProps}>
                        <Message message={item} dismiss={dismiss} />
                    </animated.div>
                )}
            </Transition>
        </div>
    );
};

export default Manager;
