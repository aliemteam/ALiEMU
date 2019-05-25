import { memo, useContext, useState } from '@wordpress/element';

import Button from 'components/buttons/button';
import Input from 'components/forms/input';
import { MessageContext } from 'components/message-hub';
import { Coaches } from 'utils/api';

import styles from './add-coach-form.scss';

interface Props {
    onAddCoach(coach: Coaches.Coach): void;
    onLoadingToggle(isLoading: boolean): void;
}

function AddCoachForm({ onAddCoach, onLoadingToggle }: Props) {
    const [inputValue, setInputValue] = useState('');
    const { dispatchMessage } = useContext(MessageContext);
    return (
        <form
            className={styles.form}
            onSubmit={async e => {
                e.preventDefault();
                onLoadingToggle(true);
                setInputValue('');
                try {
                    onAddCoach(await Coaches.add(inputValue));
                } catch (e) {
                    dispatchMessage({
                        text: 'Uh oh!',
                        details:
                            e.responseJSON && e.responseJSON.message
                                ? e.responseJSON.message
                                : 'An error occurred while attempting to add the requested user as a coach. Please try again later.',
                        intent: 'danger',
                    });
                } finally {
                    onLoadingToggle(false);
                }
            }}
        >
            <Input
                required
                aria-label="Add a coach using their email address"
                placeholder="Email address"
                type="email"
                value={inputValue}
                onChange={e => setInputValue(e.currentTarget.value)}
            />
            <Button className={styles.submit} intent="primary" type="submit">
                Add coach
            </Button>
        </form>
    );
}

export default memo(AddCoachForm);
