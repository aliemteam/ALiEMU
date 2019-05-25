import { memo, useContext, useMemo } from '@wordpress/element';

import { DashboardContext, Tab } from './dashboard';
import Groups from './tabs/groups';
import Home from './tabs/home';
import Profile from './tabs/profile';
import Progress from './tabs/progress';

import styles from './content.scss';

interface Props {
    currentTab: Tab;
}
function DashboardContent({ currentTab }: Props) {
    const { isOwnProfile } = useContext(DashboardContext);
    const CurrentTab = useMemo(() => {
        if (!isOwnProfile) {
            return Profile;
        }
        switch (currentTab) {
            case 'home':
                return Home;
            case 'progress':
                return Progress;
            case 'groups':
                return Groups;
            case 'profile':
            default:
                return Profile;
        }
    }, [currentTab, isOwnProfile]);
    return (
        <div className={styles.body}>
            <div className={styles.bodyContainer}>
                <CurrentTab />
            </div>
        </div>
    );
}
export default memo(DashboardContent);
