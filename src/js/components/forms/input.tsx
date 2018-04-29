import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './input.scss';

interface Props extends React.HTMLProps<HTMLInputElement> {}

interface State {
    isFocused: boolean;
}

export default class Input extends React.PureComponent<Props, State> {
    state = {
        isFocused: false,
    };

    render(): JSX.Element {
        const containerClass = classNames(styles.container, {
            [styles.focused]: this.state.isFocused,
        });
        return (
            <div className={containerClass}>
                <span className="foo" />
                <input
                    {...this.props}
                    className={styles.input}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                />
            </div>
        );
    }
    private handleBlur = (): void =>
        this.setState(prevState => ({ ...prevState, isFocused: false }));
    private handleFocus = (): void =>
        this.setState(prevState => ({ ...prevState, isFocused: true }));
}
