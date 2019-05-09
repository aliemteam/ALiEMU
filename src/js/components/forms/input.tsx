import classNames from 'classnames';
import React, { useRef, useState } from 'react';

import { MaybeLabel } from './label';

import styles from './input.scss';

namespace Input {
    export interface Props extends React.HTMLProps<HTMLInputElement> {
        inputRef?: React.RefObject<HTMLInputElement>;
        validityMessage?: string;
        label?: string;
        raised?: boolean;
    }
}
function Input({
    className,
    inputRef,
    label,
    raised,
    validityMessage,
    onBlur = () => void 0,
    onChange = () => void 0,
    onFocus = () => void 0,
    ...props
}: Input.Props) {
    const [isFocused, setFocused] = useState(false);
    const internalRef = inputRef ? inputRef : useRef<HTMLInputElement>(null);
    const containerClass = classNames(
        styles.container,
        {
            [styles.focused]: isFocused,
            [styles.containerRaised]: raised,
            [styles.disabled]: props.disabled,
        },
        className,
    );
    return (
        <MaybeLabel disabled={props.disabled} label={label}>
            <div className={containerClass}>
                <input
                    {...props}
                    ref={internalRef}
                    className={styles.input}
                    onBlur={e => {
                        setFocused(false);
                        onBlur(e);
                    }}
                    onChange={e => {
                        onChange(e);
                        const input = internalRef.current;
                        if (validityMessage && input) {
                            input.setCustomValidity('');
                            if (!input.checkValidity()) {
                                input.setCustomValidity(validityMessage);
                            }
                        }
                    }}
                    onFocus={e => {
                        setFocused(true);
                        onFocus(e);
                    }}
                />
            </div>
        </MaybeLabel>
    );
}

export default Input;
