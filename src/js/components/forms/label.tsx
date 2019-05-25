import { memo, HTMLProps, ReactNode } from '@wordpress/element';
import classNames from 'classnames';

import * as styles from './label.scss';

namespace Label {
    export interface Props extends HTMLProps<HTMLLabelElement> {
        disabled?: boolean;
    }
}
const Label = memo(function({ disabled, children, ...props }: Label.Props) {
    const className = classNames(styles.label, {
        [styles.disabled]: disabled,
    });
    return (
        <label {...props} className={className}>
            {children}
        </label>
    );
});
Label.displayName = 'Label';
export default Label;

namespace MaybeLabel {
    export interface Props {
        label?: string;
        disabled?: boolean;
        children: ReactNode;
    }
}
export const MaybeLabel = memo(function({
    children,
    disabled,
    label,
}: MaybeLabel.Props) {
    if (label) {
        return (
            <Label disabled={disabled}>
                {label}
                {children}
            </Label>
        );
    }
    return <>{children}</>;
});
MaybeLabel.displayName = 'MaybeLabel';
