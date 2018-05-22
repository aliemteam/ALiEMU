import * as React from 'react';

import { AnchorButton } from 'components/buttons/';
import { Input } from 'components/forms/';

interface Props extends React.HTMLProps<HTMLDivElement> {
    placeholder: string;
    children: string;
    onSave(value: string): any;
}

interface State {
    isEditing: boolean;
    value: string;
}

export default class ClickToEdit extends React.Component<Props, State> {
    state = {
        isEditing: false,
        value: this.props.children,
    };

    private ref = React.createRef<HTMLInputElement>();

    render(): JSX.Element {
        const { children, placeholder, onSave, ...props } = this.props;
        const { isEditing, value } = this.state;
        return (
            <div {...props}>
                {isEditing && (
                    <Input
                        ref={this.ref}
                        type="text"
                        value={value}
                        onBlur={this.handleSave}
                        onChange={this.handleChange}
                    />
                )}
                {!isEditing && (
                    <AnchorButton onClick={this.toggleEdit}>
                        {children ? children : placeholder}
                    </AnchorButton>
                )}
            </div>
        );
    }

    private handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const { value } = e.currentTarget;
        return this.setState(prev => ({ ...prev, value }));
    };

    private handleSave = async (): Promise<void> => {
        if (this.props.children !== this.state.value) {
            try {
                await this.props.onSave(this.state.value);
            } catch {
                this.setState(prev => ({
                    ...prev,
                    value: this.props.children,
                }));
            }
        }
        return this.toggleEdit();
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
