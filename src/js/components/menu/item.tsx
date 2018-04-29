import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './item.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
    selected?: boolean;
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
