import classNames from 'classnames';
import React, { HTMLProps, PureComponent } from 'react';

import styles from './card.scss';

interface Props extends HTMLProps<HTMLDivElement> {}

export default class Card extends PureComponent<Props> {
    render(): JSX.Element {
        const { children, className, ...props } = this.props;
        const classname = classNames(styles.card, className);
        return (
            <div {...props} className={classname}>
                {children}
            </div>
        );
    }
}
