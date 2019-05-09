import { action, flow, observable } from 'mobx';
import { observer, Observer } from 'mobx-react';
import React from 'react';

import { Groups } from 'utils/api';
import { Intent } from 'utils/constants';
import { Coach, Learner } from 'utils/types';

import Button from 'components/buttons/button';
import ButtonOutlined from 'components/buttons/button-outlined';
import Card from 'components/card/';
import Input from 'components/forms/input';
import Icon from 'components/icon/';
import { MessageContext, withMessageDispatcher } from 'components/message-hub/';
import { HeaderRow, Row } from 'components/tables/base';
import SimpleTable from 'components/tables/simple/';
import { SectionHeading } from 'components/typography/headings';

import styles from './tab-groups.scss';

type Member = Learner | Coach;

const enum MemberKind {
    LEARNER = 'learners',
    COACH = 'coaches',
}

@observer
class TabGroupsPre extends React.Component<MessageContext> {
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

    fetchGroups = flow(function*(this: TabGroupsPre) {
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
        this: TabGroupsPre,
        e: React.MouseEvent<HTMLButtonElement>,
    ) {
        const kind = e.currentTarget.dataset.kind as MemberKind;
        const id = parseInt(e.currentTarget.dataset.id || '0', 10);
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
        } catch {
            this.props.dispatchMessage({
                text: 'Uh oh!',
                details:
                    'An error occurred while attempting to remove the requested user. Please try again later.',
                intent: Intent.DANGER,
            });
        }

        this.toggleLoadingFor(kind);
    }).bind(this);

    addCoach = flow(function*(
        this: TabGroupsPre,
        e: React.FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();
        const email = this.emailInput;
        this.emailInput = '';
        this.coachesAreLoading = true;
        try {
            const newCoach: Coach = yield Groups.addCoach(email);
            this.coaches.push(newCoach);
        } catch (e) {
            this.props.dispatchMessage({
                text: 'Uh oh!',
                details:
                    e.responseJSON && e.responseJSON.message
                        ? e.responseJSON.message
                        : 'An error occurred while attempting to add the requested user as a coach. Please try again later.',
                intent: Intent.DANGER,
            });
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
                    defaultSortKey="name"
                    emptyState={this.emptyCoachesRenderer}
                    header={header}
                    isEmpty={this.coaches.length === 0}
                    isLoading={this.coachesAreLoading}
                    rows={this.coaches.map(
                        this.makeRowCreator(MemberKind.COACH),
                    )}
                    rowsPerPage={5}
                />
                <SimpleTable
                    fixed
                    caption={this.learnersTableCaption}
                    defaultSortKey="name"
                    emptyState={this.emptyLearnersRenderer}
                    header={header}
                    isEmpty={this.learners.length === 0}
                    isLoading={this.learnersAreLoading}
                    rows={this.learners.map(
                        this.makeRowCreator(MemberKind.LEARNER),
                    )}
                    rowsPerPage={5}
                />
            </>
        );
    }

    private coachesTableCaption = (id: string) => (
        <div className={styles.tableCaption}>
            <SectionHeading id={id}>My Coaches</SectionHeading>
            <Observer>{this.addCoachForm}</Observer>
        </div>
    );

    private learnersTableCaption = (id: string) => (
        <div className={styles.tableCaption}>
            <SectionHeading id={id}>My Learners</SectionHeading>
        </div>
    );

    private emptyCoachesRenderer = () => (
        <div className={styles.emptyState}>
            <div className={styles.tableCaption}>
                <SectionHeading>My Coaches</SectionHeading>
                <Observer>{this.addCoachForm}</Observer>
            </div>
            <Card className={styles.emptyStateContent}>
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
            <SectionHeading>My Learners</SectionHeading>
            <Card className={styles.emptyStateContent}>
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
        <form className={styles.addCoachForm} onSubmit={this.addCoach}>
            <Input
                required
                aria-label="Add a coach using their email address"
                placeholder="Email address"
                type="email"
                value={this.emailInput}
                onChange={this.handleEmailChange}
            />
            <Button
                intent={Intent.PRIMARY}
                style={{ backgroundColor: '#345995' }}
                type="submit"
            >
                Add coach
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
                            data-id={id}
                            data-kind={kind}
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

const TabGroups = withMessageDispatcher(TabGroupsPre);
export default TabGroups;
