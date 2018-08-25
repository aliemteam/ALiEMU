import React, {
    createRef,
    FormEvent,
    MouseEvent,
    PureComponent,
    ReactNode,
} from 'react';

import { wpAjax } from 'utils/ajax';
import { Intent, UserPracticeLevels, UserTitles } from 'utils/constants';
import inject from 'utils/inject-script';

import Button from 'components/buttons/button';
import ButtonOutlined from 'components/buttons/button-outlined';
import Input from 'components/forms/input';
import Select from 'components/forms/select';
import Notice from 'components/notice';
import PlacesAutocomplete, { Result } from 'components/places-autocomplete';
import ProgressDots from 'components/progress-dots';

import * as styles from './form-register.scss';

interface UserData {
    // Built-in meta fields
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_login: string;
    user_pass: string;

    // Custom meta fields
    user_city: string;
    user_country: string;
    user_formatted_address: string;
    user_institution: string;
    user_practice_level: string;
    user_region: string;
    user_specialty: string;
    user_title: string;
}

interface State {
    data: UserData;
    currentPage: number;
    loading: boolean;
    notice?: {
        intent: Intent;
        title: string;
        message: string;
    };
}

export default class RegistrationForm extends PureComponent<{}, State> {
    state: State = {
        currentPage: 0,
        data: {
            // built-in fields
            user_first_name: '',
            user_last_name: '',
            user_email: '',
            user_login: '',
            user_pass: '',
            // custom fields
            user_city: '',
            user_country: '',
            user_formatted_address: '',
            user_institution: '',
            user_practice_level: '',
            user_region: '',
            user_specialty: '',
            user_title: '',
        },
        loading: false,
        notice: undefined,
    };

    private pages = [
        () => (
            <>
                <Input
                    name="user_login"
                    label="Username"
                    pattern="[a-zA-Z0-9_-]{4,}"
                    autoComplete="username"
                    value={this.state.data.user_login}
                    onChange={this.handleChange}
                    validityMessage="Valid characters: A-Z, a-z, 0-9, dash, and underscore."
                    required
                />
                <Input
                    name="user_email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={this.state.data.user_email}
                    onChange={this.handleChange}
                    required
                />
                <Input
                    name="user_pass"
                    label="Password"
                    type="password"
                    pattern="[a-zA-Z0-9!@#$%^&*()]{8,}"
                    validityMessage="Password must be 8 or more characters."
                    autoComplete="new-password"
                    value={this.state.data.user_pass}
                    onChange={this.handleChange}
                    required
                />
            </>
        ),
        () => (
            <>
                <strong>Personal Information</strong>
                <Input
                    name="user_first_name"
                    label="First Name"
                    autoComplete="given-name"
                    value={this.state.data.user_first_name}
                    onChange={this.handleChange}
                    required
                />
                <Input
                    name="user_last_name"
                    label="Last Name"
                    autoComplete="family-name"
                    value={this.state.data.user_last_name}
                    onChange={this.handleChange}
                    required
                />
                <PlacesAutocomplete
                    label="City"
                    placeholder=""
                    defaultValue={this.state.data.user_formatted_address}
                    options={{
                        fields: ['address_components', 'formatted_address'],
                        types: ['(cities)'],
                    }}
                    onPlaceChange={this.handlePlaceChange}
                    required
                />
            </>
        ),
        () => (
            <>
                <strong>Professional Information</strong>
                <Input
                    name="user_institution"
                    label="Institution"
                    autoComplete="organization"
                    disabled={this.state.loading}
                    value={this.state.data.user_institution}
                    onChange={this.handleChange}
                />
                <Input
                    name="user_specialty"
                    label="Specialty"
                    autoComplete="off"
                    disabled={this.state.loading}
                    value={this.state.data.user_specialty}
                    onChange={this.handleChange}
                />
                <Select
                    name="user_title"
                    label="Role"
                    disabled={this.state.loading}
                    value={this.state.data.user_title}
                    onChange={this.handleChange}
                    required
                >
                    {UserTitles.map(title => (
                        // FIXME: Remove this after this issue resolves:
                        // https://github.com/Microsoft/tslint-microsoft-contrib/issues/409
                        // tslint:disable-next-line:react-a11y-role-has-required-aria-props
                        <option key={title} value={title}>
                            {title}
                        </option>
                    ))}
                </Select>
                <Select
                    name="user_practice_level"
                    label="Practice Level"
                    disabled={this.state.loading}
                    value={this.state.data.user_practice_level}
                    onChange={this.handleChange}
                    required
                >
                    {UserPracticeLevels.map(level => (
                        // FIXME: Remove this after this issue resolves:
                        // https://github.com/Microsoft/tslint-microsoft-contrib/issues/409
                        // tslint:disable-next-line:react-a11y-role-has-required-aria-props
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </Select>
                <Button intent={Intent.PRIMARY} loading={this.state.loading}>
                    Sign up
                </Button>
            </>
        ),
    ];

    private recaptchaRef = createRef<HTMLDivElement>();

    async componentDidMount(): Promise<void> {
        (window as any).handleSubmit = this.handleSubmit;
        await inject('https://www.google.com/recaptcha/api.js', 'grecaptcha');
        const { current: recaptchaRef } = this.recaptchaRef;
        if (recaptchaRef && !recaptchaRef.childElementCount) {
            grecaptcha.render(recaptchaRef.id);
        }
    }

    componentWillUnmount(): void {
        let child = document.querySelector(
            'iframe[title="recaptcha challenge"',
        );
        if (child && child.parentElement && child.parentElement.parentElement) {
            child = child.parentElement.parentElement;
            child.parentElement!.removeChild(child);
        }
    }

    render(): JSX.Element {
        const { currentPage, loading, notice } = this.state;
        const isLastPage = currentPage === this.pages.length - 1;
        if (notice && notice.intent === Intent.SUCCESS) {
            return (
                <Notice intent={notice.intent} title={notice.title}>
                    {notice.message}
                </Notice>
            );
        }
        return (
            <>
                <form
                    id={styles.form}
                    className={styles.form}
                    onSubmit={this.handleValidate}
                >
                    {this.maybeRenderNotice()}
                    {this.pages[currentPage]()}
                </form>
                <div className={styles.pagination}>
                    <ButtonOutlined
                        name="prev"
                        disabled={currentPage === 0 || loading}
                        onClick={this.handlePagination}
                    >
                        Prev
                    </ButtonOutlined>
                    <ProgressDots
                        steps={this.pages.length}
                        currentStep={currentPage}
                    />
                    <ButtonOutlined
                        disabled={isLastPage || loading}
                        form={styles.form}
                        name="next"
                    >
                        Next
                    </ButtonOutlined>
                </div>
                <div
                    id="recaptcha"
                    ref={this.recaptchaRef}
                    className="g-recaptcha"
                    data-sitekey="6LcsqWgUAAAAABL-m1UecnZLk3Ijg7l-9kyrNfi_"
                    data-callback="handleSubmit"
                    data-size="invisible"
                    style={{ position: 'absolute' }}
                />
            </>
        );
    }

    private maybeRenderNotice = (): ReactNode => {
        const { notice } = this.state;
        return notice && notice.intent !== Intent.SUCCESS ? (
            <Notice intent={notice.intent} title={notice.title}>
                {notice.message}
            </Notice>
        ) : null;
    };

    private handleChange = (
        e: FormEvent<HTMLInputElement | HTMLSelectElement>,
    ): void => {
        const { name, value } = e.currentTarget;
        this.setState(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [name]: value,
            },
        }));
    };

