import React, { FormEvent, MouseEvent, PureComponent, ReactNode } from 'react';

import { wpAjax } from 'utils/ajax';
import { Intent } from 'utils/constants';
import { FormKind } from './index';

import AnchorButton from 'components/buttons/anchor-button';
import Button from 'components/buttons/button';
import Checkbox from 'components/forms/checkbox';
import Input from 'components/forms/input';
import Notice from 'components/notice';

import * as styles from './form-login.scss';

interface Props {
    onForgotClick(e: MouseEvent<HTMLAnchorElement>): void;
}

interface State {
    data: {
        user_login: string;
        user_password: string;
        remember: boolean;
    };
    loading: boolean;
    notice?: {
        intent: Intent;
        title: string;
        message: string;
    };
}

export default class LoginForm extends PureComponent<Props, State> {
    state: State = {
        data: {
            user_login: '',
            user_password: '',
            remember: false,
        },
        loading: false,
        notice: undefined,
    };

    render(): JSX.Element {
        const {
            data: { user_login, user_password, remember },
            loading,
        } = this.state;
        return (
            <form className={styles.form} onSubmit={this.handleSubmit}>
                {this.maybeRenderNotice()}
                <Input
                    required
                    label="Username or Email"
                    disabled={loading}
                    autoComplete="username"
                    name="user_login"
                    value={user_login}
                    onChange={this.handleChange}
                />
                <Input
                    required
                    label="Password"
                    disabled={loading}
                    autoComplete="current-password"
                    type="password"
                    name="user_password"
                    value={user_password}
                    onChange={this.handleChange}
                />
                <div className={styles.metaRow}>
                    <Checkbox
                        disabled={loading}
                        label="Remember me"
                        name="remember"
                        checked={remember}
                        onChange={this.handleChange}
                    />
                    <AnchorButton
                        disabled={loading}
                        className={styles.anchorButton}
                        data-form={FormKind.RESET}
                        onClick={this.props.onForgotClick}
                    >
                        Forgot your password?
                    </AnchorButton>
                </div>
                <Button intent={Intent.PRIMARY} loading={loading}>
                    Login
                </Button>
            </form>
        );
    }

    private maybeRenderNotice = (): ReactNode => {
        const { notice } = this.state;
        return notice ? (
            <Notice intent={notice.intent} title={notice.title}>
                {notice.message}
            </Notice>
        ) : null;
    };

    private handleChange = (e: FormEvent<HTMLInputElement>): void => {
        const { value, checked, name, type } = e.currentTarget;
        this.setState(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [name]: type === 'checkbox' ? checked : value,
            },
        }));
    };

    private handleSubmit = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        this.setState(prev => ({ ...prev, notice: undefined, loading: true }));
        try {
            await wpAjax('user_login', window.AU_AJAX.nonce, {
                ...this.state.data,
            });
            window.location.replace('user');
        } catch (err) {
            const notice: State['notice'] = {
                intent: Intent.DANGER,
                title: '',
                message: '',
            };
            switch (err.code) {
                case 'invalid_username':
                case 'incorrect_password':
                    notice.message = 'Invalid username or password.';
                    break;
                case 'awaiting_email_confirmation':
                    notice.message =
                        'Your account is awaiting email verification.';
                    notice.intent = Intent.WARNING;
                    break;
                default:
                    notice.message =
                        'An unexpected error occurred while attempting to log in. Please try again later.';
            }
            this.setState(prev => ({ ...prev, notice, loading: false }));
        }
    };
}
