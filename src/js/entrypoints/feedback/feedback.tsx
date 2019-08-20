import { useState } from '@wordpress/element';

import ajax from 'utils/ajax';

import Button from 'components/buttons/button';
import Card from 'components/card';
import Input from 'components/forms/input';
import Textarea from 'components/forms/textarea';
import Notice from 'components/notice';

import styles from './feedback.scss';

declare const AU_Feedback: {
    user: {
        name: string;
        email: string;
    };
};

declare const grecaptcha: ReCaptchaV2.ReCaptcha;

interface NoticeData {
    intent: Intent;
    title: string;
    message: string;
}

export default function Feedback() {
    const [formData, setFormData] = useState({
        ...AU_Feedback.user,
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState<NoticeData | undefined>(undefined);

    return (
        <Card className={styles.card}>
            <form
                className={styles.form}
                onSubmit={e => {
                    e.preventDefault();
                    setIsLoading(true);
                    // eslint-disable-next-line
                    // @ts-ignore
                    window['handleSubmit'] = async (token: string) => {
                        const { success } = await ajax('send_slack_message', {
                            recaptcha_token: token,
                            ...formData,
                        });
                        setNotice({
                            intent: success ? 'success' : 'danger',
                            title: success
                                ? 'Message sent successfully'
                                : 'Message failed to send',
                            message: success
                                ? 'Your feedback has been sent successfully. If warranted, we will reply to you via email in the next 48-72 hours.'
                                : 'An internal error prevented your message from sending successfully. Please contact us via email at mlin@aliem.com',
                        });
                        setIsLoading(false);
                    };
                    grecaptcha.execute();
                }}
            >
                <h1>We {String.fromCharCode(0x2764)} Feedback!</h1>
                <p>
                    Please contact us regarding anything you think we can do
                    better.
                </p>
                {notice && (
                    <Notice intent={notice.intent} title={notice.title}>
                        {notice.message}
                    </Notice>
                )}
                {!notice && (
                    <>
                        <div className={styles.inputContainer}>
                            <Input
                                required
                                disabled={isLoading}
                                label="Name"
                                value={formData.name}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        name: e.currentTarget.value,
                                    })
                                }
                            />
                            <Input
                                required
                                disabled={isLoading}
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        email: e.currentTarget.value,
                                    })
                                }
                            />
                        </div>
                        <Textarea
                            required
                            disabled={isLoading}
                            label="Message"
                            rows={8}
                            value={formData.message}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    message: e.currentTarget.value,
                                })
                            }
                        />
                        <div className={styles.send}>
                            <Button
                                disabled={notice !== undefined}
                                intent="primary"
                                isLoading={isLoading}
                            >
                                Send
                            </Button>
                        </div>
                    </>
                )}
            </form>
            <div
                className="g-recaptcha"
                data-callback="handleSubmit"
                data-sitekey="6LcsqWgUAAAAABL-m1UecnZLk3Ijg7l-9kyrNfi_"
                data-size="invisible"
                id="recaptcha"
            />
        </Card>
    );
}
