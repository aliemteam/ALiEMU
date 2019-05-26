import { memo, useContext, useMemo, useState } from '@wordpress/element';

import AnchorButton from 'components/buttons/anchor-button';
import CourseProgressListing from 'components/course-progress-listing';
import { SectionHeading } from 'components/typography/headings';

import { DashboardContext } from '../../dashboard';

import styles from './tab-home.scss';

function TabHome() {
    const [visibleProgressRows, setVisibleProgressRows] = useState(5);
    const [visibleCompletedRows, setVisibleCompletedRows] = useState(5);

    const {
        user: { course_progress },
    } = useContext(DashboardContext);

    const { completed, started } = useMemo(() => {
        return {
            completed: course_progress.filter(
                ({ status }) => status === 'COMPLETED',
            ),
            started: course_progress.filter(
                ({ status }) => status === 'STARTED',
            ),
        };
    }, [course_progress]);

    return (
        <div className={styles.home}>
            <h1 className={styles.title}>My Learning</h1>
            <div className={styles.inProgress}>
                <SectionHeading>In Progress</SectionHeading>
                {started.slice(0, visibleProgressRows).map(course => (
                    <CourseProgressListing
                        key={course.id}
                        courseId={course.id}
                        stepsCompleted={course.steps_completed}
                        stepsTotal={course.steps_total}
                    />
                ))}
                {started.length > visibleProgressRows && (
                    <AnchorButton
                        className={styles.viewMore}
                        onClick={() =>
                            setVisibleProgressRows(visibleProgressRows + 5)
                        }
                    >
                        View more
                    </AnchorButton>
                )}
            </div>
            <div className={styles.completed}>
                <SectionHeading>Completed</SectionHeading>
                {completed.slice(0, visibleCompletedRows).map(({ id }) => (
                    <CourseProgressListing
                        key={id}
                        courseId={id}
                        stepsCompleted={1}
                        stepsTotal={1}
                    />
                ))}
                {completed.length > visibleCompletedRows && (
                    <AnchorButton
                        className={styles.viewMore}
                        onClick={() =>
                            setVisibleCompletedRows(visibleCompletedRows + 5)
                        }
                    >
                        View more
                    </AnchorButton>
                )}
            </div>
        </div>
    );
}
export default memo(TabHome);
