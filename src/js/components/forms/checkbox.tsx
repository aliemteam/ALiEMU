import classNames from 'classnames';
import React, { FormEvent, HTMLProps, PureComponent } from 'react';

import Icon from 'components/icon';

import * as styles from './checkbox.scss';

interface Props extends HTMLProps<HTMLInputElement> {
    label: string;
}

interface State {
    checked: boolean;
}

export default class Checkbox extends PureComponent<Props, State> {
    state = {
        checked: this.props.checked === true,
    };

    render(): JSX.Element {
        const { label, ...props } = this.props;
        const { checked } = this.state;
        const className = classNames(styles.checkboxContainer, {
            [styles.disabled]: props.disabled,
        });
        return (
            <label className={className}>
                <input
                    {...props}
                    checked={checked}
                    className={styles.input}
                    type="checkbox"
                    onChange={this.handleChange}
                />
                <span
                    aria-checked={checked}
                    className={styles.checkbox}
                    role="checkbox"
                >
                    {checked && <Icon icon="check" size={13} />}
                </span>
                <span>{label}</span>
            </label>
        );
    }

    private handleChange = (e: FormEvent<HTMLInputElement>): void => {
        const { checked } = e.currentTarget;
        const { onChange = () => void 0 } = this.props;
        onChange(e);
        this.setState({ checked });
    };
}
