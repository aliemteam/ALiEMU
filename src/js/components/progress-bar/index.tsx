import React, { PureComponent } from 'react';

import * as styles from './progress-bar.scss';

interface Props {
    value: number;
    max: number;
    min?: number;
    children?: never;
}

export default class ProgressBar extends PureComponent<Props> {
    static defaultProps = {
        min: 0,
    };
    render(): JSX.Element {
        const { max, min, value } = this.props;
        const style = {
            width: `${((value - min!) / (max - min!)) * 100}%`,
        };
        return (
            <div
                className={styles.progressBar}
                role="progressbar"
                aria-valuemin={min!}
                aria-valuenow={value}
                aria-valuemax={max}
            >
                <div className={styles.progressMeter} style={style} />
            </div>
        );
    }
}
