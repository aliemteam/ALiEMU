import { ReactNode } from '@wordpress/element';
import classNames from 'classnames';

import styles from './nav-group.scss';

interface Props {
    align?: 'left' | 'right';
    children: ReactNode;
    fill?: boolean;
}

export default function NavGroup({ align, children, fill }: Props) {
    const classes = classNames(styles.navGroup, {
        [styles.alignLeft]: align === 'left',
        [styles.alignRight]: align === 'right',
        [styles.fill]: fill,
    });
    return <div className={classes}>{children}</div>;
}
