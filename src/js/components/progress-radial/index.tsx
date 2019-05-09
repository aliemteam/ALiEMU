import classNames from 'classnames';
import React from 'react';

import styles from './progress-radial.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
    diameter: number;
    max: number;
    thickness: number;
    value: number;
}

export default class ProgressRadial extends React.Component<Props> {
    render(): JSX.Element {
        const {
            diameter,
            max,
            thickness,
            value,
            className,
            ...props
        } = this.props;
        const classname = classNames(styles.container, className);
        return (
            <div
                {...props}
                aria-valuemax={max}
                aria-valuemin={0}
                aria-valuenow={value}
                className={classname}
                role="progressbar"
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
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
            width={diameter}
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
                cx={center}
                cy={center}
                r={r}
                strokeDasharray={C}
                strokeWidth={thickness}
                style={style}
            />
        </svg>
    );
};
