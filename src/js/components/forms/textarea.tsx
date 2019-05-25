import { memo, HTMLProps, useState } from '@wordpress/element';
import classNames from 'classnames';

import ProgressBar from 'components/progress-bar';
import { MaybeLabel } from './label';

import styles from './textarea.scss';

interface MPBProps {
    length: number;
    maxLength?: number;
    children: JSX.Element;
}
const MaybeProgressBar = memo(({ length, maxLength, children }: MPBProps) => {
    if (maxLength) {
        return (
            <div className={styles.progressRow}>
                {children}
                <ProgressBar max={maxLength} value={length} />
            </div>
        );
    }
    return <>{children}</>;
});
MaybeProgressBar.displayName = 'MaybeProgressBar';

interface Props extends HTMLProps<HTMLTextAreaElement> {
    value?: string;
    defaultValue?: string;
    label?: string;
}
function TextArea({ label, onChange = () => void 0, ...props }: Props) {
    const [length, setLength] = useState(
        props.defaultValue
            ? props.defaultValue.length
            : props.value
            ? props.value.length
            : 0,
    );
    const style = props.rows
        ? {
              minHeight: `calc(${props.rows}em + (2 * ${styles.paddingSize}))`,
          }
        : undefined;

    return (
        <MaybeLabel disabled={props.disabled} label={label}>
            <MaybeProgressBar length={length} maxLength={props.maxLength}>
                <textarea
                    {...props}
                    className={classNames(props.className, styles.textarea)}
                    style={style}
                    onChange={e => {
                        setLength(e.currentTarget.value.length);
                        onChange(e);
                    }}
                />
            </MaybeProgressBar>
        </MaybeLabel>
    );
}
export default memo(TextArea);
