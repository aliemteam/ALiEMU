import { memo } from '@wordpress/element';
import { get } from 'lodash';

import { Courses } from 'utils/api';

import CourseHeading from './course-heading';
import FeaturedImage from './featured-image';
import styles from './course-listing.scss';

interface Props {
    category?: string;
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
    category,
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
    const imageUrl = get(_embedded, ['wp:featuredmedia', '0', 'source_url']);
    const threeMonthsAgo = Date.now() - 3 * ONE_MONTH;
    const published = new Date(publishDate).valueOf();
    return (
        <article className={styles.listing} role="listitem">
            <FeaturedImage id={id} url={imageUrl} />
            <div>
                <CourseHeading
                    category={category}
                    hours={hours}
                    isNew={published > threeMonthsAgo}
                    title={title}
                    url={link}
                />
                <div className={styles.desc}>{description}</div>
            </div>
        </article>
    );
}

export default memo(CourseListing);
