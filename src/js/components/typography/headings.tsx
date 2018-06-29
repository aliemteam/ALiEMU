import React from 'react';

import styles from './headings.scss'

export const SectionHeading = (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 {...props} className={styles.sectionHeading} />
);
