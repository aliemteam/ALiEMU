import classNames from 'classnames';
import React, { PureComponent, ReactNode } from 'react';

import { Intent } from 'utils/constants';

import Icon from 'components/icon';

import * as styles from './notice.scss';

interface Props {
    children: ReactNode;
    intent?: Intent;
    title?: string;
}

export default class Notice extends PureComponent<Props> {
    render(): JSX.Element {
        const { children, intent } = this.props;
        const className = classNames(styles.notice, {
            [styles.intentPrimary]: intent === Intent.PRIMARY,
            [styles.intentSuccess]: intent === Intent.SUCCESS,
            [styles.intentWarning]: intent === Intent.WARNING,
            [styles.intentDanger]: intent === Intent.DANGER,
        });
        return (
            <div className={className}>
                {this.maybeRenderIcon()}
                {this.maybeRenderTitle()}
                <div className={styles.content}>{children}</div>
            </div>
        );
    }

    private maybeRenderIcon = (): ReactNode => {
        const { intent } = this.props;
        let iconProps = {
            icon: '',
            size: styles.iconSize,
            className: styles.icon,
        };
        switch (intent) {
            case Intent.PRIMARY:
                iconProps = { ...iconProps, icon: 'info' };
                break;
            case Intent.SUCCESS:
                iconProps = { ...iconProps, icon: 'check_circle' };
                break;
            case Intent.WARNING:
                iconProps = { ...iconProps, icon: 'warning' };
                break;
            case Intent.DANGER:
                iconProps = { ...iconProps, icon: 'error' };
                break;
            default:
                return null;
        }
        return <Icon {...iconProps} />;
    };

    private maybeRenderTitle = (): ReactNode => {
        const { title } = this.props;
        return title ? <h1 className={styles.heading}>{title}</h1> : null;
    };
}
