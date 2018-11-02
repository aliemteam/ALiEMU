import React, { PureComponent } from 'react';

import { MessageContext, withMessageDispatcher } from 'components/message-hub/';
import { wpAjax } from 'utils/ajax';
import { Intent } from 'utils/constants';

import Button from 'components/buttons/button';
import Notice from 'components/notice';

interface Props extends MessageContext {
    user_login: string;
}

interface State {
    emailSent: boolean;
    loading: boolean;
}

class ActivationNoticePre extends PureComponent<Props, State> {
    state: State = {
        emailSent: false,
        loading: false,
    };

    render() {
        const { emailSent, loading } = this.state;
        if (emailSent) {
            return (
                <Notice
                    intent={Intent.SUCCESS}
                    title="Activation sent successfully!"
                >
                    To complete your activation, please click the link in the
                    email.
                </Notice>
            );
        } else {
            return (
                <Notice intent={Intent.PRIMARY} title="Activation required">
                    <div style={{ display: 'grid', gap: 10 }}>
                        <div>Your account is awaiting email verification.</div>
                        <Button
                            type="button"
                            intent={Intent.PRIMARY}
                            loading={loading}
                            onClick={this.handleClick}
                        >
                            Resend activation email
                        </Button>
                    </div>
                </Notice>
            );
        }
    }

    private handleClick = async () => {
        const { dispatchMessage, user_login } = this.props;
        this.setState({ loading: true });
        const { success } = await wpAjax('user_resend_activation', {
            user_login,
        });
        if (!success) {
            dispatchMessage({
                text: 'Uh oh!',
                details:
                    'An error occurred when attempting to communicate with our email server. Please try again later.',
                intent: Intent.DANGER,
            });
        }
        this.setState({ emailSent: success, loading: false });
    };
}

const ActivationNotice = withMessageDispatcher(ActivationNoticePre);
export default ActivationNotice;
