import { memo, useEffect, useState } from '@wordpress/element';

import Input from './input';

interface Props extends Omit<Input.Props, 'onChange'> {
    delimiter?: string;
    value?: string;
    onChange?(value: string): void;
}

function DateInput({
    delimiter = '/',
    value = '',
    onChange = () => void 0,
    ...props
}: Props) {
    const [inputValue, setValue] = useState(value);
    useEffect(() => onChange(inputValue));
    return (
        <Input
            {...props}
            pattern="\d{4}/\d{2}/\d{2}"
            type="search"
            validityMessage="Date must be in the form 'YYYY/MM/DD'"
            value={inputValue}
            onChange={e => {
                const { value: currentValue } = e.currentTarget;
                const previousLength = inputValue.length;
                const isInserting = currentValue.length > previousLength;
                if (isInserting && previousLength === 10) {
                    return;
                }
                if (isInserting) {
                    const [year, month, day] = currentValue.split(delimiter);
                    setValue(
                        [
                            parseYear(year, delimiter),
                            parseMonth(month, delimiter),
                            parseDay(day),
                        ]
                            .filter(Boolean)
                            .join(''),
                    );
                } else {
                    setValue(
                        inputValue.endsWith(delimiter)
                            ? currentValue.slice(0, -1)
                            : currentValue,
                    );
                }
            }}
            onKeyPress={e => {
                const code = e.key.charCodeAt(0);
                if (code < 48 || 57 < code) {
                    e.preventDefault();
                }
            }}
        />
    );
}

export default memo(DateInput);

function parseYear(input = '', delimiter: string): string {
    return input.length === 4 ? `${input}${delimiter}` : input;
}

function parseMonth(input = '', delimiter: string): string {
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

function parseDay(input = ''): string {
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
