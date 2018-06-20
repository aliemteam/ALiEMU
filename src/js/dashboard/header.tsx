import { action, flow, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Users } from 'utils/api';
import { UserContext, UserKind } from './';

import { Button } from 'components/buttons/';
import ClickToEdit from 'components/click-to-edit';
import Input from 'components/forms/input';
import TextArea from 'components/forms/textarea';
import Modal from 'components/modal/';

import * as styles from './header.scss';

interface Props {
    userKind: UserKind;
    data: WordPress.User<'view'>;
}

@observer
class DashboardHeader extends React.Component<Props> {
    @observable user = this.props.data;
    @observable isShowingEditModal: boolean = false;

    updateInstitution = flow(function*(
        this: DashboardHeader,
        institution: string,
    ): IterableIterator<any> {
        const oldValue = this.user.institution;
        this.user.institution = institution;
        try {
            yield Users.update({ institution });
        } catch (e) {
            this.user.institution = oldValue;
            throw e;
        }
    }).bind(this);

    updateUser = flow(function*(
        this: DashboardHeader,
        data: Partial<WordPress.User<'view'>>,
    ): IterableIterator<any> {
        const oldUser = toJS(this.user);
        this.user = { ...this.user, ...data };
        try {
            yield Users.update(data);
        } catch {
            this.user = oldUser;
        }
    });

    @action
    toggleEditModal = () => {
        this.isShowingEditModal = !this.isShowingEditModal;
    };

    render(): JSX.Element {
        const { userKind } = this.props;
        return (
            <div className={styles.heading}>
                <div className={styles.headingContainer}>
                    <div>
                        <h1>{this.user.name}</h1>
                        {this.maybeRenderInstitution()}
                    </div>
                    {userKind === UserKind.OWNER && (
                        <Button primary onClick={this.toggleEditModal}>
                            Edit profile
                        </Button>
                    )}
                </div>
                {this.isShowingEditModal && (
                    <Modal onClose={this.toggleEditModal}>
                        {this.editProfileForm()}
                    </Modal>
                )}
            </div>
        );
    }

    private maybeRenderInstitution = (): React.ReactNode => {
        if (!this.user.institution) {
            return null;
        }
        if (this.props.userKind === UserKind.OWNER) {
            return (
                <ClickToEdit
                    inputProps={{ className: styles.institutionInput }}
                    buttonProps={{ className: styles.institutionBtn }}
                    placeholder="Add your institution"
                    onSave={this.updateInstitution}
                >
                    {this.user.institution}
                </ClickToEdit>
            );
        }
        return (
            <span className={styles.institution}>{this.user.institution}</span>
        );
    };

    private editProfileForm = (): React.ReactNode => {
        const data = this.user as WordPress.User<'edit'>;
        return (
            <form
                className={styles.editProfileForm}
                onSubmit={this.handleSubmit}
            >
                <h2>Edit Profile</h2>
                <label>
                    First Name
                    <Input
                        large
                        name="first_name"
                        defaultValue={data.first_name}
                        required
                    />
                </label>
                <label>
                    Last Name
                    <Input
                        large
                        name="last_name"
                        defaultValue={data.last_name}
                        required
                    />
                </label>
                <label>
                    Display Name
                    <Input
                        large
                        name="name"
                        defaultValue={data.name}
                        required
                    />
                </label>
                <label>
                    Email
                    <Input
                        large
                        name="email"
                        defaultValue={data.email}
                        type="email"
                        required
                    />
                </label>
                <label>
                    Bio
                    <TextArea
                        large
                        name="description"
                        defaultValue={data.description}
                    />
                </label>
                <div>
                    <Button primary type="submit">
                        Update
                    </Button>
                </div>
            </form>
        );
    };

    private handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        const formData = new FormData(e.currentTarget);
        const data: Partial<WordPress.User<'view'>> = {};
        for (const [k, v] of formData.entries()) {
            data[k as keyof WordPress.User<'view'>] = v;
        }
        this.updateUser(data);
    };
}

export default (props: Omit<Props, 'userKind'>): JSX.Element => (
    <UserContext.Consumer>
        {(userKind: UserKind): JSX.Element => (
            <DashboardHeader {...props} userKind={userKind} />
        )}
    </UserContext.Consumer>
);
