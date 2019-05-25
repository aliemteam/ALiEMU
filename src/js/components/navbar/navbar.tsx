import { ReactNode } from '@wordpress/element';

import styles from './navbar.scss';

interface Props {
    children: ReactNode;
}

export default function Navbar({ children }: Props) {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>{children}</div>
        </nav>
    );
}
