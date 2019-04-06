import classNames from 'classnames';
import React, {
    CSSProperties,
    HTMLProps,
    MouseEvent,
    PureComponent,
} from 'react';

import { Intent } from 'utils/constants';

import Spinner from 'components/spinner';

import styles from './button.scss';

interface Props extends Omit<HTMLProps<HTMLButtonElement>, 'ref'> {
    children: string;
    intent?: Intent;
    loading?: boolean;
    scale?: number;
    type?: 'button' | 'reset' | 'submit';
}

class Button extends PureComponent<Props> {
    static defaultProps = {
        onClick: () => void 0,
    };

    render(): JSX.Element {
        const {
            children,
            href,
            intent,
            loading,
            scale,
            style,
            ...props
        } = this.props;
        const classname = classNames(styles.button, {
            [styles.intentPrimary]: intent === Intent.PRIMARY,
            [styles.intentSecondary]: intent === Intent.SECONDARY,
            [styles.intentSuccess]: intent === Intent.SUCCESS,
            [styles.intentWarning]: intent === Intent.WARNING,
            [styles.intentDanger]: intent === Intent.DANGER,
            [styles.loading]: loading,
        });
        const computedStyle: CSSProperties = scale
            ? {
                  fontSize: `calc(${styles.fontSize} * ${scale})`,
                  height: `calc(${styles.height} * ${scale})`,
                  ...style,
              }
            : { ...style };
        return (
            <button
                {...props}
                role={href ? 'link' : undefined}
                style={computedStyle}
                disabled={props.disabled || loading}
                className={classname}
                onClick={this.handleClick}
            >
                <span>{children}</span>
                {loading && (
                    <div className={styles.spinner}>
                        <Spinner size={25} />
                    </div>
                )}
            </button>
        );
    }

    private handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
        const { href, loading, onClick } = this.props;
        if (loading) {
            return e.preventDefault();
        }
        if (href) {
            window.location.href = href;
            return;
        }
        onClick!(e);
    };
}

export { Props as ButtonProps };
export default Button;
