import { memo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { get } from 'lodash';

import { Courses } from 'utils/api';

import Placeholder from '../../../assets/aliemu-placeholder.svg';
import styles from './course-listing.scss';

interface Props {
    course: Pick<
        Courses.Course,
        | '_embedded'
        | 'categories'
        | 'date_gmt'
        | 'description'
        | 'featured_media'
        | 'hours'
        | 'id'
        | 'link'
        | 'title'
    >;
}

const ONE_MONTH = 2_592_000_000;

function CourseListing({
    course: {
        _embedded,
        description,
        date_gmt: publishDate,
        id,
        link,
        hours,
        title: { rendered: title },
    },
}: Props) {
    const media = get(_embedded, ['wp:featuredmedia', '0']);
    const threeMonthsAgo = Date.now() - 3 * ONE_MONTH;
    const published = new Date(publishDate).valueOf();
    const labels = {
        title: `${id}-title`,
        hours: `${id}-hours`,
        desc: `${id}-desc`,
    };
    return (
        <article className={styles.listing} role="listitem">
            {media && (
                <div
                    className={styles.image}
                    style={{
                        backgroundImage: `url(${media.source_url})`,
                        backgroundSize: 'cover',
                    }}
                >
                    <div
                        className={styles.overlay}
                        style={{
                            filter: `hue-rotate(${id}deg)`,
                        }}
                    />
                </div>
            )}
            {!media && (
                <Placeholder
                    className={styles.image}
                    style={{
                        filter: `hue-rotate(${id}deg)`,
                    }}
                />
            )}
            <div className={styles.heading}>
                <div className={styles.titleContainer}>
                    {published > threeMonthsAgo && (
                        <span className={styles.newTag}>new</span>
                    )}
                    <a href={link} id={labels.title}>
                        {decodeEntities(title)}
                    </a>
                </div>
                {hours && (
                    <strong id={labels.hours}>
                        {`${hours} ${hours === 1 ? 'hour' : 'hours'}`}
                    </strong>
                )}
            </div>
            <div className={styles.desc} id={labels.desc}>
                {description}
            </div>
        </article>
    );
}
export default memo(CourseListing);
