import { HTMLAttributes, ReactNode } from '@wordpress/element';

import styles from './menu.scss';

interface Props extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
}

export default function Menu({ children, ...props }: Props) {
    return (
        <aside {...props} className={styles.menu} role="search">
            {children}
        </aside>
    );
}
