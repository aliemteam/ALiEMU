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
            <div role="tablist" className={styles.container}>
                {[...Array(steps).keys()].map(k => (
                    <button
                        key={`progress-dots-${k}`}
                        type="button"
                        className={classNames(styles.dot, {
                            [styles.active]: k === currentStep,
                        })}
                        role="tab"
                        aria-selected={k === currentStep}
                        data-step={k}
                        tabIndex={k === currentStep && onStepClick ? 0 : -1}
                        onClick={this.handleClick}
                    />
                ))}
            </div>
        );
    }
}
