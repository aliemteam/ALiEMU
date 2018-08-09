import React, {
    Component,
    createRef,
    FormEvent,
    HTMLProps,
    KeyboardEvent,
    ReactNode,
    SFC,
} from 'react';

import AnchorButton from 'components/buttons/anchor-button';
import Input from 'components/forms/input';

interface Props {
    children?: string;
    inputProps?: HTMLProps<HTMLInputElement>;
    buttonProps?: HTMLProps<Element>;
    buttonElement?: SFC<HTMLProps<HTMLButtonElement>>;
    placeholder?: string;
    flex?: boolean;
    onSave(value: string): any;
}

interface State {
    isEditing: boolean;
    value: string;
}

export default class ClickToEdit extends Component<Props, State> {
    static defaultProps: Partial<Props> = {
        placeholder: '',
    };

    state = {
        isEditing: false,
        value: this.props.children || '',
    };

    private ref = createRef<HTMLInputElement>();

    render(): JSX.Element {
        return (
            <>
                {this.maybeRenderInput()}
                {this.maybeRenderButton()}
            </>
        );
    }

    private maybeRenderButton = (): ReactNode => {
        if (this.state.isEditing) {
            return null;
        }
        const {
            buttonElement: Button,
            buttonProps,
            children,
            placeholder,
        } = this.props;
        const value = children || placeholder;
        return Button ? (
            <Button onClick={this.toggleEdit} />
        ) : (
            <AnchorButton {...buttonProps as any} onClick={this.toggleEdit}>
                {value}
            </AnchorButton>
        );
    };

    private maybeRenderInput = (): ReactNode => {
        if (!this.state.isEditing) {
            return null;
        }
        const { inputProps, flex } = this.props;
        return (
            <Input
                {...inputProps}
                ref={this.ref}
                flex={flex}
                value={this.state.value}
                onKeyUp={this.handleKeyUp}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
            />
        );
    };

    private handleBlur = () => {
        this.setState(prev => ({
            ...prev,
            value: this.props.children || '',
        }));
        this.toggleEdit();
    };

    private handleChange = (e: FormEvent<HTMLInputElement>): void => {
        const { value } = e.currentTarget;
        return this.setState(prev => ({ ...prev, value }));
    };

    private handleKeyUp = async (
        e: KeyboardEvent<HTMLInputElement>,
    ): Promise<void> => {
        switch (e.key) {
            case 'Escape':
                return this.handleBlur();
            case 'Enter':
                this.toggleEdit();
                if (this.props.children === this.state.value) {
                    return;
                }
                try {
                    await this.props.onSave(this.state.value);
                } catch (e) {
                    console.error(
                        `Error occured while attempting to change institution: ${
                            e.message
                        }`,
                    );
                }
                this.setState(prev => ({
                    ...prev,
                    value: this.props.children || '',
                }));
                break;
            default:
                return;
        }
    };

    private toggleEdit = (): void => {
        this.setState(
            prev => ({ ...prev, isEditing: !prev.isEditing }),
            () => {
                if (this.ref.current) {
                    this.ref.current.select();
                }
            },
        );
    };
}
