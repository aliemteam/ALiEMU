import { memo, useContext, useState } from '@wordpress/element';

import { MessageContext } from 'components/message-hub';
import ajax from 'utils/ajax';

import Button from 'components/buttons/button';
import Notice from 'components/notice';

interface Props {
    username: string;
}
function ActivationNotice({ username }: Props) {
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { dispatchMessage } = useContext(MessageContext);

    if (isSent) {
        return (
            <Notice intent="success" title="Activation sent successfully!">
                To complete your activation, please click the link in the email.
            </Notice>
        );
    }
    return (
        <Notice intent="primary" title="Activation required">
            <div style={{ display: 'grid', gap: 10 }}>
                <div>Your account is awaiting email verification.</div>
                <Button
                    intent="primary"
                    isLoading={isLoading}
                    type="button"
                    onClick={async () => {
                        setIsLoading(true);
                        const { success } = await ajax(
                            'user_resend_activation',
                            {
                                user_login: username,
                            },
                        );
                        if (!success) {
                            dispatchMessage({
                                text: 'Uh oh!',
                                details:
                                    'An error occurred when attempting to communicate with our email server. Please try again later.',
                                intent: 'danger',
                            });
                        }
                        setIsSent(success);
                        setIsLoading(false);
                    }}
                >
                    Resend activation email
                </Button>
            </div>
        </Notice>
    );
}
export default memo(ActivationNotice);
