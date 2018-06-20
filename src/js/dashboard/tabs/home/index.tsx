import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Globals } from 'dashboard/';
import * as styles from './tab-home.scss';

import { AnchorButton } from 'components/buttons/';
import CourseProgressListing from 'components/course-progress-listing/';
import { SectionHeading } from 'components/typography/';

declare const AU_Dashboard: Globals;

@observer
export default class TabHome extends React.Component {
    @observable visibleProgressRows = 5;
    @observable visibleCompletedRows = 5;

    render(): JSX.Element {
        if (!AU_Dashboard.current_user) {
            throw new Error('User should be available here.');
        }
        const user = AU_Dashboard.current_user;
        const started = user.course_progress.filter(
            progress => progress.status === 'STARTED',
        );
        const completed = user.course_progress.filter(
            progress => progress.status === 'COMPLETED',
        );
        return (
            <div className={styles.home}>
                <h1 className={styles.title}>My Learning</h1>
                <div className={styles.inProgress}>
                    <SectionHeading>In Progress</SectionHeading>
                    {started
                        .slice(0, this.visibleProgressRows)
                        .map(course => (
                            <CourseProgressListing
                                key={course.id}
                                courseId={course.id}
                                steps_completed={course.steps_completed}
                                steps_total={course.steps_total}
                            />
                        ))}
                    {started.length > this.visibleProgressRows && (
                        <AnchorButton
                            className={styles.viewMore}
                            onClick={this.addProgressRows}
                        >
                            View more
                        </AnchorButton>
                    )}
                </div>
                <div className={styles.completed}>
                    <SectionHeading>Completed</SectionHeading>
                    {completed
                        .slice(0, this.visibleCompletedRows)
                        .map(({ id }) => (
                            <CourseProgressListing
                                key={id}
                                courseId={id}
                                steps_completed={1}
                                steps_total={1}
                            />
                        ))}
                    {completed.length > this.visibleCompletedRows && (
                        <AnchorButton
                            className={styles.viewMore}
                            onClick={this.addCompletedRows}
                        >
                            View more
                        </AnchorButton>
                    )}
                </div>
            </div>
        );
    }

    @action
    private addCompletedRows = () => {
        this.visibleCompletedRows += 5;
    };

    @action
    private addProgressRows = () => {
        this.visibleProgressRows += 5;
    };
}
