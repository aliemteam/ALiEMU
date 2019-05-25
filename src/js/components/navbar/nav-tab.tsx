import { ReactNode } from '@wordpress/element';
import classNames from 'classnames';

import styles from './nav-tab.scss';

interface Props {
    active?: boolean;
    children: ReactNode;
    onClick(): void;
}

export default function NavTab({ active, children, onClick }: Props) {
    return (
        <button
            className={classNames(styles.btn, { [styles.active]: active })}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
