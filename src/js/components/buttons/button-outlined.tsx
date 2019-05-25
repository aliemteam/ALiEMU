import { memo, HTMLProps } from '@wordpress/element';
import classNames from 'classnames';

import styles from './button-outlined.scss';

export interface Props extends HTMLProps<HTMLButtonElement> {
    children: string;
    intent?: Intent;
    type?: 'button' | 'reset' | 'submit';
}
function ButtonOutlined({ children, className, intent, ...props }: Props) {
    const classname = classNames(
        styles.buttonOutlined,
        {
            [styles.buttonOutlinedPrimary]: intent === "primary",
            [styles.buttonOutlinedSecondary]: intent === "secondary",
            [styles.buttonOutlinedDanger]: intent === "danger",
            [styles.buttonOutlinedSuccess]: intent === "success",
            [styles.buttonOutlinedWarning]: intent === "warning",
        },
        className,
    );
    return (
        <button {...props} className={classname}>
            {children}
        </button>
    );
}

export default memo(ButtonOutlined);
