import { useState } from '@wordpress/element';
import { animated, config, useTransition } from 'react-spring';

import { Msg } from './';
import Message from './message';

import styles from './manager.scss';

interface Props {
    readonly messages: Msg[];
    dismiss(message: Msg): void;
}

export default function Manager({ dismiss, messages }: Props) {
    const [refMap] = useState(() => new Map());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transitions = useTransition<Msg, any>(messages, msg => msg.key, {
        config: {
            ...config.default,
            tension: 300,
        },
        from: {
            height: 0,
            opacity: 0,
            transform: 'translateY(-120px)',
        },
        enter({ key }) {
            return async (next: Function) =>
                await next({
                    overflow: 'hidden',
                    transform: 'translateY(0)',
                    opacity: 1,
                    height: refMap.get(key).scrollHeight,
                });
        },
        leave: {
            opacity: 0,
            transform: 'translateY(-120px)',
            height: 0,
        },
        onRest({ key }: Msg, action: string) {
            if (action === 'leave') {
                refMap.delete(key);
            }
        },
    });
    return (
        <div className={styles.manager}>
            {transitions.map(({ item, key, props }) => (
                <animated.div key={key} style={props}>
                    <div ref={ref => ref && refMap.set(key, ref)}>
                        <Message dismiss={dismiss} message={item} />
                    </div>
                </animated.div>
            ))}
        </div>
    );
}
