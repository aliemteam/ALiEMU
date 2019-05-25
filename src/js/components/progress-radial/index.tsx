import { memo } from '@wordpress/element';
import classNames from 'classnames';
import { animated, useSpring } from 'react-spring';

import styles from './progress-radial.scss';

interface Props {
    isAnimated?: boolean;
    className?: string;
    diameter: number;
    max: number;
    thickness: number;
    value: number;
}
function ProgressRadial({
    isAnimated,
    className,
    diameter,
    max,
    thickness,
    value,
}: Props) {
    const center = diameter / 2;
    const r = diameter / 2 - thickness / 2;
    const C = 2 * Math.PI * r;
    const offset = C - C * (value / max);

    const style = isAnimated
        ? useSpring({
              from: { strokeDashoffset: C },
              to: { strokeDashoffset: offset },
          })
        : { strokeDashoffset: offset };

    return (
        <svg
            aria-valuemax={max}
            aria-valuemin={0}
            aria-valuenow={value}
            className={classNames(className, styles.circle)}
            height={diameter}
            role="progressbar"
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
            <animated.circle
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
}
export default memo(ProgressRadial);
