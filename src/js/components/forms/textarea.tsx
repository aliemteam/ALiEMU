import classNames from 'classnames';
import React, { HTMLProps, PureComponent } from 'react';

import { MaybeLabel } from './label';

import styles from './textarea.scss';

interface Props extends HTMLProps<HTMLTextAreaElement> {
    label?: string;
}

export default class TextArea extends PureComponent<Props> {
    render(): JSX.Element {
        const { className, label, ...props } = this.props;
        const classname = classNames(className, styles.textarea);
        return (
            <MaybeLabel label={label} disabled={props.disabled}>
                <textarea {...props} className={classname} />
            </MaybeLabel>
        );
    }
}
