import { action, computed, flow, observable } from 'mobx';
import { observer, Observer } from 'mobx-react';
import * as React from 'react';

import { Row } from 'components/tables/base';
import { Intent } from 'utils/constants';
import * as styles from './tab-groups.scss';

import { Button } from 'components/buttons/';
import ButtonOutlined from 'components/buttons/button-outlined';
import { Input } from 'components/forms/';
import Icon from 'components/icon/';
import SimpleTable from 'components/tables/simple/';
import { SectionHeading } from 'components/typography/';

type Member = ALiEMU.LearnerOfUser | ALiEMU.CoachOfUser;

const enum MemberKind {
    LEARNER = 'learners',
    COACH = 'coaches',
}

@observer
export default class TabGroups extends React.Component {
    @observable coachesSortByColumn: number = 0;
    @observable coachesAreLoading: boolean = true;

    @observable learnersSortByColumn: number = 0;
    @observable learnersAreLoading: boolean = true;

    @observable emailInput: string = '';

    coaches = observable.array<Member>([], { deep: false });
    learners = observable.array<Member>([], { deep: false });

    @computed
    get coachRows(): Row[] {
        return [
            headingRow,
            ...this.coaches
                .map(this.makeRowCreator(MemberKind.COACH))
                .sort(this.makeRowSorter(this.coachesSortByColumn)),
        ];
    }

    @computed
    get learnerRows(): Row[] {
        return [
            headingRow,
            ...this.learners
                .map(this.makeRowCreator(MemberKind.LEARNER))
                .sort(this.makeRowSorter(this.learnersSortByColumn)),
        ];
    }

    fetchGroups = flow(function*(this: TabGroups): IterableIterator<any> {
        const response: ALiEMU.Groups = yield fetch(
            '/wp-json/wp/v2/users/me/groups?_embed',
            {
                headers: { 'X-WP-Nonce': window.AU_API.nonce },
                mode: 'same-origin',
            },
        ).then(res => res.json());
        if (response._embedded) {
            const { coaches, learners } = response._embedded;
            if (coaches) {
                this.coaches.replace(coaches[0]);
            }
            if (learners) {
                this.learners.replace(learners[0]);
            }
        }
        this.coachesAreLoading = false;
        this.learnersAreLoading = false;
    }).bind(this);

