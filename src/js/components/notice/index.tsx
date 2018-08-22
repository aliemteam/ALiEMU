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
                <div>
                    {this.maybeRenderTitle()}
                    {children}
                </div>
            </div>
        );
    }

    private maybeRenderIcon = (): ReactNode => {
        const { intent } = this.props;
        switch (intent) {
            case Intent.PRIMARY:
                return <Icon icon="info" size={22} />;
            case Intent.SUCCESS:
                return <Icon icon="check_circle" size={22} />;
            case Intent.WARNING:
                return <Icon icon="warning" size={22} />;
            case Intent.DANGER:
                return <Icon icon="error" size={22} />;
            default:
                return null;
        }
    };

    private maybeRenderTitle = (): ReactNode => {
        const { title } = this.props;
        return title ? <h1>{title}</h1> : null;
    };
}
