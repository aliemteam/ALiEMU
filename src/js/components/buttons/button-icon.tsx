import { memo, MouseEvent } from '@wordpress/element';

import styles from './button-icon.scss';

import Icon, { IconProps } from 'components/icon';

interface Props extends IconProps {
    onClick?(e: MouseEvent<HTMLButtonElement>): void;
}
function ButtonIcon({ onClick, ...iconProps }: Props) {
    return (
        <button className={styles.button} onClick={onClick}>
            <Icon {...iconProps} />
        </button>
    );
}
export default memo(ButtonIcon);
