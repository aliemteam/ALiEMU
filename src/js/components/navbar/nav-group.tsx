import classNames from 'classnames';
import React from 'react';

import styles from './nav-group.scss';

interface Props {
    align?: 'left' | 'right';
    fill?: boolean;
}

export default class NavGroup extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { align, fill, children } = this.props;
        const classes = classNames(styles.navGroup, {
            [styles.alignLeft]: align === 'left',
            [styles.alignRight]: align === 'right',
            [styles.fill]: fill,
        });
        return <div className={classes}>{children}</div>;
    }
}
