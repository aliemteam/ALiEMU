import * as React from 'react';

import * as styles from './menu.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {}

export default class Menu extends React.PureComponent<Props> {
    render(): JSX.Element {
        const {
            ...props,
        } = this.props;
        return (
            <div {...props} className={styles.menu} role="menu">
                {this.props.children}
            </div>
        );
    }
}
