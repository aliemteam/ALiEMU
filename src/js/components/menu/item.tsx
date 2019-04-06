import classNames from 'classnames';
import React from 'react';

import styles from './item.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
    selected?: boolean;
    type?: 'button' | 'reset' | 'submit';
}

export default class MenuItem extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { children, selected, ...props } = this.props;
        const classname = classNames(styles.menuItem, {
            [styles.selected]: selected,
        });
        return (
            <button {...props} className={classname} role="menuitem">
                {this.props.children}
            </button>
        );
    }
}
