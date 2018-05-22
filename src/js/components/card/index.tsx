import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './card.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {}

export default class Card extends React.PureComponent<Props> {
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
