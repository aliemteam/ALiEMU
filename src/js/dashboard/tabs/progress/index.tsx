import { useContext, useEffect, useMemo, useState } from '@wordpress/element';
import { isAfter, isBefore } from 'date-fns';

import Button from 'components/buttons/button';
import { DashboardContext } from 'dashboard/dashboard';
import { Learners } from 'utils/api';

import ButtonOutlined from 'components/buttons/button-outlined';
import DateInput from 'components/forms/date-input';
import Table from 'components/table';
import Tag from 'components/tag';
import { SectionHeading } from 'components/typography/headings';
import LearnerView from './learner-view';

import styles from './tab-progress.scss';

declare const AU_NONCE: string;

export interface DateRange {
    start?: Date;
    end?: Date;
}

export default function TabProgress() {
    const { user } = useContext(DashboardContext);

    const [learners, setLearners] = useState<Learners.Learner[]>([]);
    const [learnersAreLoading, setLearnersAreLoading] = useState(true);

    const [selectedLearnerId, setSelectedLearnerId] = useState(user.id);

    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [tagFilters, setTagFilters] = useState<string[]>([]);

    const dateRange = useMemo(() => {
        const startDate = Date.parse(startDateFilter) || undefined;
        const endDate = Date.parse(endDateFilter) || undefined;
        return {
            start: startDate ? new Date(startDate) : undefined,
            end: endDate ? new Date(endDate) : undefined,
        };
    }, [startDateFilter, endDateFilter]);

    const tagList = useMemo(
        () =>
            Array.from(
                new Set(
                    learners
                        .map(learner => learner.learner_tags)
                        .reduce((a, b) => [...a, ...b], []),
                ),
            ),
        [learners],
    );

    useEffect(() => {
        setTagFilters(tagFilters.filter(tag => tagList.includes(tag)));
    }, [tagList]);

    useEffect(() => {
        let isSubscribed = true;
        Learners.fetch({ per_page: 100 }).then(l => {
            isSubscribed && setLearners([user, ...l]);
            isSubscribed && setLearnersAreLoading(false);
        });
        return () => {
            isSubscribed = false;
        };
    }, [user]);

    return (
        <>
            <LearnerView
                key={selectedLearnerId}
                dateRange={dateRange}
                learner={
                    learners.find(({ id }) => id === selectedLearnerId) || user
                }
                onUpdateLearner={learner => {
                    setLearners([
                        ...learners.filter(l => l.id !== learner.id),
                        learner,
                    ]);
                }}
            />
            <Table
                caption={id => (
                    <div className={styles.captionContainer}>
                        <div className={styles.captionLeft}>
                            <SectionHeading id={id}>My Learners</SectionHeading>
                            {tagFilters.map(t => (
                                <Tag
                                    key={t}
                                    text={t}
                                    onClick={tagToRemove =>
                                        setTagFilters(
                                            tagFilters.filter(
                                                tag => tag !== tagToRemove,
                                            ),
                                        )
                                    }
                                />
                            ))}
                        </div>
                        <form className={styles.exportLearnerForm} method="GET">
                            <input
                                name="action"
                                type="hidden"
                                value="export_learner_data"
                            />
                            <input
                                name="nonce"
                                type="hidden"
                                value={AU_NONCE}
                            />
                            <DateInput
                                name="start_date"
                                placeholder="Start date"
                                value={startDateFilter}
                                onChange={value => setStartDateFilter(value)}
                            />
                            <DateInput
                                name="end_date"
                                placeholder="End date"
                                value={endDateFilter}
                                onChange={value => setEndDateFilter(value)}
                            />
                            <Button>Export learner data</Button>
                        </form>
                    </div>
                )}
                header={{
                    key: 'header',
                    cells: [
                        {
                            key: 'first-name',
                            kind: String,
                            content: 'First Name',
                            scope: 'col',
                            sortable: true,
                        },
                        {
                            key: 'last-name',
                            kind: String,
                            content: 'Last Name',
                            scope: 'col',
                            sortable: true,
                        },
                        {
                            key: 'tags',
                            kind: String,
                            content: 'Tags',
                            scope: 'col',
                        },
                        {
                            key: 'courses-completed',
                            kind: Number,
                            content: 'Courses Completed',
                            scope: 'col',
                            sortable: true,
                        },
                        {
                            key: 'total-hours',
                            kind: Number,
                            content: 'Total Hours',
                            scope: 'col',
                            sortable: true,
                        },
                        {
                            key: 'actions',
                            content: 'Actions',
                            scope: 'col',
                            width: 100,
                        },
                    ],
                }}
                isEmpty={learners.length === 0}
                isLoading={learnersAreLoading}
                rows={learners
                    .filter(learner =>
                        tagFilters.every(t => learner.learner_tags.includes(t)),
                    )
                    .map(
                        ({
                            id,
                            first_name,
                            learner_tags,
                            last_name,
                            course_progress,
                        }) => {
                            const completed = course_progress.filter(
                                progress => {
                                    const { activity_completed } = progress;
                                    if (
                                        !isWithinDateRange(
                                            activity_completed,
                                            dateRange,
                                        )
                                    ) {
                                        return false;
                                    }
                                    return true;
                                },
                            );
                            return {
                                key: `${id}`,
                                cells: [
                                    {
                                        key: `${id}-first_name`,
                                        kind: String,
                                        content: first_name,
                                    },
                                    {
                                        key: `${id}-last_name`,
                                        kind: String,
                                        content: last_name,
                                    },
                                    {
                                        key: `${id}-tags`,
                                        kind: String,
                                        content: learner_tags.map(t => (
                                            <Tag
                                                key={t}
                                                text={t}
                                                onClick={tag =>
                                                    setTagFilters(
                                                        tagFilters.includes(tag)
                                                            ? tagFilters.filter(
                                                                  t =>
                                                                      t !== tag,
                                                              )
                                                            : [
                                                                  ...tagFilters,
                                                                  tag,
                                                              ],
                                                    )
                                                }
                                            />
                                        )),
                                    },
                                    {
                                        key: `${id}-completed`,
                                        kind: Number,
                                        content: completed.length,
                                    },
                                    {
                                        key: `${id}-hours`,
                                        kind: Number,
                                        content: completed.reduce(
                                            (total, course) =>
                                                total + course.hours_awarded,
                                            0,
                                        ),
                                    },
                                    {
                                        key: `${id}-actions`,
                                        content: (
                                            <ButtonOutlined
                                                data-user={id}
                                                disabled={
                                                    selectedLearnerId === id
                                                }
                                                intent="primary"
                                                onClick={() =>
                                                    setSelectedLearnerId(id)
                                                }
                                            >
                                                View
                                            </ButtonOutlined>
                                        ),
                                    },
                                ],
                            };
                        },
                    )}
                rowsPerPage={5}
            />
            <datalist id="tag-list">
                {tagList.map(t => (
                    <option key={t} value={t} />
                ))}
            </datalist>
        </>
    );
}

export function isWithinDateRange(
    inputDate: string | null | undefined,
    range?: DateRange,
) {
    if (!inputDate) {
        return false;
    }
    if (!range) {
        return true;
    }
    const { start, end } = range;
    const date = new Date(inputDate);
    if (start && isBefore(date, start)) {
        return false;
    }
    if (end && isAfter(date, end)) {
        return false;
    }
    return true;
}
