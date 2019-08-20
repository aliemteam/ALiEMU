import { useEffect, useRef, useState } from '@wordpress/element';

import AnchorButton from 'components/buttons/anchor-button';
import Input from 'components/forms/input';

interface Props {
    value?: string;
    inputProps?: React.AllHTMLAttributes<HTMLInputElement>;
    buttonProps?: React.AllHTMLAttributes<HTMLAnchorElement>;
    buttonElement?: React.SFC<React.HTMLProps<HTMLButtonElement>>;
    placeholder?: string;
    onSave(value: string): void;
}

export default function ClickToEdit({
    buttonElement: Button,
    buttonProps,
    placeholder,
    inputProps,
    onSave,
    value: currentValue = '',
}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(currentValue);

    const inputElement = useRef<HTMLInputElement>(null);

    useEffect(() => setValue(currentValue), [currentValue]);

    useEffect(() => {
        if (isEditing && inputElement.current) {
            inputElement.current.select();
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <Input
                {...inputProps}
                ref={inputElement}
                value={value}
                onBlur={() => {
                    setValue(currentValue);
                    setIsEditing(false);
                }}
                onChange={e => setValue(e.currentTarget.value)}
                onKeyDown={e => {
                    switch (e.key) {
                        case 'Escape':
                            setValue(currentValue);
                            break;
                        case 'Enter':
                            if (currentValue !== value) {
                                onSave(value);
                            }
                            break;
                        default:
                            return;
                    }
                    setIsEditing(false);
                }}
            />
        );
    }
    if (Button) {
        return <Button onClick={() => setIsEditing(true)} />;
    }
    return (
        <AnchorButton {...buttonProps} onClick={() => setIsEditing(true)}>
            {currentValue || placeholder || value}
        </AnchorButton>
    );
}
