import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './forms.scss';

interface Props extends React.HTMLProps<HTMLInputElement> {
    forwardedRef: any;
    large?: boolean;
    flex?: boolean;
    raised?: boolean;
}

export type InputProps = Omit<Props, 'forwardedRef'>;

interface State {
    isFocused: boolean;
}

class Input extends React.PureComponent<Props, State> {
    state = {
        isFocused: false,
    };

    render(): JSX.Element {
        const {
            className,
            flex,
            forwardedRef,
            large,
            raised,
            ...props
        } = this.props;
        const containerClass = classNames(
            styles.container,
            {
                [styles.focused]: this.state.isFocused,
                [styles.containerFlex]: flex,
                [styles.containerLarge]: large,
                [styles.containerRaised]: raised,
            },
            className,
        );
        return (
            <div className={containerClass} >
                <input
                    {...props}
                    ref={forwardedRef}
                    className={styles.input}
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

export default React.forwardRef<HTMLInputElement, InputProps>(
    (props: any, ref) => <Input {...props} forwardedRef={ref} />,
);
