import { useContext, useEffect, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';

import { MessageContext } from 'components/message-hub';
import { Courses, Learners, LearnerTags } from 'utils/api';
import { DateRange, isWithinDateRange } from './';
import styles from './learner-view.scss';

import ButtonIcon from 'components/buttons/button-icon';
import Card from 'components/card';
import ClickToEdit from 'components/click-to-edit';
import Icon from 'components/icon';
import ProgressRadial from 'components/progress-radial';
import Table from 'components/table';
import Tag from 'components/tag';
import { SectionHeading } from 'components/typography/headings';

interface Props {
    learner: Learners.Learner;
    dateRange?: DateRange;
    onUpdateLearner(learner: Learners.Learner): void;
}

// FIXME: broken layout on mobile
export default function LearnerView({
    dateRange,
    learner,
    onUpdateLearner,
}: Props) {
    const { avatar_urls, course_progress, id, learner_tags, name } = learner;
    const [coursesAreLoading, setCoursesAreLoading] = useState(true);
    const [courses, setCourses] = useState<Courses.Course[]>([]);

    const { dispatchMessage } = useContext(MessageContext);

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            isSubscribed && setCoursesAreLoading(true);
            const include = course_progress.map(course => course.id);
            const fetchedCourses =
                include.length > 0
                    ? await Courses.fetchMany({ include, per_page: 100 })
                    : [];
            isSubscribed && setCourses(fetchedCourses);
            isSubscribed && setCoursesAreLoading(false);
        })();
        return () => {
            isSubscribed = false;
        };
    }, [id, course_progress]);

    return (
        <div key={id} className={styles.containerOuter}>
            <h1 className={styles.name}>{name}</h1>
            <div className={styles.containerInner}>
                <img
                    alt="User avatar"
                    className={styles.img}
                    src={avatar_urls[150]}
                />
                <div className={styles.metadata}>
                    <div className={styles.tagHeading}>
                        <SectionHeading>Tags</SectionHeading>
                        <ClickToEdit
                            buttonElement={({ onClick }) => (
                                <ButtonIcon
                                    icon="add_circle_outline"
                                    size={16}
                                    onClick={onClick}
                                />
                            )}
                            inputProps={{ list: 'tag-list' }}
                            onSave={async tag => {
                                if (learner_tags.includes(tag)) {
                                    return;
                                }
                                try {
                                    onUpdateLearner({
                                        ...learner,
                                        learner_tags: await LearnerTags.add(
                                            id,
                                            tag,
                                        ),
                                    });
                                } catch {
                                    dispatchMessage({
                                        text: 'Uh oh!',
                                        details:
                                            'An error occurred while attempting to add the learner tag. Please try again later.',
                                        intent: 'danger',
                                    });
                                }
                            }}
                        />
                    </div>
                    <div className={styles.tagContainer}>
                        {learner_tags.map(t => (
                            <Tag
                                key={t}
                                text={t}
                                onRemove={async tag => {
                                    try {
                                        onUpdateLearner({
                                            ...learner,
                                            learner_tags: await LearnerTags.remove(
                                                id,
                                                tag,
                                            ),
                                        });
                                    } catch {
                                        dispatchMessage({
                                            text: 'Uh oh!',
                                            details:
                                                'An error occurred while attempting to remove the selected learner tag. Please try again later.',
                                            intent: 'danger',
                                        });
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Table
                caption="Course Progress"
                containerClassName={styles.tableContainer}
                defaultSortKey="status"
                emptyState={() => (
                    <Card className={styles.empty}>
                        <Icon icon="assignment_late" size={50} />
                        <div>
                            This user has not interacted with any courses yet.
                        </div>
                    </Card>
                )}
                header={{
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
                }}
                isEmpty={courses.length === 0}
                isLoading={coursesAreLoading}
                rows={
                    coursesAreLoading
                        ? []
                        : course_progress
                              .filter(({ activity_completed, id, status }) => {
                                  if (
                                      status === 'COMPLETED' &&
                                      !isWithinDateRange(
                                          activity_completed,
                                          dateRange,
                                      )
                                  ) {
                                      return false;
                                  }
                                  if (
                                      courses.findIndex(
                                          course => course.id === id,
                                      ) === -1
                                  ) {
                                      return false;
                                  }
                                  return true;
                              })
                              .map(progress => {
                                  const { id, status } = progress;
                                  const isCompleted = status === 'COMPLETED';
                                  const course = courses.find(
                                      course => course.id === id,
                                  );
                                  if (!course) {
                                      throw new Error(
                                          `Could not retrieve course id "${id}"`,
                                      );
                                  }
                                  return {
                                      key: `${id}`,
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
                                                      max={
                                                          isCompleted
                                                              ? 1
                                                              : progress.steps_total
                                                      }
                                                      thickness={3}
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
                                              sortKey: course.title.rendered,
                                              content: (
                                                  <div
                                                      className={
                                                          styles.courseNameCell
                                                      }
                                                      title={decodeEntities(
                                                          course.title.rendered,
                                                      )}
                                                  >
                                                      <a href={course.link}>
                                                          {decodeEntities(
                                                              course.title
                                                                  .rendered,
                                                          )}
                                                      </a>
                                                  </div>
                                              ),
                                          },
                                          {
                                              key: `date-${id}`,
                                              kind: Date,
                                              sortKey:
                                                  progress.activity_completed !==
                                                  null
                                                      ? progress.activity_completed
                                                      : '',
                                              content:
                                                  isCompleted &&
                                                  progress.activity_completed
                                                      ? new Date(
                                                            progress.activity_completed,
                                                        ).toLocaleDateString()
                                                      : '',
                                          },
                                          {
                                              key: `hours-${id}`,
                                              kind: Number,
                                              content: isCompleted
                                                  ? progress.hours_awarded
                                                  : '',
                                          },
                                      ],
                                  };
                              })
                }
                rowsPerPage={5}
            />
        </div>
    );
}
