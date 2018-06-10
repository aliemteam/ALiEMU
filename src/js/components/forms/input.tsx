import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './input.scss';

interface Props extends React.HTMLProps<HTMLInputElement> {
    forwardedRef: any;
    large?: boolean;
    raised?: boolean;
}

interface State {
    isFocused: boolean;
}

class Input extends React.PureComponent<Props, State> {
    state = {
        isFocused: false,
    };

    render(): JSX.Element {
        const { forwardedRef, className, large, raised, ...props } = this.props;
        const containerClass = classNames(
            styles.container,
            {
                [styles.focused]: this.state.isFocused,
                [styles.containerLarge]: large,
                [styles.containerRaised]: raised,
            },
            className,
        );
        const inputClass = classNames(styles.input, {
            [styles.inputLarge]: large,
        });
        return (
            <div className={containerClass}>
                <input
                    {...props}
                    ref={forwardedRef}
                    className={inputClass}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                />
            </div>
        );
    }
    private handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        e.persist();
        this.setState(
            prevState => ({ ...prevState, isFocused: false }),
            () => {
                this.props.onBlur && this.props.onBlur(e);
            },
        );
    };
    private handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
        e.persist();
        this.setState(
            prevState => ({ ...prevState, isFocused: true }),
            () => {
                this.props.onFocus && this.props.onFocus(e);
            },
        );
    };
}

export default React.forwardRef<HTMLInputElement, Omit<Props, 'forwardedRef'>>(
    (props: any, ref) => <Input {...props} forwardedRef={ref} />,
);
