import React, { HTMLProps, PureComponent } from 'react';

type Props = HTMLProps<HTMLAnchorElement>;

export default class Anchor extends PureComponent<Props> {
    render(): JSX.Element {
        const { children, ...props } = this.props;
        return <a {...props}>{children}</a>;
    }
}
