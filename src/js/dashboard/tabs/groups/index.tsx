import { action, flow, observable } from 'mobx';
import { observer, Observer } from 'mobx-react';
import React from 'react';

import { ICoach, ILearner } from 'utils/types';

import { HeaderRow, Row } from 'components/tables/base';
import { Groups } from 'utils/api';
import { Intent } from 'utils/constants';
import styles from './tab-groups.scss';

import Button from 'components/buttons/button';
import ButtonOutlined from 'components/buttons/button-outlined';
import Card from 'components/card/';
import Input from 'components/forms/input';
import Icon from 'components/icon/';
import SimpleTable from 'components/tables/simple/';
import { SectionHeading } from 'components/typography/headings';

type Member = ILearner | ICoach;

const enum MemberKind {
    LEARNER = 'learners',
    COACH = 'coaches',
}

@observer
export default class TabGroups extends React.Component {
    @observable
    coachesSortByColumn: number = 0;
    @observable
    coachesAreLoading: boolean = true;

    @observable
    learnersSortByColumn: number = 0;
    @observable
    learnersAreLoading: boolean = true;

    @observable
    emailInput: string = '';

    coaches = observable.array<Member>([], { deep: false });
    learners = observable.array<Member>([], { deep: false });

    fetchGroups = flow(function*(this: TabGroups): IterableIterator<any> {
        const [coaches, learners] = yield Promise.all([
            Groups.fetchCoaches(),
            Groups.fetchLearners(),
        ]);
        this.coaches.replace(coaches);
        this.learners.replace(learners);
        this.coachesAreLoading = false;
        this.learnersAreLoading = false;
    }).bind(this);

    removeMember = flow(function*(
        this: TabGroups,
        e: React.MouseEvent<HTMLButtonElement>,
    ): IterableIterator<any> {
        const kind = e.currentTarget.dataset.kind as MemberKind;
        const id = parseInt(e.currentTarget.dataset.id!, 10);
        if (!kind || isNaN(id)) {
            return;
        }
        this.toggleLoadingFor(kind);

        try {
            switch (kind) {
                case MemberKind.COACH:
                    yield Groups.removeCoach(id);
                    break;
                case MemberKind.LEARNER:
                    yield Groups.removeLearner(id);
                    break;
                default:
                    throw new Error('Invalid member kind given.');
            }
            this[kind].replace(this[kind].filter(member => member.id !== id));
        } catch (e) {
            // FIXME:
            console.error(e);
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
            const newCoach: ICoach = yield Groups.addCoach(email);
            this.coaches.push(newCoach);
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
                    caption={this.coachesTableCaption}
                    header={header}
                    rows={this.coaches.map(
                        this.makeRowCreator(MemberKind.COACH),
                    )}
                    emptyState={this.emptyCoachesRenderer}
                    isEmpty={this.coaches.length === 0}
                    isLoading={this.coachesAreLoading}
                    defaultSortKey="name"
                    rowsPerPage={5}
                />
                <SimpleTable
                    fixed
                    caption="My Learners"
                    header={header}
                    rows={this.learners.map(
                        this.makeRowCreator(MemberKind.LEARNER),
                    )}
                    emptyState={this.emptyLearnersRenderer}
                    isEmpty={this.learners.length === 0}
                    isLoading={this.learnersAreLoading}
                    defaultSortKey="name"
                    rowsPerPage={5}
                />
            </>
        );
    }

    private coachesTableCaption = (id: string) => {
        return (
            <div className={styles.coachesCaption}>
                <SectionHeading id={id}>My Coaches</SectionHeading>
                <Observer>{this.addCoachForm}</Observer>
            </div>
        );
    };

    private emptyCoachesRenderer = () => (
        <div className={styles.emptyState}>
            <div className={styles.coachesCaption}>
                <SectionHeading>My Coaches</SectionHeading>
                <Observer>{this.addCoachForm}</Observer>
            </div>
            <Card>
                <Icon icon="supervised_user_circle" size={100} />
                <h3>No coaches yet</h3>
                <p>
                    Add a coach now so that he/she can track your progress and
                    activity.
                </p>
            </Card>
        </div>
    );

    private emptyLearnersRenderer = () => (
        <div className={styles.emptyState}>
            <Card>
                <Icon icon="supervised_user_circle" size={100} />
                <h3>No learners yet</h3>
                <p>
                    Have your learners add you as a coach to begin tracking
                    their progress.
                </p>
            </Card>
        </div>
    );

    private addCoachForm = () => (
        <form onSubmit={this.addCoach} className={styles.addCoachForm}>
            <Input
                required
                type="email"
                placeholder="Email address"
                aria-label="Add a coach using their email address"
                value={this.emailInput}
                onChange={this.handleEmailChange}
            />
            <Button
                type="submit"
                style={{ backgroundColor: '#345995' }}
                intent={Intent.PRIMARY}
            >
                Add Coach
            </Button>
        </form>
    );

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
                            data-id={id}
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
}

const header: HeaderRow = {
    key: 'heading',
    cells: [
        {
            key: 'name',
            kind: String,
            content: 'Name',
            scope: 'col',
            width: 200,
            sortable: true,
        },
        {
            key: 'email',
            kind: String,
            content: 'Email',
            scope: 'col',
            width: 200,
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
