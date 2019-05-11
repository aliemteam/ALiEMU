import classNames from 'classnames';
import React, { HTMLProps, PureComponent } from 'react';

import { MaybeLabel } from './label';

import * as styles from './select.scss';

interface Props extends HTMLProps<HTMLSelectElement> {
    label?: string;
}

export default class Select extends PureComponent<Props> {
    render(): JSX.Element {
        const {
            label,
            className,
            children,
            placeholder,
            ...props
        } = this.props;
        const classname = classNames(styles.select, className);
        return (
            <MaybeLabel disabled={props.disabled} label={label}>
                <select {...props} className={classname}>
                    <>
                        <option key="empty" value="">
                            {placeholder}
                        </option>
                        {children}
                    </>
                </select>
            </MaybeLabel>
        );
    }
}
