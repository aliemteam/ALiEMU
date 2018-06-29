import classNames from 'classnames';
import React, { HTMLProps, PureComponent } from 'react';

import { Intent } from 'utils/constants';
import styles from './button-outlined.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
    children: string;
    intent?: Intent;
}

export default class ButtonOutlined extends PureComponent<Props> {
    render(): JSX.Element {
        const { children, intent, ...props } = this.props;
        const classname = classNames(styles.buttonOutlined, {
            [styles.buttonOutlinedDanger]: intent === Intent.DANGER,
            [styles.buttonOutlinedSuccess]: intent === Intent.SUCCESS,
            [styles.buttonOutlinedWarning]: intent === Intent.WARNING,
        });
        return (
            <button {...props} className={classname}>
                {children}
            </button>
        );
    }
}
