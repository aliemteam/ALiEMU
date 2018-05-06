import * as React from 'react';

import * as styles from './course-listing.scss';

import Placeholder from '../../../assets/aliemu-placeholder.svg';

interface Props {
    course: LearnDash.Course;
}

const ONE_MONTH = 2_592_000_000;

export default class CourseListing extends React.PureComponent<Props> {
    render(): JSX.Element {
        const {
            course: {
                course_short_description: description,
                date_gmt: publishDate,
                id,
                link,
                recommendedHours: hours,
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
                            {this.displayUnicode(title)}
                        </a>
                    </div>
                    {labels.hours && (
                        <strong id={labels.hours}>
                            {this.pluralize('hour', hours)}
                        </strong>
                    )}
                </div>
                <div id={labels.desc} className={styles.desc}>
                    {description}
                </div>
            </article>
        );
    }

    private displayUnicode = (str: string): string =>
        str.replace(/&#(\d+);/g, (_match, code) =>
            String.fromCharCode(parseInt(code, 10)),
        );
    private pluralize = (word: string, count: string | number): string => {
        const n: number =
            typeof count === 'number' ? count : parseInt(count, 10);
        return `${isNaN(n) ? 0 : n} ${n === 1 ? word : `${word}s`}`;
    };
}
