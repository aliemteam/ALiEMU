import * as React from 'react';

import Icon from 'components/icon/';

import * as styles from './tag.scss';

interface Props {
    children: string;
    onClick?(tag: string): void;
    onRemove?(tag: string): void;
}

export default class Tag extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { children, onClick, onRemove } = this.props;
        const divProps = {
            ...(onClick ? { onClick: this.handleClick, role: 'button' } : {}),
        };
        return (
            <div className={styles.tag} {...divProps}>
                <span>{children}</span>
                {onRemove && (
                    <div
                        aria-label={`remove tag ${children}`}
                        role="button"
                        className={styles.removeBtn}
                        onClick={this.handleRemove}
                    >
                        <Icon icon="close" size={12} />
                    </div>
                )}
            </div>
        );
    }
    private handleRemove = (): void =>
        this.props.onRemove!(this.props.children);
    private handleClick = (): void => this.props.onClick!(this.props.children);
}
