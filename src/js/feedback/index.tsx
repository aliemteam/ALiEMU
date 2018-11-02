import React, { Component, FormEvent, ReactNode } from 'react';

import { wpAjax } from 'utils/ajax';
import { Intent } from 'utils/constants';

import Button from 'components/buttons/button';
import Card from 'components/card/';
import Input from 'components/forms/input';
import Textarea from 'components/forms/textarea';
import Notice from 'components/notice';

import styles from './feedback.scss';

export interface FeedbackGlobals {
    user: {
        name: string;
        email: string;
    } | null;
}

declare const AU_Feedback: FeedbackGlobals;

interface State {
    data: {
        name: string;
        email: string;
        message: string;
    };
    loading: boolean;
    notice?: {
        intent: Intent;
        title: string;
        message: string;
    };
}

export default class Feedback extends Component<{}, State> {
    state: State = {
        data: {
            name: AU_Feedback.user ? AU_Feedback.user.name : '',
            email: AU_Feedback.user ? AU_Feedback.user.email : '',
            message: '',
        },
        loading: false,
        notice: undefined,
    };

    componentDidMount() {
        (window as any).handleSubmit = this.handleSubmit;
    }

    handleValidate = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this.setState({ loading: true });
        grecaptcha.execute();
    };

    handleSubmit = async (token: string): Promise<void> => {
        const { success } = await wpAjax('send_slack_message', {
            recaptcha_token: token,
            ...this.state.data,
        });
        const notice: State['notice'] = {
            intent: success ? Intent.SUCCESS : Intent.DANGER,
            title: success
                ? 'Message sent successfully'
                : 'Message failed to send',
            message: success
                ? 'Your feedback has been sent successfully. If warranted, we will reply to you via email in the next 48-72 hours.'
                : 'An internal error prevented your message from sending successfully. Please contact us via email at mlin@aliem.com',
        };
        this.setState({ notice, loading: false });
    };

    handleChange = (
        e: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const { name, value } = e.currentTarget;
        this.setState(state => ({
            data: { ...state.data, [name]: value },
        }));
    };

    render(): JSX.Element {
        return (
            <Card className={styles.card}>
                <form className={styles.form} onSubmit={this.handleValidate}>
                    <h1>We {String.fromCharCode(0x2764)} Feedback!</h1>
                    <p>
                        Please contact us regarding anything you think we can do
                        better.
                    </p>
                    {this.maybeRenderNotice()}
                    {this.maybeRenderFields()}
                </form>
                <div
                    id="recaptcha"
                    className="g-recaptcha"
                    data-sitekey="6LcsqWgUAAAAABL-m1UecnZLk3Ijg7l-9kyrNfi_"
                    data-callback="handleSubmit"
                    data-size="invisible"
                />
            </Card>
        );
    }

    private maybeRenderFields = (): ReactNode => {
        const {
            data: { email, message, name },
            loading,
            notice,
        } = this.state;
        if (!notice || (notice && notice.intent !== Intent.SUCCESS)) {
            return (
                <>
                    <div className={styles.inputContainer}>
                        <Input
                            name="name"
                            label="Name"
                            value={name}
                            disabled={loading}
                            onChange={this.handleChange}
                            required
                        />
                        <Input
                            name="email"
                            type="email"
                            label="Email"
                            value={email}
                            disabled={loading}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <Textarea
                        name="message"
                        label="Message"
                        rows={8}
                        value={message}
                        disabled={loading}
                        onChange={this.handleChange}
                        required
                    />
                    <div className={styles.send}>
                        <Button
                            loading={loading}
                            disabled={notice !== undefined}
                            intent={Intent.PRIMARY}
                        >
                            Send
                        </Button>
                    </div>
                </>
            );
        }
        return null;
    };

    private maybeRenderNotice = (): ReactNode => {
        const { notice } = this.state;
        return notice ? (
            <Notice intent={notice.intent} title={notice.title}>
                {notice.message}
            </Notice>
        ) : null;
    };
}
