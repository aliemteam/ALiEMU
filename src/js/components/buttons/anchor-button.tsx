import classNames from 'classnames';
import React, { HTMLProps, MouseEvent, PureComponent } from 'react';

import styles from './anchor-button.scss';

interface Props extends HTMLProps<HTMLAnchorElement> {}

export default class Button extends PureComponent<Props> {
    static defaultProps = {
        onClick: () => void 0,
    };
    render(): JSX.Element {
        const { children, className, disabled, ...btnProps } = this.props;
        const classname = classNames(styles.btn, className, {
            [styles.disabled]: disabled,
        });
        return (
            <a
                {...btnProps}
                role="button"
                tabIndex={disabled ? -1 : 0}
                className={classname}
                onClick={this.handleClick}
            >
                {children}
            </a>
        );
    }

    private handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
        const { disabled, onClick } = this.props;
        if (!disabled) {
            onClick!(e);
        }
    };
}
