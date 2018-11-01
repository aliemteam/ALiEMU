import classNames from 'classnames';
import React, { PureComponent, ReactNode } from 'react';

import { Intent } from 'utils/constants';

import { IntentIcon } from 'components/icon';

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
        return intent ? (
            <IntentIcon
                className={styles.icon}
                size={styles.iconSize}
                intent={intent}
            />
        ) : null;
    };

    private maybeRenderTitle = (): ReactNode => {
        const { title } = this.props;
        return title ? <h1 className={styles.heading}>{title}</h1> : null;
    };
}
