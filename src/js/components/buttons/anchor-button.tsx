import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './anchor-button.scss';

interface Props extends React.HTMLProps<HTMLAnchorElement> {}

export default class Button extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { children, className, ...btnProps } = this.props;
        const classname = classNames(styles.btn, className);
        return (
            <a {...btnProps} className={classname} role="button" tabIndex={0}>
                {children}
            </a>
        );
    }
}
