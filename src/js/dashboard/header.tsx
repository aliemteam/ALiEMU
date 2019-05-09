import { observer } from 'mobx-react';
import React, { Component, FormEvent, ReactNode } from 'react';

import UserStore, { UserKind } from 'dashboard/user-store';
import { Intent } from 'utils/constants';

import Button from 'components/buttons/button';
import ButtonOutlined from 'components/buttons/button-outlined';
import ClickToEdit from 'components/click-to-edit';
import Input from 'components/forms/input';
import TextArea from 'components/forms/textarea';
import Modal from 'components/modal/';

import styles from './header.scss';

interface Props {
    store: UserStore;
}

interface State {
    modalIsOpen: boolean;
}

@observer
export default class DashboardHeader extends Component<Props, State> {
    state: State = {
        modalIsOpen: false,
    };

    render(): JSX.Element {
        const { user, userKind } = this.props.store;
        const { modalIsOpen } = this.state;
        return (
            <div className={styles.header}>
                <div className={styles.headerContainer}>
                    <div>
                        <h1>{user.name}</h1>
                        {this.maybeRenderInstitution()}
                    </div>
                    {userKind === UserKind.OWNER && (
                        <Button
                            intent={Intent.SECONDARY}
                            onClick={this.toggleModal}
                        >
                            Edit profile
                        </Button>
                    )}
                </div>
                {modalIsOpen && (
                    <Modal onClose={this.toggleModal}>
                        {this.editProfileForm()}
                    </Modal>
                )}
            </div>
        );
    }

    private maybeRenderInstitution = (): ReactNode => {
        const {
            user: { institution },
            userKind,
        } = this.props.store;
        if (userKind === UserKind.OWNER) {
            return (
                <ClickToEdit
                    buttonProps={{ className: styles.institutionBtn }}
                    placeholder="Add your institution"
                    onSave={this.updateInstitution}
                >
                    {institution}
                </ClickToEdit>
            );
        }
        return institution ? (
            <span className={styles.institution}>{institution}</span>
        ) : null;
    };

    private editProfileForm = (): ReactNode => {
        const { user } = this.props.store;
        return (
            <form
                className={styles.editProfileForm}
                onSubmit={this.handleSubmit}
            >
                <h2>Edit Profile</h2>
                <Input
                    required
                    autoComplete="given-name"
                    defaultValue={user.first_name}
                    label="First name"
                    name="first_name"
                />
                <Input
                    required
                    autoComplete="family-name"
                    defaultValue={user.last_name}
                    label="Last name"
                    name="last_name"
                />
                <Input
                    required
                    autoComplete="name"
                    defaultValue={user.name}
                    label="Display name"
                    name="name"
                />
                <Input
                    required
                    autoComplete="email"
                    defaultValue={user.email}
                    label="Email"
                    name="email"
                    type="email"
                />
                <TextArea
                    defaultValue={user.description}
                    label="Bio"
                    maxLength={500}
                    name="description"
                    rows={5}
                />
                <div>
                    <ButtonOutlined
                        style={{ marginRight: 5 }}
                        type="button"
                        onClick={this.toggleModal}
                    >
                        Cancel
                    </ButtonOutlined>
                    <Button intent={Intent.PRIMARY} type="submit">
                        Update
                    </Button>
                </div>
            </form>
        );
    };

    private handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: Partial<WordPress.User<'view'>> = {};
        for (const [k, v] of formData.entries()) {
            data[k as keyof WordPress.User<'view'>] = v;
        }
        this.props.store.updateUser(data);
        this.toggleModal();
    };

    private toggleModal = (): void => {
        this.setState(prev => ({ modalIsOpen: !prev.modalIsOpen }));
    };

    private updateInstitution = (institution: string): void => {
        this.props.store.updateUser({ institution });
    };
}
