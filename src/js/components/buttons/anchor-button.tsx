import { memo, HTMLProps, useRef } from '@wordpress/element';
import classNames from 'classnames';

import styles from './anchor-button.scss';

type Props = HTMLProps<HTMLAnchorElement>;

function AnchorButton({
    children,
    className,
    disabled,
    onClick = () => void 0,
    ...btnProps
}: Props) {
    const classname = classNames(styles.btn, className, {
        [styles.disabled]: disabled,
    });
    const anchorRef = useRef<HTMLAnchorElement>(null);
    return (
        <a
            {...btnProps}
            ref={anchorRef}
            className={classname}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={disabled ? undefined : onClick}
            onKeyDown={e => {
                switch (e.key) {
                    case ' ':
                    case 'Enter':
                        if (!disabled && anchorRef.current) {
                            anchorRef.current.click();
                        }
                }
            }}
        >
            {children}
        </a>
    );
}

export default memo(AnchorButton);
