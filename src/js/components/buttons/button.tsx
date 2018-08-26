import classNames from 'classnames';
import React, { HTMLProps, MouseEvent, PureComponent } from 'react';

import { Intent } from 'utils/constants';

import Spinner from 'components/spinner';

import styles from './button.scss';

interface Props extends HTMLProps<HTMLButtonElement> {
    intent?: Intent;
    loading?: boolean;
}

export default class Button extends PureComponent<Props> {
    static defaultProps = {
        onClick: () => void 0,
    };

    render(): JSX.Element {
        const { children, intent, loading, ...props } = this.props;
        const classname = classNames(styles.button, {
            [styles.intentPrimary]: intent === Intent.PRIMARY,
            [styles.intentSecondary]: intent === Intent.SECONDARY,
            [styles.intentSuccess]: intent === Intent.SUCCESS,
            [styles.intentWarning]: intent === Intent.WARNING,
            [styles.intentDanger]: intent === Intent.DANGER,
            [styles.loading]: loading,
        });
        return (
            <button
                {...props}
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
        const { loading, onClick } = this.props;
        if (loading) {
            return e.preventDefault();
        }
        onClick!(e);
    };
}
