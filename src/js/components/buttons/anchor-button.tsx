import classNames from 'classnames';
import React, { HTMLProps, PureComponent } from 'react';

import styles from './anchor-button.scss';

type Props = HTMLProps<HTMLAnchorElement>;

export default class Button extends PureComponent<Props> {
    static defaultProps = {
        onClick: () => void 0,
    };
    render(): JSX.Element {
        const {
            children,
            className,
            disabled,
            onClick,
            ...btnProps
        } = this.props;
        const classname = classNames(styles.btn, className, {
            [styles.disabled]: disabled,
        });
        return (
            <a
                {...btnProps}
                className={classname}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={disabled ? undefined : onClick}
            >
                {children}
            </a>
        );
    }
}
