import classNames from 'classnames';
import React from 'react';

import styles from './divider.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
    children?: never;
    title?: string;
}

export default class MenuDivider extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { title, ...props } = this.props;
        const classname = classNames(styles.divider, {
            [styles.heading]: title !== undefined,
        });
        return (
            <div
                className={classname}
                {...props}
                role={title ? undefined : 'separator'}
            >
                {title && <h6 className={styles.heading}>{title}</h6>}
            </div>
        );
    }
}
