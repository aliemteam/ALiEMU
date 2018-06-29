import React from 'react';

import styles from './navbar.scss';

export default class Navbar extends React.Component {
    render(): JSX.Element {
        return (
            <nav className={styles.navbar}>
                <div className={styles.container}>{this.props.children}</div>
            </nav>
        );
    }
}
