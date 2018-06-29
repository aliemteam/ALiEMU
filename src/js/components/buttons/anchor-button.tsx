import classNames from 'classnames';
import React, { HTMLProps, PureComponent } from 'react';

import styles from './anchor-button.scss';

interface Props extends HTMLProps<HTMLAnchorElement> {}

export default class Button extends PureComponent<Props> {
    render(): JSX.Element {
        const { children, className, ...btnProps } = this.props;
        const classname = classNames(styles.btn, className);
        return (
            <a {...btnProps} className={classname} role="button" tabIndex={0}>
                {children}
            </a>
        );
    }
}
