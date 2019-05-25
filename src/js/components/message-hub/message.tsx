import { memo } from '@wordpress/element';
import classNames from 'classnames';

import Button from 'components/buttons/button';
import ButtonIcon from 'components/buttons/button-icon';
import { IntentIcon } from 'components/icon';

import { Msg } from './';
import * as styles from './message.scss';

interface Props {
    readonly message: Msg;
    dismiss(message: Msg): void;
}
function Message({ dismiss, message }: Props) {
    const { actions, details, intent, text } = message;
    return (
        <div className={styles.container}>
            <div
                className={classNames(styles.message, {
                    [styles.withIcon]: intent,
                })}
            >
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
                    <ButtonIcon icon="close" onClick={() => dismiss(message)} />
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
}
export default memo(Message);
