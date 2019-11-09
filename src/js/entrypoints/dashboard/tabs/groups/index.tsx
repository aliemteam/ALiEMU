import { memo, useContext, useEffect, useState } from '@wordpress/element';

import { Coaches, Learners } from 'utils/api';

import ButtonOutlined from 'components/buttons/button-outlined';
import Card from 'components/card';
import Icon from 'components/icon';
import { MessageContext } from 'components/message-hub';
import Table from 'components/table';
import { SectionHeading } from 'components/typography/headings';

import AddCoachForm from './add-coach-form';
import styles from './tab-groups.scss';

function TabGroups() {
    const [coachesAreLoading, setCoachesAreLoading] = useState(true);
    const [learnersAreLoading, setLearnersAreLoading] = useState(true);

    const [coaches, setCoaches] = useState<Coaches.Coach[]>([]);
    const [learners, setLearners] = useState<Learners.Learner[]>([]);

    const { dispatchMessage } = useContext(MessageContext);

    useEffect(() => {
        let isSubscribed = true;
        Promise.all<Coaches.Coach[], Learners.Learner[]>([
            Coaches.fetch({ per_page: 100 }),
            Learners.fetch({ per_page: 100 }),
        ]).then(([c, l]) => {
            if (isSubscribed) {
                setCoaches(c);
                setLearners(l);
                setCoachesAreLoading(false);
                setLearnersAreLoading(false);
            }
        });
        return () => {
            isSubscribed = false;
        };
    }, []);

    return (
        <>
            <h1>My Groups</h1>
            <Table
                isFixed
                caption={id => (
                    <div className={styles.tableCaption}>
                        <SectionHeading id={id}>My Coaches</SectionHeading>
                        <AddCoachForm
                            onAddCoach={coach =>
                                setCoaches([...coaches, coach])
                            }
                            onLoadingToggle={setCoachesAreLoading}
                        />
                    </div>
                )}
                defaultSortKey="name"
                emptyState={() => (
                    <div className={styles.emptyState}>
                        <div className={styles.tableCaption}>
                            <SectionHeading>My Coaches</SectionHeading>
                            <AddCoachForm
                                onAddCoach={coach =>
                                    setCoaches([...coaches, coach])
                                }
                                onLoadingToggle={setCoachesAreLoading}
                            />
                        </div>
                        <Card className={styles.emptyStateContent}>
                            <Icon icon="supervised_user_circle" size={100} />
                            <h3>No coaches yet</h3>
                            <p>
                                Add a coach now so that he/she can track your
                                progress and activity.
                            </p>
                        </Card>
                    </div>
                )}
                header={tableHeader}
                isEmpty={coaches.length === 0}
                isLoading={coachesAreLoading}
                rows={coaches.map(({ email, id, name }) => ({
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
                                    intent="danger"
                                    onClick={async () => {
                                        setCoachesAreLoading(true);
                                        try {
                                            await Coaches.remove(id);
                                            setCoaches(
                                                coaches.filter(
                                                    coach => coach.id !== id,
                                                ),
                                            );
                                        } catch {
                                            dispatchMessage({
                                                text: 'Uh oh!',
                                                details:
                                                    'An error occurred while attempting to remove the requested user. Please try again later.',
                                                intent: 'danger',
                                            });
                                        } finally {
                                            setCoachesAreLoading(false);
                                        }
                                    }}
                                >
                                    Remove
                                </ButtonOutlined>
                            ),
                        },
                    ],
                }))}
                rowsPerPage={5}
            />
            <Table
                isFixed
                caption={id => (
                    <div className={styles.tableCaption}>
                        <SectionHeading id={id}>My Learners</SectionHeading>
                    </div>
                )}
                defaultSortKey="name"
                emptyState={() => (
                    <div className={styles.emptyState}>
                        <SectionHeading>My Learners</SectionHeading>
                        <Card className={styles.emptyStateContent}>
                            <Icon icon="supervised_user_circle" size={100} />
                            <h3>No learners yet</h3>
                            <p>
                                Have your learners add you as a coach to begin
                                tracking their progress.
                            </p>
                        </Card>
                    </div>
                )}
                header={tableHeader}
                isEmpty={learners.length === 0}
                isLoading={learnersAreLoading}
                rows={learners.map(({ email, id, name }) => ({
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
                                    intent="danger"
                                    onClick={async () => {
                                        setLearnersAreLoading(true);
                                        try {
                                            await Learners.remove(id);
                                            setLearners(
                                                learners.filter(
                                                    learner =>
                                                        learner.id !== id,
                                                ),
                                            );
                                        } catch {
                                            dispatchMessage({
                                                text: 'Uh oh!',
                                                details:
                                                    'An error occurred while attempting to remove the requested user. Please try again later.',
                                                intent: 'danger',
                                            });
                                        } finally {
                                            setLearnersAreLoading(false);
                                        }
                                    }}
                                >
                                    Remove
                                </ButtonOutlined>
                            ),
                        },
                    ],
                }))}
                rowsPerPage={5}
            />
        </>
    );
}
export default memo(TabGroups);

const tableHeader: Table.HeaderRow = {
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
