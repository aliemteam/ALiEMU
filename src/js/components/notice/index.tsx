import { memo, ReactNode } from '@wordpress/element';
import classNames from 'classnames';

import { IntentIcon } from 'components/icon';

import * as styles from './notice.scss';

interface Props {
    children: ReactNode;
    intent?: Intent;
    title?: string;
}
function Notice({ children, intent, title }: Props) {
    const className = classNames(styles.notice, {
        [styles.intentPrimary]: intent === 'primary',
        [styles.intentSuccess]: intent === 'success',
        [styles.intentWarning]: intent === 'warning',
        [styles.intentDanger]: intent === 'danger',
    });
    return (
        <div className={className}>
            {intent && <IntentIcon intent={intent} size={22} />}
            <div>
                {title && <h1 className={styles.heading}>{title}</h1>}
                {children}
            </div>
        </div>
    );
}
export default memo(Notice);
