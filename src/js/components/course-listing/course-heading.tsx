import { decodeEntities } from '@wordpress/html-entities';

import styles from './course-heading.scss';

interface Props {
    category?: string;
    hours: number;
    isNew?: boolean;
    title: string;
    url: string;
}

export default function CourseHeading({
    category = '',
    hours,
    isNew,
    title,
    url,
}: Props) {
    return (
        <>
            <div className={styles.meta}>
                <strong>{category}</strong>
                <strong>{`${hours} ${hours === 1 ? 'hour' : 'hours'}`}</strong>
            </div>
            <div>
                {isNew && <span className={styles.tag}>new</span>}
                <a href={url}>{decodeEntities(title)}</a>
            </div>
        </>
    );
}
