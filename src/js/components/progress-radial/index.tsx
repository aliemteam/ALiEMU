import * as classNames from 'classnames';
import * as React from 'react';

import * as styles from './progress-radial.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
    diameter: number;
    max: number;
    thickness: number;
    value: number;
}

export default class ProgressRadial extends React.Component<Props> {
    render(): JSX.Element {
        const { diameter, max, thickness, value, ...props } = this.props;
        return (
            <div
                {...props}
                role="progressbar"
                aria-valuemax={max}
                aria-valuenow={value}
                aria-valuemin={0}
            >
                <Circle {...this.props} />
            </div>
        );
    }
}

const Circle = (props: Props): JSX.Element => {
    const { diameter, max, thickness, value } = props;
    const { PI } = Math;

    const center = diameter / 2;
    const r = diameter / 2 - thickness / 2;
    const C = 2 * PI * r;
    const offset = C - C * (value / max);

    const style = {
        strokeDashoffset: offset,
    };

    const classname = classNames('no-inherit', styles.circle);

    return (
        <svg
            className={classname}
            width={diameter}
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
        >
            <circle
                className={styles.circleBackground}
                cx={center}
                cy={center}
                r={r}
                strokeWidth={thickness}
            />
            <circle
                className={styles.circleFill}
                style={style}
                cx={center}
                cy={center}
                r={r}
                strokeWidth={thickness}
                strokeDasharray={C}
            />
        </svg>
    );
};
