import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './nav-group.scss';

interface Props {
    align?: 'left' | 'right';
}

export default class NavGroup extends React.PureComponent<Props> {
    static defaultProps = {
        align: 'left',
    };
    render(): JSX.Element {
        const { align, children } = this.props;
        const classes = classNames(styles.navGroup, {
            [styles.alignLeft]: align === 'left',
            [styles.alignRight]: align === 'right',
        });
        return <div className={classes}>{children}</div>;
    }
}
