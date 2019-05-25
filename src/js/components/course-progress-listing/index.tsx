import { memo, useEffect, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import classNames from 'classnames';
import { get } from 'lodash';
import ContentLoader from 'react-content-loader';

import { Courses } from 'utils/api';
import styles from './course-progress-listing.scss';

import Card from 'components/card';
import RadialProgress from 'components/progress-radial';

interface Props {
    courseId: number;
    stepsCompleted: number;
    stepsTotal: number;
}

function CourseProgressListing({ courseId, ...props }: Props) {
    const [course, setCourse] = useState<Courses.Course | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            try {
                const data = await Courses.fetchOne(courseId);
                isSubscribed && setCourse(data);
            } catch {
                // Don't do anything on error.
            } finally {
                isSubscribed && setIsLoading(false);
            }
        })();
        return () => {
            isSubscribed = false;
        };
    }, []);

    if (isLoading) {
        return <Placeholder />;
    }
    if (course) {
        return <Listing {...props} course={course} />;
    }
    return null;
}

function Placeholder() {
    return (
        <ContentLoader
            className={classNames('no-inherit', styles.card)}
            height={75}
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
            speed={2}
            style={{ padding: 0 }}
            width={475}
        >
            <circle cx="37" cy="38" r="30" />
            <rect height="13" rx="4" ry="4" width="300" x="77" y="18" />
            <rect height="11" rx="4" ry="4" width="110" x="77" y="44" />
        </ContentLoader>
    );
}

interface ListingProps {
    course: Courses.Course;
    stepsCompleted: number;
    stepsTotal: number;
}

function Listing({ course, stepsCompleted, stepsTotal }: ListingProps) {
    const title = decodeEntities(course.title.rendered);
    const isComplete = stepsCompleted === stepsTotal;
    const certificateLink = get(course, ['_links', 'certificate', '0', 'href']);
    return (
        <Card className={styles.listing}>
            <RadialProgress
                isAnimated
                className={styles.icon}
                diameter={50}
                max={stepsTotal}
                thickness={4}
                value={stepsCompleted}
            />
            <a className={styles.title} href={course.link} title={title}>
                {title}
            </a>
            <div className={styles.details}>
                <span>
                    {stepsCompleted} / {stepsTotal} completed
                </span>
                {isComplete && certificateLink && (
                    <a
                        href={certificateLink}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Certificate
                    </a>
                )}
            </div>
        </Card>
    );
}
export default memo(CourseProgressListing);
