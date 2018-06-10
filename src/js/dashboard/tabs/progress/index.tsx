import { action, computed, flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Row } from 'components/tables/base';
import { Globals } from 'dashboard/dashboard';

import ButtonOutlined from 'components/buttons/button-outlined';
import SimpleTable, { HeaderSortable } from 'components/tables/simple/';
import { SectionHeading } from 'components/typography/';

import LearnerView from './learner-view';

declare const AU_Dashboard: Globals;
const current_user = AU_Dashboard.current_user!;

type Learner = ALiEMU.LearnerOfUser;

export const fetchLearners = async (
    endpoint: string = '/wp-json/wp/v2/users/me/groups?_embed',
    learners: Learner[] = [],
): Promise<Learner[]> => {
    const response: ALiEMU.Groups = await fetch(endpoint, {
        headers: {
            'X-WP-Nonce': window.AU_API.nonce,
        },
    }).then(res => res.json());
    if (response._embedded && response._embedded.learners) {
        learners = [...learners, ...response._embedded.learners[0]];
    }
    if (!response._links.next) {
        return learners;
    }
    return fetchLearners(response._links.next[0].href, learners);
};

@observer
export default class TabProgress extends React.Component {
    @observable learnersAreLoading: boolean = true;
    @observable selectedLearnerId = current_user.id;

    learners = observable.array<Learner>([], { deep: false });

    @computed
    get selectedLearner(): Learner {
        return this.learners.find(({ id }) => id === this.selectedLearnerId) || current_user;
    }
    set selectedLearner({ id }: Learner) {
        this.selectedLearnerId = id;
    }

    @computed
    get learnerRows(): Row[] {
        return this.learners.map(this.createLearnerRow);
    }

    fetchLearners = flow(function*(this: TabProgress): IterableIterator<any> {
        const learners = yield fetchLearners();
        this.learners.replace([current_user, ...learners]);
        this.learnersAreLoading = false;
    }).bind(this);

    componentDidMount(): void {
        this.fetchLearners();
    }

    @action
    handleLearnerSelect = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const { user } = e.currentTarget.dataset;
        if ( user ) {
            this.selectedLearnerId = parseInt(user, 10);
        }
    };

    render(): JSX.Element {
        const learnerTableCaption = (id: string) => (
            <SectionHeading id={id}>My Learners</SectionHeading>
        );
        return (
            <>
                <LearnerView learner={this.selectedLearner} />
                <SimpleTable
                    renderCaption={learnerTableCaption}
                    header={header}
                    rows={this.learnerRows}
                    rowsPerPage={5}
                    isLoading={this.learnersAreLoading}
                    isEmpty={this.learnersAreLoading}
                />
            </>
        );
    }

    private createLearnerRow = ({
        id,
        first_name,
        last_name,
        course_progress: { completed },
    }: Learner): Row => ({
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
                key: `${id}-completed`,
                kind: Number,
                content: completed.length,
            },
            {
                key: `${id}-hours`,
                kind: Number,
                content: completed.reduce(
                    (total, course) => total + course.hours,
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
    });
}

const header: Row<HeaderSortable> = {
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
