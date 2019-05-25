import { memo, HTMLProps } from '@wordpress/element';
import classNames from 'classnames';

import { MaybeLabel } from './label';

import * as styles from './select.scss';

interface Props extends HTMLProps<HTMLSelectElement> {
    label?: string;
}

function Select({ label, className, children, placeholder, ...props }: Props) {
    return (
        <MaybeLabel disabled={props.disabled} label={label}>
            <select {...props} className={classNames(styles.select, className)}>
                <>
                    <option key="empty" value="">
                        {placeholder}
                    </option>
                    {children}
                </>
            </select>
        </MaybeLabel>
    );
}
export default memo(Select);
