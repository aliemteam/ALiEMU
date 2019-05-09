import classNames from 'classnames';
import React, {
    CSSProperties,
    FormEvent,
    HTMLProps,
    PureComponent,
} from 'react';

import ProgressBar from 'components/progress-bar';
import { MaybeLabel } from './label';

import styles from './textarea.scss';

interface Props extends HTMLProps<HTMLTextAreaElement> {
    label?: string;
}

interface State {
    length: number;
}

export default class TextArea extends PureComponent<Props, State> {
    state = {
        length: this.props.defaultValue
            ? this.props.defaultValue.length
            : this.props.value && typeof this.props.value === 'string'
            ? this.props.value.length
            : 0,
    };

    render(): JSX.Element {
        const { className, label, ...props } = this.props;
        const { length } = this.state;
        const classname = classNames(className, styles.textarea);
        const style: CSSProperties = {
            ...(props.rows
                ? {
                      minHeight: `calc(${props.rows}em + (2 * ${
                          styles.paddingSize
                      }))`,
                  }
                : {}),
        };
        return (
            <MaybeLabel disabled={props.disabled} label={label}>
                <MaybeProgressBar length={length} maxLength={props.maxLength}>
                    <textarea
                        {...props}
                        className={classname}
                        style={style}
                        onChange={this.handleChange}
                    />
                </MaybeProgressBar>
            </MaybeLabel>
        );
    }

    private handleChange = (e: FormEvent<HTMLTextAreaElement>): void => {
        const { value } = e.currentTarget;
        const { onChange = () => void 0 } = this.props;
        this.setState({ length: value.length });
        onChange(e);
    };
}

interface MPBProps {
    length: number;
    maxLength?: number;
    children: JSX.Element;
}

const MaybeProgressBar = ({
    length,
    maxLength,
    children,
}: MPBProps): JSX.Element => {
    return maxLength ? (
        <div className={styles.progressRow}>
            {children}
            <ProgressBar max={maxLength} value={length} />
        </div>
    ) : (
        children
    );
};
