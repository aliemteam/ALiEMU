import classNames from 'classnames';
import React, { HTMLProps, PureComponent, ReactNode } from 'react';

import * as styles from './label.scss';

interface Props extends HTMLProps<HTMLLabelElement> {
    disabled?: boolean;
}

export default class Label extends PureComponent<Props> {
    render(): JSX.Element {
        const { disabled, ...props } = this.props;
        const className = classNames(styles.label, {
            [styles.disabled]: disabled,
        });
        return <label {...props} className={className} />;
    }
}

interface MaybeLabelProps {
    label?: string;
    disabled?: boolean;
    children: ReactNode;
}

export const MaybeLabel = ({
    children,
    disabled,
    label,
}: MaybeLabelProps): JSX.Element => {
    return label ? (
        <Label disabled={disabled}>
            {label}
            {children}
        </Label>
    ) : (
        <>{children}</>
    );
};
