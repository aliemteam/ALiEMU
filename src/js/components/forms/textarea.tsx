import classNames from 'classnames';
import React, { HTMLProps, PureComponent } from 'react';

import styles from './textarea.scss';

type Props = HTMLProps<HTMLTextAreaElement>;

export default class TextArea extends PureComponent<Props> {
    render(): JSX.Element {
        const { className, ...props } = this.props;
        const classname = classNames(className, styles.textarea);
        return <textarea {...props} className={classname} />;
    }
}
