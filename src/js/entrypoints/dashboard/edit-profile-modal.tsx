import { memo, useContext, useState } from '@wordpress/element';

import Button from 'components/buttons/button';
import ButtonOutlined from 'components/buttons/button-outlined';
import Card from 'components/card';
import Input from 'components/forms/input';
import TextArea from 'components/forms/textarea';
import Modal from 'components/modal';

import { DashboardContext } from './dashboard';
import styles from './edit-profile-modal.scss';

interface Props {
    onClose(): void;
}
const EditProfileModal = memo(function({ onClose }: Props) {
    const {
        updateUser,
        user: { description, email, first_name, last_name, name },
    } = useContext(DashboardContext);
    const [data, setData] = useState({
        first_name,
        last_name,
        name,
        email,
        description,
    });
    return (
        <Modal onClose={onClose}>
            <Card>
                <h1 className={styles.title}>Edit Profile</h1>
                <form
                    className={styles.form}
                    onSubmit={e => {
                        e.preventDefault();
                        updateUser(data);
                        onClose();
                    }}
                >
                    <Input
                        required
                        autoComplete="given-name"
                        label="First name"
                        value={data.first_name}
                        onChange={e =>
                            setData({
                                ...data,
                                first_name: e.currentTarget.value,
                            })
                        }
                    />
                    <Input
                        required
                        autoComplete="family-name"
                        label="Last name"
                        value={data.last_name}
                        onChange={e =>
                            setData({
                                ...data,
                                last_name: e.currentTarget.value,
                            })
                        }
                    />
                    <Input
                        required
                        autoComplete="name"
                        label="Display name"
                        value={data.name}
                        onChange={e =>
                            setData({
                                ...data,
                                name: e.currentTarget.value,
                            })
                        }
                    />
                    <Input
                        required
                        autoComplete="email"
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={e =>
                            setData({
                                ...data,
                                email: e.currentTarget.value,
                            })
                        }
                    />
                    <TextArea
                        label="Bio"
                        maxLength={500}
                        rows={5}
                        value={data.description}
                        onChange={e =>
                            setData({
                                ...data,
                                description: e.currentTarget.value,
                            })
                        }
                    />
                    <div className={styles.controls}>
                        <ButtonOutlined type="button" onClick={onClose}>
                            Cancel
                        </ButtonOutlined>
                        <Button intent="primary" type="submit">
                            Update
                        </Button>
                    </div>
                </form>
            </Card>
        </Modal>
    );
});

EditProfileModal.displayName = 'EditProfileModal';

export default EditProfileModal;
