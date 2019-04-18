import { observer } from 'mobx-react';
import React from 'react';

import { Tabs } from 'dashboard/dashboard';
import UserStore, { UserKind } from 'dashboard/user-store';

import { Navbar, NavGroup, NavTab } from 'components/navbar/';

interface Props {
    store: UserStore;
    currentTab: Tabs;
    onTabClick(tab: Tabs): void;
}

@observer
export default class DashboardNavbar extends React.Component<Props> {
    render(): JSX.Element {
        const { currentTab, onTabClick, store } = this.props;
        const isOwner = store.userKind === UserKind.OWNER;
        return (
            <Navbar>
                <NavGroup>
                    {isOwner && (
                        <NavTab
                            active={currentTab === Tabs.HOME}
                            onClick={() => onTabClick(Tabs.HOME)}
                        >
                            Home
                        </NavTab>
                    )}
                    <NavTab
                        active={currentTab === Tabs.PROFILE}
                        onClick={() => onTabClick(Tabs.PROFILE)}
                    >
                        Profile
                    </NavTab>
                    {isOwner && (
                        <NavTab
                            active={currentTab === Tabs.PROGRESS}
                            onClick={() => onTabClick(Tabs.PROGRESS)}
                        >
                            Progress
                        </NavTab>
                    )}
                    {isOwner && (
                        <NavTab
                            active={currentTab === Tabs.GROUPS}
                            onClick={() => onTabClick(Tabs.GROUPS)}
                        >
                            Groups
                        </NavTab>
                    )}
                </NavGroup>
            </Navbar>
        );
    }
}
