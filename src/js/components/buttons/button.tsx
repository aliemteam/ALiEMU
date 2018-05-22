import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from 'css/components/_button.scss';

interface Props extends React.HTMLProps<HTMLButtonElement> {
    primary?: boolean;
    flat?: boolean;
    narrow?: boolean;
}

export default class Button extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { primary, flat, narrow, children, ...btnProps } = this.props;
        const classname = classNames(styles.btn, {
            [styles.btnPrimary]: primary,
            [styles.btnFlat]: flat,
            [styles.btnNarrow]: narrow,
        });
        return (
            <button {...btnProps} className={classname}>
                {children}
            </button>
        );
    }
}
