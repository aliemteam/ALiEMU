import { memo, useState } from '@wordpress/element';

import Button from 'components/buttons/button';
import Input from 'components/forms/input';
import Notice from 'components/notice';
import ajax from 'utils/ajax';

import * as styles from './form-reset.scss';

const enum Status {
    ERROR,
    PENDING,
    SUCCESS,
}

function ResetForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(Status.PENDING);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <form
            className={styles.form}
            onSubmit={async e => {
                e.preventDefault();
                setIsLoading(true);
                const response = await ajax('reset_password', {
                    user_login: email,
                });
                setIsLoading(false);
                setStatus(response.success ? Status.SUCCESS : Status.ERROR);
            }}
        >
            {status === Status.SUCCESS && (
                <Notice intent="success" title="Confirmation email sent">
                    If an account exists for <strong>{email}</strong>, an email
                    will be sent with further instructions.
                </Notice>
            )}
            {status === Status.ERROR && (
                <Notice intent="danger" title="Internal server error">
                    An internal error has occurred while attempting to reset the
                    password for <strong>{email}</strong>. Please try again
                    later.
                </Notice>
            )}
            {status === Status.PENDING && (
                <>
                    <span className={styles.span}>
                        Enter your email address below and we&apos;ll send you a
                        link to reset your password.
                    </span>
                    <Input
                        required
                        disabled={isLoading}
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.currentTarget.value)}
                    />
                </>
            )}
            <Button
                disabled={status !== Status.PENDING}
                intent="primary"
                isLoading={isLoading}
            >
                Send Email
            </Button>
        </form>
    );
}
export default memo(ResetForm);
