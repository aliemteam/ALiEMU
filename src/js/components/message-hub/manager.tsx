import React, { CSSProperties } from 'react';
import { animated, config, Transition } from 'react-spring/renderprops';

import { Msg } from './';

import Message from './message';

import styles from './manager.scss';

interface Props {
    readonly messages: Msg[];
    dismiss(message: Msg): void;
}

// FIXME: convert to hooks
/* eslint-disable */
const Manager = (props: Props) => {
    const { messages, dismiss } = props;
    const keyFromItem = (item: any) => item.key;
    return (
        <div className={styles.manager}>
            <Transition
                native
                config={{
                    ...config.default,
                    tension: 300,
                }}
                enter={{
                    overflow: 'hidden',
                    height: 'auto',
                    transform: 'translateY(0)',
                    opacity: 1,
                }}
                from={
                    {
                        height: 0,
                        transform: 'translateY(-120px)',
                        opacity: 0,
                    } as any
                }
                items={messages}
                keys={keyFromItem}
                leave={{
                    opacity: 0,
                    transform: 'translateY(0)',
                    height: 0,
                }}
            >
                {(item: Msg) => (cssProps: CSSProperties) => (
                    <animated.div style={cssProps}>
                        <Message dismiss={dismiss} message={item} />
                    </animated.div>
                )}
            </Transition>
        </div>
    );
};

export default Manager;
