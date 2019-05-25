import { memo } from '@wordpress/element';
import classNames from 'classnames';

import * as styles from './progress-dots.scss';

interface Props {
    steps: number;
    currentStep: number;
    onStepClick?(n: number): void;
}

function ProgressDots({ currentStep, steps, onStepClick }: Props) {
    return (
        <div className={styles.container} role="tablist">
            {[...Array(steps).keys()].map(i => (
                <button
                    key={i}
                    aria-selected={i === currentStep}
                    className={classNames(styles.dot, {
                        [styles.active]: i === currentStep,
                    })}
                    role="tab"
                    tabIndex={i === currentStep && onStepClick ? 0 : -1}
                    type="button"
                    onClick={() => onStepClick && onStepClick(i)}
                />
            ))}
        </div>
    );
}
export default memo(ProgressDots);
