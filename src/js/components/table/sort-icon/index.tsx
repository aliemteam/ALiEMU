import { memo } from '@wordpress/element';
import classNames from 'classnames';

import styles from './sort-icon.scss';

interface Props {
    active?: boolean;
    children?: never;
    order: 'ascending' | 'descending';
    size?: number;
}
function SortIcon({ active, order, size = 10 }: Props) {
    const classname = classNames(styles.icon, {
        [styles.active]: active,
        [styles.asc]: order === 'ascending',
        [styles.desc]: order === 'descending',
    });
    return (
        <svg
            className={classname}
            height={size}
            version="1.1"
            viewBox="0 0 25 25"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <polygon points="10 0, 20 10, 0 10" />
            <polygon points="10 25, 20 15, 0 15" />
        </svg>
    );
}
export default memo(SortIcon);
