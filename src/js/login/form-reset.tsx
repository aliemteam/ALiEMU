import React, { FormEvent, PureComponent } from 'react';

import { wpAjax } from 'utils/ajax';
import { Intent } from 'utils/constants';

import Button from 'components/buttons/button';
import Input from 'components/forms/input';
import Notice from 'components/notice';

import * as styles from './form-reset.scss';

const enum Status {
    PENDING,
    SUCCESS,
    ERROR,
}

interface State {
    data: {
        user_login: string;
    };
    status: Status;
    loading: boolean;
}

export default class ResetForm extends PureComponent<{}, State> {
    state: State = {
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
                    disabled={status !== Status.PENDING}
                    intent={Intent.PRIMARY}
                    loading={loading}
                >
                    Send Email
                </Button>
            </form>
        );
    }

    private renderFormContent = (): JSX.Element => {
        const {
            data: { user_login: username },
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
                        If an account exists for <strong>{username}</strong>, an
                        email will be sent with further instructions.
                    </Notice>
                );
            case Status.ERROR:
                return (
                    <Notice
                        intent={Intent.DANGER}
                        title="Internal server error"
                    >
                        An internal error has occurred while attempting to reset
                        the password for <strong>{username}</strong>. Please try
                        again later.
                    </Notice>
                );
            case Status.PENDING:
            default:
                return (
                    <>
                        <span className={styles.span}>
                            Enter your email address below and we&apos;ll send you a
                            link to reset your password.
                        </span>
                        <Input
                            required
                            disabled={loading}
                            label="Email"
                            type="email"
                            value={username}
                            onChange={this.handleChange}
                        />
                    </>
                );
        }
    };

    private handleChange = (e: FormEvent<HTMLInputElement>): void => {
        const { value } = e.currentTarget;
        this.setState(prev => ({
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
        this.setState({ loading: true });
        const response = await wpAjax('reset_password', { ...this.state.data });
        this.setState({
            loading: false,
            status: response.success ? Status.SUCCESS : Status.ERROR,
        });
    };
}
