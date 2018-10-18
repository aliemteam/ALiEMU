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
        message: ReactNode;
        renderWithForm: boolean;
        intent?: Intent;
        title?: string;
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
        return (
            <form className={styles.form} onSubmit={this.handleSubmit}>
                {this.maybeRenderNotice()}
                {this.maybeRenderForm()}
            </form>
        );
    }

    private maybeRenderForm = (): ReactNode => {
        const {
            data: { user_login, user_password, remember },
            loading,
            notice,
        } = this.state;
        if (notice && !notice.renderWithForm) {
            return null;
        }
        return (
            <>
                <Input
                    required
                    autoFocus
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
            </>
        );
    };

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
        const { data } = this.state;
        this.setState(prev => ({ ...prev, notice: undefined, loading: true }));
        const response = await wpAjax('user_login', { ...data });
        if (response.success) {
            return window.location.replace('user');
        }
        const { code } = response.data;
        let notice: State['notice'] = {
            intent: Intent.DANGER,
            title: '',
            renderWithForm: false,
            message:
                'An unexpected error occurred while attempting to log in. Please try again later.',
        };
        switch (code) {
            case 'invalid_username':
            case 'incorrect_password':
                notice = {
                    ...notice,
                    renderWithForm: true,
                    message: 'Invalid username or password.',
                };
                break;
            case 'awaiting_email_confirmation':
                notice = {
                    ...notice,
                    intent: Intent.PRIMARY,
                    title: 'Activation Required',
                    message: <ActivationNotice user_login={data.user_login} />,
                };
                break;
            default:
        }
        this.setState(prev => ({ ...prev, notice, loading: false }));
    };
}

interface ANProps {
    user_login: string;
}

interface ANState {
    emailSent: boolean;
    loading: boolean;
}

class ActivationNotice extends PureComponent<ANProps, ANState> {
    state = {
        emailSent: false,
        loading: false,
    };

    render() {
        const { emailSent, loading } = this.state;
        return (
            <div className={styles.activationNotice}>
                {!emailSent && (
                    <>
                        <div>Your account is awaiting email verification.</div>
                        <Button
                            type="button"
                            intent={Intent.PRIMARY}
                            loading={loading}
                            onClick={this.handleClick}
                        >
                            Resend activation email
                        </Button>
                    </>
                )}
                {emailSent && (
                    <div>
                        <div>
                            <strong>Activation sent successfully.</strong>
                        </div>
                        <div>
                            To complete your activation, please click the link
                            in the email.
                        </div>
                    </div>
                )}
            </div>
        );
    }

    private handleClick = async () => {
        const { user_login } = this.props;
        this.setState(prev => ({ ...prev, loading: true }));
        const response = await wpAjax('user_resend_activation', { user_login });
        if (response.success) {
            this.setState(prev => ({
                ...prev,
                emailSent: true,
                loading: false,
            }));
        } else {
            // FIXME:
            console.error(
                'An error occurred while attempting to send confirmation email',
            );
        }
    };
}
