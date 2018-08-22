import React, { Component, FormEvent } from 'react';

import { wpAjax } from 'utils/ajax';
import { Intent } from 'utils/constants';

import Button from 'components/buttons/button';
import Card from 'components/card/';
import Input from 'components/forms/input';
import Textarea from 'components/forms/textarea';

import styles from './feedback.scss';

export interface FeedbackGlobals {
    user: {
        name: string;
        email: string;
    } | null;
}

declare const AU_Feedback: FeedbackGlobals;

interface State {
    name: string;
    email: string;
    message: string;
}

export default class Feedback extends Component<{}, State> {
    state = {
        name: AU_Feedback.user ? AU_Feedback.user.name : '',
        email: AU_Feedback.user ? AU_Feedback.user.email : '',
        message: '',
    };

    componentDidMount() {
        (window as any).handleSubmit = this.handleSubmit;
    }

    handleValidate = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        grecaptcha.execute();
    };

    handleSubmit = async (token: string): Promise<void> => {
        try {
            await wpAjax('send_slack_message', window.AU_AJAX.nonce, {
                recaptcha_token: token,
                ...this.state,
            });
        } catch (_e) {
            // FIXME: Display error for user.
        }
    };

    handleChange = (
        e: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const key = e.currentTarget.dataset.key as keyof State | undefined;
        const value = e.currentTarget.value;
        if (key) {
            this.setState(prev => ({ ...prev, [key]: value }));
        }
    };

    render(): JSX.Element {
        return (
            <Card className={styles.container}>
                <form className={styles.form} onSubmit={this.handleValidate}>
                    <h1 className={styles.heading}>
                        We {String.fromCharCode(0x2764)} Feedback!
                    </h1>
                    <p className={styles.text}>
                        Please contact us regarding anything you think we can do
                        better.
                    </p>
                    <label className={styles.name}>
                        Name:
                        <Input
                            required
                            data-key="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label className={styles.email}>
                        Email:
                        <Input
                            type="email"
                            required
                            data-key="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label className={styles.message}>
                        Message:
                        <Textarea
                            rows={8}
                            required
                            data-key="message"
                            value={this.state.message}
                            onChange={this.handleChange}
                        />
                    </label>
                    <div className={styles.send}>
                        <div
                            id="recaptcha"
                            className="g-recaptcha"
                            data-sitekey="6LcsqWgUAAAAABL-m1UecnZLk3Ijg7l-9kyrNfi_"
                            data-callback="handleSubmit"
                            data-size="invisible"
                        />
                        <Button intent={Intent.PRIMARY}>Send</Button>
                    </div>
                </form>
            </Card>
        );
    }
}
