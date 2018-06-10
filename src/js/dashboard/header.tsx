import { flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { User, UserContext } from './';

import { Button } from 'components/buttons/';
import ClickToEdit from 'components/click-to-edit';

import * as styles from './header.scss';

interface Props {
    user: User;
    data: WordPress.User<'view'>;
}

class Store {
    @observable name: string;
    @observable institution: string;

    updateInstitution = flow(function*(
        this: Store,
        value: string,
    ): IterableIterator<any> {
        const oldValue = this.institution;
        this.institution = value;
        try {
            const response: Response = yield fetch(`/wp-json/wp/v2/users/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.AU_API.nonce,
                },
                body: JSON.stringify({ institution: value }),
                mode: 'same-origin',
            });
            if (!response.ok) {
                // FIXME:
                throw new Error('do something here');
            }
        } catch (e) {
            this.institution = oldValue;
            throw e;
        }
    }).bind(this);

    constructor(data: WordPress.User<'view'>) {
        this.name = data.name;
        this.institution = data.institution;
    }
}

@observer
class DashboardHeading extends React.Component<Props> {
    store: Store;

    constructor(props: Props) {
        super(props);
        this.store = new Store(props.data);
    }

    render(): JSX.Element {
        const { user } = this.props;
        return (
            <div className={styles.heading}>
                <div className={styles.headingContainer}>
                    <div>
                        <h1>{this.store.name}</h1>
                        {user === User.OWNER && (
                            <ClickToEdit
                                className={styles.institutionBtn}
                                placeholder="Add your institution"
                                onSave={this.store.updateInstitution}
                            >
                                {this.store.institution}
                            </ClickToEdit>
                        )}
                        {user === User.VISITOR &&
                            this.store.institution && (
                                <span className={styles.institution}>
                                    {this.store.institution}
                                </span>
                            )}
                    </div>
                    {user === User.OWNER && (
                        <Button primary>Edit profile</Button>
                    )}
                </div>
            </div>
        );
    }
}

export default (props: Omit<Props, 'user'>): JSX.Element => (
    <UserContext.Consumer>
        {(user: User): JSX.Element => (
            <DashboardHeading {...props} user={user} />
        )}
    </UserContext.Consumer>
);
