import * as classNames from 'classnames';
import * as React from 'react';

import { Intent } from 'utils/constants';
import * as styles from './button-outlined.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
    children: string;
    intent?: Intent;
}

export default class ButtonOutlined extends React.PureComponent<Props> {
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
