import { HTMLProps, memo } from '@wordpress/element';

import styles from './headings.scss';

export const SectionHeading = memo(
    ({ children, ...props }: HTMLProps<HTMLHeadingElement>) => (
        <h2 {...props} className={styles.sectionHeading}>
            {children}
        </h2>
    ),
);
SectionHeading.displayName = 'SectionHeading';
