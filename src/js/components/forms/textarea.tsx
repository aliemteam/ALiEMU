import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './forms.scss';

interface Props extends React.HTMLProps<HTMLTextAreaElement> {
    large?: boolean;
}

export default class TextArea extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { className, large, ...props } = this.props;
        const classname = classNames(className, styles.textarea, {
            [styles.textareaLarge]: large,
        });
        return <textarea {...props} className={classname} />;
    }
}
