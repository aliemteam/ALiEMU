import { memo } from '@wordpress/element';

import * as styles from './progress-bar.scss';

interface Props {
    max: number;
    min?: number;
    value: number;
}
function ProgressBar({ max, min = 0, value }: Props) {
    const style = {
        width: `${((value - min) / (max - min)) * 100}%`,
    };
    return (
        <div
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={value}
            className={styles.progressBar}
            role="progressbar"
        >
            <div className={styles.progressMeter} style={style} />
        </div>
    );
}
export default memo(ProgressBar);
