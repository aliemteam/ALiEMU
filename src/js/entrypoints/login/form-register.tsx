import {
    Component,
    FormEvent,
    MouseEvent,
    ReactNode,
    createRef,
} from '@wordpress/element';

import ajax from 'utils/ajax';
import { UserPracticeLevels, UserTitles } from 'utils/constants';
import inject from 'utils/inject-script';

import Button from 'components/buttons/button';
import ButtonOutlined from 'components/buttons/button-outlined';
import Input from 'components/forms/input';
import Select from 'components/forms/select';
import Notice from 'components/notice';
import PlacesAutocomplete, { Result } from 'components/places-autocomplete';
import ProgressDots from 'components/progress-dots';

import * as styles from './form-register.scss';

declare const grecaptcha: ReCaptchaV2.ReCaptcha;

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

// FIXME: refactor into a function
export default class RegistrationForm extends Component<{}, State> {
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
                    required
                    autoComplete="username"
                    label="Username"
                    name="user_login"
                    pattern="[a-zA-Z0-9_-]{4,}"
                    validityMessage="Valid characters: A-Z, a-z, 0-9, dash, and underscore."
                    value={this.state.data.user_login}
                    onChange={this.handleChange}
                />
                <Input
                    required
                    autoComplete="email"
                    label="Email"
                    name="user_email"
                    type="email"
                    value={this.state.data.user_email}
                    onChange={this.handleChange}
                />
                <Input
                    required
                    autoComplete="new-password"
                    label="Password"
                    name="user_pass"
                    pattern="[a-zA-Z0-9!@#$%^&*()]{8,}"
                    type="password"
                    validityMessage="Password must be 8 or more characters."
                    value={this.state.data.user_pass}
                    onChange={this.handleChange}
                />
            </>
        ),
        () => (
            <>
                <strong>Personal Information</strong>
                <Input
                    required
                    autoComplete="given-name"
                    label="First Name"
                    name="user_first_name"
                    value={this.state.data.user_first_name}
                    onChange={this.handleChange}
                />
                <Input
                    required
                    autoComplete="family-name"
                    label="Last Name"
                    name="user_last_name"
                    value={this.state.data.user_last_name}
                    onChange={this.handleChange}
                />
                <PlacesAutocomplete
                    required
                    defaultValue={this.state.data.user_formatted_address}
                    label="City"
                    options={{
                        fields: ['address_components', 'formatted_address'],
                        types: ['(cities)'],
                    }}
                    placeholder=""
                    onPlaceChange={this.handlePlaceChange}
                />
            </>
        ),
        () => (
            <>
                <strong>Professional Information</strong>
                <Input
                    autoComplete="organization"
                    disabled={this.state.loading}
                    label="Institution"
                    name="user_institution"
                    value={this.state.data.user_institution}
                    onChange={this.handleChange}
                />
                <Input
                    autoComplete="off"
                    disabled={this.state.loading}
                    label="Specialty"
                    name="user_specialty"
                    value={this.state.data.user_specialty}
                    onChange={this.handleChange}
                />
                <Select
                    required
                    disabled={this.state.loading}
                    label="Role"
                    name="user_title"
                    value={this.state.data.user_title}
                    onChange={this.handleChange}
                >
                    {UserTitles.map(title => (
                        <option key={title} value={title}>
                            {title}
                        </option>
                    ))}
                </Select>
                <Select
                    required
                    disabled={this.state.loading}
                    label="Practice Level"
                    name="user_practice_level"
                    value={this.state.data.user_practice_level}
                    onChange={this.handleChange}
                >
                    {UserPracticeLevels.map(level => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </Select>
                <Button intent="primary" isLoading={this.state.loading}>
                    Sign up
                </Button>
            </>
        ),
    ];

    private recaptchaRef = createRef<HTMLDivElement>();

    async componentDidMount(): Promise<void> {
        // @ts-ignore
        window['handleSubmit'] = this.handleSubmit;
        await inject('https://www.google.com/recaptcha/api.js', 'grecaptcha');
        const { current: recaptchaRef } = this.recaptchaRef;
        if (recaptchaRef && !recaptchaRef.childElementCount) {
            grecaptcha.render(recaptchaRef.id);
        }
    }

    componentWillUnmount(): void {
        let child = document.querySelector(
            'iframe[title="recaptcha challenge"]',
        );
        if (child && child.parentElement && child.parentElement.parentElement) {
            child = child.parentElement.parentElement;
            if (child.parentElement) {
                child.parentElement.removeChild(child);
            }
        }
    }

    render(): JSX.Element {
        const { currentPage, loading, notice } = this.state;
        const isLastPage = currentPage === this.pages.length - 1;
        if (notice && notice.intent === 'success') {
            return (
                <Notice intent={notice.intent} title={notice.title}>
                    {notice.message}
                </Notice>
            );
        }
        return (
            <>
                <form
                    className={styles.form}
                    id={styles.form}
                    onSubmit={this.handleValidate}
                >
                    {this.maybeRenderNotice()}
                    {this.pages[currentPage]()}
                </form>
                <div className={styles.pagination}>
                    <ButtonOutlined
                        disabled={currentPage === 0 || loading}
                        intent="primary"
                        name="prev"
                        onClick={this.handlePagination}
                    >
                        Prev
                    </ButtonOutlined>
                    <ProgressDots
                        currentStep={currentPage}
                        steps={this.pages.length}
                    />
                    <ButtonOutlined
                        disabled={isLastPage || loading}
                        form={styles.form}
                        intent="primary"
                        name="next"
                    >
                        Next
                    </ButtonOutlined>
                </div>
                <div
                    ref={this.recaptchaRef}
                    className="g-recaptcha"
                    data-callback="handleSubmit"
                    data-sitekey="6LcsqWgUAAAAABL-m1UecnZLk3Ijg7l-9kyrNfi_"
                    data-size="invisible"
                    id="recaptcha"
                    style={{ position: 'absolute' }}
                />
            </>
        );
    }

    private maybeRenderNotice = (): ReactNode => {
        const { notice } = this.state;
        return notice && notice.intent !== 'success' ? (
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
            notice: undefined,
            currentPage: prev.currentPage + amount,
        }));
    };

    private handleValidate = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const { currentPage } = this.state;
        this.setState({ notice: undefined });
        if (currentPage < this.pages.length - 1) {
            return this.handlePagination(e);
        } else {
            this.setState({ loading: true });
            return grecaptcha.execute();
        }
    };

    private handleSubmit = async (token: string): Promise<void> => {
        this.setState({ loading: true });
        const response = await ajax('user_register', {
            ...this.state.data,
            recaptcha_token: token,
        });
        if (!response.success) {
            grecaptcha.reset();
        }
        this.setState({
            loading: false,
            notice: {
                intent: response.success ? 'success' : 'danger',
                title: response.success
                    ? 'Registration submitted'
                    : 'Registration failed',
                message: response.success
                    ? 'To complete your registration, please confirm your identity by clicking the activation link in the email we just sent you.'
                    : response.data.message ||
                      'An internal error occurred. Please try again later.',
            },
        });
    };
}
