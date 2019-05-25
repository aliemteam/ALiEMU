import { forwardRef, memo, useRef, useState } from '@wordpress/element';
import classNames from 'classnames';

import { MaybeLabel } from './label';
import styles from './input.scss';

namespace Input {
    export interface Props extends React.AllHTMLAttributes<HTMLInputElement> {
        validityMessage?: string;
        label?: string;
        isRaised?: boolean;
    }
}
const Input = memo(
    forwardRef<HTMLInputElement, Input.Props>(function(
        { label, isRaised, validityMessage, ...props },
        ref,
    ) {
        const [isFocused, setFocused] = useState(false);
        const internalRef = ref
            ? (ref as React.RefObject<HTMLInputElement>)
            : useRef<HTMLInputElement>(null);
        const containerClass = classNames(
            styles.container,
            {
                [styles.focused]: isFocused,
                [styles.containerRaised]: isRaised,
                [styles.disabled]: props.disabled,
            },
            props.className,
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
                            props.onBlur && props.onBlur(e);
                        }}
                        onChange={e => {
                            props.onChange && props.onChange(e);
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
                            props.onFocus && props.onFocus(e);
                        }}
                    />
                </div>
            </MaybeLabel>
        );
    }),
);

Input.displayName = 'Input';

export default Input;
