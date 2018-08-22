import React, { FormEvent, PureComponent } from 'react';

import { wpAjax } from 'utils/ajax';
import { Intent } from 'utils/constants';

import Button from 'components/buttons/button';
import Input from 'components/forms/input';
import Notice from 'components/notice';

import * as styles from './form-reset.scss';

const enum Status {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

interface State {
    data: {
        user_login: string;
    };
    status: Status;
    loading: boolean;
}

export default class ResetForm extends PureComponent<{}, State> {
    state = {
        data: {
            user_login: '',
        },
        status: Status.PENDING,
        loading: false,
    };

    render(): JSX.Element {
        const { status, loading } = this.state;
        return (
            <form className={styles.form} onSubmit={this.handleSubmit}>
                {this.renderFormContent()}
                <Button
                    intent={Intent.PRIMARY}
                    loading={loading}
                    disabled={status !== Status.PENDING}
                >
                    Send Email
                </Button>
            </form>
        );
    }

    private renderFormContent = (): JSX.Element => {
        const {
            data: { user_login },
            loading,
            status,
        } = this.state;
        switch (status) {
            case Status.SUCCESS:
                return (
                    <Notice
                        intent={Intent.SUCCESS}
                        title="Confirmation email sent"
                    >
                        If an account exists for <strong>{user_login}</strong>,
                        an email will be sent with further instructions.
                    </Notice>
                );
            case Status.ERROR:
                return (
                    <Notice
                        intent={Intent.DANGER}
                        title="Internal server error"
                    >
                        An internal error has occurred while attempting to reset
                        the password for <strong>{user_login}</strong>. Please
                        try again later.
                    </Notice>
                );
            case Status.PENDING:
            default:
                return (
                    <>
                        <span className={styles.span}>
                            Enter your email address below and we'll send you a
                            link to reset your password.
                        </span>
                        <Input
                            type="email"
                            label="Email"
                            disabled={loading}
                            value={user_login}
                            onChange={this.handleChange}
                            required
                        />
                    </>
                );
        }
    };

    private handleChange = (e: FormEvent<HTMLInputElement>): void => {
        const { value } = e.currentTarget;
        this.setState(prev => ({
            ...prev,
            data: {
                ...prev.data,
                user_login: value,
            },
        }));
    };

    private handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        let status = Status.SUCCESS;
        const { data } = this.state;

        this.setState(prev => ({ ...prev, loading: true }));
        try {
            await wpAjax('reset_password', window.AU_AJAX.nonce, { ...data });
        } catch (_e) {
            status = Status.ERROR;
        }
        this.setState(prev => ({ ...prev, status, loading: false }));
    };
}
