import React, { MouseEvent, PureComponent } from 'react';

import styles from './button-icon.scss';

import Icon, { Props as IconProps } from 'components/icon/';

interface Props extends IconProps {
    onClick?(e: MouseEvent<HTMLButtonElement>): void;
}

export default class ButtonIcon extends PureComponent<Props> {
    render(): JSX.Element {
        const { onClick, ...iconProps } = this.props;
        return (
            <button className={styles.button} onClick={onClick}>
                <Icon {...iconProps} />
            </button>
        );
    }
}
