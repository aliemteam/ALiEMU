import React from 'react';

import styles from './menu.scss';

type Props = React.HTMLProps<HTMLDivElement>;

export default class Menu extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { ...props } = this.props;
        return (
            <div {...props} className={styles.menu} role="menu">
                {this.props.children}
            </div>
        );
    }
}
