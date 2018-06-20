import * as React from 'react';

import { AnchorButton } from 'components/buttons/';
import Input from 'components/forms/input';

interface Props {
    children?: string;
    inputProps?: React.HTMLProps<HTMLInputElement>;
    buttonProps?: React.HTMLProps<Element>;
    buttonElement?: React.SFC<React.HTMLProps<HTMLButtonElement>>;
    placeholder?: string;
    flex?: boolean;
    onSave(value: string): any;
}

interface State {
    isEditing: boolean;
    value: string;
}

export default class ClickToEdit extends React.Component<Props, State> {
    static defaultProps: Partial<Props> = {
        placeholder: '',
    };

    state = {
        isEditing: false,
        value: this.props.children || '',
    };

    private ref = React.createRef<HTMLInputElement>();

    render(): JSX.Element {
        return (
            <>
                {this.maybeRenderInput()}
                {this.maybeRenderButton()}
            </>
        );
    }

    private maybeRenderButton = (): React.ReactNode => {
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

    private maybeRenderInput = (): React.ReactNode => {
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

    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const { value } = e.currentTarget;
        return this.setState(prev => ({ ...prev, value }));
    };

    private handleKeyUp = async (
        e: React.KeyboardEvent<HTMLInputElement>,
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
                    console.error(`Error occured while attempting to change institution: ${e.message}`);
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
