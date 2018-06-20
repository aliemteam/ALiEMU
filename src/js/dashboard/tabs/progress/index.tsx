import * as isAfter from 'date-fns/is_after';
import * as isBefore from 'date-fns/is_before';
import { action, computed, flow, observable } from 'mobx';
import { observer, Observer } from 'mobx-react';
import * as React from 'react';

import { ILearner } from 'utils/types';

import { HeaderRow, Row } from 'components/tables/base';
import { Globals } from 'dashboard/dashboard';
import { Groups } from 'utils/api';

import ButtonOutlined from 'components/buttons/button-outlined';
import DateInput from 'components/forms/date-input';
import SimpleTable from 'components/tables/simple/';
import Tag from 'components/tag/';
import { SectionHeading } from 'components/typography/';

import LearnerView from './learner-view';
import * as styles from './tab-progress.scss';

declare const AU_Dashboard: Globals;

export interface DateRange {
    start?: Date;
    end?: Date;
}

@observer
export default class TabProgress extends React.Component {
    current_user = AU_Dashboard.current_user!;
    @observable learnersAreLoading: boolean = true;
    @observable selectedLearnerId = AU_Dashboard.current_user!.id;
    @observable startDateFilter = '';
    @observable endDateFilter = '';

    learners = observable.array<ILearner>([], { deep: true });
    tagFilters = observable.array<string>([], { deep: false });

    dateRangeForm = React.createRef<HTMLFormElement>();

    fetchLearners = flow(function*(this: TabProgress): IterableIterator<any> {
        const learners: ILearner[] = yield Groups.fetchLearners();
        this.learners.replace([AU_Dashboard.current_user!, ...learners]);
        this.learnersAreLoading = false;
    }).bind(this);

    @computed.struct
    get dateRange(): DateRange {
        const filterStart = this.startDateFilter;
        const filterEnd = this.endDateFilter;
        const form = this.dateRangeForm.current;
        const startInput = form
            ? (form.elements[0] as HTMLInputElement)
            : undefined;
        const endInput = form
            ? (form.elements[1] as HTMLInputElement)
            : undefined;
        return {
            start:
                startInput && startInput.validity.valid
                    ? new Date(filterStart)
                    : undefined,
            end:
                endInput && endInput.validity.valid
                    ? new Date(filterEnd)
                    : undefined,
        };
    }

    @computed
    get selectedLearner(): ILearner {
        return (
            this.learners.find(({ id }) => id === this.selectedLearnerId) ||
            this.current_user
        );
    }
    set selectedLearner({ id }: ILearner) {
        this.selectedLearnerId = id;
    }

    @computed
    get learnerRows(): Row[] {
        return this.learners
            .filter(learner =>
                this.tagFilters.every(t => learner.learner_tags.includes(t)),
            )
            .map(this.createLearnerRow);
    }

    @computed
    get tagList(): string[] {
        return Array.from(
            new Set(
                this.learners
                    .map(learner => learner.learner_tags)
                    .reduce((a, b) => [...a, ...b], []),
            ),
        );
    }

    componentDidMount(): void {
        this.fetchLearners();
    }

    @action
    handleLearnerSelect = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const { user } = e.currentTarget.dataset;
        if (user) {
            this.selectedLearnerId = parseInt(user, 10);
        }
    };

    @action
    handleTagClick = (tag: string): void => {
        this.tagFilters.remove(tag) || this.tagFilters.push(tag);
    };

    @action
    handleStartDateChange = (value: string): void => {
        this.startDateFilter = value;
    };

    @action
    handleEndDateChange = (value: string): void => {
        this.endDateFilter = value;
    };

    render(): JSX.Element {
        return (
            <>
                <LearnerView
                    key={this.selectedLearner.id}
                    learner={this.selectedLearner}
                    dateRange={this.dateRange}
                />
                <SimpleTable
                    caption={this.renderTableCaption}
                    header={header}
                    rows={this.learnerRows}
                    rowsPerPage={5}
                    isLoading={this.learnersAreLoading}
                    isEmpty={this.learnersAreLoading}
                />
                <datalist id="tag-list">
                    {this.tagList.map(t => (
                        <option key={t} value={t} role="listitem" />
                    ))}
                </datalist>
            </>
        );
    }

    private renderTableCaption = (id: string): JSX.Element => {
        const captionRenderer = () => (
            <div className={styles.captionContainer}>
                <div className={styles.captionLeft}>
                    <SectionHeading id={id}>My Learners</SectionHeading>
                    {this.tagFilters.map(t => (
                        <Tag onClick={this.handleTagClick} key={t}>
                            {t}
                        </Tag>
                    ))}
                </div>
                <form className={styles.captionRight} ref={this.dateRangeForm}>
                    <DateInput
                        value={this.startDateFilter}
                        placeholder="Start Date"
                        onChange={this.handleStartDateChange}
                    />
                    <DateInput
                        value={this.endDateFilter}
                        placeholder="End Date"
                        onChange={this.handleEndDateChange}
                    />
                </form>
            </div>
        );
        return <Observer>{captionRenderer}</Observer>;
    };

    private createLearnerRow = ({
        id,
        first_name,
        learner_tags,
        last_name,
        course_progress,
    }: ILearner): Row => {
        const completed = course_progress.filter(progress => {
            const { activity_completed } = progress;
            if (!isWithinDateRange(activity_completed, this.dateRange)) {
                return false;
            }
            return true;
        });
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
                        <Tag onClick={this.handleTagClick} key={t}>
                            {t}
                        </Tag>
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
                        (total, course) => total + course.hours_awarded,
                        0,
                    ),
                },
                {
                    key: `${id}-actions`,
                    content: (
                        <ButtonOutlined
                            data-user={id}
                            disabled={this.selectedLearnerId === id}
                            onClick={this.handleLearnerSelect}
                        >
                            View
                        </ButtonOutlined>
                    ),
                },
            ],
        };
    };
}

export const isWithinDateRange = (
    inputDate: string | null | undefined,
    range?: DateRange,
): boolean => {
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
};

const header: HeaderRow = {
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
};
