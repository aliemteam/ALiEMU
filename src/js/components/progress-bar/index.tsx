import React, { PureComponent } from 'react';

import * as styles from './progress-bar.scss';

interface Props {
    value: number;
    max: number;
    min?: number;
    children?: never;
}

export default class ProgressBar extends PureComponent<Props> {
    render(): JSX.Element {
        const { max, min = 0, value } = this.props;
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
}
