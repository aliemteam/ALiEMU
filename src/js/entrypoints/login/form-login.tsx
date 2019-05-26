import { memo, useEffect, useRef, useState } from '@wordpress/element';

import AnchorButton from 'components/buttons/anchor-button';
import Button from 'components/buttons/button';
import Checkbox from 'components/forms/checkbox';
import Input from 'components/forms/input';
import Notice from 'components/notice';
import ajax from 'utils/ajax';

import ActivationNotice from './activation-notice';
import * as styles from './form-login.scss';

interface Props {
    onForgotClick(): void;
}
function LoginForm({ onForgotClick }: Props) {
    const [data, setData] = useState({
        user_login: '',
        user_password: '',
        remember: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState<React.ReactNode>(null);
    const [shouldRenderForm, setShouldRenderForm] = useState(true);
    const firstInputElement = useRef<HTMLInputElement>(null);

    useEffect(() => {
        firstInputElement.current && firstInputElement.current.focus();
    }, []);

    return (
        <form
            className={styles.form}
            onSubmit={async e => {
                e.preventDefault();
                setIsLoading(true);
                const response = await ajax('user_login', { ...data });
                if (response.success) {
                    return window.location.replace('user');
                }
                switch (response.data.code) {
                    case 'awaiting_email_confirmation':
                        setNotice(
                            <ActivationNotice username={data.user_login} />,
                        );
                        setShouldRenderForm(false);
                        break;
                    case 'invalid_username':
                    case 'incorrect_password':
                        setNotice(
                            <Notice intent="danger">
                                Invalid username or password.
                            </Notice>,
                        );
                        break;
                    case 'awaiting_admin_review':
                    case 'inactive':
                        setNotice(
                            <Notice intent="warning">
                                {response.data.message}
                            </Notice>,
                        );
                        setShouldRenderForm(false);
                        break;
                    default:
                        setNotice(
                            <Notice intent="danger">
                                An unexpected error occurred while attempting to
                                log in. Please try again later.
                            </Notice>,
                        );
                        setShouldRenderForm(false);
                }
                setIsLoading(false);
            }}
        >
            {notice}
            {shouldRenderForm && (
                <>
                    <Input
                        ref={firstInputElement}
                        required
                        autoComplete="username"
                        disabled={isLoading}
                        label="Username or Email"
                        value={data.user_login}
                        onChange={e =>
                            setData({
                                ...data,
                                user_login: e.currentTarget.value,
                            })
                        }
                    />
                    <Input
                        required
                        autoComplete="current-password"
                        disabled={isLoading}
                        label="Password"
                        type="password"
                        value={data.user_password}
                        onChange={e =>
                            setData({
                                ...data,
                                user_password: e.currentTarget.value,
                            })
                        }
                    />
                    <div className={styles.metaRow}>
                        <Checkbox
                            checked={data.remember}
                            disabled={isLoading}
                            label="Remember me"
                            onChange={e =>
                                setData({
                                    ...data,
                                    remember: e.currentTarget.checked,
                                })
                            }
                        />
                        <AnchorButton
                            className={styles.anchorButton}
                            disabled={isLoading}
                            onClick={onForgotClick}
                        >
                            Forgot your password?
                        </AnchorButton>
                    </div>
                    <Button intent="primary" isLoading={isLoading}>
                        Login
                    </Button>
                </>
            )}
        </form>
    );
}
export default memo(LoginForm);
