import classNames from 'classnames';
import React, { MouseEvent, PureComponent } from 'react';

import * as styles from './progress-dots.scss';

interface Props {
    steps: number;
    currentStep: number;
    onStepClick?(n: number): void;
}

export default class ProgressDots extends PureComponent<Props> {
    handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
        if (!this.props.onStepClick) {
            return;
        }
        const step: number = parseInt(e.currentTarget.dataset.step || '', 10);
        this.props.onStepClick(step);
    };
    render(): JSX.Element {
        const { currentStep, onStepClick, steps } = this.props;
        return (
            <div className={styles.container} role="tablist">
                {[...Array(steps).keys()].map(k => (
                    <button
                        key={`progress-dots-${k}`}
                        aria-selected={k === currentStep}
                        className={classNames(styles.dot, {
                            [styles.active]: k === currentStep,
                        })}
                        data-step={k}
                        role="tab"
                        tabIndex={k === currentStep && onStepClick ? 0 : -1}
                        type="button"
                        onClick={this.handleClick}
                    />
                ))}
            </div>
        );
    }
}
