import React, { HTMLProps, PureComponent } from 'react';

type Props = HTMLProps<HTMLAnchorElement>;

export default class Anchor extends PureComponent<Props> {
    render(): JSX.Element {
        return <a {...this.props} />;
    }
}
