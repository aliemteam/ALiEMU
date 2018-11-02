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
    static defaultProps = {
        onChange: () => void 0,
    };

    state = {
        checked: this.props.checked === true,
    };

    render(): JSX.Element {
        const { label, ...props } = this.props;
        const { checked } = this.state;
        const className = classNames(styles.checkboxContainer, {
            [styles.disabled]: props.disabled,
        });
        // FIXME: Remove below when the following issue resolves.
        // https://github.com/Microsoft/tslint-microsoft-contrib/issues/409
        // tslint:disable:react-a11y-role-has-required-aria-props
        return (
            <label className={className}>
                <input
                    {...props}
                    onChange={this.handleChange}
                    className={styles.input}
                    checked={checked}
                    type="checkbox"
                />
                <span
                    role="checkbox"
                    aria-checked={checked}
                    className={styles.checkbox}
                >
                    {checked && <Icon icon="check" size={13} />}
                </span>
                <span>{label}</span>
            </label>
        );
    }

    private handleChange = (e: FormEvent<HTMLInputElement>): void => {
        const { checked } = e.currentTarget;
        this.props.onChange!(e);
        this.setState({ checked });
    };
}