    private handlePlaceChange = (value?: Partial<Result>): void => {
        const components: Partial<UserData> = {
            user_city: '',
            user_region: '',
            user_country: '',
            user_formatted_address: '',
        };
        if (value && value.address_components && value.formatted_address) {
            components.user_formatted_address = value.formatted_address;
            for (const c of value.address_components) {
                if (c.types.includes('locality')) {
                    components.user_city = c.long_name;
                    continue;
                }
                if (c.types.includes('administrative_area_level_1')) {
                    components.user_region = c.long_name;
                    continue;
                }
                if (c.types.includes('country')) {
                    components.user_country = c.long_name;
                }
            }
        }
        this.setState(prev => ({
            ...prev,
            notice: undefined,
            data: { ...prev.data, ...components },
        }));
    };

    private handlePagination = (
        e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
    ): void => {
        e.preventDefault();
        const amount = e.currentTarget.name === 'prev' ? -1 : 1;
        this.setState(prev => ({
            ...prev,
            notice: undefined,
            currentPage: prev.currentPage + amount,
        }));
    };

    private handleValidate = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const { currentPage } = this.state;
        this.setState(prev => ({ ...prev, notice: undefined }));
        return currentPage < this.pages.length - 1
            ? this.handlePagination(e)
            : grecaptcha.execute();
    };

    private handleSubmit = async (token: string): Promise<void> => {
        this.setState(prev => ({ ...prev, loading: true }));
        const response = await wpAjax('user_register', {
            recaptcha_token: token,
            ...this.state.data,
        });
        this.setState(
            prev => ({
                ...prev,
                loading: false,
                notice: {
                    intent: response.success ? Intent.SUCCESS : Intent.DANGER,
                    title: response.success
                        ? 'Registration submitted'
                        : 'Registration failed',
                    message: response.success
                        ? 'To complete your registration, please confirm your identity by clicking the activation link in the email we just sent you.'
                        : response.data.message ||
                          'An internal error occurred. Please try again later.',
                },
            }),
            grecaptcha.reset,
        );
    };
}
