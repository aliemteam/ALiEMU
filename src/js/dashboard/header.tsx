import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import UserStore, { UserKind } from 'dashboard/user-store';

import { Button } from 'components/buttons/';
import ClickToEdit from 'components/click-to-edit';
import Input from 'components/forms/input';
import TextArea from 'components/forms/textarea';
import Modal from 'components/modal/';

import * as styles from './header.scss';

interface Props {
    store: UserStore;
}

@observer
export default class DashboardHeader extends React.Component<Props> {
    @observable isShowingEditModal: boolean = false;

    @action
    toggleEditModal = () => {
        this.isShowingEditModal = !this.isShowingEditModal;
    };

    render(): JSX.Element {
        const { user, userKind } = this.props.store;
        return (
            <div className={styles.heading}>
                <div className={styles.headingContainer}>
                    <div>
                        <h1>{user.name}</h1>
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
        if (!this.props.store.user.institution) {
            return null;
        }
        if (this.props.store.userKind === UserKind.OWNER) {
            return (
                <ClickToEdit
                    inputProps={{ className: styles.institutionInput }}
                    buttonProps={{ className: styles.institutionBtn }}
                    placeholder="Add your institution"
                    onSave={this.updateInstitution}
                >
                    {this.props.store.user.institution}
                </ClickToEdit>
            );
        }
        return (
            <span className={styles.institution}>
                {this.props.store.user.institution}
            </span>
        );
    };

    private editProfileForm = (): React.ReactNode => {
        const { user } = this.props.store;
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
                        defaultValue={user.first_name}
                        required
                    />
                </label>
                <label>
                    Last Name
                    <Input
                        large
                        name="last_name"
                        defaultValue={user.last_name}
                        required
                    />
                </label>
                <label>
                    Display Name
                    <Input
                        large
                        name="name"
                        defaultValue={user.name}
                        required
                    />
                </label>
                <label>
                    Email
                    <Input
                        large
                        name="email"
                        defaultValue={user.email}
                        type="email"
                        required
                    />
                </label>
                <label>
                    Bio
                    <TextArea
                        large
                        name="description"
                        defaultValue={user.description}
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
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Partial<WordPress.User<'view'>> = {};
        for (const [k, v] of formData.entries()) {
            data[k as keyof WordPress.User<'view'>] = v;
        }
        this.props.store.updateUser(data);
    };

    private updateInstitution = (institution: string): void => {
        this.props.store.updateUser({ institution });
    };
}
