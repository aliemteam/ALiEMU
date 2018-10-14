import React, { FormEvent, KeyboardEvent, PureComponent } from 'react';

import Input, { InputProps } from './input';

interface Props extends Omit<InputProps, 'onChange'> {
    value: string;
    delimiter?: string;
    onChange?(value: string): void;
}

interface State {
    value: string;
}

type KBEvent = KeyboardEvent<HTMLInputElement>;
type InputEvent = FormEvent<HTMLInputElement>;

export default class DateInput extends PureComponent<Props, State> {
    static defaultProps = {
        delimiter: '/',
    };

    state = {
        value: this.props.value,
    };

    render(): JSX.Element {
        const { delimiter, ...props } = this.props;
        return (
            <Input
                {...props}
                value={this.state.value}
                type="search"
                pattern="\d{4}/\d{2}/\d{2}"
                onKeyPress={this.handleKeyPress}
                onChange={this.handleChange}
            />
        );
    }
    private handleKeyPress = (e: KBEvent): void => {
        const code = e.key.charCodeAt(0);
        if (code < 48 || 57 < code) {
            e.preventDefault();
        }
    };

    private handleChange = (e: InputEvent): void => {
        const { value } = e.currentTarget;
        const currentLength = this.props.value.length;
        const isInserting = value.length > currentLength;
        if (isInserting && currentLength === 10) {
            return;
        }
        const parsed = isInserting
            ? this.handleInsert(value)
            : this.handleDelete(value);
        this.setState(
            prev => ({ ...prev, value: parsed }),
            () => this.props.onChange && this.props.onChange(parsed),
        );
    };

    private handleInsert = (value: string): string => {
        const { delimiter } = this.props;
        const [year, month, day] = value.split(delimiter!);
        return [
            parseYear(year, delimiter),
            parseMonth(month, delimiter),
            parseDay(day),
        ]
            .filter(Boolean)
            .join('');
    };

    private handleDelete = (input: string): string => {
        const { delimiter, value } = this.props;
        return value.endsWith(delimiter!) ? input.slice(0, -1) : input;
    };
}

function parseYear(input: string, delimiter = '/'): string {
    return input.length === 4 ? `${input}${delimiter}` : input;
}

function parseMonth(input: string = '', delimiter = '/'): string {
    if (!input) {
        return input;
    }
    const n = parseInt(input, 10);
    if (0 === n) {
        return '0';
    }
    if (1 === n) {
        return input.length === 1 ? input : `${input}${delimiter}`;
    }
    if (2 <= n && n <= 9) {
        return `0${n}${delimiter}`;
    }
    if (n <= 11) {
        return `${n}${delimiter}`;
    }
    return `12${delimiter}`;
}

function parseDay(input: string = ''): string {
    if (!input) {
        return input;
    }
    const n = parseInt(input.slice(0, 2), 10);
    if (0 === n) {
        return `${n}`;
    }
    if (1 === n) {
        return input;
    }
    if (2 <= n && n <= 3) {
        return `${n}`;
    }
    if (4 <= n && n <= 9) {
        return `0${n}`;
    }
    if (n <= 30) {
        return `${n}`;
    }
    return '31';
}
