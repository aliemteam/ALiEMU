import * as React from 'react';

import * as styles from './spinner.scss';

interface Props {
    size: number;
}

export default class Spinner extends React.PureComponent<Props> {
    render(): JSX.Element {
        const { size } = this.props;
        const center = size / 2;
        const r = center * 0.9;
        const C = 2 * Math.PI * r;
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${size} ${size}`}
                width={size}
                height={size}
                style={{
                    strokeWidth: `${size / 10}px`,
                    strokeDasharray: `${C}px`,
                    strokeDashoffset: `${C * 0.8}px`,
                }}
                className={styles.spinner}
            >
                <circle cx={center} cy={center} r={r} />
            </svg>
        );
    }
}
