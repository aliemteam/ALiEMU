import { ReactNode } from '@wordpress/element';
import classNames from 'classnames';

import styles from './item.scss';

interface Props {
    children: ReactNode;
    isActive?: boolean;
    onClick(): void;
}

export function MenuItemRadio({ children, isActive, onClick }: Props) {
    const classname = classNames(styles.menuItem, {
        [styles.active]: isActive,
    });
    return (
        <button
            aria-checked={isActive}
            className={classname}
            role="menuitemradio"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export function MenuItemCheckbox({ children, isActive, onClick }: Props) {
    const classname = classNames(styles.menuItem, {
        [styles.active]: isActive,
    });
    return (
        <button
            aria-checked={isActive}
            className={classname}
            role="menuitemcheckbox"
            onClick={onClick}
        >
            {children}
        </button>
    );
}
