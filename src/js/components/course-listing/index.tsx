import React from 'react';

import { displayUnicode, pluralize } from 'utils/text-utils';
import styles from './course-listing.scss';

import { CourseSubset } from 'catalog/';
import Placeholder from '../../../assets/aliemu-placeholder.svg';

interface Props {
    course: CourseSubset;
}

const ONE_MONTH = 2_592_000_000;

export default class CourseListing extends React.PureComponent<Props> {
    render(): JSX.Element {
        const {
            course: {
                description,
                date_gmt: publishDate,
                id,
                link,
                hours,
                title: { rendered: title },
            },
        } = this.props;
        const media =
            this.props.course._embedded &&
            this.props.course._embedded['wp:featuredmedia']
                ? this.props.course._embedded['wp:featuredmedia'][0]
                : undefined;
        const threeMonthsAgo = Date.now() - 3 * ONE_MONTH;
        const published = new Date(publishDate).valueOf();
        const labels = {
            title: `${id}-title`,
            hours: `${id}-hours`,
            desc: `${id}-desc`,
        };
        return (
            <article
                className={styles.listing}
                aria-labelledby={labels.title}
                aria-describedby={labels.hours + ' ' + labels.desc}
            >
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
                        <a
                            id={`${labels.title}`}
                            role="heading"
                            aria-level={1}
                            href={link}
                        >
                            {displayUnicode(title)}
                        </a>
                    </div>
                    {labels.hours && (
                        <strong id={labels.hours}>
                            {pluralize('hour', hours)}
                        </strong>
                    )}
                </div>
                <div id={labels.desc} className={styles.desc}>
                    {description}
                </div>
            </article>
        );
    }
}
