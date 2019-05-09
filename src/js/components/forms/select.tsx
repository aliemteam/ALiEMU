import classNames from 'classnames';
import React, { HTMLProps, PureComponent } from 'react';

import { MaybeLabel } from './label';

import * as styles from './select.scss';

interface Props extends HTMLProps<HTMLSelectElement> {
    label?: string;
}

export default class Select extends PureComponent<Props> {
    // FIXME: Remove this after this issue resolves:
    // https://github.com/Microsoft/tslint-microsoft-contrib/issues/409
    // tslint:disable:react-a11y-role-has-required-aria-props
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
