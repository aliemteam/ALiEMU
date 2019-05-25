import { memo, useContext } from '@wordpress/element';

import { Navbar, NavGroup, NavTab } from 'components/navbar';
import { DashboardContext, Tab } from 'dashboard/dashboard';

interface Props {
    currentTab: Tab;
    onTabClick(tab: Tab): void;
}
function DashboardNavbar({ currentTab, onTabClick }: Props) {
    const { isOwnProfile } = useContext(DashboardContext);
    return (
        <Navbar>
            <NavGroup>
                {isOwnProfile && (
                    <NavTab
                        active={currentTab === 'home'}
                        onClick={() => onTabClick('home')}
                    >
                        Home
                    </NavTab>
                )}
                <NavTab
                    active={currentTab === 'profile'}
                    onClick={() => onTabClick('profile')}
                >
                    Profile
                </NavTab>
                {isOwnProfile && (
                    <NavTab
                        active={currentTab === 'progress'}
                        onClick={() => onTabClick('progress')}
                    >
                        Progress
                    </NavTab>
                )}
                {isOwnProfile && (
                    <NavTab
                        active={currentTab === 'groups'}
                        onClick={() => onTabClick('groups')}
                    >
                        Groups
                    </NavTab>
                )}
            </NavGroup>
        </Navbar>
    );
}
export default memo(DashboardNavbar);
