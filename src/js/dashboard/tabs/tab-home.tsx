import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Globals } from '../dashboard';
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
        return (
            <div className={styles.home}>
                <h1 className={styles.title}>My Learning</h1>
                <div className={styles.inProgress}>
                    <SectionHeading>In Progress</SectionHeading>
                    {user.course_progress.started
                        .slice(0, this.visibleProgressRows)
                        .map(course => (
                            <CourseProgressListing
                                key={course.id}
                                courseId={course.id}
                                steps_completed={
                                    course.lessons_completed.length +
                                    course.topics_completed.length
                                }
                                steps_total={course.total_steps}
                            />
                        ))}
                    {user.course_progress.started.length >
                        this.visibleProgressRows && (
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
                    {user.course_progress.completed
                        .slice(0, this.visibleCompletedRows)
                        .map(id => (
                            <CourseProgressListing
                                key={id}
                                courseId={id}
                                steps_completed={1}
                                steps_total={1}
                            />
                        ))}
                    {user.course_progress.completed.length >
                        this.visibleCompletedRows && (
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
