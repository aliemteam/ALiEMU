import { memo, AllHTMLAttributes } from '@wordpress/element';
import classNames from 'classnames';

import Spinner from 'components/spinner';

import styles from './button.scss';

export interface ButtonProps extends AllHTMLAttributes<HTMLButtonElement> {
    children: string;
    intent?: Intent;
    isLoading?: boolean;
    scale?: number;
    type?: 'button' | 'reset' | 'submit';
}

function Button({
    children,
    intent,
    isLoading,
    scale,
    style,
    href,
    onClick = () => void 0,
    ...props
}: ButtonProps) {
    const classname = classNames(styles.button, {
        [styles.intentPrimary]: intent === 'primary',
        [styles.intentSecondary]: intent === 'secondary',
        [styles.intentSuccess]: intent === 'success',
        [styles.intentWarning]: intent === 'warning',
        [styles.intentDanger]: intent === 'danger',
        [styles.loading]: isLoading,
    });
    const computedStyle = scale
        ? {
              fontSize: `calc(${styles.fontSize} * ${scale})`,
              height: `calc(${styles.height} * ${scale})`,
              ...style,
          }
        : { ...style };
    return (
        <button
            {...props}
            className={classname}
            disabled={props.disabled || isLoading}
            role={href ? 'link' : undefined}
            style={computedStyle}
            onClick={e => {
                if (isLoading) {
                    return e.preventDefault();
                }
                if (href) {
                    window.location.href = href;
                    return;
                }
                onClick(e);
            }}
        >
            <span>{children}</span>
            {isLoading && (
                <div className={styles.spinner}>
                    <Spinner size={25} />
                </div>
            )}
        </button>
    );
}

export default memo(Button);
