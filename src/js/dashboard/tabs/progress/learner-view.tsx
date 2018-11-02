import { computed, flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { MessageContext, withMessageDispatcher } from 'components/message-hub/';
import { HeaderRow, Row } from 'components/tables/base';
import { Courses, Groups } from 'utils/api';
import { CourseStatus, Intent } from 'utils/constants';
import { displayUnicode } from 'utils/text-utils';
import { ICourse, ILearner } from 'utils/types';
import { DateRange, isWithinDateRange } from './';
import styles from './learner-view.scss';

import ButtonIcon from 'components/buttons/button-icon';
import Card from 'components/card/';
import ClickToEdit from 'components/click-to-edit/';
import Icon from 'components/icon/';
import ProgressRadial from 'components/progress-radial/';
import SimpleTable from 'components/tables/simple/';
import Tag from 'components/tag/';
import { SectionHeading } from 'components/typography/headings';

type Props = {
    learner: ILearner;
    dateRange?: DateRange;
} & MessageContext;

@observer
class LearnerViewPre extends React.Component<Props> {
    @observable
    coursesLoading = true;

    courses = observable.map<number, ICourse>([], { deep: false });

    fetchCourses = flow(function*(this: LearnerViewPre): IterableIterator<any> {
        this.coursesLoading = true;
        this.courses.clear();

        const include = this.props.learner.course_progress.map(({ id }) => id);
        const courses: ICourse[] =
            include.length > 0 ? yield Courses.fetchMany({ include }) : [];

        this.courses.replace(courses.map(course => [course.id, course]));
        this.coursesLoading = false;
    });

    handleRemoveTag = flow(function*(
        this: LearnerViewPre,
        tag: string,
    ): IterableIterator<any> {
        const { learner } = this.props;
        const oldTags = learner.learner_tags.slice();
        learner.learner_tags = learner.learner_tags.filter(t => t !== tag);
        try {
            yield Groups.removeLearnerTag(learner.id, tag);
        } catch {
            learner.learner_tags = oldTags;
            this.props.dispatchMessage({
                text: 'Uh oh!',
                details:
                    'An error occurred while attempting to remove the selected learner tag. Please try again later.',
                intent: Intent.DANGER,
            });
        }
    }).bind(this);

    handleAddTag = flow(function*(
        this: LearnerViewPre,
        tag: string,
    ): IterableIterator<any> {
        const { learner } = this.props;
        const oldTags = learner.learner_tags.slice();
        if (oldTags.includes(tag)) {
            return;
        }
        learner.learner_tags.push(tag);
        try {
            yield Groups.addLearnerTag(learner.id, tag);
        } catch {
            learner.learner_tags = oldTags;
            this.props.dispatchMessage({
                text: 'Uh oh!',
                details:
                    'An error occurred while attempting to add learner tag. Please try again later.',
                intent: Intent.DANGER,
            });
        }
    }).bind(this);

    componentDidMount(): void {
        this.fetchCourses();
    }

    render(): JSX.Element {
        const { avatar_urls, id, learner_tags, name } = this.props.learner;
        return (
            <div className={styles.containerOuter} key={id}>
                <div className={styles.containerInner}>
                    <img className={styles.img} src={avatar_urls[150]} />
                    <div className={styles.metadata}>
                        <h1>{name}</h1>
                        <div className={styles.tagHeading}>
                            <SectionHeading>Tags</SectionHeading>
                            <ClickToEdit
                                buttonElement={addTagButton}
                                onSave={this.handleAddTag}
                                inputProps={{ list: 'tag-list' }}
                            />
                        </div>
                        <div className={styles.tagContainer}>
                            {learner_tags.map(t => (
                                <Tag key={t} onRemove={this.handleRemoveTag}>
                                    {t}
                                </Tag>
                            ))}
                        </div>
                    </div>
                </div>
                <SimpleTable
                    header={header}
                    caption="Course Progress"
                    containerClassName={styles.tableContainer}
                    rows={[...this.courseProgressRows]}
                    rowsPerPage={5}
                    defaultSortKey="status"
                    isLoading={this.coursesLoading}
                    isEmpty={this.courses.size === 0}
                    emptyState={emptyProgress}
                />
            </div>
        );
    }

    @computed
    get courseProgressRows(): Row[] {
        const {
            dateRange,
            learner: { course_progress },
        } = this.props;
        if (this.coursesLoading) {
            return [];
        }
        return course_progress
            .filter(progress => {
                const { status, activity_completed } = progress;
                if (
                    (status === CourseStatus.COMPLETED &&
                        !isWithinDateRange(activity_completed, dateRange)) ||
                    !this.courses.has(progress.id)
                ) {
                    return false;
                }
                return true;
            })
            .map(progress => {
                const { id, status } = progress;
                const isCompleted = status === CourseStatus.COMPLETED;
                const course = this.courses.get(id)!;
                return {
                    key: id,
                    height: 50,
                    cells: [
                        {
                            key: `progress-${id}`,
                            sortKey: isCompleted
                                ? Infinity
                                : progress.steps_completed /
                                  progress.steps_total,
                            content: (
                                <ProgressRadial
                                    diameter={30}
                                    thickness={3}
                                    max={isCompleted ? 1 : progress.steps_total}
                                    value={
                                        isCompleted
                                            ? 1
                                            : progress.steps_completed
                                    }
                                />
                            ),
                        },
                        {
                            key: `course-name-${id}`,
                            kind: String,
                            content: (
                                <div
                                    className={styles.courseNameCell}
                                    title={displayUnicode(
                                        course.title.rendered,
                                    )}
                                >
                                    <a href={course.link}>
                                        {displayUnicode(course.title.rendered)}
                                    </a>
                                </div>
                            ),
                        },
                        {
                            key: `date-${id}`,
                            kind: Date,
                            sortKey:
                                progress.activity_completed !== null
                                    ? progress.activity_completed
                                    : '',
                            content: isCompleted
                                ? new Date(
                                      progress.activity_completed!,
                                  ).toLocaleDateString()
                                : '',
                        },
                        {
                            key: `hours-${id}`,
                            kind: Number,
                            content: isCompleted ? progress.hours_awarded : '',
                        },
                    ],
                };
            });
    }
}

const addTagButton = (props: React.HTMLProps<HTMLButtonElement>) => (
    <ButtonIcon onClick={props.onClick} icon="add_circle_outline" size={16} />
);

const emptyProgress = () => (
    <Card className={styles.empty}>
        <Icon icon="assignment_late" size={50} />
        <div>This user has not interacted with any courses yet.</div>
    </Card>
);

const header: HeaderRow = {
    key: 'header',
    cells: [
        {
            key: 'status',
            content: 'Status',
            sortable: true,
            width: 40,
            scope: 'col',
        },
        {
            key: 'course-name',
            kind: String,
            content: 'Course',
            sortable: true,
            scope: 'col',
        },
        {
            key: 'completion-date',
            kind: Date,
            content: 'Date Completed',
            sortable: true,
            scope: 'col',
        },
        {
            key: 'hours',
            kind: Number,
            content: 'Hours',
            scope: 'col',
        },
    ],
};

const LearnerView = withMessageDispatcher(LearnerViewPre);
export default LearnerView;
