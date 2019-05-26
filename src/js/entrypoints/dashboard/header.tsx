import { memo, useContext, useState } from '@wordpress/element';

import Button from 'components/buttons/button';
import ClickToEdit from 'components/click-to-edit';

import { DashboardContext } from './dashboard';
import EditProfileModal from './edit-profile-modal';
import styles from './header.scss';

function DashboardHeader() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { isOwnProfile, updateUser, user } = useContext(DashboardContext);

    return (
        <div className={styles.header}>
            <div className={styles.headerContainer}>
                <div>
                    <h1>{user.name}</h1>
                    {isOwnProfile && (
                        <ClickToEdit
                            buttonProps={{ className: styles.institutionBtn }}
                            placeholder="Add your institution"
                            value={user.institution}
                            onSave={async institution =>
                                updateUser({ institution })
                            }
                        />
                    )}
                    {!isOwnProfile && user.institution && (
                        <span className={styles.institution}>
                            {user.institution}
                        </span>
                    )}
                </div>
                {isOwnProfile && (
                    <Button
                        intent="secondary"
                        onClick={() => setModalIsOpen(true)}
                    >
                        Edit profile
                    </Button>
                )}
            </div>
            {modalIsOpen && (
                <EditProfileModal onClose={() => setModalIsOpen(false)} />
            )}
        </div>
    );
}
export default memo(DashboardHeader);
