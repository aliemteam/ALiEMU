import classNames from 'classnames';
import React from 'react';

import styles from './nav-tab.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
    active?: boolean;
}

export default class NavTab extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { active, children, ...props } = this.props;
        const cls = classNames(styles.btn, { [styles.active]: active });
        return (
            <button {...props} className={cls}>
                {children}
            </button>
        );
    }
}
