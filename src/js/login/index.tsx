import React, { Component, MouseEvent } from 'react';

import { mapUrlParams } from 'utils/helpers';

import Card from 'components/card/';
import { Navbar, NavGroup, NavTab } from 'components/navbar/';

import LoginForm from './form-login';
import RegistrationForm from './form-register';
import ResetForm from './form-reset';

import Logo from '../../assets/aliemu-logo-horizontal.svg';
import * as styles from './index.scss';

export const enum FormKind {
    LOGIN = 'LOGIN',
    REGISTER = 'REGISTER',
    RESET = 'RESET',
}

interface State {
    activeForm: FormKind;
}

export default class Login extends Component<{}, State> {
    state = {
        activeForm:
            mapUrlParams().get('tab') === 'register'
                ? FormKind.REGISTER
                : FormKind.LOGIN,
    };

    handleFormSwitch = (
        e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ): void => {
        const activeForm = e.currentTarget.dataset.form as FormKind | undefined;
        if (activeForm) {
            this.setState(prev => ({ ...prev, activeForm }));
        }
    };

    render(): JSX.Element {
        const { activeForm } = this.state;
        return (
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Logo className={styles.logo} />
                    <Navbar>
                        <NavGroup fill>
                            <NavTab
                                data-form={FormKind.LOGIN}
                                active={activeForm === FormKind.LOGIN}
                                onClick={this.handleFormSwitch}
                            >
                                Login
                            </NavTab>
                            <NavTab
                                data-form={FormKind.REGISTER}
                                active={activeForm === FormKind.REGISTER}
                                onClick={this.handleFormSwitch}
                            >
                                Sign up
                            </NavTab>
                        </NavGroup>
                    </Navbar>
                    {this.renderForm()}
                </Card>
            </div>
        );
    }

    private renderForm = (): JSX.Element => {
        switch (this.state.activeForm) {
            case FormKind.REGISTER:
                return <RegistrationForm />;
            case FormKind.RESET:
                return <ResetForm />;
            case FormKind.LOGIN:
            default:
                return <LoginForm onForgotClick={this.handleFormSwitch} />;
        }
    };
}
