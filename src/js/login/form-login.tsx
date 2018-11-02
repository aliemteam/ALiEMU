import React, { FormEvent, MouseEvent, PureComponent, ReactNode } from 'react';

import { wpAjax } from 'utils/ajax';
import { Intent } from 'utils/constants';
import { FormKind } from './index';

import AnchorButton from 'components/buttons/anchor-button';
import Button from 'components/buttons/button';
import Checkbox from 'components/forms/checkbox';
import Input from 'components/forms/input';
import Notice from 'components/notice';
import ActivationNotice from './activation-notice';

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
    shouldRenderForm: boolean;
    notice(): ReactNode;
}

const renderNoop = () => null;

export default class LoginForm extends PureComponent<Props, State> {
    state: State = {
        data: {
            user_login: '',
            user_password: '',
            remember: false,
        },
        loading: false,
        shouldRenderForm: true,
        notice: renderNoop,
    };

    render(): JSX.Element {
        return (
            <form className={styles.form} onSubmit={this.handleSubmit}>
                {this.state.notice()}
                {this.maybeRenderForm()}
            </form>
        );
    }

    private maybeRenderForm = (): ReactNode => {
        const {
            data: { user_login, user_password, remember },
            loading,
            shouldRenderForm,
        } = this.state;
        if (!shouldRenderForm) {
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
        this.setState({ notice: renderNoop, loading: true });
        const response = await wpAjax('user_login', { ...data });
        if (response.success) {
            return window.location.replace('user');
        }
        const { code } = response.data;
        let notice: () => ReactNode;
        let shouldRenderForm = false;
        switch (code) {
            case 'awaiting_email_confirmation':
                notice = () => (
                    <ActivationNotice user_login={data.user_login} />
                );
                break;
            case 'invalid_username':
            case 'incorrect_password':
                notice = () => (
                    <Notice intent={Intent.DANGER}>
                        Invalid username or password.
                    </Notice>
                );
                shouldRenderForm = true;
                break;
            default:
                notice = () => (
                    <Notice intent={Intent.DANGER}>
                        An unexpected error occurred while attempting to log in.
                        Please try again later.
                    </Notice>
                );
        }
        this.setState({ notice, shouldRenderForm, loading: false });
    };
}
