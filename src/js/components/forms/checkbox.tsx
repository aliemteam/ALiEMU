import { memo, HTMLProps } from '@wordpress/element';
import classNames from 'classnames';

import Icon from 'components/icon';

import * as styles from './checkbox.scss';

interface Props extends HTMLProps<HTMLInputElement> {
    label: string;
}

function Checkbox({ checked, label, ...props }: Props) {
    const className = classNames(styles.checkboxContainer, {
        [styles.disabled]: props.disabled,
    });
    return (
        <label className={className}>
            <input
                {...props}
                checked={checked}
                className={styles.input}
                type="checkbox"
            />
            <span
                aria-checked={checked}
                className={styles.checkbox}
                role="checkbox"
            >
                {checked && <Icon icon="check" size={13} />}
            </span>
            <span>{label}</span>
        </label>
    );
}

export default memo(Checkbox);
