import * as React from 'react';

import * as styles from './headings.scss'

export const SectionHeading = (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 {...props} className={styles.sectionHeading} />
);