    removeMember = flow(function*(
        this: TabGroups,
        e: React.MouseEvent<HTMLAnchorElement>,
    ): IterableIterator<any> {
        const { email } = e.currentTarget.dataset;
        const kind = e.currentTarget.dataset.kind as MemberKind | undefined;
        if (!kind || !email) {
            return;
        }
        this.toggleLoadingFor(kind);
        const response: Response = yield fetch(
            '/wp-json/wp/v2/users/me/groups',
            {
                method: 'DELETE',
                headers: {
                    'X-WP-Nonce': window.AU_API.nonce,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    kind: kind === MemberKind.COACH ? 'coach' : 'learner',
                }),
                mode: 'same-origin',
            },
        );
        if (response.ok) {
            this[kind].replace(
                this[kind].filter(member => member.email !== email),
            );
        } else {
            // TODO:
            console.error('do something with the error here.');
        }
        this.toggleLoadingFor(kind);
    }).bind(this);

    addCoach = flow(function*(
        this: TabGroups,
        e: React.FormEvent<HTMLFormElement>,
    ): IterableIterator<any> {
        e.preventDefault();
        const email = this.emailInput;
        this.emailInput = '';
        this.coachesAreLoading = true;
        try {
            const response: ALiEMU.Groups = yield fetch(
                '/wp-json/wp/v2/users/me/groups',
                {
                    method: 'POST',
                    headers: {
                        'X-WP-Nonce': window.AU_API.nonce,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                    }),
                    mode: 'same-origin',
                },
            ).then(data => data.json());
            if (response._embedded && response._embedded.coaches) {
                this.coaches.replace(response._embedded.coaches[0]);
            }
        } catch (e) {
            console.error(e);
        }
        this.coachesAreLoading = false;
    }).bind(this);

    componentDidMount(): void {
        this.fetchGroups();
    }

    @action
    handleEmailChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.emailInput = e.currentTarget.value;
    };

    render(): JSX.Element {
        return (
            <>
                <h1>My Groups</h1>
                <SimpleTable
                    fixed
                    renderCaption={this.coachesTableCaption}
                    rows={this.coachRows}
                    emptyState={emptyCoaches}
                    isEmpty={this.coaches.length === 0}
                    isLoading={this.coachesAreLoading}
                />
                <SimpleTable
                    fixed
                    renderCaption={this.learnerTableCaption}
                    rows={this.learnerRows}
                    emptyState={emptyLearners}
                    isEmpty={this.learners.length === 0}
                    isLoading={this.learnersAreLoading}
                />
            </>
        );
    }

    private learnerTableCaption = (id: string) => (
        <SectionHeading id={id}>My Learners</SectionHeading>
    );

    private coachesTableCaption = (id: string) => {
        const formRenderer = () => (
            <form onSubmit={this.addCoach} className={styles.addCoachForm}>
                <Input
                    type="email"
                    placeholder="Email address"
                    aria-label="Add a coach using their email address"
                    value={this.emailInput}
                    onChange={this.handleEmailChange}
                    required
                />
                <Button
                    type="submit"
                    style={{ backgroundColor: '#345995' }}
                    primary
                >
                    Add Coach
                </Button>
            </form>
        );
        return (
            <div className={styles.coachesCaption}>
                <SectionHeading id={id}>My Coaches</SectionHeading>
                <Observer>{formRenderer}</Observer>
            </div>
        );
    };

    @action
    private toggleLoadingFor = (kind: MemberKind, state?: boolean): boolean => {
        switch (kind) {
            case MemberKind.COACH:
                return (this.coachesAreLoading = state
                    ? state
                    : !this.coachesAreLoading);
            case MemberKind.LEARNER:
            default:
                return (this.learnersAreLoading = state
                    ? state
                    : !this.learnersAreLoading);
        }
    };

    private makeRowCreator = (kind: MemberKind) => (user: Member): Row => {
        const { email, id, name } = user;
        return {
            key: `${id}`,
            height: 48,
            cells: [
                {
                    key: name,
                    kind: String,
                    content: name,
                },
                {
                    key: email,
                    kind: String,
                    content: email,
                },
                {
                    key: `actions-${id}`,
                    content: (
                        <ButtonOutlined
                            data-kind={kind}
                            data-email={email}
                            intent={Intent.DANGER}
                            onClick={this.removeMember}
                        >
                            Remove
                        </ButtonOutlined>
                    ),
                },
            ],
        };
    };

    private makeRowSorter = (sortByColumn: number) => (a: Row, b: Row) => {
        const keyA = a.cells[sortByColumn].key;
        const keyB = b.cells[sortByColumn].key;
        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
    };
}

const headingRow: Row = {
    key: 'heading',
    cells: [
        {
            key: 'name',
            kind: String,
            content: 'Name',
            scope: 'col',
        },
        {
            key: 'email',
            kind: String,
            content: 'Email',
            scope: 'col',
        },
        {
            key: 'actions',
            content: 'Actions',
            scope: 'col',
            width: 110,
        },
    ],
};

const emptyCoaches = () => (
    <div className={styles.emptyState}>
        <Icon icon="supervised_user_circle" size={100} />
        <h3>No coaches yet</h3>
        <p>
            Add a coach above so that he/she can track your progress and
            activity.
        </p>
    </div>
);

const emptyLearners = () => (
    <div className={styles.emptyState}>
        <Icon icon="supervised_user_circle" size={100} />
        <h3>No learners yet</h3>
        <p>Have your learners add you as a coach and they will show up here.</p>
    </div>
);
