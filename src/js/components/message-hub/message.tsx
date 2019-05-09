import React from 'react';

import { Msg } from './';

import Button from 'components/buttons/button';
import ButtonIcon from 'components/buttons/button-icon';
import { IntentIcon } from 'components/icon';

import * as styles from './message.scss';

interface Props {
    readonly message: Msg;
    dismiss(message: Msg): void;
}

const Message = ({ dismiss, message }: Props): JSX.Element => {
    const { actions, details, intent, text } = message;
    const onClick = () => dismiss(message);
    return (
        <div className={styles.container}>
            <div className={styles.message}>
                {intent && (
                    <div className={styles.iconContainer}>
                        <IntentIcon intent={intent} size={22} />
                    </div>
                )}
                <div className={styles.content}>
                    <h1 className={styles.heading}>{text}</h1>
                    {details && <div>{details}</div>}
                </div>
                <div className={styles.dismiss}>
                    <ButtonIcon icon="close" onClick={onClick} />
                </div>
                {actions && (
                    <div className={styles.actions}>
                        {actions.map(action => (
                            <Button key={action.children} {...action} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
