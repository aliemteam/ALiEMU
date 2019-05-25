import { ReactNode } from '@wordpress/element';

import styles from './group.scss';

interface Props {
    heading?: string;
    children: ReactNode;
}

export default function MenuGroup({ children, heading }: Props) {
    return (
        <div aria-label={heading} role="group">
            {heading && <h6 className={styles.heading}>{heading}</h6>}
            {children}
        </div>
    );
}
