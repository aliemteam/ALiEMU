import { memo } from '@wordpress/element';

import Logo from 'assets/aliemu-logo-horizontal.svg';
import Card from 'components/card';
import { Navbar, NavGroup, NavTab } from 'components/navbar';
import useQueryParam from 'hooks/use-query-param';

import LoginForm from './form-login';
import RegistrationForm from './form-register';
import ResetForm from './form-reset';

import * as styles from './login.scss';

type FormKind = 'login' | 'register' | 'reset';

function Login() {
    const [activeForm, setActiveForm] = useQueryParam<FormKind>('tab', 'login');

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Logo className={styles.logo} />
                <Navbar>
                    <NavGroup fill>
                        <NavTab
                            active={activeForm === 'login'}
                            onClick={() => setActiveForm('login')}
                        >
                            Login
                        </NavTab>
                        <NavTab
                            active={activeForm === 'register'}
                            onClick={() => setActiveForm('register')}
                        >
                            Sign up
                        </NavTab>
                    </NavGroup>
                </Navbar>
                {activeForm === 'register' && <RegistrationForm />}
                {activeForm === 'reset' && <ResetForm />}
                {!['register', 'reset'].includes(activeForm) && (
                    <LoginForm onForgotClick={() => setActiveForm('reset')} />
                )}
            </Card>
        </div>
    );
}
export default memo(Login);
