import * as dateFormat from 'date-fns/format';
import { computed, flow, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Row } from 'components/tables/base';
import { displayUnicode } from 'utils/text-utils';
import * as styles from './learner-view.scss';

import ProgressRadial from 'components/progress-radial/';
import SimpleTable, { HeaderSortable } from 'components/tables/simple/';
import { SectionHeading } from 'components/typography/';

// TODO: Add link rel preload for this url: https://secure.gravatar.com/avatar?s=150&d=mp and work some magic to prevent image flickering

interface Props {
    learner: WordPress.BaseUser;
}

export const fetchCourses = async (
    courseIds: number[],
    page: number = 1,
    courses: ALiEMU.Course[] = [],
): Promise<ALiEMU.Course[]> => {
    const response = await fetch(
        `/wp-json/aliemu/v1/courses?page=${page}&include=${courseIds.join(
            ',',
        )}&_embed`,
        {
            headers: {
                'X-WP-Nonce': window.AU_API.nonce,
            },
        },
    );
    courses = [...courses, ...(await response.json())];

    let totalPages = 0;
    if (response.headers.has('X-WP-TotalPages')) {
        totalPages = parseInt(response.headers.get('X-WP-TotalPages')!, 10);
    }
    if (page >= totalPages) {
        return courses;
    }
    return fetchCourses(courseIds, page + 1, courses);
};

@observer
export default class LearnerView extends React.Component<Props> {
    @observable coursesLoading = true;
    @observable learner = this.props.learner;

    courses = observable.map<number, ALiEMU.Course>([], { deep: false });

    fetchCourses = flow(function*(this: LearnerView): IterableIterator<any> {
        this.coursesLoading = true;
        this.courses.clear();
        const { completed, started } = this.props.learner.course_progress;
        const courseIds = [...completed, ...started].map(({ id }) => id);
        const courses: ALiEMU.Course[] = yield fetchCourses(courseIds);
        this.courses.replace(courses.map(course => [course.id, course]));
        this.coursesLoading = false;
    });

    private disposeLearnerReaction: IReactionDisposer;

    constructor(props: Props) {
        super(props);
        this.fetchCourses();
        this.disposeLearnerReaction = reaction(
            () => this.props.learner.id,
            () => this.fetchCourses(),
        );
    }

    componentWillUnmount(): void {
        this.disposeLearnerReaction();
    }

    render(): JSX.Element {
        const { avatar_urls, name, id } = this.props.learner;
        return (
            <div className={styles.grid} key={id}>
                <div className={styles.info}>
                    <img src={avatar_urls[150]} />
                    <div>
                        <h2>{name}</h2>
                        <div>Tags will go here</div>
                    </div>
                </div>
                <div className={styles.data}>
                    <SimpleTable
                        containerClassName={styles.progressTable}
                        header={headerRow}
                        renderCaption={progressCaptionRenderer}
                        rows={[...this.courseProgressRows]}
                        rowsPerPage={5}
                        defaultSortKey="progress"
                        isLoading={this.coursesLoading}
                        isEmpty={this.courses.size === 0}
                    />
                </div>
            </div>
        );
    }

    @computed
    get courseProgressRows(): Row[] {
        if (this.coursesLoading) {
            return [];
        }
        const {
            course_progress: { completed, started },
        } = this.props.learner;
        const items = [...this.courses.entries()];
        return items.map(([id, course]) => {
            let progress: any = completed.find(i => i.id === id);
            if (progress) {
                return {
                    key: id,
                    cells: [
                        {
                            key: `progress-${id}`,
                            sortKey: Infinity,
                            content: (
                                <ProgressRadial
                                    diameter={25}
                                    thickness={2}
                                    max={1}
                                    value={1}
                                />
                            ),
                        },
                        {
                            key: `course-name-${id}`,
                            kind: String,
                            content: displayUnicode(course.title.rendered),
                        },
                        {
                            key: `date-${id}`,
                            kind: Date,
                            content: dateFormat(
                                new Date(progress.date),
                                'YYYY/MM/DD',
                            ),
                        },
                        {
                            key: `hours-${id}`,
                            kind: Number,
                            content: progress.hours,
                        },
                    ],
                };
            }
            progress = started.find(i => i.id === id)!;
            const steps = progress.lessons_completed
                ? progress.lessons_completed.length
                : 0 + progress.topics_completed
                    ? progress.topics_completed.length
                    : 0;
            return {
                key: id,
                cells: [
                    {
                        key: `progress-${id}`,
                        sortKey: steps,
                        content: (
                            <ProgressRadial
                                diameter={25}
                                thickness={2}
                                max={progress.total_steps}
                                value={steps}
                            />
                        ),
                    },
                    {
                        key: `course-name-${id}`,
                        kind: String,
                        content: displayUnicode(course.title.rendered),
                    },
                    {
                        key: `date-${id}`,
                        kind: Date,
                        content: '',
                    },
                    {
                        key: `hours-${id}`,
                        kind: Number,
                        content: '',
                    },
                ],
            };
        });
    }
}

const progressCaptionRenderer = (id: string): JSX.Element => (
    <SectionHeading id={id}>Course Progress</SectionHeading>
);

const headerRow: Row<HeaderSortable> = {
    key: 'header',
    cells: [
        {
            key: 'progress',
            content: 'Progress',
            sortable: true,
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
