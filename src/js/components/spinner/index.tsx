import { memo } from '@wordpress/element';

import styles from './spinner.scss';

interface Props {
    size: number;
}
function Spinner({ size }: Props) {
    const center = size / 2;
    const r = center * 0.9;
    const C = 2 * Math.PI * r;
    return (
        <svg
            className={styles.spinner}
            height={size}
            style={{
                strokeWidth: `${size / 10}px`,
                strokeDasharray: `${C}px`,
                strokeDashoffset: `${C * 0.8}px`,
            }}
            viewBox={`0 0 ${size} ${size}`}
            width={size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx={center} cy={center} r={r} />
        </svg>
    );
}
export default memo(Spinner);
