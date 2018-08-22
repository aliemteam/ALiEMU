import classNames from 'classnames';
import React, {
    createRef,
    FocusEvent,
    FormEvent,
    forwardRef,
    HTMLProps,
    PureComponent,
    RefObject,
} from 'react';

import { MaybeLabel } from './label';

import styles from './input.scss';

interface Props extends HTMLProps<HTMLInputElement> {
    forwardedRef?: RefObject<HTMLInputElement>;
    validityMessage?: string;
    label?: string;
    raised?: boolean;
}

export type InputProps = Omit<Props, 'forwardedRef'>;

interface State {
    isFocused: boolean;
}

class Input extends PureComponent<Props, State> {
    static defaultProps = {
        onBlur: () => void 0,
        onChange: () => void 0,
        onFocus: () => void 0,
    };

    state = {
        isFocused: false,
    };

    private ref = this.props.forwardedRef || createRef<HTMLInputElement>();

    render(): JSX.Element {
        const {
            className,
            forwardedRef,
            raised,
            label,
            validityMessage,
            ...props
        } = this.props;
        const containerClass = classNames(
            styles.container,
            {
                [styles.focused]: this.state.isFocused,
                [styles.containerRaised]: raised,
                [styles.disabled]: props.disabled,
            },
            className,
        );
        return (
            <MaybeLabel label={label} disabled={props.disabled}>
                <div className={containerClass}>
                    <input
                        {...props}
                        ref={this.ref}
                        className={styles.input}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onChange={this.handleValidation}
                    />
                </div>
            </MaybeLabel>
        );
    }

    private handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
        this.setState(prev => ({ ...prev, isFocused: false }));
        this.props.onBlur!(e);
    };

    private handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
        this.setState(prev => ({ ...prev, isFocused: true }));
        this.props.onFocus!(e);
    };

    private handleValidation = (e: FormEvent<HTMLInputElement>) => {
        const { required, validityMessage, onChange } = this.props;
        if (required && validityMessage && this.ref.current) {
            this.validate(this.ref.current, validityMessage);
        }
        onChange!(e);
    };

    private validate = (input: HTMLInputElement, message: string): void => {
        input.setCustomValidity('');
        const isValid = input.checkValidity();
        if (!isValid) {
            input.setCustomValidity(message);
        }
    };
}

export default forwardRef<HTMLInputElement, InputProps>((props: any, ref) => (
    <Input {...props} forwardedRef={ref} />
));
